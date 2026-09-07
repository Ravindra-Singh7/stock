from pydantic import BaseModel, ConfigDict


class WatchlistItemBase(BaseModel):
    symbol: str


class WatchlistItemCreate(WatchlistItemBase):
    pass


class WatchlistItemRead(WatchlistItemBase):
    id: int

    model_config = ConfigDict(from_attributes=True)
