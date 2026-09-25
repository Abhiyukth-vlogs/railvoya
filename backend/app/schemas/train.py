from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import date

class StationItem(BaseModel):
    code: str
    name: str
    city: str
    state: str
    hindi_name: Optional[str] = None
    is_major_junction: bool = False

class ScheduleStop(BaseModel):
    station_code: str
    station_name: str
    arrival_time: str
    departure_time: str
    halt_minutes: int
    day_count: int
    distance_km: int
    platform: str

class ClassAvailability(BaseModel):
    class_code: str  # 1A, 2A, 3A, 3E, CC, EC, SL, 2S
    class_name: str
    fare: float
    status: str  # AVAILABLE, RAC, WL, REGRET
    status_detail: str  # e.g., "AVAILABLE 42", "RAC 6", "WL 18"
    seats_count: int
    last_updated: str
    catering_available: bool = False

class TrainSearchResult(BaseModel):
    train_number: str
    train_name: str
    train_type: str  # Vande Bharat, Rajdhani, Shatabdi, Superfast, Express
    origin_code: str
    origin_name: str
    destination_code: str
    destination_name: str
    departure_time: str
    arrival_time: str
    duration: str
    arrival_day_offset: int
    running_days: List[str]  # e.g., ["M", "T", "W", "T", "F", "S", "S"]
    classes: List[ClassAvailability]

class TrainSearchQuery(BaseModel):
    origin: str
    destination: str
    journey_date: date
    travel_class: Optional[str] = None
    quota: str = "GN"

class TrainScheduleResponse(BaseModel):
    train_number: str
    train_name: str
    train_type: str
    running_days: List[str]
    total_distance_km: int
    total_duration: str
    stops: List[ScheduleStop]
