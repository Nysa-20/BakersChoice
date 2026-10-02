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

## Implemented Features (Phase 4: Frontend Implementation)
- **API Client Generation**:
  - Automatically generated typed API definitions (`src/api/schema.d.ts`) using `openapi-typescript` referencing the backend OpenAPI specs.
  - Setup `openapi-fetch` API client (`src/api/client.ts`) globally configured with automatic JWT injection.
- **State Management (Zustand)**:
  - Created `authStore.ts` to manage user sessions and persistence locally.
  - Created `cartStore.ts` for localized cart management, supporting dynamic quantity updates and tax calculations before pushing to the checkout API.
- **Customer Storefront UI**:
  - Engineered core foundational layout components: `Navbar`, `CartDrawer`, and customized `Button` component using Tailwind CSS matching the PRD typography (Playfair Display / Poppins).
  - Built the `HomePage` integrating the `GET /api/products/` API endpoint to display real-time stock levels, pricing, and "Add to Cart" functionality securely.
  
## Pending / Future Work
- Build the **Admin Dashboard** (order queue management, inventory restock, WebSockets integration for real-time orders).
- Implement the comprehensive Checkout flow linking the frontend Cart to the Backend `POST /api/orders` endpoints.
