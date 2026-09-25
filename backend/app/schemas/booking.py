from pydantic import BaseModel, Field, EmailStr, ConfigDict
from typing import List, Optional
from datetime import date, datetime
from app.schemas.availability import FareBreakdown

class PassengerInput(BaseModel):
    full_name: str = Field(min_length=2, max_length=100)
    age: int = Field(ge=1, le=120)
    gender: str = Field(pattern=r"^(Male|Female|Transgender)$")
    berth_preference: str = Field(default="No Preference")
    food_preference: Optional[str] = "No Food"
    senior_citizen: bool = False
    save_to_account: bool = False

class BookingCreateRequest(BaseModel):
    train_number: str
    origin_code: str
    destination_code: str
    boarding_station_code: Optional[str] = None
    journey_date: date
    travel_class: str
    quota: str = "GN"
    passengers: List[PassengerInput] = Field(min_length=1, max_length=6)
    contact_email: EmailStr
    contact_phone: str = Field(pattern=r"^[6-9]\d{9}$")
    idempotency_key: str = Field(min_length=10, max_length=64)
    simulation_scenario: str = Field(default="SUCCESS")

class BookingPassengerResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    full_name: str
    age: int
    gender: str
    berth_preference: str
    assigned_coach: str
    assigned_berth: int
    assigned_berth_type: str
    current_status: str
    status_detail: str

class BookingResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    pnr_number: str
    train_number: str
    train_name: str
    origin_code: str
    origin_name: str
    destination_code: str
    destination_name: str
    boarding_station_code: str
    journey_date: date
    departure_time: str
    arrival_time: str
    duration: str
    arrival_day_offset: int
    travel_class: str
    quota: str
    status: str
    passengers: List[BookingPassengerResponse]
    base_fare: float
    reservation_charge: float
    superfast_charge: float
    tatkal_charge: float
    gst_amount: float
    total_amount: float
    refund_amount: float = 0.0
    contact_email: str
    contact_phone: str
    is_demo: bool
    created_at: datetime

class BookingCancelRequest(BaseModel):
    passenger_ids: Optional[List[str]] = None
    reason: Optional[str] = "User requested cancellation"

class BookingCancelResponse(BaseModel):
    booking_id: str
    pnr_number: str
    status: str
    refund_amount: float
    cancellation_charge: float
    message: str
