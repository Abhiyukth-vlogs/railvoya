import uuid
from typing import Dict, Any
from app.providers.base import IPaymentProvider

class DemoPaymentAdapter(IPaymentProvider):
    async def initiate_payment(self, booking_id: str, amount: float, scenario: str = "SUCCESS") -> Dict[str, Any]:
        """
        Simulate payment processing with deterministic scenarios.
        """
        ref_id = f"DEMO-PAY-{uuid.uuid4().hex[:12].upper()}"

        if scenario == "PAYMENT_FAILED":
            return {
                "status": "FAILED",
                "provider": "demo",
                "provider_reference": ref_id,
                "amount": amount,
                "currency": "INR",
                "error_message": "Payment simulation: Transaction declined by issuing bank."
            }
        elif scenario == "GATEWAY_TIMEOUT":
            return {
                "status": "PENDING_RECONCILIATION",
                "provider": "demo",
                "provider_reference": ref_id,
                "amount": amount,
                "currency": "INR",
                "message": "Payment simulation: Gateway timeout. Booking marked for reconciliation."
            }
        else:
            return {
                "status": "SUCCESS",
                "provider": "demo",
                "provider_reference": ref_id,
                "amount": amount,
                "currency": "INR",
                "message": "Payment simulation: Demo payment approved successfully."
            }

    async def verify_webhook(self, payload: bytes, signature: str) -> Dict[str, Any]:
        return {
            "verified": True,
            "event": "demo.payment.captured",
            "provider": "demo"
        }
