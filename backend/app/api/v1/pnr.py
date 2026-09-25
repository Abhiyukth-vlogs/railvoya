from fastapi import APIRouter, HTTPException, status
from app.schemas.pnr import PnrStatusResponse, PnrPassengerStatus
from app.providers import get_railway_provider
from app.services.booking_service import BookingService
from app.core.database import get_db
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import Depends
from datetime import datetime, timezone

router = APIRouter(prefix="/pnr", tags=["PNR Status"])

@router.get("/{pnr_number}", response_model=PnrStatusResponse)
async def check_pnr_status(
    pnr_number: str,
    db: AsyncSession = Depends(get_db)
):
    cleaned = pnr_number.strip().upper()
    if len(cleaned) < 5:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"error": "INVALID_PNR", "message": "Please enter a valid 10-digit railway PNR or demo identifier."}
        )

    # 1. Check if it matches an actual booking stored in our local database first!
    local_booking = await BookingService.get_booking_by_pnr(db, cleaned)
    if local_booking:
        passengers = []
        for idx, p in enumerate(local_booking.passengers):
            passengers.append(
                PnrPassengerStatus(
                    passenger_number=idx + 1,
                    booking_status=p.status_detail,
                    current_status=p.status_detail,
                    coach=p.assigned_coach,
                    berth_number=p.assigned_berth,
                    berth_type=p.assigned_berth_type
                )
            )

        return PnrStatusResponse(
            pnr_number=local_booking.pnr_number,
            train_number=local_booking.train_number,
            train_name=local_booking.train_name,
            journey_date=local_booking.journey_date,
            origin_code=local_booking.origin_code,
            origin_name=local_booking.origin_name,
            destination_code=local_booking.destination_code,
            destination_name=local_booking.destination_name,
            boarding_point=local_booking.boarding_station_code,
            travel_class=local_booking.travel_class,
            quota=local_booking.quota,
            chart_status="CHART PREPARED" if local_booking.status == "CONFIRMED" else "CHART NOT PREPARED",
            passengers=passengers,
            last_updated=datetime.now(timezone.utc).strftime("%d %b %Y, %I:%M %p IST"),
            is_demo=local_booking.is_demo
        )

    # 2. Otherwise generate deterministic simulation response from Railway Provider
    provider = get_railway_provider()
    return await provider.get_pnr_status(cleaned)
