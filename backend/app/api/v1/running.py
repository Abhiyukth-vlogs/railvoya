from fastapi import APIRouter, Query
from datetime import date
from typing import Optional
from app.schemas.running import RunningStatusResponse
from app.providers import get_railway_provider

router = APIRouter(prefix="/running-status", tags=["Train Live Running Status"])

@router.get("/{train_number}", response_model=RunningStatusResponse)
async def get_running_status(
    train_number: str,
    journey_date: Optional[date] = Query(default=None, description="Journey date (defaults to today)")
):
    provider = get_railway_provider()
    target_date = journey_date or date.today()
    return await provider.get_running_status(train_number.strip(), target_date)
