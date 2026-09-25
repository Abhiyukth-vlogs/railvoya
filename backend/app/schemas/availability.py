from pydantic import BaseModel
from typing import Optional
from datetime import date

class FareBreakdown(BaseModel):
    base_fare: float
    reservation_charge: float
    superfast_charge: float
    tatkal_charge: float
    gst_amount: float
    total_fare_per_passenger: float
    total_amount: float
    currency: str = "INR"

class AvailabilityCheckRequest(BaseModel):
    train_number: str
    origin: str
    destination: str
    journey_date: date
    travel_class: str
    quota: str = "GN"
    passenger_count: int = 1

class AvailabilityResponse(BaseModel):
    train_number: str
    train_name: str
    origin_code: str
    destination_code: str
    journey_date: date
    travel_class: str
    quota: str
    status: str
    status_detail: str
    seats_available: int
    fare_breakdown: FareBreakdown
    last_updated: str
    disclaimer: str = "Berth availability is indicative and subject to dynamic confirmation at payment."
