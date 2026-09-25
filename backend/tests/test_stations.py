import pytest

@pytest.mark.asyncio
async def test_station_search_and_popular(client):
    # 1. Search by code
    res = await client.get("/api/v1/stations/search?q=NDLS")
    assert res.status_code == 200
    stations = res.json()
    assert len(stations) > 0
    assert stations[0]["code"] == "NDLS"
    assert "New Delhi" in stations[0]["name"]

    # 2. Search by city/name (case-insensitive)
    res_city = await client.get("/api/v1/stations/search?q=mumbai")
    assert res_city.status_code == 200
    city_stations = res_city.json()
    codes = [s["code"] for s in city_stations]
    assert "MMCT" in codes or "CSMT" in codes

    # 3. Popular stations
    pop_res = await client.get("/api/v1/stations/popular")
    assert pop_res.status_code == 200
    popular = pop_res.json()
    assert len(popular) >= 5
    pop_codes = [s["code"] for s in popular]
    assert "NDLS" in pop_codes
