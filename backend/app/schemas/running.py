from pydantic import BaseModel
from typing import List, Optional
from datetime import date

class StationRunningStop(BaseModel):
    station_code: str
    station_name: str
    scheduled_arrival: str
    scheduled_departure: str
    actual_arrival: str
    actual_departure: str
    delay_arrival_minutes: int
    delay_departure_minutes: int
    platform: str
    has_arrived: bool
    has_departed: bool
    is_current: bool

class RunningStatusResponse(BaseModel):
    train_number: str
    train_name: str
    journey_date: date
    current_station: str
    current_status_summary: str  # e.g., "Departed KOTA on time" or "Running 15 mins late"
    delay_minutes: int
    last_updated: str
    stops: List[StationRunningStop]
    is_demo: bool = True
