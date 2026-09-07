import pandas as pd


def compute_sma(series: pd.Series, window: int = 20) -> pd.Series:
    return series.rolling(window=window).mean()


def compute_rsi(series: pd.Series, period: int = 14) -> pd.Series:
    delta = series.diff()
    gain = delta.clip(lower=0).rolling(window=period).mean()
    loss = (-delta.clip(upper=0)).rolling(window=period).mean()
    rs = gain / loss.replace(0, pd.NA)
    return 100 - (100 / (1 + rs))
