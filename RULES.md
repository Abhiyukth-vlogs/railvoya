# RailVoya - Development Rules & Guidelines

**Brand:** RailVoya  
**Document Version:** 1.0.0  
**Scope:** Frontend, Backend, Testing, Accessibility, and Security Guidelines  

---

## 1. Core Principles & Philosophy

1. **Honest Demo & Transparency:**  
   RailVoya never masquerades as an official government portal. We do not use IRCTC emblems, government logos, or make false claims of live ticket issuance when running in demo mode. Every demo ticket, PNR, and receipt must be unequivocally labeled with disclaimers such as `"DEMO — NOT VALID FOR TRAVEL"` and `"Demo mode — no real tickets are issued"`.

2. **Clean Abstractions over Shortcuts:**  
   Do not hardcode demo data inside API endpoints or UI components. All railway logic (search, availability, pricing, reservations, cancellation, tracking) must flow through the `IRailwayProvider` interface.

3. **Resilience & Idempotency:**  
   Railway booking transactions must be safe against double-clicks, network drops, and slow connections. Idempotency keys must be enforced on booking creation.

---

## 2. Frontend Engineering Rules (React + TypeScript)

1. **TypeScript Strict Mode:**  
   `"strict": true` must be enabled. No `any` types in domain models or service responses. Use discriminated unions for booking, payment, and availability states.
2. **Tailwind CSS & Design Tokens:**  
   - Use centralized brand colors defined in `src/config/brand.ts` and `tailwind.config.js`:
     - Navy Primary: `#102A43`
     - Action Orange: `#C2410C` (with pure white text `#FFFFFF`)
     - Decorative Orange: `#F97316`
     - Page Background: `#F6F8FC`
     - Card Background: `#FFFFFF`
     - Text Primary: `#132238`
     - Text Secondary: `#526277`
     - Border: `#DCE3ED`
     - Positive: `#16734B`, Warning: `#8A5100`, Error: `#B42318`
   - Spacing scale must adhere to 8px rhythm (p-2, p-4, p-6, p-8).
   - Card border radius must be between `16px` and `20px` (`rounded-2xl`).
   - Desktop container maximum width must be centered around `1200px` (`max-w-6xl` or `max-w-7xl`).
3. **Component Modularity:**  
   Components should be single-responsibility and easily testable. Break down complex pages (like Search Results and Booking) into focused subcomponents (e.g., `TrainCard`, `AvailabilityChip`, `PassengerForm`, `FareSummary`).
4. **Form Handling & Validation:**  
   - Validate inputs inline with clear human-readable error messages.
   - Do not allow submission of empty, malformed, or contradictory inputs (e.g., origin == destination, past travel dates).

---

## 3. Accessibility & Responsive Requirements (WCAG 2.1 AA)

1. **Target Viewports:**  
   The application must be verified at three standard breakpoints:
   - **Mobile:** 390px width (iPhone 14 / modern smartphone). Zero horizontal scrolling, sticky elements must not occlude inputs.
   - **Tablet:** 768px width (iPad / medium tablet).
   - **Desktop:** 1440px width (Full HD / laptop display).
2. **Touch Targets & Sizing:**  
   All clickable buttons, tabs, autocomplete options, and icon controls must provide a minimum touch target of `44x44px`.
3. **Contrast Ratios:**  
   - Normal text: At least 4.5:1 contrast against its background.
   - Large text (18pt+ or 14pt+ bold): At least 3.0:1 contrast.
   - `#C2410C` (Action Orange) on `#FFFFFF` provides 5.1:1 contrast (WCAG AA compliant).
   - Text on `#102A43` (Primary Navy) must be white `#FFFFFF` or high-contrast silver `#E2E8F0`.
4. **Keyboard & Focus Management:**  
   - Visible outline focus rings (`focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#C2410C]`).
   - Station autocomplete dropdown must support ArrowDown, ArrowUp, Enter, and Escape keys.
   - Modals and drawers must trap focus and close on Escape key.
5. **Screen Readers & ARIA:**  
   - Proper `aria-expanded`, `aria-haspopup`, `aria-label`, and `role` attributes on custom widgets.
   - `aria-live="polite"` on availability updates and search status announcements.

---

## 4. Backend Engineering Rules (Python FastAPI + SQLAlchemy)

1. **Type Annotations & Validation:**  
   - 100% type hints on function signatures, query parameters, and return types.
   - Pydantic v2 schemas for all request payloads and responses.
2. **Session Security & Authentication:**  
   - Password hashing must use salted `Argon2id` or PBKDF2 with >= 600,000 rounds.
   - Session cookies must have `HttpOnly=True`, `SameSite="lax"`, and `Secure` (in production).
   - Endpoints must verify that a user only queries or modifies their own records (`user_id == session.user_id`).
3. **Database & Migrations:**  
   - All schema changes must be versioned via Alembic migrations.
   - Use SQLite for local development (`railvoya.db`) with zero external service dependencies.
   - Provide documented PostgreSQL connection string capability for production.
4. **Error Handling:**  
   - Return standard RFC-7807 compatible or consistent JSON error structures:
     ```json
     {
       "error": {
         "code": "STATION_CONFLICT",
         "message": "Origin and destination stations cannot be identical.",
         "details": {}
       }
     }
     ```
   - Never leak Python stack traces or internal database errors in production responses.

---

## 5. Honest Demo Behavior & Railway Rules

1. **Deterministic Dataset:**  
   Demo trains, stations, fares, and seat counts must be consistent and realistic.
2. **Train Availability States:**  
   Properly distinguish between:
   - `AVAILABLE` (e.g., "AVAILABLE 42")
   - `RAC` (Reservation Against Cancellation, e.g., "RAC 12")
   - `WAITLIST` (e.g., "WL 28")
   - `REGRET` / `NOT_AVAILABLE`
3. **Quotas:**  
   Support real Indian railway quota logic:
   - `GN`: General Quota (standard)
   - `TQ`: Tatkal Quota (max 4 passengers, premium fee)
   - `PT`: Premium Tatkal Quota (dynamic surge fare)
   - `LD`: Ladies Quota (sole female travelers or accompanied children)
   - `SS`: Senior Citizen / Lower Berth Quota (men >= 60, women >= 45 travelling alone/in pairs)
4. **Berth Preference Disclaimer:**  
   Explicitly display notice: `"Berth preferences are requests submitted to Indian Railways; actual berth allocation is determined by railway PRS algorithms at chart preparation."`
5. **No Real Financial Data:**  
   Do not ask for real credit card numbers, CVVs, or bank logins. Demo completion uses simulated sandbox triggers.

---

## 6. Verification & Testing Requirements

1. **Automated Backend Tests:**  
   Pytest suite covering:
   - User registration, login, session validation, unauthorized checks.
   - Station autocomplete fuzzy search and validation (same origin/dest error).
   - Train search filters, date calculation, availability state transitions.
   - Booking creation with idempotency key, passenger limits, Tatkal limits.
   - Ticket PDF generation with demo watermark.
   - Cancellation logic and refund computation.
2. **Automated Frontend & Browser Verification:**  
   Run `browser_subagent` to verify the end-to-end journey in an active browser:
   - Homepage search -> Results list -> Booking form -> Demo completion -> Ticket view -> My Trips -> Cancellation.
   - Screenshots captured and verified at 390px, 768px, and 1440px.
