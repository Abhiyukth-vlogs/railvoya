from pydantic import BaseModel
from typing import List
from datetime import date

class PnrPassengerStatus(BaseModel):
    passenger_number: int
    booking_status: str  # e.g., "CNF / B3 / 42" or "WL 12"
    current_status: str  # e.g., "CNF / B3 / 42" or "RAC 4"
    coach: str
    berth_number: int
    berth_type: str

class PnrStatusResponse(BaseModel):
    pnr_number: str
    train_number: str
    train_name: str
    journey_date: date
    origin_code: str
    origin_name: str
    destination_code: str
    destination_name: str
    boarding_point: str
    travel_class: str
    quota: str
    chart_status: str  # "CHART NOT PREPARED" or "CHART PREPARED"
    passengers: List[PnrPassengerStatus]
    last_updated: str
    is_demo: bool = True
