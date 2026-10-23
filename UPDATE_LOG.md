# BakersChoice Update Log

This document serves as an architectural record and update log for the BakersChoice project. Agents should refer to this file to understand the current state, database schema, and implemented features without hallucinating project details.

## Current Architecture
- **Framework:** FastAPI (Backend) / React + Vite (Frontend)
- **Database:** PostgreSQL (via SQLAlchemy 2.0 ORM)
- **Migrations:** Alembic
- **Schemas:** Pydantic models for data validation

## Implemented Features (Phase 1: Repository Restructuring)
- **Directory Structure:** Separated the monolithic architecture into `/backend` and `/frontend` directories.
- **Frontend Stack Setup:** Initialized React SPA using Vite, TypeScript, Tailwind CSS (with custom brand tokens), and `shadcn/ui` placeholders.
- **Cleanup:** Removed legacy SQLite database (`bakerschoice.db`), Jinja2 templates, static HTML files, and legacy update scripts.

## Implemented Features (Phase 2: Database Migration to PostgreSQL)
- **Database Layer setup:** Integrated PostgreSQL via `psycopg2-binary`. Configured `app/database.py` to use `postgresql://`.
- **Models Created & Refactored (`app/models.py`):**
  - Updated all primary keys to use `UUID` instead of Integer.
  - Implemented PRD-compliant schema:
    - `User`: Handles authentication and roles (`customer`, `admin`), points_balance.
    - `Category`, `Item` (formerly Product): Includes stock_quantity, low_stock_threshold, tags.
    - `Order`, `OrderItem`: Full checkout models.
    - `Address`, `PointsLedger`, `StockAuditLog`, `Cart`, `CartItem`.
- **Security:**
  - Integrated `passlib` for bcrypt password hashing.
  - Implemented JWT-based authentication using `python-jose`.

## Implemented Features (Phase 3: Backend API Development)
- **Schema Refactoring (`app/schemas.py`)**:
  - Restructured all Pydantic schemas to strictly type UUIDs and Enum statuses from the new PostgreSQL models.
  - Implemented `Cart` and `PointsLedger` schemas.
- **Authentication Router (`app/routers/auth.py`)**:
  - Transitioned login mechanism to rely exclusively on `email` instead of `username`, generating JWT tokens tied to email.
  - Added logic to automatically provision an empty `Cart` for newly registered users.
- **Product & Inventory Router (`app/routers/products.py`)**:
  - Added new endpoint `PUT /api/products/{product_id}/stock` strictly for Admins to adjust inventory levels and concurrently record to `StockAuditLog`.
- **Order Processing Router (`app/routers/orders.py`)**:
  - Rewritten `POST /api/orders` to execute atomic stock deductions: checks current stock securely and prevents overselling (returns 400 if out of stock).
  - Integrated robust Point Redemption constraints (redeem logic caps at 50% order value) and Points Earnings logic directly connected to the `PointsLedger`.
  - Maintained WebSocket broadcasting on new order creation/status changes for real-time Admin dashboard updates.
- **Core App (`main.py`)**:
  - Removed outdated Jinja2 templating and static file mounting logic.
  - Installed `CORSMiddleware` to permit cross-origin requests from the Vite React frontend (port 5173).

## Pending / Future Work
- Generate API client types for the frontend using `openapi-typescript` based on the new `/openapi.json`.
- Implement `WeasyPrint` or similar mechanism for PDF Invoice generation on order completion.
- Begin **Phase 4: Frontend Implementation (React)**.

## Implemented Features (Phase 4: Frontend Implementation - Complete Artisanal Overhaul)
- **API Client Generation**:
  - Automatically generated typed API definitions (`src/api/schema.d.ts`) using `openapi-typescript` referencing the backend OpenAPI specs.
  - Setup `openapi-fetch` API client (`src/api/client.ts`) globally configured with automatic JWT injection.
- **State Management (Zustand)**:
  - Created `authStore.ts` to manage user sessions and persistence locally.
  - Created `cartStore.ts` for localized cart management, supporting dynamic quantity updates and tax calculations before pushing to the checkout API.
- **Brand Identity & Typography Tokens (`02-design.md`)**:
  - Pervasive Butter Cream (`#F1E4A6`) foundation with Deep Forest Green (`#1F3A18`) and Olive (`#264A1E`) accents.
  - Injected Google Fonts **Playfair Display** (Headings) and **Poppins** (Body & UI labels).
- **Signature UI Primitives Built (`src/components/ui/`)**:
  - `ScallopedDivider.tsx`: Custom SVG wave path recreating the pie-crust scalloped border on thumbnails and section boundaries.
  - `StatCard.tsx`: Deep green rounded rectangle cards displaying bold white numbers (`80+`, `95+`, points balance) overlapping editorial photo edges.
  - `ChevronList.tsx`: Feature bullets utilizing the deep green left-chevron (`‹`) glyph.
  - `DiagonalTickerRibbon.tsx`: Sliced banner with continuous marquee infinite loop of bakery keywords.
  - `Button.tsx`: Refined to strict 8–10px soft rectangle, deep forest green fill, white text, and subtle hover scale.
- **Complete Page Suite Implemented**:
  - **Homepage (`HomePage.tsx`)**: Reconstructed all sections from `02-design.md` (Split Hero with scalloped teasers & floating caption, Intro/Stats section with overlapping StatCards, Diagonal Ticker Ribbon, 4-column minimal Best Sellers grid, reversed Catering feature, Brand Story collage, Testimonial carousel with progress indicator, and Artisanal Footer).
  - **Catalog & Filter Page (`CatalogPage.tsx`)**: Full 8-item catalog with category pills, dietary tags (Vegan, Organic, Gluten-Free), search bar, stock counters, and "Sold Out" badge styling.
  - **Catering Page (`CateringPage.tsx`)**: Wedding & banquet packages, guest tiers, and interactive consultation inquiry form.
  - **About Page (`AboutPage.tsx`)**: Heritage 36-hour sourdough fermentation story, cultured butter lamination details, and stat cards.
  - **Contact Page (`ContactPage.tsx`)**: Historic Pastry District address, bakehouse pickup hours, direct inquiry form.
  - **On-Brand Auth (`LoginPage.tsx`)**: Customer and Admin login with welcome points callout.
  - **Cart Drawer & Checkout (`CartDrawer.tsx`, `CheckoutPage.tsx`)**: Slide-out basket, delivery vs pickup toggle, interactive loyalty points redemption slider (enforcing max 50% discount per PRD FR-13), tax calculation, and order confirmation.
  - **User Account (`AccountPage.tsx`)**: StatCard for Points Balance, reward tier callout, past order history with downloadable invoice buttons.
  - **Admin Dashboard (`AdminDashboard.tsx`)**: Data-first layout adhering to brand tokens with 4 KPI StatCards, inventory table with low-stock warnings, and live orders queue with fulfillment controls.
- **Indian Market Localization & Rupee (₹) Currency Migration**:
  - Migrated all currency representations across the platform from USD ($) to Indian Rupees (₹).
  - Configured Indian tax structure (5% GST on bakery & confectionery items).
  - Added green "Pure Vegetarian / 100% Eggless" symbol indicators across all product cards and category filters.
  - Re-curated the product catalog with artisanal Indian and fusion bakery offerings: *Cardamom & Saffron Mawa Cake (₹320), Artisan Sourdough Loaf (₹280), Belgian Dark Truffle Cake - Eggless (₹950), Smoked Paneer Tikka Puff (₹140), Rasmalai Tres Leches Gateau (₹1,100), Brioche Sourdough Pav (₹120), Classic Butter Croissant (₹180), and Almond Nankhatai Tin (₹450)*.
  - Updated marquee ticker with India-oriented keywords: `100% Eggless Options ✦ HandCrafted ✦ DesiMawaCakes ✦ SourdoughPav ✦ CulturedButter ✦ RasmalaiGateau ✦ BelgianTruffle ✦ KhapliWheat ✦ PaneerPuff ✦ DailyFreshBakes ✦ PureDesiGhee ✦ IraniBakeryCraft`.
  - Configured localized Indian payment methods on checkout: UPI (Google Pay, PhonePe, Paytm, BHIM VPA), NetBanking, Credit/Debit cards, and local PIN-code address forms.
  - Localized flagship bakehouse details: 14, 100 Feet Road, Indiranagar, Bengaluru, Karnataka (+91 98450 72839) with FSSAI license notation.
  - Updated backend database seed script (`seed_db.py`) to align DB with Indian categories, items, and INR pricing.
- **Visual Verification**:
  - Playwright visual regression captures verified for the complete storefront, catalog, and admin portal.

## Pending / Future Work
- PDF Invoice rendering service (WeasyPrint) on the backend for downloading invoices from Order History.
- Live WebSockets listener in the Admin Dashboard for instant incoming order alerts without manual refreshing.
