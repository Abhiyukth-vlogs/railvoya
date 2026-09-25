from typing import List, Optional
from fastapi import APIRouter, Depends, Response, HTTPException, status
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession
import io

from app.core.database import get_db
from app.schemas.booking import (
    BookingCreateRequest,
    BookingResponse,
    BookingCancelRequest,
    BookingCancelResponse,
)
from app.services.booking_service import BookingService
from app.services.pdf_service import PdfService
from app.api.deps import get_current_user_optional, get_current_user_required
from app.models.user import User

router = APIRouter(prefix="/bookings", tags=["Bookings & Tickets"])

@router.post("", response_model=BookingResponse, status_code=status.HTTP_201_CREATED)
async def create_booking(
    payload: BookingCreateRequest,
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: AsyncSession = Depends(get_db)
):
    booking = await BookingService.create_booking(
        db=db,
        req=payload,
        current_user=current_user
    )
    return booking

@router.get("", response_model=List[BookingResponse])
async def list_my_bookings(
    current_user: User = Depends(get_current_user_required),
    db: AsyncSession = Depends(get_db)
):
    return await BookingService.get_user_bookings(db, current_user.id)

@router.get("/{booking_id}", response_model=BookingResponse)
async def get_booking_details(
    booking_id: str,
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: AsyncSession = Depends(get_db)
):
    return await BookingService.get_booking_by_id(db, booking_id, current_user)

@router.post("/{booking_id}/cancel", response_model=BookingCancelResponse)
async def cancel_booking(
    booking_id: str,
    payload: Optional[BookingCancelRequest] = None,
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: AsyncSession = Depends(get_db)
):
    reason = payload.reason if payload and payload.reason else "User requested cancellation"
    return await BookingService.cancel_booking(
        db=db,
        booking_id=booking_id,
        reason=reason,
        current_user=current_user
    )

@router.get("/{booking_id}/ticket.pdf")
async def download_ticket_pdf(
    booking_id: str,
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: AsyncSession = Depends(get_db)
):
    booking = await BookingService.get_booking_by_id(db, booking_id, current_user)
    pdf_bytes = PdfService.generate_ticket_pdf(booking)

    filename = f"RailVoya_Ticket_{booking.pnr_number}.pdf"
    return StreamingResponse(
        io.BytesIO(pdf_bytes),
        media_type="application/pdf",
        headers={
            "Content-Disposition": f'inline; filename="{filename}"',
            "Cache-Control": "no-cache, no-store, must-revalidate",
        }
    )
