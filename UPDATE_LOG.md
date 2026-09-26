# BakersChoice Update Log

This document serves as an architectural record and update log for the BakersChoice project. Agents should refer to this file to understand the current state, database schema, and implemented features without hallucinating project details.

## Current Architecture
- **Framework:** FastAPI
- **Database:** SQLite (via SQLAlchemy 2.0 ORM) - easily swappable to PostgreSQL/MySQL.
- **Migrations:** Alembic
- **Schemas:** Pydantic models for data validation

## Implemented Features (Phase 1 & 2)
- **Database Layer setup:** Integrated SQLAlchemy and configured an SQLite database (`bakerschoice.db`).
- **Models Created:**
  - `Category`, `Product`, `Order`, `OrderItem`
  - `User`: Handles authentication and roles (admin, customer).
- **Security:**
  - Integrated `passlib` for bcrypt password hashing.
  - Implemented JWT-based authentication using `python-jose`.
  - Created `/api/auth/login` and `/api/auth/register` endpoints.
- **Admin Endpoints:**
  - Added protected CRUD endpoints in `/api/products/` requiring admin privileges.

## Implemented Features (Phase 1, 2 & 3)
- **Database Layer setup:** SQLite (`bakerschoice.db`) with Alembic migrations.
- **Models Created:** `Category`, `Product`, `Order`, `OrderItem`, `User`.
- **Security:** JWT authentication & bcrypt hashing.
- **Admin Endpoints & Dashboard:** Built `admin.html` with protected product management and live order tracking.
- **Dynamic Frontend:** Refactored `index.html` to load products dynamically and submit structured JSON orders.

## Implemented Features (Phase 4)
- **Real-time WebSockets (`app/core/websockets.py`)**: 
  - Admin dashboard maintains a live WebSocket connection (`/ws/admin`).
  - New orders instantly appear on the dashboard (flashing green) without a page refresh.
  - Admins can update order statuses (Pending, Preparing, Ready, Completed) and changes sync instantly.

## Pending / Future Work
- Integrate a real Payment Gateway (Stripe/Razorpay) before finalizing checkout (Requires API keys).
