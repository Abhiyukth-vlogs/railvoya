import hmac
import hashlib
from typing import Dict, Any
from fastapi import HTTPException
from app.providers.base import IPaymentProvider
from app.core.config import settings

class LivePaymentAdapter(IPaymentProvider):
    """
    Live Payment Gateway Adapter (e.g. Razorpay / Cashfree / Stripe).
    Handles hosted checkout creation and signed server webhook HMAC verification.
    """
    def __init__(self):
        self.gateway_url = settings.LIVE_PAYMENT_GATEWAY_URL
        self.key_id = settings.LIVE_PAYMENT_KEY_ID
        self.key_secret = settings.LIVE_PAYMENT_KEY_SECRET
        self.webhook_secret = settings.LIVE_PAYMENT_WEBHOOK_SECRET

    def _check_credentials(self):
        if not self.key_id or not self.key_secret:
            raise HTTPException(
                status_code=503,
                detail={
                    "error": "LIVE_PAYMENT_GATEWAY_UNCONFIGURED",
                    "message": (
                        "Live payment checkout is disabled. Production requires hosted merchant keys "
                        "(e.g., Razorpay/Stripe) and webhook signature secrets. "
                        "RailVoya is currently running in Demo Mode."
                    ),
                    "required_credentials": ["LIVE_PAYMENT_KEY_ID", "LIVE_PAYMENT_KEY_SECRET", "LIVE_PAYMENT_WEBHOOK_SECRET"]
                }
            )

    async def initiate_payment(self, booking_id: str, amount: float, scenario: str = "SUCCESS") -> Dict[str, Any]:
        self._check_credentials()
        # In live mode, call hosted gateway checkout order endpoint
        return {}

    async def verify_webhook(self, payload: bytes, signature: str) -> Dict[str, Any]:
        self._check_credentials()
        if not self.webhook_secret:
            raise HTTPException(status_code=400, detail="Missing webhook secret")

        expected_sig = hmac.new(
            self.webhook_secret.encode("utf-8"),
            payload,
            hashlib.sha256
        ).hexdigest()

        if not hmac.compare_digest(expected_sig, signature):
            raise HTTPException(status_code=400, detail="Invalid webhook signature")

        return {"verified": True, "provider": "live"}
