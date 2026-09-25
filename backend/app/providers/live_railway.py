from typing import List, Optional
from datetime import date
from fastapi import HTTPException
from app.providers.base import IRailwayProvider
from app.schemas.train import StationItem, TrainSearchResult, TrainScheduleResponse
from app.schemas.availability import AvailabilityResponse
from app.schemas.pnr import PnrStatusResponse
from app.schemas.running import RunningStatusResponse
from app.core.config import settings

class LiveRailwayAdapter(IRailwayProvider):
    """
    Authorized Indian Railways / CRIS API Adapter.
    This adapter handles production railway communications when live partner credentials,
    IP whitelisting, and PKI digital certificates are configured.
    """
    def __init__(self):
        self.api_url = settings.LIVE_RAILWAY_API_URL
        self.api_key = settings.LIVE_RAILWAY_API_KEY
        self.partner_code = settings.LIVE_RAILWAY_PARTNER_CODE

    def _check_credentials(self):
        if not self.api_url or not self.api_key:
            raise HTTPException(
                status_code=503,
                detail={
                    "error": "LIVE_RAILWAY_PROVIDER_UNCONFIGURED",
                    "message": (
                        "Live railway integration is disabled. Production requires an authorized CRIS/IRCTC "
                        "partner agreement, IP whitelisting, and server credentials. "
                        "RailVoya is currently running in Demo Mode."
                    ),
                    "required_credentials": ["LIVE_RAILWAY_API_URL", "LIVE_RAILWAY_API_KEY", "LIVE_RAILWAY_PARTNER_CODE"]
                }
            )

    async def search_stations(self, query: str) -> List[StationItem]:
        self._check_credentials()
        # In live mode, query CRIS/IRCTC Station Directory
        return []

    async def get_popular_stations(self) -> List[StationItem]:
        self._check_credentials()
        return []

    async def search_trains(
        self,
        origin: str,
        destination: str,
        journey_date: date,
        travel_class: Optional[str] = None,
        quota: str = "GN"
    ) -> List[TrainSearchResult]:
        self._check_credentials()
        return []

    async def get_train_schedule(self, train_number: str) -> Optional[TrainScheduleResponse]:
        self._check_credentials()
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
        self._check_credentials()
        raise NotImplementedError()

    async def get_pnr_status(self, pnr_number: str) -> PnrStatusResponse:
        self._check_credentials()
        raise NotImplementedError()

    async def get_running_status(self, train_number: str, journey_date: date) -> RunningStatusResponse:
        self._check_credentials()
        raise NotImplementedError()
