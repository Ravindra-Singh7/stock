from pydantic import BaseModel


class OhlcPoint(BaseModel):
    time: str
    open: float
    high: float
    low: float
    close: float
    volume: float


class StockQuote(BaseModel):
    symbol: str
    company_name: str
    exchange: str | None = None
    currency: str | None = None
    current_price: float
    previous_close: float | None = None
    change: float
    change_percent: float
    market_cap: float | None = None
    sector: str | None = None
    website: str | None = None


class IndicatorSeries(BaseModel):
    sma_20: list[dict[str, float | str]]
    rsi_14: list[dict[str, float | str]]


class StockResponse(BaseModel):
    quote: StockQuote
    ohlc: list[OhlcPoint]
    indicators: IndicatorSeries


class PredictionResponse(BaseModel):
    symbol: str
    model: str
    predicted_price: float
    latest_close: float
    confidence_note: str
