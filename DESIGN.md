# RailVoya - Brand Identity & Design System (DESIGN.md)

**Brand Name:** RailVoya  
**Tagline:** Every journey, made simpler.  
**Domain:** `railvoya.co.in`  
**Design Version:** 1.0.0  

---

## 1. Brand Identity & Visual Language

RailVoya is designed to feel calm, authoritative, modern, and uncluttered. Traditional railway booking sites are crowded with third-party advertisements, flashing tickers, and tiny font sizes. RailVoya counters this with generous whitespace, a reassuring deep navy foundation, and high-energy, accessible action orange buttons.

### Logo & Symbol Concept
- **The Symbol:** An interlocking geometric monogram combining parallel railway tracks curving forward with a clean, rounded train window silhouette.
- **The Wordmark:** Clean, geometric sans-serif lettering: **Rail** in bold navy (`#102A43`), **Voya** in medium weight action orange (`#C2410C`) or crisp white on dark backgrounds.
- **Favicon:** The train-track / window monogram glyph inside a rounded 32x32 SVG canvas with deep navy background and radiant orange track accents.

---

## 2. Color Palette & Design Tokens

| Token Name | Hex Code | Role & Usage | Contrast Ratio (WCAG) |
|---|---|---|---|
| `--color-navy-primary` | `#102A43` | Hero background, primary headings, active tabs, header bar | 12.8:1 on `#FFFFFF` (AAA) |
| `--color-page-bg` | `#F6F8FC` | Body page background, subtle tint behind cards | Base surface |
| `--color-card-bg` | `#FFFFFF` | Primary card surfaces, modal dialogs, search form container | Base card |
| `--color-action-orange`| `#C2410C` | Primary buttons ("Search trains", "Book Now", "Pay & Confirm") | 5.1:1 with `#FFFFFF` text (AA) |
| `--color-decor-orange` | `#F97316` | Accent borders, badges, journey route highlights, stars | Decorative highlight |
| `--color-text-main` | `#132238` | Body text, titles, station names, train numbers | 14.1:1 on `#FFFFFF` (AAA) |
| `--color-text-secondary`|`#526277`| Subtitles, departure station codes, captions, timestamps | 5.3:1 on `#FFFFFF` (AA) |
| `--color-border` | `#DCE3ED` | Card borders, dividers, table grid lines, input outlines | Subtle structural line |
| `--color-status-success`|`#16734B`| "AVAILABLE", payment confirmed, refund complete | 5.6:1 on `#FFFFFF` (AA) |
| `--color-status-warning`|`#8A5100`| "RAC", Tatkal high-demand alert, expiring session | 5.8:1 on `#FFFFFF` (AA) |
| `--color-status-error` | `#B42318` | "WAITLIST / REGRET", validation errors, failed booking | 5.9:1 on `#FFFFFF` (AA) |

---

## 3. Typography & Font System

- **Primary Font:** Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif.
- **Font Scales:**
  - `Display / Hero Title`: 32px (mobile) to 48px (desktop), font-weight 800, line-height 1.15.
  - `Section Heading (H2)`: 24px (mobile) to 30px (desktop), font-weight 700.
  - `Card Title (H3)`: 18px to 20px, font-weight 600.
  - `Body Regular`: 15px to 16px, font-weight 400, line-height 1.5.
  - `Meta / Station Code / Pill`: 12px to 13px, font-weight 600, uppercase letter-spacing 0.05em.

---

## 4. Spacing, Radii & Elevation

- **8px Grid System:**
  - `space-1` = 4px (micro-spacing)
  - `space-2` = 8px (icon margins, inline badges)
  - `space-3` = 12px (form input inner padding)
  - `space-4` = 16px (standard component gaps)
  - `space-6` = 24px (card inner padding)
  - `space-8` = 32px (section vertical spacing)
  - `space-12` = 48px (hero vertical breathing room)
- **Border Radii:**
  - Standard cards & modals: `16px` (`rounded-2xl`).
  - Inputs & action buttons: `10px` to `12px` (`rounded-xl`).
  - Status pills & badges: `9999px` (`rounded-full`).
- **Shadows & Elevation:**
  - Soft card shadow: `0 4px 20px -2px rgba(16, 42, 67, 0.06), 0 2px 6px -1px rgba(16, 42, 67, 0.04)`
  - Elevated search card: `0 20px 40px -10px rgba(16, 42, 67, 0.12), 0 0 1px 1px rgba(16, 42, 67, 0.05)`
  - Modal backdrop: `rgba(16, 42, 67, 0.6)` with backdrop blur `4px`.

---

## 5. Key Component Blueprints

### A. Compact Header
- Deep navy or crisp white with navy text depending on scroll.
- Left: RailVoya Logo & wordmark.
- Center: Navigation links ("Trains", "PNR Status", "Train Status", "My Trips", "Help").
- Right: "Login / Sign Up" button or user avatar dropdown with "My Bookings", "Saved Passengers", "Logout".

### B. Hero & Overlapping Search Card
- **Hero:** Deep Navy `#102A43` background with subtle train track vector lines and soft amber gradient glow.
- **Headline:** *"Your next journey starts here."*
- **Tagline:** *"Every journey, made simpler."*
- **Search Card:** Sits overlapping bottom of hero.
  - Desktop: 1-row layout with:
    1. From Station (Autocomplete input with quick clear & station code badge).
    2. Accessible Station Swap button (`rotate-180` hover animation).
    3. To Station (Autocomplete input).
    4. Journey Date (Picker with "Today" and "Tomorrow" quick buttons).
    5. Class & Quota dropdowns.
    6. "Search trains" action button in `#C2410C`.
  - Mobile: Clean vertical stack respecting travel flow (From -> To -> Date -> Class/Quota -> Submit).

### C. Search Results Card
- Train Title Bar: Train number (e.g. `20608`), Train name (e.g. `Vande Bharat Express`), running days indicator ("M T W T F S S").
- Departure & Arrival Columns:
  - Origin: Departure time (bold 20px), Station Code (e.g. `MAS`), Station Name.
  - Journey Timeline: Total duration (e.g. `4h 30m`), route line with arrow, "View Schedule" link.
  - Destination: Arrival time (bold 20px), Station Code (e.g. `SBC`), arrival day offset badge (e.g. `+1 Day`).
- Class Selection Strip:
  - Horizontal scroll/grid of classes (`1A`, `2A`, `3A`, `3E`, `CC`, `EC`, `SL`, `2S`).
  - Each chip contains: Class Code, Fare (`₹1,240`), and colored availability badge (`AVAILABLE 48` green, `RAC 6` amber, `WL 18` red).
  - Selected chip highlighted with orange border and checkmark.

### D. Booking Step Indicator
- 4 Steps: `1. Select Train` -> `2. Passengers` -> `3. Review & Pay` -> `4. Ticket Confirmed`.
- Visual progress bar with current step pulsing in action orange.

---

## 6. System States (Loading, Empty, Error, Success)

- **Loading State:** Shimmering skeleton cards preserving layout dimensions. No jarring layout shifts.
- **Empty State:** High-contrast illustration or clean icon with friendly headline (e.g., *"No trains found between these stations on this date"*), plus suggestion to search adjacent dates or alternate nearby stations.
- **Error State:** Banner with `#B42318` border, clear explanation of the error (e.g., *"Provider timed out"*), and an immediate *"Retry Search"* button without losing input parameters.
- **Success State:** Celebratory confirmation card with demo PNR badge, green checkmark icon, clear journey receipt, and primary button to download the PDF ticket.
