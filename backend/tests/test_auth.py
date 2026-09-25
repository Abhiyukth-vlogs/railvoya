import pytest

@pytest.mark.asyncio
async def test_signup_and_login(client):
    # 1. Signup
    signup_payload = {
        "email": "testuser@railvoya.co.in",
        "password": "Password@123",
        "full_name": "Test Traveler",
        "phone": "9876543210"
    }
    res = await client.post("/api/v1/auth/signup", json=signup_payload)
    assert res.status_code == 200, res.text
    data = res.json()
    assert data["email"] == "testuser@railvoya.co.in"
    assert data["full_name"] == "Test Traveler"
    assert "railvoya_session" in res.cookies

    # 2. Get Profile (/me)
    me_res = await client.get("/api/v1/auth/me")
    assert me_res.status_code == 200
    assert me_res.json()["email"] == "testuser@railvoya.co.in"

    # 3. Duplicate email rejection
    dup_res = await client.post("/api/v1/auth/signup", json=signup_payload)
    assert dup_res.status_code == 400

    # 4. Logout
    logout_res = await client.post("/api/v1/auth/logout")
    assert logout_res.status_code == 200

    # 5. Login
    login_payload = {
        "email": "testuser@railvoya.co.in",
        "password": "Password@123"
    }
    login_res = await client.post("/api/v1/auth/login", json=login_payload)
    assert login_res.status_code == 200
    assert "railvoya_session" in login_res.cookies

    # 6. Invalid login
    bad_login = await client.post("/api/v1/auth/login", json={"email": "testuser@railvoya.co.in", "password": "WrongPassword"})
    assert bad_login.status_code == 401
