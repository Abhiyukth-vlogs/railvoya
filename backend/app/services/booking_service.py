from datetime import datetime, timezone, date
from typing import Optional, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from fastapi import HTTPException, status

from app.models.booking import Booking, BookingPassenger, BookingEvent
from app.models.payment import PaymentTransaction
from app.models.user import User
from app.schemas.booking import BookingCreateRequest, BookingCancelResponse
from app.providers import get_railway_provider, get_payment_provider
from app.services.auth_service import AuthService
from app.core.security import generate_pnr

def utc_now():
    return datetime.now(timezone.utc)

COACH_PREFIX_MAP = {
    "1A": "H",
    "2A": "A",
    "3A": "B",
    "3E": "M",
    "CC": "C",
    "EC": "E",
    "SL": "S",
    "2S": "D",
}

class BookingService:
    @staticmethod
    async def create_booking(
        db: AsyncSession,
        req: BookingCreateRequest,
        current_user: Optional[User] = None
    ) -> Booking:
        # Rule 1: Reject identical origin and destination
        if req.origin_code.strip().upper() == req.destination_code.strip().upper():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail={"error": "INVALID_STATIONS", "message": "Origin and destination stations cannot be identical."}
            )

        # Rule 2: Reject past dates
        if req.journey_date < date.today():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail={"error": "INVALID_DATE", "message": "Journey date cannot be in the past."}
            )

        # Rule 3: Tatkal passenger limits (max 4 passengers for Tatkal / Premium Tatkal)
        if req.quota in ["TQ", "PT"] and len(req.passengers) > 4:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail={"error": "TATKAL_PASSENGER_LIMIT", "message": "Under Tatkal and Premium Tatkal quotas, a maximum of 4 passengers is permitted per booking."}
            )

        # Rule 4: Server-side Idempotency check
        existing_res = await db.execute(
            select(Booking)
            .where(Booking.idempotency_key == req.idempotency_key)
            .options(selectinload(Booking.passengers), selectinload(Booking.events))
        )
        existing_booking = existing_res.scalars().first()
        if existing_booking:
            return existing_booking

        # Rule 5: Re-validate fare and availability from Railway Provider
        railway_provider = get_railway_provider()
        avail = await railway_provider.check_availability(
            train_number=req.train_number,
            origin=req.origin_code.strip().upper(),
            destination=req.destination_code.strip().upper(),
            journey_date=req.journey_date,
            travel_class=req.travel_class,
            quota=req.quota,
            passenger_count=len(req.passengers)
        )

        fare = avail.fare_breakdown
        train_sched = await railway_provider.get_train_schedule(req.train_number)
        dep_time = "06:00"
        arr_time = "14:00"
        duration = "8h 00m"
        day_offset = 0

        if train_sched:
            orig_stop = next((s for s in train_sched.stops if s.station_code == req.origin_code.upper()), None)
            dest_stop = next((s for s in train_sched.stops if s.station_code == req.destination_code.upper()), None)
            if orig_stop and dest_stop:
                dep_time = orig_stop.departure_time
                arr_time = dest_stop.arrival_time
                day_offset = dest_stop.day_count - orig_stop.day_count

        # Create Booking in PENDING_PAYMENT state
        pnr = generate_pnr(is_demo=True)
        booking = Booking(
            user_id=current_user.id if current_user else None,
            pnr_number=pnr,
            idempotency_key=req.idempotency_key,
            train_number=req.train_number,
            train_name=avail.train_name,
            origin_code=req.origin_code.upper(),
            origin_name=req.origin_code.upper(),
            destination_code=req.destination_code.upper(),
            destination_name=req.destination_code.upper(),
            boarding_station_code=req.boarding_station_code or req.origin_code.upper(),
            journey_date=req.journey_date,
            departure_time=dep_time,
            arrival_time=arr_time,
            duration=duration,
            arrival_day_offset=day_offset,
            travel_class=req.travel_class,
            quota=req.quota,
            status="PENDING_PAYMENT",
            base_fare=fare.base_fare,
            reservation_charge=fare.reservation_charge,
            superfast_charge=fare.superfast_charge,
            tatkal_charge=fare.tatkal_charge,
            gst_amount=fare.gst_amount,
            total_amount=fare.total_amount,
            refund_amount=0.0,
            contact_email=req.contact_email,
            contact_phone=req.contact_phone,
            is_demo=True
        )
        db.add(booking)
        await db.flush()

        # Add passengers with allocated berths
        coach_prefix = COACH_PREFIX_MAP.get(req.travel_class, "B")
        coach_num = 1
        berth_types = ["Lower", "Middle", "Upper", "Side Lower", "Side Upper", "Window"]

        for idx, p in enumerate(req.passengers):
            coach_str = f"{coach_prefix}{coach_num}"
            berth_no = 21 + idx
            pref = p.berth_preference if p.berth_preference != "No Preference" else berth_types[idx % len(berth_types)]
            
            bp = BookingPassenger(
                booking_id=booking.id,
                full_name=p.full_name.strip(),
                age=p.age,
                gender=p.gender,
                berth_preference=p.berth_preference,
                assigned_coach=coach_str,
                assigned_berth=berth_no,
                assigned_berth_type=pref,
                current_status="CNF",
                status_detail=f"Confirmed / {coach_str} / {berth_no} ({pref})"
            )
            db.add(bp)

            # Save passenger if requested and user is logged in
            if current_user and p.save_to_account:
                await AuthService.save_passenger(
                    db=db,
                    user_id=current_user.id,
                    full_name=p.full_name,
                    age=p.age,
                    gender=p.gender,
                    berth_preference=p.berth_preference,
                    food_preference=p.food_preference or "No Food",
                    senior_citizen=p.senior_citizen
                )

        # Log booking creation event
        event = BookingEvent(
            booking_id=booking.id,
            event_type="BOOKING_CREATED",
            message=f"Booking created in state PENDING_PAYMENT with PNR {pnr}."
        )
        db.add(event)

        # Process payment simulation via PaymentProvider
        payment_provider = get_payment_provider()
        pay_res = await payment_provider.initiate_payment(
            booking_id=booking.id,
            amount=fare.total_amount,
            scenario=req.simulation_scenario
        )

        txn = PaymentTransaction(
            booking_id=booking.id,
            provider=pay_res["provider"],
            provider_reference=pay_res["provider_reference"],
            amount=pay_res["amount"],
            currency=pay_res["currency"],
            status=pay_res["status"]
        )
        db.add(txn)

        if pay_res["status"] == "SUCCESS":
            booking.status = "CONFIRMED"
            db.add(
                BookingEvent(
                    booking_id=booking.id,
                    event_type="PAYMENT_CONFIRMED",
                    message="Demo payment simulation succeeded. E-ticket issued."
                )
            )
        elif pay_res["status"] == "PENDING_RECONCILIATION":
            booking.status = "PENDING_RECONCILIATION"
            db.add(
                BookingEvent(
                    booking_id=booking.id,
                    event_type="PAYMENT_PENDING",
                    message="Payment simulation timed out. Status marked for reconciliation."
                )
            )
        else:
            booking.status = "FAILED"
            db.add(
                BookingEvent(
                    booking_id=booking.id,
                    event_type="PAYMENT_FAILED",
                    message=f"Payment simulation failed: {pay_res.get('error_message', 'Payment declined.')}"
                )
            )
            await db.commit()
            raise HTTPException(
                status_code=status.HTTP_402_PAYMENT_REQUIRED,
                detail={
                    "error": "PAYMENT_FAILED",
                    "message": pay_res.get("error_message", "Payment declined during simulation."),
                    "booking_id": booking.id
                }
            )

        await db.commit()
        await db.refresh(booking)

        # Load relationships
        res = await db.execute(
            select(Booking)
            .where(Booking.id == booking.id)
            .options(selectinload(Booking.passengers), selectinload(Booking.events))
        )
        return res.scalars().first()

    @staticmethod
    async def get_booking_by_id(
        db: AsyncSession,
        booking_id: str,
        current_user: Optional[User] = None
    ) -> Booking:
        res = await db.execute(
            select(Booking)
            .where(Booking.id == booking_id)
            .options(selectinload(Booking.passengers), selectinload(Booking.events))
        )
        booking = res.scalars().first()
        if not booking:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail={"error": "BOOKING_NOT_FOUND", "message": "Booking not found."}
            )

        # Private ownership check
        if current_user and booking.user_id and booking.user_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail={"error": "ACCESS_DENIED", "message": "You do not have permission to view this booking."}
            )

        return booking

    @staticmethod
    async def get_booking_by_pnr(
        db: AsyncSession,
        pnr: str
    ) -> Optional[Booking]:
        res = await db.execute(
            select(Booking)
            .where(Booking.pnr_number == pnr)
            .options(selectinload(Booking.passengers), selectinload(Booking.events))
        )
        return res.scalars().first()

    @staticmethod
    async def get_user_bookings(
        db: AsyncSession,
        user_id: str
    ) -> List[Booking]:
        res = await db.execute(
            select(Booking)
            .where(Booking.user_id == user_id)
            .order_by(Booking.created_at.desc())
            .options(selectinload(Booking.passengers))
        )
        return list(res.scalars().all())

    @staticmethod
    async def cancel_booking(
        db: AsyncSession,
        booking_id: str,
        reason: str = "User requested cancellation",
        current_user: Optional[User] = None
    ) -> BookingCancelResponse:
        booking = await BookingService.get_booking_by_id(db, booking_id, current_user)

        if booking.status == "CANCELLED":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail={"error": "ALREADY_CANCELLED", "message": "This booking is already cancelled."}
            )

        # Standard Indian Railway cancellation rules:
        # Per passenger flat deduction (1A: 240, 2A: 200, 3A: 180, CC: 180, SL: 120, 2S: 60)
        cancellation_rate_map = {
            "1A": 240.0,
            "EC": 240.0,
            "2A": 200.0,
            "3A": 180.0,
            "3E": 180.0,
            "CC": 180.0,
            "SL": 120.0,
            "2S": 60.0
        }
        fee_per_pax = cancellation_rate_map.get(booking.travel_class, 120.0)
        pax_count = len(booking.passengers)
        total_clerkage = fee_per_pax * pax_count
        refund_amt = max(0.0, booking.total_amount - total_clerkage)

        booking.status = "CANCELLED"
        booking.refund_amount = refund_amt

        for p in booking.passengers:
            p.current_status = "CAN"
            p.status_detail = "Cancelled"

        db.add(
            BookingEvent(
                booking_id=booking.id,
                event_type="BOOKING_CANCELLED",
                message=f"Booking cancelled. Reason: {reason}. Refund amount: Rs {refund_amt}."
            )
        )

        await db.commit()

        return BookingCancelResponse(
            booking_id=booking.id,
            pnr_number=booking.pnr_number,
            status="CANCELLED",
            refund_amount=refund_amt,
            cancellation_charge=total_clerkage,
            message=f"Booking successfully cancelled. Refund of Rs {refund_amt:.2f} processed in demo mode."
        )
