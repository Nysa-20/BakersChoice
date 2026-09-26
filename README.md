# BakersChoice

BakersChoice is a modern, full-stack web-based ordering system for a bakery, built with FastAPI. It provides a seamless interface for customers to browse available bakery items and place orders, backed by a real-time admin dashboard for order management and product inventory.

## Features

- **Dynamic Storefront:** Customers can browse categories (Cakes, Cookies, Breads) loaded dynamically from the backend.
- **Structured Order Checkout:** Orders are calculated and submitted via a structured JSON API.
- **Admin Dashboard:** A protected portal (`/admin`) for bakery staff to manage the menu and view orders.
- **Real-Time WebSockets:** New orders instantly pop up on the Admin Dashboard without refreshing the page.
- **Secure Authentication:** JWT-based authentication for admin accounts with `bcrypt` password hashing.
- **Database Persistence:** Relational database setup using SQLite (easily swappable to PostgreSQL/MySQL) managed via SQLAlchemy and Alembic.

## Tech Stack

| Component         | Technology                                         |
|-------------------|----------------------------------------------------|
| Backend Framework | FastAPI                                            |
| Database ORM      | SQLAlchemy 2.0 & Alembic (Migrations)              |
| Authentication    | passlib, bcrypt, python-jose (JWT)                 |
| Real-Time Comm.   | FastAPI WebSockets                                 |
| Templating Engine | Jinja2                                             |
| Application Server| Uvicorn                                            |
| Package Manager   | uv                                                 |

## Prerequisites

- Python 3.13 or higher
- [uv](https://github.com/astral-sh/uv) package manager installed

## Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Nysa-20/BakersChoice.git
   cd BakersChoice
   ```

2. **Install dependencies using `uv`:**
   ```bash
   uv sync
   # Note: Additional dependencies like sqlalchemy, alembic, websockets, and passlib have been added.
   ```

3. **Initialize the Database:**
   Run the Alembic migrations to create the database tables:
   ```bash
   uv run alembic upgrade head
   ```

4. **Seed the Database:**
   Populate the database with the default categories, products, and create the default admin user:
   ```bash
   uv run python seed_db.py
   uv run python create_admin.py
   ```

## Running the Application

```bash
uv run uvicorn main:app --reload
```

- **Customer Storefront:** `http://127.0.0.1:8000`
- **Admin Dashboard:** `http://127.0.0.1:8000/admin`
  - *Default Login:* Username: `admin` / Password: `admin123`

## API Routes Overview

| Method | Path | Description |
|--------|------|-------------|
| GET | `/` | Renders the customer storefront (`index.html`) |
| GET | `/admin` | Renders the admin dashboard (`admin.html`) |
| POST | `/api/auth/login` | Authenticates users and returns a JWT token |
| GET | `/api/products/` | Fetches the full product menu |
| POST | `/api/products/` | (Admin) Adds a new product to the menu |
| DELETE | `/api/products/{id}` | (Admin) Deletes a product |
| POST | `/api/orders/` | Submits a new customer order & broadcasts via WS |
| GET | `/api/orders/` | Fetches all recent orders |
| PATCH | `/api/orders/{id}/status` | (Admin) Updates the status of an order |
| WS | `/ws/admin` | WebSocket connection for real-time dashboard updates |
