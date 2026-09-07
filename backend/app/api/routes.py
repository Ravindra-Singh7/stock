import asyncio

from fastapi import APIRouter, Depends, Header, HTTPException, Query, WebSocket, WebSocketDisconnect
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.config import settings
from app.db.database import get_db
from app.models.portfolio import PortfolioHolding
from app.models.user import User
from app.models.watchlist import WatchlistItem
from app.schemas.auth import AuthResponse, LoginRequest, RegisterRequest, UserRead
from app.schemas.portfolio import PortfolioHoldingCreate, PortfolioHoldingRead
from app.schemas.stock import PredictionResponse, StockResponse
from app.schemas.watchlist import WatchlistItemCreate, WatchlistItemRead
from app.services.auth import hash_password, verify_password
from app.services.market_data import (
    get_featured_stocks,
    get_live_price,
    get_stock_snapshot,
    normalize_symbol,
    search_symbols,
)
from app.services.prediction import predict_next_close
import yfinance as yf


router = APIRouter()


def build_holding_recommendation(holding: PortfolioHolding) -> PortfolioHoldingRead:
    cost_basis = holding.quantity * holding.buy_price
    try:
        snapshot = get_stock_snapshot(holding.symbol)
        current_price = snapshot.quote.current_price
        market_value = holding.quantity * current_price
        unrealized_gain = market_value - cost_basis
        gain_percent = (unrealized_gain / cost_basis * 100) if cost_basis else 0.0
        daily_change = snapshot.quote.change_percent

        if gain_percent <= -8:
            recommendation = "Review"
            reason = "Position is meaningfully below cost; review sizing and risk before adding."
        elif gain_percent >= 18 and daily_change < 0:
            recommendation = "Take profit"
            reason = "Position has a strong unrealized gain while daily momentum is cooling."
        elif gain_percent >= 8 or daily_change > 1.5:
            recommendation = "Hold"
            reason = "Position is above cost or showing constructive daily momentum."
        else:
            recommendation = "Watch"
            reason = "Position is near cost; wait for a stronger trend before adding."

        return PortfolioHoldingRead(
            id=holding.id,
            symbol=holding.symbol,
            quantity=holding.quantity,
            buy_price=holding.buy_price,
            current_price=round(current_price, 2),
            market_value=round(market_value, 2),
            cost_basis=round(cost_basis, 2),
            unrealized_gain=round(unrealized_gain, 2),
            unrealized_gain_percent=round(gain_percent, 2),
            recommendation=recommendation,
            recommendation_reason=reason,
        )
    except ValueError:
        return PortfolioHoldingRead(
            id=holding.id,
            symbol=holding.symbol,
            quantity=holding.quantity,
            buy_price=holding.buy_price,
            cost_basis=round(cost_basis, 2),
            recommendation="Data unavailable",
            recommendation_reason="Live market data could not be loaded for this symbol.",
        )


def get_current_user(
    db: Session = Depends(get_db),
    x_user_id: int | None = Header(default=None),
) -> User:
    if x_user_id is None:
        raise HTTPException(status_code=401, detail="Authentication required.")
    user = db.get(User, x_user_id)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid user session.")
    return user


@router.get("/health")
def healthcheck() -> dict[str, str]:
    return {"status": "ok"}


@router.post("/auth/register", response_model=AuthResponse, status_code=201)
def register(payload: RegisterRequest, db: Session = Depends(get_db)) -> AuthResponse:
    existing = db.scalar(select(User).where(User.email == payload.email))
    if existing:
        raise HTTPException(status_code=409, detail="An account with this email already exists.")

    user = User(name=payload.name, email=payload.email, password_hash=hash_password(payload.password))
    db.add(user)
    db.commit()
    db.refresh(user)
    return AuthResponse(user=UserRead.model_validate(user))


@router.post("/auth/login", response_model=AuthResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)) -> AuthResponse:
    user = db.scalar(select(User).where(User.email == payload.email))
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password.")
    return AuthResponse(user=UserRead.model_validate(user))


@router.get("/market/featured")
def featured_stocks() -> list[dict]:
    return get_featured_stocks()


@router.get("/search")
def search_stock(query: str = Query(default="")) -> list[dict[str, str]]:
    return search_symbols(query)


@router.get("/stock/{symbol}", response_model=StockResponse)
def stock_details(symbol: str) -> StockResponse:
    try:
        return get_stock_snapshot(symbol)
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.get("/predict/{symbol}", response_model=PredictionResponse)
def predict_price(symbol: str) -> PredictionResponse:
    symbol = normalize_symbol(symbol)
    history = yf.Ticker(symbol).history(period="6mo", interval="1d", auto_adjust=False)
    if history.empty:
        raise HTTPException(status_code=404, detail=f"No historical data found for '{symbol}'.")

    predicted_price, latest_close = predict_next_close(history)
    return PredictionResponse(
        symbol=symbol.upper(),
        model="PyTorch Transformer",
        predicted_price=round(predicted_price, 2),
        latest_close=round(latest_close, 2),
        confidence_note="Forecast generated by a lightweight transformer trained on recent closing-price windows.",
    )


@router.get("/portfolio", response_model=list[PortfolioHoldingRead])
def list_portfolio(user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> list[PortfolioHoldingRead]:
    holdings = db.scalars(select(PortfolioHolding).where(PortfolioHolding.user_id == user.id)).all()
    return [build_holding_recommendation(holding) for holding in holdings]


@router.post("/portfolio", response_model=PortfolioHoldingRead, status_code=201)
def create_portfolio_holding(
    payload: PortfolioHoldingCreate, user: User = Depends(get_current_user), db: Session = Depends(get_db)
) -> PortfolioHolding:
    holding = PortfolioHolding(**payload.model_dump(), symbol=normalize_symbol(payload.symbol), user_id=user.id)
    db.add(holding)
    db.commit()
    db.refresh(holding)
    return holding


@router.get("/watchlist", response_model=list[WatchlistItemRead])
def list_watchlist(user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> list[WatchlistItem]:
    return db.scalars(select(WatchlistItem).where(WatchlistItem.user_id == user.id)).all()


@router.post("/watchlist", response_model=WatchlistItemRead, status_code=201)
def create_watchlist_item(
    payload: WatchlistItemCreate, user: User = Depends(get_current_user), db: Session = Depends(get_db)
) -> WatchlistItem:
    symbol = normalize_symbol(payload.symbol)
    exists = db.scalar(
        select(WatchlistItem).where(WatchlistItem.user_id == user.id, WatchlistItem.symbol == symbol)
    )
    if exists:
        return exists

    item = WatchlistItem(symbol=symbol, user_id=user.id)
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@router.websocket("/ws/{symbol}")
async def stock_socket(websocket: WebSocket, symbol: str) -> None:
    await websocket.accept()
    try:
        while True:
            price = get_live_price(symbol)
            await websocket.send_json({"symbol": symbol.upper(), "price": round(price, 2)})
            await asyncio.sleep(3)
    except WebSocketDisconnect:
        return
