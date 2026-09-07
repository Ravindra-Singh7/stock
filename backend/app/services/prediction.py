import math

import pandas as pd
import torch
from torch import nn


class PositionalEncoding(nn.Module):
    def __init__(self, d_model: int, max_len: int = 256) -> None:
        super().__init__()
        position = torch.arange(max_len, dtype=torch.float32).unsqueeze(1)
        div_term = torch.exp(torch.arange(0, d_model, 2, dtype=torch.float32) * (-math.log(10000.0) / d_model))
        pe = torch.zeros(max_len, d_model)
        pe[:, 0::2] = torch.sin(position * div_term)
        pe[:, 1::2] = torch.cos(position * div_term)
        self.register_buffer("pe", pe.unsqueeze(0))

    def forward(self, values: torch.Tensor) -> torch.Tensor:
        return values + self.pe[:, : values.size(1)]


class PriceTransformer(nn.Module):
    def __init__(self, d_model: int = 32, nhead: int = 4, layers: int = 2) -> None:
        super().__init__()
        self.input_projection = nn.Linear(1, d_model)
        self.position = PositionalEncoding(d_model)
        encoder_layer = nn.TransformerEncoderLayer(
            d_model=d_model,
            nhead=nhead,
            dim_feedforward=96,
            dropout=0.05,
            activation="gelu",
            batch_first=True,
        )
        self.encoder = nn.TransformerEncoder(encoder_layer, num_layers=layers)
        self.output = nn.Sequential(
            nn.LayerNorm(d_model),
            nn.Linear(d_model, 1),
        )

    def forward(self, values: torch.Tensor) -> torch.Tensor:
        encoded = self.position(self.input_projection(values))
        encoded = self.encoder(encoded)
        return self.output(encoded[:, -1]).squeeze(-1)


def _last_trend_prediction(closes: pd.Series) -> tuple[float, float]:
    latest = float(closes.iloc[-1]) if len(closes) else 0.0
    if len(closes) < 2:
        return latest, latest
    recent_change = float(closes.diff().tail(5).mean())
    return max(latest + recent_change, 0.0), latest


def _build_windows(values: torch.Tensor, sequence_length: int) -> tuple[torch.Tensor, torch.Tensor]:
    windows = []
    targets = []
    for index in range(len(values) - sequence_length):
        windows.append(values[index : index + sequence_length])
        targets.append(values[index + sequence_length])
    return torch.stack(windows).unsqueeze(-1), torch.stack(targets)


def predict_next_close(history: pd.DataFrame) -> tuple[float, float]:
    closes = history["Close"].dropna().tail(180).reset_index(drop=True)
    if len(closes) < 45:
        return _last_trend_prediction(closes)

    torch.set_num_threads(1)
    torch.manual_seed(7)

    close_tensor = torch.tensor(closes.to_numpy(dtype="float32"))
    latest_close = float(close_tensor[-1].item())
    mean = close_tensor.mean()
    std = close_tensor.std()
    if float(std) == 0.0:
        return latest_close, latest_close

    normalized = (close_tensor - mean) / std
    sequence_length = min(30, max(12, len(normalized) // 4))
    x_train, y_train = _build_windows(normalized, sequence_length)

    model = PriceTransformer()
    optimizer = torch.optim.AdamW(model.parameters(), lr=0.003, weight_decay=0.001)
    loss_fn = nn.SmoothL1Loss()

    model.train()
    for _ in range(75):
        optimizer.zero_grad(set_to_none=True)
        prediction = model(x_train)
        loss = loss_fn(prediction, y_train)
        loss.backward()
        torch.nn.utils.clip_grad_norm_(model.parameters(), 1.0)
        optimizer.step()

    model.eval()
    with torch.no_grad():
        next_window = normalized[-sequence_length:].unsqueeze(0).unsqueeze(-1)
        normalized_prediction = model(next_window).item()

    predicted_price = (normalized_prediction * float(std)) + float(mean)
    return max(float(predicted_price), 0.0), latest_close
