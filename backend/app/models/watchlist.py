from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.database import Base


class WatchlistItem(Base):
    __tablename__ = "watchlist_items"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    symbol: Mapped[str] = mapped_column(String(20), index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))

    user = relationship("User", back_populates="watchlist_items")
