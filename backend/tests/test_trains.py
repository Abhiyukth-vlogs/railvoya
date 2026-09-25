import pytest
from datetime import date, timedelta

@pytest.mark.asyncio
async def test_train_search_and_schedule(client):
    tomorrow = (date.today() + timedelta(days=1)).isoformat()

    # 1. Search valid route NDLS -> MMCT
    res = await client.get(f"/api/v1/trains/search?origin=NDLS&destination=MMCT&journey_date={tomorrow}&quota=GN")
    assert res.status_code == 200, res.text
    trains = res.json()
    assert len(trains) > 0
    t = trains[0]
    assert t["origin_code"] == "NDLS"
    assert t["destination_code"] == "MMCT"
    assert len(t["classes"]) > 0

    # 2. Reject identical stations
    same_res = await client.get(f"/api/v1/trains/search?origin=NDLS&destination=NDLS&journey_date={tomorrow}")
    assert same_res.status_code == 400

    # 3. Reject past dates
    past_date = (date.today() - timedelta(days=2)).isoformat()
    past_res = await client.get(f"/api/v1/trains/search?origin=NDLS&destination=MMCT&journey_date={past_date}")
    assert past_res.status_code == 400

    # 4. Get Train Schedule
    train_no = trains[0]["train_number"]
    sched_res = await client.get(f"/api/v1/trains/{train_no}/schedule")
    assert sched_res.status_code == 200
    sched = sched_res.json()
    assert sched["train_number"] == train_no
    assert len(sched["stops"]) >= 2
