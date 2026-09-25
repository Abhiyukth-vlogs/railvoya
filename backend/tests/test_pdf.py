import pytest
from datetime import date, timedelta
import uuid

@pytest.mark.asyncio
async def test_ticket_pdf_generation(client):
    tomorrow = date.today() + timedelta(days=1)
    
    # Create a booking first
    booking_payload = {
        "train_number": "22436",
        "origin_code": "NDLS",
        "destination_code": "BSB",
        "journey_date": tomorrow.isoformat(),
        "travel_class": "CC",
        "quota": "GN",
        "passengers": [
            {
                "full_name": "Priya Sen",
                "age": 28,
                "gender": "Female",
                "berth_preference": "Window",
                "food_preference": "Veg"
            }
        ],
        "contact_email": "priya.sen@example.com",
        "contact_phone": "9876543210",
        "idempotency_key": str(uuid.uuid4())
    }

    res = await client.post("/api/v1/bookings", json=booking_payload)
    assert res.status_code == 201
    booking_id = res.json()["id"]

    # Download ticket PDF
    pdf_res = await client.get(f"/api/v1/bookings/{booking_id}/ticket.pdf")
    assert pdf_res.status_code == 200
    assert pdf_res.headers["content-type"] == "application/pdf"
    content = pdf_res.content
    assert len(content) > 1000
    # PDF standard magic number '%PDF-'
    assert content.startswith(b"%PDF-")
