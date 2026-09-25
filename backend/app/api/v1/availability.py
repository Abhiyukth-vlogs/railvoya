from fastapi import APIRouter, HTTPException, status
from app.schemas.availability import AvailabilityCheckRequest, AvailabilityResponse
from app.providers import get_railway_provider

router = APIRouter(prefix="/availability", tags=["Seat Availability & Fare Quotes"])

@router.post("/check", response_model=AvailabilityResponse)
async def check_availability(payload: AvailabilityCheckRequest):
    provider = get_railway_provider()
    try:
        return await provider.check_availability(
            train_number=payload.train_number.strip(),
            origin=payload.origin.strip().upper(),
            destination=payload.destination.strip().upper(),
            journey_date=payload.journey_date,
            travel_class=payload.travel_class.strip().upper(),
            quota=payload.quota.strip().upper(),
            passenger_count=payload.passenger_count
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"error": "AVAILABILITY_ERROR", "message": str(e)}
        )
