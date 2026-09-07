from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.database import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(120))
    email: Mapped[str] = mapped_column(String(120), unique=True, index=True)
    password_hash: Mapped[str] = mapped_column(String(255))

    watchlist_items = relationship("WatchlistItem", back_populates="user", cascade="all, delete-orphan")
    portfolio_holdings = relationship("PortfolioHolding", back_populates="user", cascade="all, delete-orphan")
