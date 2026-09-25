import pytest
from datetime import date, timedelta
import uuid

@pytest.mark.asyncio
async def test_booking_flow_and_idempotency(client):
    tomorrow = date.today() + timedelta(days=1)
    idempotency_key = str(uuid.uuid4())

    booking_payload = {
        "train_number": "12952",
        "origin_code": "NDLS",
        "destination_code": "MMCT",
        "journey_date": tomorrow.isoformat(),
        "travel_class": "3A",
        "quota": "GN",
        "passengers": [
            {
                "full_name": "Aarav Sharma",
                "age": 32,
                "gender": "Male",
                "berth_preference": "Lower Berth",
                "food_preference": "Veg"
            },
            {
                "full_name": "Neha Sharma",
                "age": 29,
                "gender": "Female",
                "berth_preference": "Window",
                "food_preference": "Veg"
            }
        ],
        "contact_email": "aarav.sharma@example.com",
        "contact_phone": "9876543210",
        "idempotency_key": idempotency_key,
        "simulation_scenario": "SUCCESS"
    }

    # 1. Create booking
    res = await client.post("/api/v1/bookings", json=booking_payload)
    assert res.status_code == 201, res.text
    booking = res.json()
    assert booking["status"] == "CONFIRMED"
    assert booking["pnr_number"].startswith("RV-DEMO-")
    assert len(booking["passengers"]) == 2
    assert booking["total_amount"] > 0
    booking_id = booking["id"]

    # 2. Idempotency test: Same payload with same idempotency_key returns identical booking!
    dup_res = await client.post("/api/v1/bookings", json=booking_payload)
    assert dup_res.status_code == 201
    assert dup_res.json()["id"] == booking_id
    assert dup_res.json()["pnr_number"] == booking["pnr_number"]

    # 3. Retrieve booking
    get_res = await client.get(f"/api/v1/bookings/{booking_id}")
    assert get_res.status_code == 200
    assert get_res.json()["id"] == booking_id

    # 4. Cancel booking
    cancel_res = await client.post(f"/api/v1/bookings/{booking_id}/cancel")
    assert cancel_res.status_code == 200
    cancel_data = cancel_res.json()
    assert cancel_data["status"] == "CANCELLED"
    assert cancel_data["refund_amount"] > 0

    # 5. Check cancellation persistence
    after_res = await client.get(f"/api/v1/bookings/{booking_id}")
    assert after_res.json()["status"] == "CANCELLED"
    assert after_res.json()["passengers"][0]["current_status"] == "CAN"

@pytest.mark.asyncio
async def test_tatkal_passenger_limit_enforced(client):
    tomorrow = date.today() + timedelta(days=1)
    
    # 5 passengers under Tatkal (max allowed is 4!)
    tatkal_payload = {
        "train_number": "12952",
        "origin_code": "NDLS",
        "destination_code": "MMCT",
        "journey_date": tomorrow.isoformat(),
        "travel_class": "3A",
        "quota": "TQ",
        "passengers": [
            {"full_name": f"Passenger {i}", "age": 25, "gender": "Male"}
            for i in range(5)
        ],
        "contact_email": "tatkal.test@example.com",
        "contact_phone": "9876543210",
        "idempotency_key": str(uuid.uuid4())
    }

    res = await client.post("/api/v1/bookings", json=tatkal_payload)
    assert res.status_code == 400
    assert "TATKAL_PASSENGER_LIMIT" in res.text
