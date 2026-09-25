from app.core.config import settings
from app.providers.base import IRailwayProvider, IPaymentProvider
from app.providers.demo_railway import DemoRailwayAdapter
from app.providers.live_railway import LiveRailwayAdapter
from app.providers.demo_payment import DemoPaymentAdapter
from app.providers.live_payment import LivePaymentAdapter

_demo_railway_instance = DemoRailwayAdapter()
_live_railway_instance = LiveRailwayAdapter()
_demo_payment_instance = DemoPaymentAdapter()
_live_payment_instance = LivePaymentAdapter()

def get_railway_provider() -> IRailwayProvider:
    if settings.RAILWAY_PROVIDER_MODE.lower() == "live":
        return _live_railway_instance
    return _demo_railway_instance

def get_payment_provider() -> IPaymentProvider:
    if settings.PAYMENT_PROVIDER_MODE.lower() == "live":
        return _live_payment_instance
    return _demo_payment_instance
