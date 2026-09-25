from typing import List, Optional, Dict
from datetime import date, datetime, timedelta, timezone
import hashlib
from app.providers.base import IRailwayProvider
from app.schemas.train import (
    StationItem,
    TrainSearchResult,
    TrainScheduleResponse,
    ScheduleStop,
    ClassAvailability,
)
from app.schemas.availability import AvailabilityResponse, FareBreakdown
from app.schemas.pnr import PnrStatusResponse, PnrPassengerStatus
from app.schemas.running import RunningStatusResponse, StationRunningStop

from app.data.stations_india import ALL_INDIA_STATIONS

STATIONS_DATA: List[Dict] = ALL_INDIA_STATIONS
STATION_MAP: Dict[str, Dict] = {s["code"]: s for s in STATIONS_DATA}
GENERATED_TRAINS_CACHE: Dict[str, Dict] = {}


# Master trains catalog with routes and real intermediate stops
TRAINS_CATALOG: List[Dict] = [
    {
        "train_number": "12952",
        "train_name": "New Delhi - Mumbai Central Tejas Rajdhani Express",
        "train_type": "Rajdhani",
        "origin_code": "NDLS",
        "origin_name": "New Delhi",
        "destination_code": "MMCT",
        "destination_name": "Mumbai Central",
        "departure_time": "16:55",
        "arrival_time": "08:35",
        "duration": "15h 40m",
        "arrival_day_offset": 1,
        "running_days": ["M", "T", "W", "T", "F", "S", "S"],
        "classes": ["1A", "2A", "3A"],
        "distance_km": 1386,
        "stops": [
            {"station_code": "NDLS", "station_name": "New Delhi", "arrival_time": "First", "departure_time": "16:55", "halt_minutes": 0, "day_count": 1, "distance_km": 0, "platform": "3"},
            {"station_code": "KOTA", "station_name": "Kota Junction", "arrival_time": "21:30", "departure_time": "21:40", "halt_minutes": 10, "day_count": 1, "distance_km": 465, "platform": "2"},
            {"station_code": "BRC", "station_name": "Vadodara Junction", "arrival_time": "03:40", "departure_time": "03:50", "halt_minutes": 10, "day_count": 2, "distance_km": 993, "platform": "1"},
            {"station_code": "ST", "station_name": "Surat", "arrival_time": "05:13", "departure_time": "05:18", "halt_minutes": 5, "day_count": 2, "distance_km": 1123, "platform": "2"},
            {"station_code": "MMCT", "station_name": "Mumbai Central", "arrival_time": "08:35", "departure_time": "Last", "halt_minutes": 0, "day_count": 2, "distance_km": 1386, "platform": "1"},
        ]
    },
    {
        "train_number": "12951",
        "train_name": "Mumbai Central - New Delhi Tejas Rajdhani Express",
        "train_type": "Rajdhani",
        "origin_code": "MMCT",
        "origin_name": "Mumbai Central",
        "destination_code": "NDLS",
        "destination_name": "New Delhi",
        "departure_time": "17:00",
        "arrival_time": "08:32",
        "duration": "15h 32m",
        "arrival_day_offset": 1,
        "running_days": ["M", "T", "W", "T", "F", "S", "S"],
        "classes": ["1A", "2A", "3A"],
        "distance_km": 1386,
        "stops": [
            {"station_code": "MMCT", "station_name": "Mumbai Central", "arrival_time": "First", "departure_time": "17:00", "halt_minutes": 0, "day_count": 1, "distance_km": 0, "platform": "1"},
            {"station_code": "ST", "station_name": "Surat", "arrival_time": "19:43", "departure_time": "19:48", "halt_minutes": 5, "day_count": 1, "distance_km": 263, "platform": "1"},
            {"station_code": "BRC", "station_name": "Vadodara Junction", "arrival_time": "21:06", "departure_time": "21:16", "halt_minutes": 10, "day_count": 1, "distance_km": 393, "platform": "2"},
            {"station_code": "KOTA", "station_name": "Kota Junction", "arrival_time": "03:15", "departure_time": "03:25", "halt_minutes": 10, "day_count": 2, "distance_km": 921, "platform": "1"},
            {"station_code": "NDLS", "station_name": "New Delhi", "arrival_time": "08:32", "departure_time": "Last", "halt_minutes": 0, "day_count": 2, "distance_km": 1386, "platform": "3"},
        ]
    },
    {
        "train_number": "12925",
        "train_name": "Paschim Superfast Express",
        "train_type": "Superfast",
        "origin_code": "MMCT",
        "origin_name": "Mumbai Central",
        "destination_code": "NDLS",
        "destination_name": "New Delhi",
        "departure_time": "11:25",
        "arrival_time": "10:40",
        "duration": "23h 15m",
        "arrival_day_offset": 1,
        "running_days": ["M", "T", "W", "T", "F", "S", "S"],
        "classes": ["1A", "2A", "3A", "SL", "2S"],
        "distance_km": 1386,
        "stops": [
            {"station_code": "MMCT", "station_name": "Mumbai Central", "arrival_time": "First", "departure_time": "11:25", "halt_minutes": 0, "day_count": 1, "distance_km": 0, "platform": "5"},
            {"station_code": "ST", "station_name": "Surat", "arrival_time": "15:47", "departure_time": "15:52", "halt_minutes": 5, "day_count": 1, "distance_km": 263, "platform": "1"},
            {"station_code": "BRC", "station_name": "Vadodara Junction", "arrival_time": "17:42", "departure_time": "17:52", "halt_minutes": 10, "day_count": 1, "distance_km": 393, "platform": "3"},
            {"station_code": "KOTA", "station_name": "Kota Junction", "arrival_time": "01:45", "departure_time": "01:55", "halt_minutes": 10, "day_count": 2, "distance_km": 921, "platform": "1"},
            {"station_code": "NDLS", "station_name": "New Delhi", "arrival_time": "10:40", "departure_time": "Last", "halt_minutes": 0, "day_count": 2, "distance_km": 1386, "platform": "4"},
        ]
    },
    {
        "train_number": "22436",
        "train_name": "New Delhi - Varanasi Vande Bharat Express",
        "train_type": "Vande Bharat",
        "origin_code": "NDLS",
        "origin_name": "New Delhi",
        "destination_code": "BSB",
        "destination_name": "Varanasi Junction",
        "departure_time": "06:00",
        "arrival_time": "14:00",
        "duration": "8h 00m",
        "arrival_day_offset": 0,
        "running_days": ["T", "W", "F", "S", "S"],
        "classes": ["CC", "EC"],
        "distance_km": 759,
        "stops": [
            {"station_code": "NDLS", "station_name": "New Delhi", "arrival_time": "First", "departure_time": "06:00", "halt_minutes": 0, "day_count": 1, "distance_km": 0, "platform": "1"},
            {"station_code": "CNB", "station_name": "Kanpur Central", "arrival_time": "10:08", "departure_time": "10:10", "halt_minutes": 2, "day_count": 1, "distance_km": 440, "platform": "5"},
            {"station_code": "BSB", "station_name": "Varanasi Junction", "arrival_time": "14:00", "departure_time": "Last", "halt_minutes": 0, "day_count": 1, "distance_km": 759, "platform": "1"},
        ]
    },
    {
        "train_number": "22435",
        "train_name": "Varanasi - New Delhi Vande Bharat Express",
        "train_type": "Vande Bharat",
        "origin_code": "BSB",
        "origin_name": "Varanasi Junction",
        "destination_code": "NDLS",
        "destination_name": "New Delhi",
        "departure_time": "15:00",
        "arrival_time": "23:00",
        "duration": "8h 00m",
        "arrival_day_offset": 0,
        "running_days": ["T", "W", "F", "S", "S"],
        "classes": ["CC", "EC"],
        "distance_km": 759,
        "stops": [
            {"station_code": "BSB", "station_name": "Varanasi Junction", "arrival_time": "First", "departure_time": "15:00", "halt_minutes": 0, "day_count": 1, "distance_km": 0, "platform": "1"},
            {"station_code": "CNB", "station_name": "Kanpur Central", "arrival_time": "18:30", "departure_time": "18:32", "halt_minutes": 2, "day_count": 1, "distance_km": 319, "platform": "1"},
            {"station_code": "NDLS", "station_name": "New Delhi", "arrival_time": "23:00", "departure_time": "Last", "halt_minutes": 0, "day_count": 1, "distance_km": 759, "platform": "16"},
        ]
    },
    {
        "train_number": "20607",
        "train_name": "MGR Chennai Central - Mysuru Vande Bharat Express",
        "train_type": "Vande Bharat",
        "origin_code": "MAS",
        "origin_name": "MGR Chennai Central",
        "destination_code": "SBC",
        "destination_name": "KSR Bengaluru City",
        "departure_time": "05:50",
        "arrival_time": "10:20",
        "duration": "4h 30m",
        "arrival_day_offset": 0,
        "running_days": ["M", "T", "W", "F", "S", "S"],
        "classes": ["CC", "EC"],
        "distance_km": 359,
        "stops": [
            {"station_code": "MAS", "station_name": "MGR Chennai Central", "arrival_time": "First", "departure_time": "05:50", "halt_minutes": 0, "day_count": 1, "distance_km": 0, "platform": "2A"},
            {"station_code": "SBC", "station_name": "KSR Bengaluru City", "arrival_time": "10:20", "departure_time": "10:25", "halt_minutes": 5, "day_count": 1, "distance_km": 359, "platform": "7"},
            {"station_code": "MYS", "station_name": "Mysuru Junction", "arrival_time": "12:20", "departure_time": "Last", "halt_minutes": 0, "day_count": 1, "distance_km": 497, "platform": "1"},
        ]
    },
    {
        "train_number": "20608",
        "train_name": "Mysuru - MGR Chennai Central Vande Bharat Express",
        "train_type": "Vande Bharat",
        "origin_code": "SBC",
        "origin_name": "KSR Bengaluru City",
        "destination_code": "MAS",
        "destination_name": "MGR Chennai Central",
        "departure_time": "14:50",
        "arrival_time": "19:20",
        "duration": "4h 30m",
        "arrival_day_offset": 0,
        "running_days": ["M", "T", "W", "F", "S", "S"],
        "classes": ["CC", "EC"],
        "distance_km": 359,
        "stops": [
            {"station_code": "MYS", "station_name": "Mysuru Junction", "arrival_time": "First", "departure_time": "13:05", "halt_minutes": 0, "day_count": 1, "distance_km": 0, "platform": "1"},
            {"station_code": "SBC", "station_name": "KSR Bengaluru City", "arrival_time": "14:45", "departure_time": "14:50", "halt_minutes": 5, "day_count": 1, "distance_km": 138, "platform": "7"},
            {"station_code": "MAS", "station_name": "MGR Chennai Central", "arrival_time": "19:20", "departure_time": "Last", "halt_minutes": 0, "day_count": 1, "distance_km": 497, "platform": "1"},
        ]
    },
    {
        "train_number": "12007",
        "train_name": "Chennai - Mysuru Shatabdi Express",
        "train_type": "Shatabdi",
        "origin_code": "MAS",
        "origin_name": "MGR Chennai Central",
        "destination_code": "SBC",
        "destination_name": "KSR Bengaluru City",
        "departure_time": "06:00",
        "arrival_time": "10:55",
        "duration": "4h 55m",
        "arrival_day_offset": 0,
        "running_days": ["M", "W", "T", "F", "S", "S"],
        "classes": ["CC", "EC"],
        "distance_km": 359,
        "stops": [
            {"station_code": "MAS", "station_name": "MGR Chennai Central", "arrival_time": "First", "departure_time": "06:00", "halt_minutes": 0, "day_count": 1, "distance_km": 0, "platform": "2"},
            {"station_code": "SBC", "station_name": "KSR Bengaluru City", "arrival_time": "10:55", "departure_time": "11:00", "halt_minutes": 5, "day_count": 1, "distance_km": 359, "platform": "7"},
            {"station_code": "MYS", "station_name": "Mysuru Junction", "arrival_time": "13:00", "departure_time": "Last", "halt_minutes": 0, "day_count": 1, "distance_km": 497, "platform": "1"},
        ]
    },
    {
        "train_number": "12301",
        "train_name": "Howrah - New Delhi Rajdhani Express (via Gaya)",
        "train_type": "Rajdhani",
        "origin_code": "HWH",
        "origin_name": "Howrah Junction",
        "destination_code": "NDLS",
        "destination_name": "New Delhi",
        "departure_time": "16:50",
        "arrival_time": "10:05",
        "duration": "17h 15m",
        "arrival_day_offset": 1,
        "running_days": ["M", "T", "W", "T", "F", "S"],
        "classes": ["1A", "2A", "3A"],
        "distance_km": 1450,
        "stops": [
            {"station_code": "HWH", "station_name": "Howrah Junction", "arrival_time": "First", "departure_time": "16:50", "halt_minutes": 0, "day_count": 1, "distance_km": 0, "platform": "9"},
            {"station_code": "DDU", "station_name": "Pt. Deen Dayal Upadhyaya Junction", "arrival_time": "00:45", "departure_time": "00:55", "halt_minutes": 10, "day_count": 2, "distance_km": 668, "platform": "2"},
            {"station_code": "CNB", "station_name": "Kanpur Central", "arrival_time": "04:50", "departure_time": "04:55", "halt_minutes": 5, "day_count": 2, "distance_km": 1013, "platform": "1"},
            {"station_code": "NDLS", "station_name": "New Delhi", "arrival_time": "10:05", "departure_time": "Last", "halt_minutes": 0, "day_count": 2, "distance_km": 1450, "platform": "8"},
        ]
    },
    {
        "train_number": "12302",
        "train_name": "New Delhi - Howrah Rajdhani Express (via Gaya)",
        "train_type": "Rajdhani",
        "origin_code": "NDLS",
        "origin_name": "New Delhi",
        "destination_code": "HWH",
        "destination_name": "Howrah Junction",
        "departure_time": "16:50",
        "arrival_time": "09:55",
        "duration": "17h 05m",
        "arrival_day_offset": 1,
        "running_days": ["M", "T", "W", "T", "F", "S", "S"],
        "classes": ["1A", "2A", "3A"],
        "distance_km": 1450,
        "stops": [
            {"station_code": "NDLS", "station_name": "New Delhi", "arrival_time": "First", "departure_time": "16:50", "halt_minutes": 0, "day_count": 1, "distance_km": 0, "platform": "4"},
            {"station_code": "CNB", "station_name": "Kanpur Central", "arrival_time": "21:32", "departure_time": "21:37", "halt_minutes": 5, "day_count": 1, "distance_km": 437, "platform": "5"},
            {"station_code": "DDU", "station_name": "Pt. Deen Dayal Upadhyaya Junction", "arrival_time": "01:42", "departure_time": "01:52", "halt_minutes": 10, "day_count": 2, "distance_km": 782, "platform": "2"},
            {"station_code": "HWH", "station_name": "Howrah Junction", "arrival_time": "09:55", "departure_time": "Last", "halt_minutes": 0, "day_count": 2, "distance_km": 1450, "platform": "9"},
        ]
    },
    {
        "train_number": "12002",
        "train_name": "New Delhi - Rani Kamlapati (Bhopal) Shatabdi Express",
        "train_type": "Shatabdi",
        "origin_code": "NDLS",
        "origin_name": "New Delhi",
        "destination_code": "BPL",
        "destination_name": "Bhopal Junction",
        "departure_time": "06:00",
        "arrival_time": "14:40",
        "duration": "8h 40m",
        "arrival_day_offset": 0,
        "running_days": ["M", "T", "W", "T", "F", "S", "S"],
        "classes": ["CC", "EC"],
        "distance_km": 707,
        "stops": [
            {"station_code": "NDLS", "station_name": "New Delhi", "arrival_time": "First", "departure_time": "06:00", "halt_minutes": 0, "day_count": 1, "distance_km": 0, "platform": "1"},
            {"station_code": "AGC", "station_name": "Agra Cantt", "arrival_time": "07:50", "departure_time": "07:55", "halt_minutes": 5, "day_count": 1, "distance_km": 195, "platform": "1"},
            {"station_code": "GWL", "station_name": "Gwalior Junction", "arrival_time": "09:23", "departure_time": "09:28", "halt_minutes": 5, "day_count": 1, "distance_km": 313, "platform": "1"},
            {"station_code": "VGLJ", "station_name": "Virangana Lakshmibai Jhansi", "arrival_time": "10:45", "departure_time": "10:50", "halt_minutes": 5, "day_count": 1, "distance_km": 410, "platform": "1"},
            {"station_code": "BPL", "station_name": "Bhopal Junction", "arrival_time": "14:40", "departure_time": "Last", "halt_minutes": 0, "day_count": 1, "distance_km": 707, "platform": "1"},
        ]
    },
    {
        "train_number": "12124",
        "train_name": "Pune - Mumbai CSMT Deccan Queen",
        "train_type": "Superfast",
        "origin_code": "PUNE",
        "origin_name": "Pune Junction",
        "destination_code": "CSMT",
        "destination_name": "Chhatrapati Shivaji Maharaj Terminus",
        "departure_time": "07:15",
        "arrival_time": "10:25",
        "duration": "3h 10m",
        "arrival_day_offset": 0,
        "running_days": ["M", "T", "W", "T", "F", "S", "S"],
        "classes": ["CC", "2S"],
        "distance_km": 192,
        "stops": [
            {"station_code": "PUNE", "station_name": "Pune Junction", "arrival_time": "First", "departure_time": "07:15", "halt_minutes": 0, "day_count": 1, "distance_km": 0, "platform": "5"},
            {"station_code": "CSMT", "station_name": "Chhatrapati Shivaji Maharaj Terminus", "arrival_time": "10:25", "departure_time": "Last", "halt_minutes": 0, "day_count": 1, "distance_km": 192, "platform": "8"},
        ]
    },
    {
        "train_number": "12123",
        "train_name": "Mumbai CSMT - Pune Deccan Queen",
        "train_type": "Superfast",
        "origin_code": "CSMT",
        "origin_name": "Chhatrapati Shivaji Maharaj Terminus",
        "destination_code": "PUNE",
        "destination_name": "Pune Junction",
        "departure_time": "17:10",
        "arrival_time": "20:25",
        "duration": "3h 15m",
        "arrival_day_offset": 0,
        "running_days": ["M", "T", "W", "T", "F", "S", "S"],
        "classes": ["CC", "2S"],
        "distance_km": 192,
        "stops": [
            {"station_code": "CSMT", "station_name": "Chhatrapati Shivaji Maharaj Terminus", "arrival_time": "First", "departure_time": "17:10", "halt_minutes": 0, "day_count": 1, "distance_km": 0, "platform": "8"},
            {"station_code": "PUNE", "station_name": "Pune Junction", "arrival_time": "20:25", "departure_time": "Last", "halt_minutes": 0, "day_count": 1, "distance_km": 192, "platform": "5"},
        ]
    },
    {
        "train_number": "20901",
        "train_name": "Mumbai Central - Gandhinagar Vande Bharat Express",
        "train_type": "Vande Bharat",
        "origin_code": "MMCT",
        "origin_name": "Mumbai Central",
        "destination_code": "ADI",
        "destination_name": "Ahmedabad Junction",
        "departure_time": "06:00",
        "arrival_time": "11:25",
        "duration": "5h 25m",
        "arrival_day_offset": 0,
        "running_days": ["M", "T", "W", "T", "F", "S"],
        "classes": ["CC", "EC"],
        "distance_km": 491,
        "stops": [
            {"station_code": "MMCT", "station_name": "Mumbai Central", "arrival_time": "First", "departure_time": "06:00", "halt_minutes": 0, "day_count": 1, "distance_km": 0, "platform": "5"},
            {"station_code": "ST", "station_name": "Surat", "arrival_time": "08:50", "departure_time": "08:53", "halt_minutes": 3, "day_count": 1, "distance_km": 263, "platform": "1"},
            {"station_code": "BRC", "station_name": "Vadodara Junction", "arrival_time": "09:56", "departure_time": "09:59", "halt_minutes": 3, "day_count": 1, "distance_km": 393, "platform": "2"},
            {"station_code": "ADI", "station_name": "Ahmedabad Junction", "arrival_time": "11:25", "departure_time": "11:30", "halt_minutes": 5, "day_count": 1, "distance_km": 491, "platform": "1"},
        ]
    },
    {
        "train_number": "20902",
        "train_name": "Gandhinagar - Mumbai Central Vande Bharat Express",
        "train_type": "Vande Bharat",
        "origin_code": "ADI",
        "origin_name": "Ahmedabad Junction",
        "destination_code": "MMCT",
        "destination_name": "Mumbai Central",
        "departure_time": "14:45",
        "arrival_time": "20:25",
        "duration": "5h 40m",
        "arrival_day_offset": 0,
        "running_days": ["M", "T", "W", "T", "F", "S"],
        "classes": ["CC", "EC"],
        "distance_km": 491,
        "stops": [
            {"station_code": "ADI", "station_name": "Ahmedabad Junction", "arrival_time": "14:40", "departure_time": "14:45", "halt_minutes": 5, "day_count": 1, "distance_km": 0, "platform": "1"},
            {"station_code": "BRC", "station_name": "Vadodara Junction", "arrival_time": "15:40", "departure_time": "15:43", "halt_minutes": 3, "day_count": 1, "distance_km": 98, "platform": "2"},
            {"station_code": "ST", "station_name": "Surat", "arrival_time": "16:53", "departure_time": "16:56", "halt_minutes": 3, "day_count": 1, "distance_km": 228, "platform": "1"},
            {"station_code": "MMCT", "station_name": "Mumbai Central", "arrival_time": "20:25", "departure_time": "Last", "halt_minutes": 0, "day_count": 1, "distance_km": 491, "platform": "5"},
        ]
    },
    {
        "train_number": "12430",
        "train_name": "New Delhi - KSR Bengaluru City Rajdhani Express",
        "train_type": "Rajdhani",
        "origin_code": "NDLS",
        "origin_name": "New Delhi",
        "destination_code": "SBC",
        "destination_name": "KSR Bengaluru City",
        "departure_time": "20:50",
        "arrival_time": "06:40",
        "duration": "33h 50m",
        "arrival_day_offset": 2,
        "running_days": ["M", "T", "W", "T", "F", "S", "S"],
        "classes": ["1A", "2A", "3A"],
        "distance_km": 2365,
        "stops": [
            {"station_code": "NDLS", "station_name": "New Delhi", "arrival_time": "First", "departure_time": "20:50", "halt_minutes": 0, "day_count": 1, "distance_km": 0, "platform": "5"},
            {"station_code": "AGC", "station_name": "Agra Cantt", "arrival_time": "23:05", "departure_time": "23:10", "halt_minutes": 5, "day_count": 1, "distance_km": 195, "platform": "1"},
            {"station_code": "BPL", "station_name": "Bhopal Junction", "arrival_time": "05:55", "departure_time": "06:05", "halt_minutes": 10, "day_count": 2, "distance_km": 707, "platform": "1"},
            {"station_code": "SC", "station_name": "Secunderabad Junction", "arrival_time": "18:50", "departure_time": "19:00", "halt_minutes": 10, "day_count": 2, "distance_km": 1675, "platform": "2"},
            {"station_code": "SBC", "station_name": "KSR Bengaluru City", "arrival_time": "06:40", "departure_time": "Last", "halt_minutes": 0, "day_count": 3, "distance_km": 2365, "platform": "8"},
        ]
    }
]

# Helper rate card for classes
CLASS_BASE_RATES: Dict[str, Dict] = {
    "1A": {"per_km": 2.85, "base_min": 1400, "res_charge": 60, "sf_charge": 75, "tatkal_per": 0.30, "gst": True, "name": "AC First Class (1A)"},
    "2A": {"per_km": 1.65, "base_min": 850, "res_charge": 50, "sf_charge": 45, "tatkal_per": 0.30, "gst": True, "name": "AC 2-Tier (2A)"},
    "3A": {"per_km": 1.15, "base_min": 600, "res_charge": 40, "sf_charge": 45, "tatkal_per": 0.30, "gst": True, "name": "AC 3-Tier (3A)"},
    "3E": {"per_km": 1.05, "base_min": 540, "res_charge": 40, "sf_charge": 45, "tatkal_per": 0.30, "gst": True, "name": "AC 3 Economy (3E)"},
    "CC": {"per_km": 1.20, "base_min": 450, "res_charge": 40, "sf_charge": 45, "tatkal_per": 0.30, "gst": True, "name": "AC Chair Car (CC)"},
    "EC": {"per_km": 2.40, "base_min": 1100, "res_charge": 60, "sf_charge": 75, "tatkal_per": 0.30, "gst": True, "name": "Exec. Chair Car (EC)"},
    "SL": {"per_km": 0.45, "base_min": 220, "res_charge": 20, "sf_charge": 30, "tatkal_per": 0.10, "gst": False, "name": "Sleeper (SL)"},
    "2S": {"per_km": 0.28, "base_min": 120, "res_charge": 15, "sf_charge": 15, "tatkal_per": 0.10, "gst": False, "name": "Second Sitting (2S)"},
}

class DemoRailwayAdapter(IRailwayProvider):
    async def search_stations(self, query: str) -> List[StationItem]:
        q = query.strip().upper()
        if not q:
            return await self.get_popular_stations()

        matches = []
        for s in STATIONS_DATA:
            if (
                q == s["code"]
                or q in s["code"]
                or q.lower() in s["name"].lower()
                or q.lower() in s["city"].lower()
                or q.lower() in s["state"].lower()
                or (s.get("hindi_name") and q in s["hindi_name"])
            ):
                # Prioritize exact code matches
                is_exact = s["code"] == q
                matches.append((is_exact, StationItem(**s)))

        # Sort: exact matches first, then major junctions, then alphabetical
        matches.sort(key=lambda item: (not item[0], not item[1].is_major_junction, item[1].name))
        return [item[1] for item in matches[:15]]

    async def get_popular_stations(self) -> List[StationItem]:
        popular_codes = ["NDLS", "MMCT", "HWH", "SBC", "MAS", "ADI", "PUNE", "BSB", "CNB", "JP", "GHY", "TVC", "BPL", "HYB"]
        results = [StationItem(**s) for s in STATIONS_DATA if s["code"] in popular_codes]
        return results

    def _generate_dynamic_trains(
        self,
        orig_code: str,
        dest_code: str,
        journey_date: date,
        travel_class: Optional[str] = None,
        quota: str = "GN"
    ) -> List[TrainSearchResult]:
        orig_station = STATION_MAP.get(orig_code, {"code": orig_code, "name": orig_code, "city": orig_code, "state": "India"})
        dest_station = STATION_MAP.get(dest_code, {"code": dest_code, "name": dest_code, "city": dest_code, "state": "India"})

        # Deterministic seed based on station pair
        pair_str = f"{min(orig_code, dest_code)}:{max(orig_code, dest_code)}"
        pair_hash = int(hashlib.md5(pair_str.encode()).hexdigest()[:8], 16)

        # Distance approximation
        if orig_station.get("state") == dest_station.get("state") and orig_station.get("state") != "India":
            base_distance = 180 + (pair_hash % 380)
        else:
            base_distance = 450 + (pair_hash % 1600)

        # Pick intermediate junction stops from STATIONS_DATA
        potential_stops = [
            s for s in STATIONS_DATA
            if s["code"] not in [orig_code, dest_code] and s.get("is_major_junction")
        ]
        int_stops = []
        if potential_stops:
            idx1 = pair_hash % len(potential_stops)
            idx2 = (pair_hash // 7) % len(potential_stops)
            if idx1 == idx2:
                idx2 = (idx2 + 1) % len(potential_stops)
            int_stops = [potential_stops[idx1], potential_stops[idx2]]

        is_long_dist = base_distance >= 750
        templates = [
            {
                "num_offset": 201,
                "type": "Vande Bharat" if not is_long_dist else "Rajdhani",
                "name_suffix": "Vande Bharat Express" if not is_long_dist else "Tejas Rajdhani Express",
                "classes": ["CC", "EC"] if not is_long_dist else ["1A", "2A", "3A"],
                "dep_hour": 6,
                "dep_min": 0,
                "speed_kmh": 82,
            },
            {
                "num_offset": 305,
                "type": "Superfast",
                "name_suffix": "Superfast Express",
                "classes": ["1A", "2A", "3A", "SL"],
                "dep_hour": 11,
                "dep_min": 30,
                "speed_kmh": 66,
            },
            {
                "num_offset": 451,
                "type": "Express",
                "name_suffix": "Mail Express",
                "classes": ["2A", "3A", "SL", "2S"],
                "dep_hour": 16,
                "dep_min": 45,
                "speed_kmh": 54,
            },
            {
                "num_offset": 617,
                "type": "Garib Rath" if not is_long_dist else "Humsafar",
                "name_suffix": "Garib Rath Express" if not is_long_dist else "Humsafar Express",
                "classes": ["3A", "3E"],
                "dep_hour": 21,
                "dep_min": 15,
                "speed_kmh": 68,
            },
        ]

        results = []
        for t_idx, t_spec in enumerate(templates):
            t_base = 22000 if t_spec["type"] in ["Vande Bharat", "Superfast"] else (12000 if t_spec["type"] == "Rajdhani" else 15000)
            train_num = str(t_base + ((pair_hash + t_spec["num_offset"] + t_idx * 11) % 999))
            train_name = f"{orig_station['city']} - {dest_station['city']} {t_spec['name_suffix']}"

            travel_hours = max(2.5, base_distance / t_spec["speed_kmh"])
            tot_mins = int(travel_hours * 60)

            dep_h = t_spec["dep_hour"]
            dep_m = t_spec["dep_min"]
            dep_time_str = f"{dep_h:02d}:{dep_m:02d}"

            arr_total_mins = (dep_h * 60 + dep_m) + tot_mins
            day_offset = arr_total_mins // (24 * 60)
            arr_rem_mins = arr_total_mins % (24 * 60)
            arr_time_str = f"{arr_rem_mins // 60:02d}:{arr_rem_mins % 60:02d}"

            dur_str = f"{tot_mins // 60}h {tot_mins % 60:02d}m"

            stops = [
                {
                    "station_code": orig_code,
                    "station_name": orig_station["name"],
                    "arrival_time": "First",
                    "departure_time": dep_time_str,
                    "halt_minutes": 0,
                    "day_count": 1,
                    "distance_km": 0,
                    "platform": str((pair_hash % 4) + 1),
                }
            ]

            if int_stops:
                stop1 = int_stops[0]
                d1 = int(base_distance * 0.35)
                mins1 = int((d1 / t_spec["speed_kmh"]) * 60)
                t1_arr = (dep_h * 60 + dep_m) + mins1
                stops.append({
                    "station_code": stop1["code"],
                    "station_name": stop1["name"],
                    "arrival_time": f"{(t1_arr % 1440) // 60:02d}:{(t1_arr % 1440) % 60:02d}",
                    "departure_time": f"{((t1_arr + 5) % 1440) // 60:02d}:{((t1_arr + 5) % 1440) % 60:02d}",
                    "halt_minutes": 5,
                    "day_count": 1 + (t1_arr // 1440),
                    "distance_km": d1,
                    "platform": str(((pair_hash + 1) % 4) + 1),
                })

                if len(int_stops) > 1 and base_distance >= 400:
                    stop2 = int_stops[1]
                    d2 = int(base_distance * 0.70)
                    mins2 = int((d2 / t_spec["speed_kmh"]) * 60)
                    t2_arr = (dep_h * 60 + dep_m) + mins2
                    stops.append({
                        "station_code": stop2["code"],
                        "station_name": stop2["name"],
                        "arrival_time": f"{(t2_arr % 1440) // 60:02d}:{(t2_arr % 1440) % 60:02d}",
                        "departure_time": f"{((t2_arr + 5) % 1440) // 60:02d}:{((t2_arr + 5) % 1440) % 60:02d}",
                        "halt_minutes": 5,
                        "day_count": 1 + (t2_arr // 1440),
                        "distance_km": d2,
                        "platform": str(((pair_hash + 2) % 4) + 1),
                    })

            stops.append({
                "station_code": dest_code,
                "station_name": dest_station["name"],
                "arrival_time": arr_time_str,
                "departure_time": "Last",
                "halt_minutes": 0,
                "day_count": 1 + day_offset,
                "distance_km": base_distance,
                "platform": str(((pair_hash + 3) % 4) + 1),
            })

            train_dict = {
                "train_number": train_num,
                "train_name": train_name,
                "train_type": t_spec["type"],
                "origin_code": orig_code,
                "origin_name": orig_station["name"],
                "destination_code": dest_code,
                "destination_name": dest_station["name"],
                "departure_time": dep_time_str,
                "arrival_time": arr_time_str,
                "duration": dur_str,
                "arrival_day_offset": day_offset,
                "running_days": ["M", "T", "W", "T", "F", "S", "S"],
                "classes": t_spec["classes"],
                "distance_km": base_distance,
                "stops": stops,
            }
            GENERATED_TRAINS_CACHE[train_num] = train_dict

            classes_avail = []
            for c_code in t_spec["classes"]:
                if travel_class and travel_class != "ALL" and travel_class != c_code:
                    continue
                avail_info = self._calculate_availability(
                    train_num,
                    orig_code,
                    dest_code,
                    journey_date,
                    c_code,
                    quota,
                    base_distance,
                )
                classes_avail.append(avail_info)

            if classes_avail:
                results.append(
                    TrainSearchResult(
                        train_number=train_num,
                        train_name=train_name,
                        train_type=t_spec["type"],
                        origin_code=orig_code,
                        origin_name=orig_station["name"],
                        destination_code=dest_code,
                        destination_name=dest_station["name"],
                        departure_time=dep_time_str,
                        arrival_time=arr_time_str,
                        duration=dur_str,
                        arrival_day_offset=day_offset,
                        running_days=["M", "T", "W", "T", "F", "S", "S"],
                        classes=classes_avail,
                    )
                )

        return results

    async def search_trains(
        self,
        origin: str,
        destination: str,
        journey_date: date,
        travel_class: Optional[str] = None,
        quota: str = "GN"
    ) -> List[TrainSearchResult]:
        orig = origin.strip().upper()
        dest = destination.strip().upper()

        matching_trains = []

        for train in TRAINS_CATALOG:
            stop_codes = [stop["station_code"] for stop in train["stops"]]
            if orig in stop_codes and dest in stop_codes:
                orig_idx = stop_codes.index(orig)
                dest_idx = stop_codes.index(dest)

                if orig_idx < dest_idx:
                    orig_stop = train["stops"][orig_idx]
                    dest_stop = train["stops"][dest_idx]

                    dist_km = dest_stop["distance_km"] - orig_stop["distance_km"]
                    day_offset = dest_stop["day_count"] - orig_stop["day_count"]

                    classes_avail = []
                    for c_code in train["classes"]:
                        if travel_class and travel_class != "ALL" and travel_class != c_code:
                            continue

                        avail_info = self._calculate_availability(
                            train["train_number"],
                            orig,
                            dest,
                            journey_date,
                            c_code,
                            quota,
                            dist_km
                        )
                        classes_avail.append(avail_info)

                    if classes_avail:
                        matching_trains.append(
                            TrainSearchResult(
                                train_number=train["train_number"],
                                train_name=train["train_name"],
                                train_type=train["train_type"],
                                origin_code=orig,
                                origin_name=orig_stop["station_name"],
                                destination_code=dest,
                                destination_name=dest_stop["station_name"],
                                departure_time=orig_stop["departure_time"],
                                arrival_time=dest_stop["arrival_time"],
                                duration=self._calculate_duration_str(orig_stop["departure_time"], dest_stop["arrival_time"], day_offset),
                                arrival_day_offset=day_offset,
                                running_days=train["running_days"],
                                classes=classes_avail
                            )
                        )

        # If catalog has fewer than 2 trains for this pair, supplement dynamically
        if len(matching_trains) < 2:
            dynamic_trains = self._generate_dynamic_trains(orig, dest, journey_date, travel_class, quota)
            existing_nums = {t.train_number for t in matching_trains}
            for dt in dynamic_trains:
                if dt.train_number not in existing_nums:
                    matching_trains.append(dt)

        return matching_trains

    async def get_train_schedule(self, train_number: str) -> Optional[TrainScheduleResponse]:
        train = next((t for t in TRAINS_CATALOG if t["train_number"] == train_number), None)
        if not train:
            train = GENERATED_TRAINS_CACHE.get(train_number)

        if train:
            return TrainScheduleResponse(
                train_number=train["train_number"],
                train_name=train["train_name"],
                train_type=train["train_type"],
                running_days=train["running_days"],
                total_distance_km=train["distance_km"],
                total_duration=train["duration"],
                stops=[ScheduleStop(**s) for s in train["stops"]]
            )
        return None

    async def check_availability(
        self,
        train_number: str,
        origin: str,
        destination: str,
        journey_date: date,
        travel_class: str,
        quota: str = "GN",
        passenger_count: int = 1
    ) -> AvailabilityResponse:
        train = next((t for t in TRAINS_CATALOG if t["train_number"] == train_number), None)
        if not train:
            train = GENERATED_TRAINS_CACHE.get(train_number)

        if not train:
            # Generate dynamically on demand
            self._generate_dynamic_trains(origin, destination, journey_date, travel_class, quota)
            train = GENERATED_TRAINS_CACHE.get(train_number)

        if not train:
            train = TRAINS_CATALOG[0]


        # Find stops
        stop_codes = [s["station_code"] for s in train["stops"]]
        if origin not in stop_codes or destination not in stop_codes:
            raise ValueError(f"Station pair {origin} - {destination} not on train route.")

        orig_stop = next(s for s in train["stops"] if s["station_code"] == origin)
        dest_stop = next(s for s in train["stops"] if s["station_code"] == destination)
        dist_km = dest_stop["distance_km"] - orig_stop["distance_km"]

        fare_breakdown = self._calculate_fare_breakdown(travel_class, dist_km, quota, passenger_count)
        avail = self._calculate_availability(train_number, origin, destination, journey_date, travel_class, quota, dist_km)

        return AvailabilityResponse(
            train_number=train_number,
            train_name=train["train_name"],
            origin_code=origin,
            destination_code=destination,
            journey_date=journey_date,
            travel_class=travel_class,
            quota=quota,
            status=avail.status,
            status_detail=avail.status_detail,
            seats_available=avail.seats_count,
            fare_breakdown=fare_breakdown,
            last_updated=avail.last_updated,
            disclaimer="Demo mode: seat counts and fares are deterministically generated for simulation."
        )

    async def get_pnr_status(self, pnr_number: str) -> PnrStatusResponse:
        pnr = pnr_number.strip().upper()
        # Use PNR hash to determine deterministic status
        hash_val = int(hashlib.md5(pnr.encode()).hexdigest()[:8], 16)
        
        # Pick a demo train from catalog
        train = TRAINS_CATALOG[hash_val % len(TRAINS_CATALOG)]
        travel_class = train["classes"][0]
        
        # 1-3 passengers
        p_count = (hash_val % 3) + 1
        passengers = []
        coaches = {"1A": "H1", "2A": "A1", "3A": "B3", "3E": "M2", "CC": "C2", "EC": "E1", "SL": "S4", "2S": "D2"}
        coach = coaches.get(travel_class, "B1")
        berth_types = ["Lower", "Middle", "Upper", "Side Lower", "Side Upper", "Window"]

        for i in range(p_count):
            berth_no = ((hash_val + i * 7) % 64) + 1
            b_type = berth_types[(hash_val + i) % len(berth_types)]
            
            # Deterministic status: Mostly Confirmed, occasionally RAC/WL
            mod_status = (hash_val + i) % 10
            if mod_status < 7:
                b_stat = f"CNF / {coach} / {berth_no}"
                c_stat = f"CNF / {coach} / {berth_no}"
            elif mod_status < 9:
                b_stat = f"RAC {i + 1}"
                c_stat = f"CNF / {coach} / {berth_no}" if hash_val % 2 == 0 else f"RAC {i + 1}"
            else:
                b_stat = f"WL {i + 5}"
                c_stat = f"WL {i + 2}"

            passengers.append(
                PnrPassengerStatus(
                    passenger_number=i + 1,
                    booking_status=b_stat,
                    current_status=c_stat,
                    coach=coach,
                    berth_number=berth_no,
                    berth_type=b_type
                )
            )

        chart_prep = "CHART PREPARED" if (hash_val % 2 == 0) else "CHART NOT PREPARED"
        today = date.today()

        return PnrStatusResponse(
            pnr_number=pnr,
            train_number=train["train_number"],
            train_name=train["train_name"],
            journey_date=today + timedelta(days=(hash_val % 5) + 1),
            origin_code=train["origin_code"],
            origin_name=train["origin_name"],
            destination_code=train["destination_code"],
            destination_name=train["destination_name"],
            boarding_point=train["origin_code"],
            travel_class=travel_class,
            quota="GN",
            chart_status=chart_prep,
            passengers=passengers,
            last_updated=datetime.now(timezone.utc).strftime("%d %b %Y, %I:%M %p IST"),
            is_demo=True
        )

    async def get_running_status(self, train_number: str, journey_date: date) -> RunningStatusResponse:
        train = next((t for t in TRAINS_CATALOG if t["train_number"] == train_number), None)
        if not train:
            train = GENERATED_TRAINS_CACHE.get(train_number)
        if not train:
            # Fallback to first train if arbitrary train searched
            train = TRAINS_CATALOG[0]

        hash_val = int(hashlib.md5(f"{train['train_number']}-{journey_date}".encode()).hexdigest()[:8], 16)
        
        # Decide current station index
        stops_count = len(train["stops"])
        current_idx = min(max(1, (hash_val % stops_count)), stops_count - 1)
        delay = (hash_val % 25) - 5  # between -5 (early) and 20 mins late
        if delay < 0:
            delay = 0

        running_stops = []
        for idx, s in enumerate(train["stops"]):
            has_arrived = idx <= current_idx
            has_departed = idx < current_idx
            is_cur = idx == current_idx
            
            running_stops.append(
                StationRunningStop(
                    station_code=s["station_code"],
                    station_name=s["station_name"],
                    scheduled_arrival=s["arrival_time"],
                    scheduled_departure=s["departure_time"],
                    actual_arrival=s["arrival_time"] if not has_arrived else self._add_minutes_to_time(s["arrival_time"], delay if idx >= current_idx else 0),
                    actual_departure=s["departure_time"] if not has_departed else self._add_minutes_to_time(s["departure_time"], delay if idx >= current_idx else 0),
                    delay_arrival_minutes=delay if idx >= current_idx else 0,
                    delay_departure_minutes=delay if idx >= current_idx else 0,
                    platform=s.get("platform", "1"),
                    has_arrived=has_arrived,
                    has_departed=has_departed,
                    is_current=is_cur
                )
            )

        cur_station_name = train["stops"][current_idx]["station_name"]
        summary = f"Arrived at {cur_station_name} on time" if delay == 0 else f"Running {delay} mins late near {cur_station_name}"

        return RunningStatusResponse(
            train_number=train["train_number"],
            train_name=train["train_name"],
            journey_date=journey_date,
            current_station=cur_station_name,
            current_status_summary=summary,
            delay_minutes=delay,
            last_updated=datetime.now(timezone.utc).strftime("%d %b %Y, %I:%M %p IST"),
            stops=running_stops,
            is_demo=True
        )

    def _calculate_fare_breakdown(
        self,
        travel_class: str,
        distance_km: int,
        quota: str,
        passenger_count: int
    ) -> FareBreakdown:
        rate = CLASS_BASE_RATES.get(travel_class, CLASS_BASE_RATES["3A"])
        
        # Base Fare
        calc_base = max(rate["base_min"], int(distance_km * rate["per_km"]))
        res_charge = rate["res_charge"]
        sf_charge = rate["sf_charge"]
        
        # Tatkal surcharge
        tatkal_charge = 0.0
        if quota == "TQ":
            tatkal_charge = round(calc_base * rate["tatkal_per"], 0)
        elif quota == "PT":
            tatkal_charge = round(calc_base * (rate["tatkal_per"] + 0.25), 0)

        subtotal_before_tax = calc_base + res_charge + sf_charge + tatkal_charge
        
        # 5% GST on AC classes
        gst_amount = 0.0
        if rate["gst"]:
            gst_amount = round(subtotal_before_tax * 0.05, 2)

        fare_per_pax = subtotal_before_tax + gst_amount
        total = round(fare_per_pax * passenger_count, 2)

        return FareBreakdown(
            base_fare=float(calc_base * passenger_count),
            reservation_charge=float(res_charge * passenger_count),
            superfast_charge=float(sf_charge * passenger_count),
            tatkal_charge=float(tatkal_charge * passenger_count),
            gst_amount=float(gst_amount * passenger_count),
            total_fare_per_passenger=float(fare_per_pax),
            total_amount=total,
            currency="INR"
        )

    def _calculate_availability(
        self,
        train_number: str,
        origin: str,
        destination: str,
        journey_date: date,
        travel_class: str,
        quota: str,
        distance_km: int
    ) -> ClassAvailability:
        rate = CLASS_BASE_RATES.get(travel_class, CLASS_BASE_RATES["3A"])
        fare_obj = self._calculate_fare_breakdown(travel_class, distance_km, quota, 1)

        # Deterministic seed using train, date, class, quota
        seed_str = f"{train_number}:{origin}:{destination}:{journey_date.isoformat()}:{travel_class}:{quota}"
        seed_int = int(hashlib.sha256(seed_str.encode()).hexdigest()[:8], 16)

        # Quotas have different base seat capacities
        capacity_map = {
            "GN": (20, 60),
            "TQ": (8, 25),
            "PT": (5, 18),
            "LD": (4, 12),
            "SS": (4, 10),
            "HP": (2, 6)
        }
        min_cap, max_cap = capacity_map.get(quota, (10, 40))
        seat_num = min_cap + (seed_int % (max_cap - min_cap + 1))

        # Modulo for states: 80% Available, 12% RAC, 8% WL
        mod = seed_int % 100
        if mod < 80:
            status = "AVAILABLE"
            detail = f"AVAILABLE {seat_num}"
            count = seat_num
        elif mod < 92:
            status = "RAC"
            rac_num = (seed_int % 12) + 1
            detail = f"RAC {rac_num}"
            count = rac_num
        else:
            status = "WL"
            wl_num = (seed_int % 18) + 1
            detail = f"WL {wl_num}"
            count = wl_num

        return ClassAvailability(
            class_code=travel_class,
            class_name=rate["name"],
            fare=fare_obj.total_fare_per_passenger,
            status=status,
            status_detail=detail,
            seats_count=count,
            last_updated="Just now",
            catering_available=travel_class in ["1A", "2A", "3A", "CC", "EC"]
        )

    def _calculate_duration_str(self, dep_time: str, arr_time: str, day_offset: int) -> str:
        try:
            dh, dm = map(int, dep_time.split(":"))
            ah, am = map(int, arr_time.split(":"))
            total_dep_mins = dh * 60 + dm
            total_arr_mins = (day_offset * 24 * 60) + (ah * 60 + am)
            diff_mins = total_arr_mins - total_dep_mins
            hours = diff_mins // 60
            minutes = diff_mins % 60
            return f"{hours}h {minutes:02d}m"
        except Exception:
            return "12h 00m"

    def _add_minutes_to_time(self, time_str: str, minutes_to_add: int) -> str:
        try:
            if time_str in ["First", "Last"]:
                return time_str
            h, m = map(int, time_str.split(":"))
            total = (h * 60 + m + minutes_to_add) % (24 * 60)
            return f"{total // 60:02d}:{total % 60:02d}"
        except Exception:
            return time_str
