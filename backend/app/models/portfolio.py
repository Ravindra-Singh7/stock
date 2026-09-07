from sqlalchemy import Float, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.database import Base


class PortfolioHolding(Base):
    __tablename__ = "portfolio_holdings"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    symbol: Mapped[str] = mapped_column(String(20), index=True)
    quantity: Mapped[float] = mapped_column(Float)
    buy_price: Mapped[float] = mapped_column(Float)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))

    user = relationship("User", back_populates="portfolio_holdings")
