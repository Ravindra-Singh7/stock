from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import inspect

from app.api.routes import router
from app.core.config import settings
from app.db.database import Base, SessionLocal, engine
from app.services.seed import seed_demo_data


def ensure_schema() -> None:
    inspector = inspect(engine)
    if "users" not in inspector.get_table_names():
        Base.metadata.create_all(bind=engine)
        return

    columns = {column["name"] for column in inspector.get_columns("users")}
    if "password_hash" not in columns:
        Base.metadata.drop_all(bind=engine)
        Base.metadata.create_all(bind=engine)
        return

    Base.metadata.create_all(bind=engine)


@asynccontextmanager
async def lifespan(_: FastAPI) -> AsyncIterator[None]:
    ensure_schema()
    with SessionLocal() as db:
        seed_demo_data(db)
    yield


app = FastAPI(title=settings.app_name, lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url, "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix=settings.api_v1_prefix)
