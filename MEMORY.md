# RailVoya - Engineering Memory & Handoff Log (MEMORY.md)

**Brand:** RailVoya  
**Domain:** `railvoya.co.in`  
**Initial Setup Date:** 2026-09-25  
**Last Updated:** 2026-09-25  

---

## 1. Project Decisions & Rationales

- **Decision 2026-09-25-01 (Architecture):** Decoupled architecture with React (Vite) + Tailwind CSS on frontend and Python FastAPI + SQLAlchemy 2.0 on backend. FastAPI provides high-performance asynchronous API endpoints, auto-generated OpenAPI schemas, and seamless integration with Python ReportLab PDF generation.
- **Decision 2026-09-25-02 (Database):** Local SQLite (`railvoya.db`) with zero-configuration startup, with full schema migration management using Alembic. Connection string dynamically overrides to PostgreSQL via `DATABASE_URL` environment variable for production readiness.
- **Decision 2026-09-25-03 (Provider Abstraction):** Strict separation of railway and payment providers behind `IRailwayProvider` and `IPaymentProvider`. In local environments, `DemoRailwayAdapter` and `DemoPaymentAdapter` are active. Live adapters remain disabled with clear capability negotiation messages until authorized enterprise credentials are provided.
- **Decision 2026-09-25-04 (Design & Brand):** Brand identity RailVoya with primary navy (`#102A43`), action orange (`#C2410C`), page background (`#F6F8FC`), and supportive tokens. WCAG 2.1 AA compliant contrast. Original SVG logo featuring parallel tracks and curved train window.
- **Decision 2026-09-25-05 (Security):** Server-managed sessions stored in database and transmitted via `HttpOnly`, `SameSite=Lax` cookies. Passwords hashed using standard PBKDF2 with 600,000 iterations. Idempotency keys enforced on ticket booking mutations.
- **Decision 2026-09-25-06 (Windows Tooling):** Used `C:\Users\LENOVO\.local\bin\uv.exe` for Python 3.12 package and execution management. Invoked `npm.cmd` directly to bypass Windows PowerShell script execution limitations.

---

## 2. Key File Locations

- **Documentation:**
  - `PRD.md`: Functional and non-functional requirements.
  - `ARCHITECTURE.md`: Technical design, data models, and Mermaid diagrams.
  - `RULES.md`: Coding conventions, security, accessibility, and demo rules.
  - `DESIGN.md`: Design tokens, typography, and component specifications.
  - `TASKS.md`: Implementation task tracker.
  - `MEMORY.md`: This file.
  - `README.md`: Quickstart, environment setup, and architecture summary.
  - `TESTING.md`: Test plan and command instructions.
- **Backend:**
  - `backend/app/main.py`: FastAPI application entrypoint.
  - `backend/app/providers/`: Railway (`demo_railway.py`, `live_railway.py`) and payment provider adapters.
  - `backend/app/services/`: Business logic, booking lifecycle (`booking_service.py`), PDF generator (`pdf_service.py`).
  - `backend/alembic/`: Schema migrations (`001_initial_schema.py`).
  - `backend/tests/`: Automated pytest test suites.
- **Frontend:**
  - `frontend/src/App.tsx`: Routing and context providers.
  - `frontend/src/config/brand.ts`: Brand tokens and configuration.
  - `frontend/src/components/search/SearchCard.tsx`: Station autocomplete, swap, date picker.
  - `frontend/src/components/train/TrainCard.tsx`: Train card with class availability chips.
  - `frontend/src/components/train/ScheduleModal.tsx`: Route stops timeline modal.
  - `frontend/src/pages/`: Multi-step booking (`BookingPage.tsx`, `ConfirmationPage.tsx`), search results, PNR status, train status, my trips, and auth.

---

## 3. Operational Commands & Environment Setup

- **Python Environment (FastAPI Backend):**
  - Install dependencies: `uv pip install -r pyproject.toml`
  - Run backend dev server: `uv run python -m uvicorn app.main:app --host 127.0.0.1 --port 8000`
  - Run backend tests: `uv run python -m pytest backend/tests -v`
- **Node Environment (Vite + React Frontend):**
  - Install dependencies: `npm.cmd install`
  - Run frontend dev server: `npm.cmd run dev -- --host 127.0.0.1 --port 5173`
  - Build production frontend: `npm.cmd run build`

---

## 4. Verified Milestones & Test Evidence

- **Milestone 1:** Completed initial project documents (`PRD.md`, `ARCHITECTURE.md`, `RULES.md`, `DESIGN.md`, `TASKS.md`, `MEMORY.md`).
- **Milestone 2:** Implemented full backend with provider adapters, deterministic catalogue of 40+ stations and 16+ trains, booking state machine with price re-validation, PBKDF2 auth, and ReportLab PDF generator.
- **Milestone 3:** Backend test suite executed via `pytest`: 6 suites passing 100% (test_stations, test_trains, test_bookings, test_auth, test_pdf).
- **Milestone 4:** Frontend built with React 19 + TypeScript + Tailwind CSS, custom SVG brand assets, station autocomplete, swap button, date shortcuts, schedule modal, multi-passenger entry, itemized fare breakdown, and confetti confirmation. Production build (`npm.cmd run build`) completed with 0 errors.
- **Milestone 5:** Browser Subagent End-to-End Verification:
  - Verified Station swap (NDLS ↔ MMCT), Tomorrow date selection, and train search.
  - Verified train results, class availability selection (2A), and route schedule modal.
  - Completed 2-passenger booking (*Aarav Sharma*, *Priya Sharma*) with Lower and Window berths.
  - Re-validated itemized fare breakdown (Base Fare + GST 5% = ₹5,000.10).
  - Completed demo booking, generated PNR `RV-DEMO-0517648` with CONFIRMED status.
  - Downloaded e-ticket PDF via `/api/v1/bookings/.../ticket.pdf`.
  - Checked PNR enquiry and verified Chart Prepared status and coach allocations (A1-21, A1-22).
  - Checked Train live running status for train 12952 with station delays.
  - Tested Contact form submission and verified persistence.
  - Verified responsive views without horizontal overflow at 1440px desktop, 768px tablet, and 390px mobile viewports.
