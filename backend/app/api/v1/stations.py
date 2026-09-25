from typing import List, Optional
from fastapi import APIRouter, Query
from app.schemas.train import StationItem
from app.providers import get_railway_provider

router = APIRouter(prefix="/stations", tags=["Stations"])

@router.get("/search", response_model=List[StationItem])
async def search_stations(
    q: str = Query(default="", min_length=0, max_length=50, description="Station name, city, or 3-4 letter IR code")
):
    provider = get_railway_provider()
    return await provider.search_stations(q)

@router.get("/popular", response_model=List[StationItem])
async def get_popular_stations():
    provider = get_railway_provider()
    return await provider.get_popular_stations()
