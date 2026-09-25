# RailVoya - Engineering Memory & Handoff Log (MEMORY.md)

**Brand:** RailVoya  
**Domain:** `railvoya.co.in`  
**Initial Setup Date:** 2026-09-25  

---

## 1. Project Decisions & Rationales

- **Decision 2026-09-25-01 (Architecture):** Decoupled architecture with React (Vite) + Tailwind CSS on frontend and Python FastAPI + SQLAlchemy on backend. FastAPI provides high-performance asynchronous API endpoints, auto-generated OpenAPI schemas, and seamless integration with Python PDF generation libraries.
- **Decision 2026-09-25-02 (Database):** Local SQLite (`railvoya.db`) with zero-configuration startup, with full schema migration management using Alembic. Connection string dynamically overrides to PostgreSQL via `DATABASE_URL` environment variable for production readiness.
- **Decision 2026-09-25-03 (Provider Abstraction):** Strict separation of railway and payment providers behind `IRailwayProvider` and `IPaymentProvider`. In local environments, `DemoRailwayAdapter` and `DemoPaymentAdapter` are active. Live adapters remain disabled with clear capability negotiation messages until authorized enterprise credentials are provided.
- **Decision 2026-09-25-04 (Design & Brand):** Brand identity RailVoya with primary navy (`#102A43`), action orange (`#C2410C`), and supportive tokens. WCAG 2.1 AA compliant contrast. Original SVG logo featuring parallel tracks and curved train window.
- **Decision 2026-09-25-05 (Security):** Server-managed sessions stored in database and transmitted via `HttpOnly`, `SameSite=Lax` cookies. Passwords hashed using standard PBKDF2/Argon2. Idempotency keys enforced on ticket booking mutations.

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
  - `backend/app/providers/`: Railway and payment provider adapters.
  - `backend/app/services/`: Business logic, booking lifecycle, PDF generator.
- **Frontend:**
  - `frontend/src/App.tsx`: Routing and context providers.
  - `frontend/src/config/brand.ts`: Brand tokens and configuration.
  - `frontend/src/pages/`: Page components.

---

## 3. Operational Commands & Environment Setup

- **Python Environment:** Managed via `uv`.
  - Install dependencies: `uv pip install -r pyproject.toml`
  - Run backend dev server: `uv run uvicorn app.main:app --reload --port 8000`
  - Run backend tests: `uv run pytest`
- **Node Environment:**
  - Install dependencies: `npm.cmd install`
  - Run frontend dev server: `npm.cmd run dev`
  - Build production frontend: `npm.cmd run build`

---

## 4. Verified Milestones & Next Steps

- **Milestone 1:** Completed initial project documents (`PRD.md`, `ARCHITECTURE.md`, `RULES.md`, `DESIGN.md`, `TASKS.md`, `MEMORY.md`).
- **Next Step:** Create repository configuration files (`README.md`, `TESTING.md`, `.env.example`, `Dockerfile`, `docker-compose.yml`, `.idx/dev.nix`) and initialize the backend and frontend codebases.
