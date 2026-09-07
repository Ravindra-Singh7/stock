from pathlib import Path
import tempfile

from pydantic_settings import BaseSettings, SettingsConfigDict


def default_database_url() -> str:
    db_dir = Path(tempfile.gettempdir()) / "StockIt"
    db_dir.mkdir(parents=True, exist_ok=True)
    db_path = db_dir / "stockit.db"
    return f"sqlite:///{db_path.as_posix()}"


class Settings(BaseSettings):
    app_name: str = "StockIt API"
    api_v1_prefix: str = "/api"
    database_url: str = default_database_url()
    frontend_url: str = "http://localhost:5173"
    default_user_email: str = "demo@stockit.app"
    default_user_name: str = "StockIt Demo"

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")


settings = Settings()
