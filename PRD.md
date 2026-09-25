# RailVoya - Product Requirements Document (PRD)

**Brand Name:** RailVoya  
**Intended Domain:** `railvoya.co.in`  
**Tagline:** Every journey, made simpler.  
**Interface Language:** English (with regional language readiness)  
**Primary Functional Reference:** [IRCTC Train Search](https://www.irctc.co.in/eticket/train-search)  
**Document Version:** 1.0.0  
**Status:** Approved for Implementation  

---

## 1. Executive Summary & Vision

RailVoya is an independent, modern Indian train travel booking and discovery web platform. While traditional railway booking interfaces are notoriously dense, cluttered, and stressful, RailVoya provides a calm, high-contrast, clutter-free user experience with clear visual hierarchy, transparent pricing, intuitive station autocomplete, and end-to-end booking journey simulation.

RailVoya operates under an **Honest Demo & Independent Service** paradigm:
- It maintains an explicit disclosure that RailVoya is an independent travel portal and does not issue real railway tickets in demo mode.
- In demo mode, it provides an authentic, deterministic simulation of Indian Railways search, seat availability, quotas (General, Tatkal, Ladies, Senior Citizen), passenger entry, fare breakdown, booking reconciliation, cancellation, PNR status, and running status.
- It cleanly abstracts all railway and payment integrations behind strict provider interfaces, preparing the system for authorized live provider APIs when credentials become available.

---

## 2. Target Users & Personas

1. **Daily Commuters & Intercity Travelers (e.g., Rajesh, 28):** Regularly searches for fast trains (Vande Bharat, Shatabdi) between major metro pairs (e.g., Mumbai to Pune, Delhi to Jaipur). Values instant station autocomplete, live availability, and rapid 1-click booking.
2. **Family Vacation Planners (e.g., Priya & Amit, 38):** Booking cross-country journeys with multiple passengers, children, and elderly parents. Values clear berth preference requests, food options, transparent fare breakdown, and downloadable PDF tickets.
3. **Emergency & Tatkal Travelers (e.g., Vikram, 23):** Needs quick access to quota options (Tatkal, Premium Tatkal), immediate seat counts, and failure/retry transparency without losing entered search state.

---

## 3. Product Scope & Functional Boundary

| Capability | Local Demo Mode (Implemented & Verified) | Live Production Mode (Adapter Ready) |
|---|---|---|
| **Station Discovery** | 40+ major Indian Railway junction stations with code, city, state, and Hindi translations. | Authorized CRIS / IRCTC Station API. |
| **Train Search & Schedule** | Curated catalog of 20+ flagship trains (Vande Bharat, Rajdhani, Shatabdi, Duronto, Superfast, Mail/Express) with real-world timings and intermediate stops. | Authorized Train Schedule & Search Feed. |
| **Availability & Quotas** | Deterministic simulation across General (GN), Tatkal (TQ), Premium Tatkal (PT), Ladies (LD), Lower Berth/Senior Citizen (SS), Divyangjan (HP). Supports Available, RAC, WL, and Regret states. | Live PRS (Passenger Reservation System) queries. |
| **Passenger Management** | Up to 6 passengers per booking (4 for Tatkal). Name, age, gender, berth preference, concession criteria, food choice. Optional saved passengers. | PRS passenger schema limits. |
| **Payment Flow** | Demo completion simulation with test scenarios (Instant Success, Insufficient Balance / Failure, Network Timeout / Pending Reconciliation). | Hosted Payment Gateway (Razorpay / Cashfree / Stripe) with signed server webhooks. |
| **Ticket Issuance** | Generates verifiable `DEMO-RV-...` booking reference and downloadable PDF ticket clearly marked with watermarks and notices: "DEMO — NOT VALID FOR TRAVEL". | Authorized PNR issuance with real PRS transaction ID. |
| **Cancellation & Refund** | Server-persisted cancellation of full booking or individual passengers with dynamic refund calculation based on time before departure. | Live PRS cancellation and automated gateway refund. |
| **PNR & Running Status** | Instant lookup for demo PNRs and standard train running status with platform numbers and delay indicators. | Live NTES / CRIS tracking feeds. |

---

## 4. Numbered Requirements

### Search & Discovery
- **REQ-SRCH-01:** Station autocomplete with minimum 1-character trigger, matching on station name, city name, or 3-4 letter station code (e.g., "NDLS", "New Delhi", "Delhi").
- **REQ-SRCH-02:** Station swap control that exchanges origin and destination seamlessly with keyboard and screen reader accessibility.
- **REQ-SRCH-03:** Journey date picker defaulting to today/tomorrow, constrained to Asia/Kolkata timezone (+05:30), rejecting past dates and identical origin-destination selections.
- **REQ-SRCH-04:** Class selector supporting 1A (AC First Class), 2A (AC 2-Tier), 3A (AC 3-Tier), 3E (AC 3 Economy), CC (AC Chair Car), EC (Executive Chair Car), SL (Sleeper), 2S (Second Sitting).
- **REQ-SRCH-05:** Quota selector supporting General (GN), Tatkal (TQ), Premium Tatkal (PT), Ladies (LD), Senior Citizen (SS), Divyangjan (HP).
- **REQ-SRCH-06:** Recent searches panel stored locally without sensitive passenger data; popular route shortcut pills that populate the search form.

### Search Results & Train Details
- **REQ-RES-01:** Results listing showing train number, name, origin, destination, departure time, arrival time, duration, and day offset indicator (+1, +2 days).
- **REQ-RES-02:** Class availability cards showing status (Available with seat count, RAC, WL with number, or Unavailable), fare in INR (₹), and timestamp of last check.
- **REQ-RES-03:** Expandable route modal/drawer showing all intermediate stops, arrival/departure times, halt duration, day count, and distance in kilometers.
- **REQ-RES-04:** Filtering sidebar (desktop) and bottom sheet (mobile) supporting departure time windows (Morning, Afternoon, Evening, Night), train types (Vande Bharat, Rajdhani, Express), travel classes, and available-only filter.
- **REQ-RES-05:** Sorting by departure time, journey duration, and fare.
- **REQ-RES-06:** Adjacent date navigation bar allowing user to step -1 day or +1 day without clearing active filters.

### Passenger Entry & Booking Journey
- **REQ-BKG-01:** Dynamic passenger entry allowing 1 to 6 passengers (validated against Tatkal cap of 4 when quota = TQ/PT).
- **REQ-BKG-02:** Field-level validation for name (min 2 chars, letters only), age (1-120), gender (Male, Female, Transgender), berth preference (Lower, Middle, Upper, Side Lower, Side Upper, Window), and senior citizen verification.
- **REQ-BKG-03:** Clear legal disclaimer: "Berth preferences are passenger requests submitted to Indian Railways; actual berth allocation is determined by railway PRS algorithms at charting time."
- **REQ-BKG-04:** Contact details capture (valid Indian 10-digit mobile number and email address) for booking updates.
- **REQ-BKG-05:** Optional "Save passenger to my account" checkbox with explicit user consent.
- **REQ-BKG-06:** Sticky journey summary on desktop and expandable summary bar on mobile displaying train, route, date, quota, passengers, and live price.

### Review, Fare Breakdown & Idempotency
- **REQ-REV-01:** Booking review screen summarizing passenger roster, selected class, quota, boarding station, and contact details.
- **REQ-REV-02:** Itemized fare breakdown displaying Base Fare, Reservation Fee, Superfast Surcharge, Tatkal Fee (if applicable), GST (5% on AC classes), and Total Fare.
- **REQ-REV-03:** Server-side availability and fare re-validation before proceeding to payment. If fare or availability changed, user is notified and required to re-confirm.
- **REQ-REV-04:** Idempotency key generated per booking attempt to prevent duplicate bookings or double charges on double-click or network retry.

### Payment, Demo Completion & Reconciliation
- **REQ-PAY-01:** In Demo Mode, display prominent banner: "Demo mode — no real tickets are issued. No payment card details are collected."
- **REQ-PAY-02:** Provide simulation controls: Complete Demo Booking (Success), Simulate Card Failure, and Simulate Gateway Timeout.
- **REQ-PAY-03:** Server-side booking lifecycle states: `PENDING_PAYMENT`, `PAYMENT_SUCCESS`, `CONFIRMED`, `FAILED`, `CANCELLED`, `REFUND_PENDING`.
- **REQ-PAY-04:** Strict business rule: Payment success alone does not produce a confirmed railway ticket; ticket confirmation requires explicit provider confirmation.

### Post-Booking & Tickets
- **REQ-TCK-01:** Confirmation screen displaying demo PNR (e.g., `DEMO-RV-7849102`), booking reference, QR code placeholder, passenger berth/coach assignments (e.g., B4-23 Lower), and itemized tax invoice.
- **REQ-TCK-02:** Downloadable PDF ticket generated on backend with prominent red watermark and header: "DEMO TICKET — NOT VALID FOR TRAVEL".
- **REQ-TCK-03:** User account "My Trips" dashboard listing upcoming and completed journeys with filter and search.
- **REQ-TCK-04:** Persistent cancellation workflow allowing full or partial cancellation with refund calculation and status update.

### Utility & Information Pages
- **REQ-UTL-01:** PNR Status search with demo PNR shortcut pills, validation, charting status, and passenger status breakdown (Booking Status vs. Current Status).
- **REQ-UTL-02:** Train Live Running Status search by train number/name, with route timeline, current station, platform number, delay status, and last reported timestamp.
- **REQ-UTL-03:** Contact Us form with validation, topic selection, message capture, and database persistence with confirmation message: "Your message was saved".
- **REQ-UTL-04:** About page explaining RailVoya's independent design mission, technology stack, and clear legal disclosure that RailVoya is not an official affiliate of IRCTC or Indian Railways.
- **REQ-UTL-05:** Terms of Service, Privacy Policy, and Help & FAQ pages.

### Security, Auth & Sessions
- **REQ-SEC-01:** User registration and login with secure password hashing (Argon2 / PBKDF2), email validation, and session management via secure HttpOnly cookies.
- **REQ-SEC-02:** Private record authorization: Users can only view, download, or cancel bookings associated with their own account.
- **REQ-SEC-03:** Sensitive data hygiene: No passenger names or PNRs logged in plaintext in system logs or exposed in unauthenticated URLs.

---

## 5. Acceptance Criteria

1. **Station Autocomplete:** Typing "del" or "ndls" suggests New Delhi (NDLS), Delhi Sarai Rohilla (DEE), etc. Selecting one fills the input. Swapping works instantaneously.
2. **Search Results:** Searching NDLS -> MMCT displays Vande Bharat and Rajdhani Express with real-time class chips, fares, duration, and day offsets.
3. **Demo Booking:** User can select a class, fill 2 passengers, review itemized fare with GST, complete demo payment, see confirmed PNR, and download a branded PDF ticket.
4. **Cancellation:** User can cancel the booking in My Trips and see the status change to `CANCELLED` with a calculated refund amount.
5. **Responsiveness:** Flawless visual display and touch interaction at 390px (mobile), 768px (tablet), and 1440px (desktop) with 0 horizontal overflow.
6. **Accessibility:** Passes WCAG 2.1 AA color contrast, visible focus rings, keyboard navigability on autocomplete and modals, and touch targets >= 44px.
