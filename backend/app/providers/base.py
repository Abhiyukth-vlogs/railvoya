from abc import ABC, abstractmethod
from typing import List, Optional
from datetime import date
from app.schemas.train import StationItem, TrainSearchResult, TrainScheduleResponse
from app.schemas.availability import AvailabilityResponse, FareBreakdown
from app.schemas.pnr import PnrStatusResponse
from app.schemas.running import RunningStatusResponse

class IRailwayProvider(ABC):
    @abstractmethod
    async def search_stations(self, query: str) -> List[StationItem]:
        """Search stations by code, name, city, or state."""
        pass

    @abstractmethod
    async def get_popular_stations(self) -> List[StationItem]:
        """Get curated major railway junction stations."""
        pass

    @abstractmethod
    async def search_trains(
        self,
        origin: str,
        destination: str,
        journey_date: date,
        travel_class: Optional[str] = None,
        quota: str = "GN"
    ) -> List[TrainSearchResult]:
        """Search available trains between two stations on a given date."""
        pass

    @abstractmethod
    async def get_train_schedule(self, train_number: str) -> Optional[TrainScheduleResponse]:
        """Get complete schedule and stop timeline for a train."""
        pass

    @abstractmethod
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
        """Get live seat availability and detailed fare quote."""
        pass

    @abstractmethod
    async def get_pnr_status(self, pnr_number: str) -> PnrStatusResponse:
        """Lookup live booking and charting status by 10-digit or demo PNR."""
        pass

    @abstractmethod
    async def get_running_status(self, train_number: str, journey_date: date) -> RunningStatusResponse:
        """Lookup live location, platform, and delay status."""
        pass


class IPaymentProvider(ABC):
    @abstractmethod
    async def initiate_payment(self, booking_id: str, amount: float, scenario: str = "SUCCESS") -> dict:
        """Initiate payment transaction or simulated demo flow."""
        pass

    @abstractmethod
    async def verify_webhook(self, payload: bytes, signature: str) -> dict:
        """Verify signed webhook from payment gateway."""
        pass
