from fastapi import APIRouter
from app.core.config import settings
from app.schemas.common import HealthResponse, CapabilitiesResponse

router = APIRouter(prefix="/system", tags=["System & Capabilities"])

@router.get("/health", response_model=HealthResponse)
async def get_health():
    db_type = "SQLite" if "sqlite" in settings.DATABASE_URL else "PostgreSQL"
    return HealthResponse(
        status="healthy",
        app=settings.APP_NAME,
        environment=settings.ENVIRONMENT,
        database=db_type,
        railway_provider=settings.RAILWAY_PROVIDER_MODE,
        payment_provider=settings.PAYMENT_PROVIDER_MODE
    )

@router.get("/capabilities", response_model=CapabilitiesResponse)
async def get_capabilities():
    is_live_rail = settings.RAILWAY_PROVIDER_MODE.lower() == "live"
    is_live_pay = settings.PAYMENT_PROVIDER_MODE.lower() == "live"

    blocked = []
    if not is_live_rail:
        blocked.append({
            "name": "CRIS / IRCTC Live PRS Reservation",
            "reason": "Requires authorized Indian Railways partner credentials and IP whitelisting."
        })
    if not is_live_pay:
        blocked.append({
            "name": "Live Payment Gateway (Razorpay/Stripe)",
            "reason": "Requires verified merchant credentials and signed webhook endpoints."
        })

    return CapabilitiesResponse(
        mode=settings.RAILWAY_PROVIDER_MODE,
        brand_name=settings.BRAND_NAME,
        domain=settings.INTENDED_DOMAIN,
        tagline=settings.TAGLINE,
        railway_provider="LiveRailwayAdapter" if is_live_rail else "DemoRailwayAdapter",
        live_booking_enabled=is_live_rail,
        payment_provider="LivePaymentAdapter" if is_live_pay else "DemoPaymentAdapter",
        live_checkout_enabled=is_live_pay,
        blocked_integrations=blocked
    )
