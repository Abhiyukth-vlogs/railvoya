# RailVoya - Implementation Tasks & Verification Checklist (TASKS.md)

**Brand:** RailVoya  
**Tracking Status:** Active Implementation  
**Last Updated:** 2026-09-25  

---

## Task Matrix & Status

| Task ID | PRD Req ID | Description | Phase | Status | Evidence / Verification Notes |
|---|---|---|---|---|---|
| **TASK-01** | REQ-DOC-01 | Create initial 6 root project documents (PRD, ARCHITECTURE, RULES, DESIGN, TASKS, MEMORY) | Planning | **Completed** | PRD.md, ARCHITECTURE.md, RULES.md, DESIGN.md, TASKS.md, MEMORY.md created. |
| **TASK-02** | REQ-DOC-02 | Create setup & config files: README.md, TESTING.md, .env.example, Dockerfile, docker-compose.yml, .idx/dev.nix | Setup | **Pending** | |
| **TASK-03** | REQ-BE-01 | Setup FastAPI backend environment, dependencies with uv, SQLAlchemy models, Alembic migrations | Backend | **Pending** | |
| **TASK-04** | REQ-BE-02 | Implement Provider Abstraction: `IRailwayProvider`, `DemoRailwayAdapter`, `LiveRailwayAdapter`, `IPaymentProvider` | Backend | **Pending** | |
| **TASK-05** | REQ-BE-03 | Implement Deterministic Dataset (40+ stations, 20+ flagship trains, schedules, fare calculator, availability simulator) | Backend | **Pending** | |
| **TASK-06** | REQ-BE-04 | Implement Auth & Session Management (PBKDF2/Argon2 hashing, HttpOnly cookies, session table, /me endpoint) | Backend | **Pending** | |
| **TASK-07** | REQ-BE-05 | Implement Booking Lifecycle, Idempotency, Price Re-validation, Cancellation, and Refund Calculation | Backend | **Pending** | |
| **TASK-08** | REQ-BE-06 | Implement PDF Ticket Generation service with ReportLab (prominent "DEMO — NOT VALID FOR TRAVEL" watermark) | Backend | **Pending** | |
| **TASK-09** | REQ-BE-07 | Implement PNR Status, Train Running Status, and Contact form submission endpoints | Backend | **Pending** | |
| **TASK-10** | REQ-FE-01 | Initialize React + TypeScript + Tailwind CSS with Vite, custom brand tokens, SVG logo, and favicon | Frontend | **Pending** | |
| **TASK-11** | REQ-FE-02 | Build Header, Footer, Hero, and Search Card with Station Autocomplete, Swap button, Date shortcuts, Class/Quota | Frontend | **Pending** | |
| **TASK-12** | REQ-FE-03 | Build Search Results Page with adjacent-date stepper, sidebar/drawer filters, train cards, class chips, expandable schedule | Frontend | **Pending** | |
| **TASK-13** | REQ-FE-04 | Build Multi-step Booking Journey (Select -> Passengers -> Review with itemized fare & GST -> Demo payment simulation) | Frontend | **Pending** | |
| **TASK-14** | REQ-FE-05 | Build Booking Confirmation Page, PDF download trigger, and My Trips history with Cancellation flow | Frontend | **Pending** | |
| **TASK-15** | REQ-FE-06 | Build PNR Status Page, Train Live Running Status Page, and Account / Saved Passengers management | Frontend | **Pending** | |
| **TASK-16** | REQ-FE-07 | Build Informational Pages: About (with independent disclosure), Contact Us, Help & FAQs, Privacy, Terms | Frontend | **Pending** | |
| **TASK-17** | REQ-TST-01 | Write comprehensive backend tests (pytest) for search, availability, booking lifecycle, idempotency, auth, PDF | Testing | **Pending** | |
| **TASK-18** | REQ-TST-02 | End-to-end browser test via browser_subagent and capture responsive screenshots at 390px, 768px, 1440px | Verification| **Pending** | |
