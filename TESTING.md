# RailVoya - Testing & Quality Assurance Guide (TESTING.md)

This document details the automated and manual verification procedures for the RailVoya Indian train travel platform.

---

## 1. Test Suite Structure

```
backend/tests/
├── conftest.py              # Test database engine, FastAPI test client, fixtures
├── test_auth.py             # Signup, password hashing, login, logout, unauthorized access
├── test_stations.py         # Autocomplete matching, popular stations, case insensitivity
├── test_trains.py           # Train search, date filters, class filtering, schedule route
├── test_availability.py     # Quota seat availability, fare calculation, GST logic
├── test_bookings.py         # Booking creation, idempotency, Tatkal passenger limit, cancellation, refund
└── test_pdf.py              # ReportLab ticket PDF generation and "DEMO" watermark verification
```

---

## 2. Running Automated Tests

### Backend Unit & Integration Tests
```powershell
cd d:\Rail\backend
uv run pytest -v
```

### Coverage Report
```powershell
cd d:\Rail\backend
uv run pytest --cov=app --cov-report=term-missing
```

---

## 3. Browser-Based Verification Scenarios

### Scenario A: Search & Filtering
1. Open Homepage at `http://localhost:5173`.
2. Verify Hero title: "Your next journey starts here." and Tagline: "Every journey, made simpler."
3. Type "del" in From Station. Select "New Delhi (NDLS)".
4. Type "mum" in To Station. Select "Mumbai Central (MMCT)".
5. Click Swap button. Verify stations swap places smoothly.
6. Click "Tomorrow" shortcut. Verify date updates to tomorrow (Asia/Kolkata).
7. Click "Search trains".
8. Verify search results load with Vande Bharat Express and Rajdhani Express.
9. Click "View Schedule" on a train card to open the route modal. Verify stops and platform details.

### Scenario B: Complete Demo Booking Flow
1. Select class "3A" on train `12952 / Mumbai Rajdhani`.
2. Click "Book Now".
3. Fill Passenger 1: "Aarav Sharma", Age: 32, Gender: "Male", Berth: "Lower Berth".
4. Fill Passenger 2: "Neha Sharma", Age: 29, Gender: "Female", Berth: "Window".
5. Enter Contact details: Phone "9876543210", Email "aarav@example.com".
6. Proceed to Review. Verify itemized fare breakdown (Base Fare, Reservation Fee, Superfast Charge, 5% GST).
7. Click "Complete Demo Booking".
8. Verify Confirmation page loads with generated Demo PNR (e.g., `DEMO-RV-...`).
9. Click "Download E-Ticket (PDF)". Verify PDF contains "DEMO — NOT VALID FOR TRAVEL" header.

### Scenario C: Cancellation & Trip Management
1. Navigate to "My Trips" from header.
2. Confirm the booking is listed under "Upcoming Trips".
3. Click "Cancel Booking".
4. Confirm cancellation. Verify status changes to `CANCELLED` and refund amount is computed.

### Scenario D: Responsiveness & Accessibility
1. Verify viewports:
   - 390px (Mobile): Hamburger navigation or compact header, stacked search inputs, no horizontal scroll.
   - 768px (Tablet): Responsive grid, clear touch targets.
   - 1440px (Desktop): Centered 1200px container, 1-row search card, filter sidebar.
2. Verify touch targets are at least 44x44px.
3. Verify visible focus indicators on interactive inputs.
