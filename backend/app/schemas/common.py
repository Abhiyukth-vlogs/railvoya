from pydantic import BaseModel
from typing import Optional, Any, Dict, List

class ErrorDetail(BaseModel):
    code: str
    message: str
    details: Optional[Dict[str, Any]] = None

class ErrorResponse(BaseModel):
    error: ErrorDetail

class HealthResponse(BaseModel):
    status: str
    app: str
    environment: str
    database: str
    railway_provider: str
    payment_provider: str

class CapabilitiesResponse(BaseModel):
    mode: str
    brand_name: str
    domain: str
    tagline: str
    railway_provider: str
    live_booking_enabled: bool
    payment_provider: str
    live_checkout_enabled: bool
    blocked_integrations: List[Dict[str, str]]
