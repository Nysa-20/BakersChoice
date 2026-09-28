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

## Pending / Future Work
- Update existing routes (`app/routers/`) and schemas (`app/schemas.py`) to fully utilize the new UUID-based PostgreSQL schema.
- Run Alembic migrations on a live PostgreSQL database to apply the new schema.
- Integrate a real Payment Gateway (Stripe/Razorpay) before finalizing checkout (Requires API keys).
