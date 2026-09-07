from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.config import settings
from app.models.portfolio import PortfolioHolding
from app.models.user import User
from app.models.watchlist import WatchlistItem
from app.services.auth import hash_password


def seed_demo_data(db: Session) -> None:
    existing = db.scalar(select(User).where(User.email == settings.default_user_email))
    if existing:
        return

    user = User(
        name=settings.default_user_name,
        email=settings.default_user_email,
        password_hash=hash_password("stockit123"),
    )
    db.add(user)
    db.flush()

    db.add_all(
        [
            WatchlistItem(symbol="RELIANCE.NS", user_id=user.id),
            WatchlistItem(symbol="TCS.NS", user_id=user.id),
            WatchlistItem(symbol="INFY.NS", user_id=user.id),
            PortfolioHolding(symbol="RELIANCE.NS", quantity=14, buy_price=2890.4, user_id=user.id),
            PortfolioHolding(symbol="TCS.NS", quantity=6, buy_price=4025.1, user_id=user.id),
            PortfolioHolding(symbol="HDFCBANK.NS", quantity=10, buy_price=1681.2, user_id=user.id),
        ]
    )
    db.commit()
