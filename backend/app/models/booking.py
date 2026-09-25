import uuid
from datetime import datetime, timezone, date
from typing import List, Optional
from sqlalchemy import String, Integer, Float, DateTime, Date, Boolean, ForeignKey, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base

def utc_now():
    return datetime.now(timezone.utc)

class Booking(Base):
    __tablename__ = "bookings"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)
    pnr_number: Mapped[str] = mapped_column(String(32), unique=True, index=True, nullable=False)
    idempotency_key: Mapped[str] = mapped_column(String(64), unique=True, index=True, nullable=False)
    
    # Train Journey Information
    train_number: Mapped[str] = mapped_column(String(20), nullable=False)
    train_name: Mapped[str] = mapped_column(String(255), nullable=False)
    origin_code: Mapped[str] = mapped_column(String(10), nullable=False)
    origin_name: Mapped[str] = mapped_column(String(255), nullable=False)
    destination_code: Mapped[str] = mapped_column(String(10), nullable=False)
    destination_name: Mapped[str] = mapped_column(String(255), nullable=False)
    boarding_station_code: Mapped[str] = mapped_column(String(10), nullable=False)
    journey_date: Mapped[date] = mapped_column(Date, nullable=False)
    departure_time: Mapped[str] = mapped_column(String(20), nullable=False)
    arrival_time: Mapped[str] = mapped_column(String(20), nullable=False)
    duration: Mapped[str] = mapped_column(String(50), nullable=False)
    arrival_day_offset: Mapped[int] = mapped_column(Integer, default=0)
    
    # Class & Quota
    travel_class: Mapped[str] = mapped_column(String(10), nullable=False)
    quota: Mapped[str] = mapped_column(String(10), nullable=False)
    
    # Status: DRAFT, PENDING_PAYMENT, CONFIRMED, FAILED, CANCELLED, REFUND_PENDING
    status: Mapped[str] = mapped_column(String(30), default="PENDING_PAYMENT", index=True)
    
    # Fare breakdown
    base_fare: Mapped[float] = mapped_column(Float, default=0.0)
    reservation_charge: Mapped[float] = mapped_column(Float, default=0.0)
    superfast_charge: Mapped[float] = mapped_column(Float, default=0.0)
    tatkal_charge: Mapped[float] = mapped_column(Float, default=0.0)
    gst_amount: Mapped[float] = mapped_column(Float, default=0.0)
    total_amount: Mapped[float] = mapped_column(Float, default=0.0)
    refund_amount: Mapped[float] = mapped_column(Float, default=0.0)
    
    # Contact Information
    contact_email: Mapped[str] = mapped_column(String(255), nullable=False)
    contact_phone: Mapped[str] = mapped_column(String(20), nullable=False)
    
    # Mode flag
    is_demo: Mapped[bool] = mapped_column(Boolean, default=True)
    
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now, onupdate=utc_now)

    user = relationship("User", back_populates="bookings")
    passengers = relationship("BookingPassenger", back_populates="booking", cascade="all, delete-orphan")
    events = relationship("BookingEvent", back_populates="booking", cascade="all, delete-orphan")
    transactions = relationship("PaymentTransaction", back_populates="booking", cascade="all, delete-orphan")

class BookingPassenger(Base):
    __tablename__ = "booking_passengers"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    booking_id: Mapped[str] = mapped_column(String(36), ForeignKey("bookings.id", ondelete="CASCADE"), nullable=False, index=True)
    full_name: Mapped[str] = mapped_column(String(255), nullable=False)
    age: Mapped[int] = mapped_column(Integer, nullable=False)
    gender: Mapped[str] = mapped_column(String(20), nullable=False)
    berth_preference: Mapped[str] = mapped_column(String(50), default="No Preference")
    assigned_coach: Mapped[str] = mapped_column(String(20), default="Pending")
    assigned_berth: Mapped[int] = mapped_column(Integer, default=0)
    assigned_berth_type: Mapped[str] = mapped_column(String(50), default="Confirmed")
    current_status: Mapped[str] = mapped_column(String(30), default="CNF")  # CNF, RAC, WL, CAN
    status_detail: Mapped[str] = mapped_column(String(100), default="Confirmed")

    booking = relationship("Booking", back_populates="passengers")

class BookingEvent(Base):
    __tablename__ = "booking_events"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    booking_id: Mapped[str] = mapped_column(String(36), ForeignKey("bookings.id", ondelete="CASCADE"), nullable=False, index=True)
    event_type: Mapped[str] = mapped_column(String(50), nullable=False)
    message: Mapped[str] = mapped_column(String(500), nullable=False)
    event_data: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)

    booking = relationship("Booking", back_populates="events")
