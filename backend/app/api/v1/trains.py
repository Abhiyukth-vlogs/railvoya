from typing import List, Optional
from datetime import date
from fastapi import APIRouter, Query, HTTPException, status
from app.schemas.train import TrainSearchResult, TrainScheduleResponse
from app.providers import get_railway_provider

router = APIRouter(prefix="/trains", tags=["Trains"])

@router.get("/search", response_model=List[TrainSearchResult])
async def search_trains(
    origin: str = Query(..., min_length=2, max_length=10, description="Origin station code (e.g. NDLS)"),
    destination: str = Query(..., min_length=2, max_length=10, description="Destination station code (e.g. MMCT)"),
    journey_date: date = Query(..., description="Journey date in YYYY-MM-DD"),
    travel_class: Optional[str] = Query(default=None, description="Optional class filter (e.g. 3A, CC, ALL)"),
    quota: str = Query(default="GN", description="Quota: GN, TQ, PT, LD, SS, HP")
):
    if origin.strip().upper() == destination.strip().upper():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"error": "INVALID_STATIONS", "message": "Origin and destination stations cannot be identical."}
        )

    if journey_date < date.today():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"error": "INVALID_DATE", "message": "Journey date cannot be in the past."}
        )

    provider = get_railway_provider()
    return await provider.search_trains(
        origin=origin.strip().upper(),
        destination=destination.strip().upper(),
        journey_date=journey_date,
        travel_class=travel_class,
        quota=quota.strip().upper()
    )

@router.get("/{train_number}/schedule", response_model=TrainScheduleResponse)
async def get_train_schedule(train_number: str):
    provider = get_railway_provider()
    schedule = await provider.get_train_schedule(train_number.strip())
    if not schedule:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"error": "TRAIN_NOT_FOUND", "message": f"Train {train_number} not found."}
        )
    return schedule
