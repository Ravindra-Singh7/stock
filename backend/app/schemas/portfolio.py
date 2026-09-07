from pydantic import BaseModel, ConfigDict


class PortfolioHoldingBase(BaseModel):
    symbol: str
    quantity: float
    buy_price: float


class PortfolioHoldingCreate(PortfolioHoldingBase):
    pass


class PortfolioHoldingRead(PortfolioHoldingBase):
    id: int
    current_price: float | None = None
    market_value: float | None = None
    cost_basis: float | None = None
    unrealized_gain: float | None = None
    unrealized_gain_percent: float | None = None
    recommendation: str | None = None
    recommendation_reason: str | None = None

    model_config = ConfigDict(from_attributes=True)
