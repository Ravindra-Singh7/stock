from functools import lru_cache

import pandas as pd
import yfinance as yf

from app.schemas.stock import IndicatorSeries, OhlcPoint, StockQuote, StockResponse
from app.services.indicators import compute_rsi, compute_sma


FEATURED_SYMBOLS = [
    "RELIANCE.NS",
    "TCS.NS",
    "INFY.NS",
    "HDFCBANK.NS",
    "ICICIBANK.NS",
    "BHARTIARTL.NS",
    "LT.NS",
    "SBIN.NS",
    "ITC.NS",
    "MARUTI.NS",
    "TATAMOTORS.NS",
    "AAPL",
]


@lru_cache
def get_symbol_universe() -> list[dict[str, str]]:
    return [
        {"symbol": "RELIANCE.NS", "name": "Reliance Industries Ltd."},
        {"symbol": "TCS.NS", "name": "Tata Consultancy Services Ltd."},
        {"symbol": "INFY.NS", "name": "Infosys Ltd."},
        {"symbol": "HDFCBANK.NS", "name": "HDFC Bank Ltd."},
        {"symbol": "ICICIBANK.NS", "name": "ICICI Bank Ltd."},
        {"symbol": "BHARTIARTL.NS", "name": "Bharti Airtel Ltd."},
        {"symbol": "LT.NS", "name": "Larsen & Toubro Ltd."},
        {"symbol": "SBIN.NS", "name": "State Bank of India"},
        {"symbol": "ITC.NS", "name": "ITC Ltd."},
        {"symbol": "ASIANPAINT.NS", "name": "Asian Paints Ltd."},
        {"symbol": "HINDUNILVR.NS", "name": "Hindustan Unilever Ltd."},
        {"symbol": "MARUTI.NS", "name": "Maruti Suzuki India Ltd."},
        {"symbol": "TATAMOTORS.NS", "name": "Tata Motors Ltd."},
        {"symbol": "TATASTEEL.NS", "name": "Tata Steel Ltd."},
        {"symbol": "AXISBANK.NS", "name": "Axis Bank Ltd."},
        {"symbol": "KOTAKBANK.NS", "name": "Kotak Mahindra Bank Ltd."},
        {"symbol": "BAJFINANCE.NS", "name": "Bajaj Finance Ltd."},
        {"symbol": "SUNPHARMA.NS", "name": "Sun Pharmaceutical Industries Ltd."},
        {"symbol": "M&M.NS", "name": "Mahindra & Mahindra Ltd."},
        {"symbol": "ULTRACEMCO.NS", "name": "UltraTech Cement Ltd."},
        {"symbol": "WIPRO.NS", "name": "Wipro Ltd."},
        {"symbol": "HCLTECH.NS", "name": "HCL Technologies Ltd."},
        {"symbol": "POWERGRID.NS", "name": "Power Grid Corporation of India Ltd."},
        {"symbol": "NTPC.NS", "name": "NTPC Ltd."},
        {"symbol": "ONGC.NS", "name": "Oil and Natural Gas Corporation Ltd."},
        {"symbol": "COALINDIA.NS", "name": "Coal India Ltd."},
        {"symbol": "ADANIENT.NS", "name": "Adani Enterprises Ltd."},
        {"symbol": "ADANIPORTS.NS", "name": "Adani Ports and SEZ Ltd."},
        {"symbol": "AAPL", "name": "Apple Inc."},
        {"symbol": "MSFT", "name": "Microsoft Corp."},
        {"symbol": "GOOGL", "name": "Alphabet Inc."},
        {"symbol": "AMZN", "name": "Amazon.com Inc."},
        {"symbol": "NVDA", "name": "NVIDIA Corp."},
        {"symbol": "TSLA", "name": "Tesla Inc."},
        {"symbol": "META", "name": "Meta Platforms Inc."},
        {"symbol": "JPM", "name": "JPMorgan Chase & Co."},
        {"symbol": "V", "name": "Visa Inc."},
        {"symbol": "SPY", "name": "SPDR S&P 500 ETF Trust"},
    ]


def normalize_symbol(symbol: str) -> str:
    cleaned = symbol.strip().upper()
    if "." in cleaned:
        return cleaned
    known_symbols = {item["symbol"] for item in get_symbol_universe()}
    if cleaned in known_symbols:
        return cleaned
    return f"{cleaned}.NS"


def _prepare_history(symbol: str, period: str = "6mo", interval: str = "1d") -> tuple[dict, pd.DataFrame]:
    normalized_symbol = normalize_symbol(symbol)
    ticker = yf.Ticker(normalized_symbol)
    info = ticker.fast_info or {}
    history = ticker.history(period=period, interval=interval, auto_adjust=False)
    if history.empty:
        raise ValueError(f"No market data found for symbol '{normalized_symbol}'.")
    history = history.reset_index()
    return info, history


def _build_quote(symbol: str, ticker: yf.Ticker, info: dict, history: pd.DataFrame) -> StockQuote:
    metadata = getattr(ticker, "info", {}) or {}
    latest = history.iloc[-1]
    previous_close = float(latest.get("Close", 0.0))
    current_price = float(info.get("lastPrice") or metadata.get("currentPrice") or previous_close)
    change = current_price - previous_close
    change_percent = (change / previous_close * 100) if previous_close else 0.0
    return StockQuote(
        symbol=symbol.upper(),
        company_name=metadata.get("longName") or metadata.get("shortName") or symbol.upper(),
        exchange=metadata.get("exchange"),
        currency=metadata.get("currency"),
        current_price=current_price,
        previous_close=previous_close,
        change=change,
        change_percent=change_percent,
        market_cap=metadata.get("marketCap"),
        sector=metadata.get("sector"),
        website=metadata.get("website"),
    )


def _format_time(value) -> str:
    timestamp = pd.to_datetime(value)
    return timestamp.strftime("%Y-%m-%d")


def get_stock_snapshot(symbol: str) -> StockResponse:
    normalized_symbol = normalize_symbol(symbol)
    ticker = yf.Ticker(normalized_symbol)
    info, history = _prepare_history(symbol)

    history["SMA20"] = compute_sma(history["Close"], 20)
    history["RSI14"] = compute_rsi(history["Close"], 14)

    ohlc = [
        OhlcPoint(
            time=_format_time(row.Date),
            open=float(row.Open),
            high=float(row.High),
            low=float(row.Low),
            close=float(row.Close),
            volume=float(row.Volume),
        )
        for row in history.itertuples()
    ]

    sma = [
        {"time": _format_time(row.Date), "value": float(row.SMA20)}
        for row in history.dropna(subset=["SMA20"]).itertuples()
    ]
    rsi = [
        {"time": _format_time(row.Date), "value": float(row.RSI14)}
        for row in history.dropna(subset=["RSI14"]).itertuples()
    ]

    return StockResponse(
        quote=_build_quote(normalized_symbol, ticker, info, history),
        ohlc=ohlc,
        indicators=IndicatorSeries(sma_20=sma, rsi_14=rsi),
    )


def get_live_price(symbol: str) -> float:
    symbol = normalize_symbol(symbol)
    ticker = yf.Ticker(symbol)
    info = ticker.fast_info or {}
    if info.get("lastPrice"):
        return float(info["lastPrice"])

    history = ticker.history(period="5d", interval="1m")
    if history.empty:
        raise ValueError(f"No intraday price available for '{symbol}'.")
    return float(history["Close"].dropna().iloc[-1])


def get_featured_stocks() -> list[dict]:
    featured = []
    for symbol in FEATURED_SYMBOLS:
        try:
            snapshot = get_stock_snapshot(symbol)
            featured.append(snapshot.quote.model_dump())
        except ValueError:
            continue
    return featured


def search_symbols(query: str) -> list[dict[str, str]]:
    if not query:
        return get_symbol_universe()[:10]

    normalized = query.lower().strip()
    return [
        item
        for item in get_symbol_universe()
        if normalized in item["symbol"].lower() or normalized in item["name"].lower()
    ][:12]
