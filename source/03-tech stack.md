# Tech Stack Specification: FastAPI + React + PostgreSQL Bakery E-Commerce Platform

## Purpose of This Document
This document defines the concrete technology choices to implement the system described in `bakery-website-prd.md`, using **FastAPI (Python) for the backend, React for the frontend, and PostgreSQL for the database** — a relational stack chosen because the app's data (orders, stock, points ledger) is inherently transactional and relational, and because a Python backend gives the optional AI/analytics layer a much more natural home. This replaces the earlier MERN-based version of this document; the PRD and design spec are unaffected.

---

## 1. Architecture Snapshot

```
┌─────────────────────────────┐        ┌──────────────────────────────┐
│   React Frontend (SPA)      │        │   React Admin Frontend        │
│   Customer Storefront       │        │   (same codebase, role-gated  │
│   (Vite + React Router)     │        │   routes)                     │
└──────────────┬───────────────┘        └──────────────┬───────────────┘
               │  REST API (JSON, JWT auth, OpenAPI docs auto-generated)
               └───────────────┬─────────────────────────┘
                                │
                    ┌───────────▼────────────┐
                    │   FastAPI (Python)      │
                    │  Routers, Pydantic       │
                    │  Schemas, Services,      │
                    │  Dependencies (auth,     │
                    │  DB session, roles)      │
                    └───────────┬────────────┘
                                │
        ┌───────────────────────┼───────────────────────────┐
        │                       │                           │
┌───────▼────────┐   ┌──────────▼──────────┐     ┌──────────▼──────────┐
│  PostgreSQL     │   │   File System        │     │  External Services  │
│  (SQLAlchemy /  │   │  (Invoices/PDFs,      │     │  Payment Gateway,    │
│   SQLModel ORM, │   │   Product Images)     │     │  Email/SMS, LLM API  │
│   Alembic       │   │                       │     │                      │
│   migrations)   │   │                       │     │                      │
└─────────────────┘   └───────────────────────┘     └──────────────────────┘
```

---

## 2. Frontend — React

The frontend layer is essentially unchanged from language perspective — the backend swap doesn't affect it, since both Express and FastAPI expose the same kind of JSON REST API to React.

### 2.1 Core
| Concern | Choice | Why |
|---|---|---|
| Build tool | **Vite** | Fast dev server/HMR |
| Framework | **React 18** (functional components + Hooks) | Ecosystem, team familiarity |
| Routing | **React Router v6** | Nested/protected routes for admin vs customer areas |
| Language | **TypeScript** (recommended) | Type safety across the growing data model |

### 2.2 Styling (to implement the design spec)
| Concern | Choice | Why |
|---|---|---|
| CSS approach | **Tailwind CSS**, custom theme config | Fast to implement the cream/green tokens, custom radii and fonts from `bakery-website-design-spec.md` |
| Component primitives | **shadcn/ui** (Radix-based) | Accessible unstyled primitives for modals, dropdowns, dialogs |
| Icons | **lucide-react** | Chevron bullets, cart icon, hamburger menu |
| Animations | **Framer Motion** | Diagonal ribbon ticker, testimonial carousel transitions |

### 2.3 State & Data Management
| Concern | Choice | Why |
|---|---|---|
| Server state / caching | **TanStack Query (React Query)** | Fetching/caching catalog, cart, orders, analytics data from the FastAPI backend |
| Client/UI state | **Zustand** | Cart contents pre-checkout, auth/session state, UI toggles |
| Forms | **React Hook Form** + **Zod** | Login/signup, checkout, admin product forms — validated client-side, mirrored by Pydantic schemas server-side |

### 2.4 Commerce/Utility Libraries
| Concern | Choice | Why |
|---|---|---|
| Charts (admin analytics) | **Recharts** | Revenue trends, category performance |
| Carousel/slider | **Embla Carousel** | Testimonial + best-seller carousels |
| Image handling | **react-lazy-load-image-component** | Performance for the image-heavy catalog |
| Date handling | **date-fns** | Order timestamps, analytics date ranges |
| PDF preview (optional) | **react-pdf** | In-browser invoice preview before download |

### 2.5 App Structure (indicative)
```
/src
  /components        → shared UI (Button, Card, ProductCard, StatCard, ChevronList...)
  /features
    /catalog          → listing, filters, item detail
    /cart              → cart drawer, cart page
    /checkout          → checkout flow, payment
    /auth              → login, signup, forgot password
    /account           → order history, points, profile
    /admin
      /inventory
      /orders
      /analytics
  /lib                → api client (typed via generated OpenAPI client), query client config, utils
  /store              → Zustand stores
  /routes             → React Router route definitions, route guards
```

### 2.6 A FastAPI-Specific Frontend Bonus
FastAPI auto-generates an **OpenAPI schema**. Use **`openapi-typescript`** (or `openapi-typescript-codegen`) to generate a fully typed API client straight from the running backend's `/openapi.json`. This gives the frontend compile-time-checked request/response types without hand-writing them, and keeps frontend and backend in sync automatically whenever the API changes.

### 2.7 Customer vs Admin Frontend
**Recommendation:** Single React app, single codebase, `/admin/*` routes wrapped in a `RequireRole("admin")` guard — same reasoning as before: keeps the design system in one place and satisfies the PRD's role-based access requirement (FR-10) without maintaining two frontends.

---

## 3. Backend — FastAPI (Python)

### 3.1 Core
| Concern | Choice | Why |
|---|---|---|
| Framework | **FastAPI** | Async-first, automatic request/response validation via Pydantic, auto-generated OpenAPI/Swagger docs at `/docs` |
| Language | **Python 3.12+** | Latest stable, best async performance |
| ASGI server | **Uvicorn** (dev) behind **Gunicorn** with Uvicorn workers (production) | Standard production pattern for FastAPI |
| Validation/schemas | **Pydantic v2** | Request/response models, automatic 422 errors on bad input — this is largely "free" compared to hand-wiring Zod validation into Express |
| Structure | **Routers → Services → Repositories/CRUD → Models** | Keeps business logic (points calculation, stock decrement, invoice generation) out of route handlers and independently testable |

### 3.2 Authentication & Authorization
| Concern | Choice | Why |
|---|---|---|
| Auth strategy | **OAuth2 Password flow + JWT** (`fastapi.security.OAuth2PasswordBearer`), access token + refresh token, refresh token in httpOnly cookie | FastAPI's standard, well-documented auth pattern |
| Password hashing | **passlib[bcrypt]** | Standard, satisfies NFR-1 |
| JWT handling | **python-jose** (or **PyJWT**) | Token creation/verification |
| Role-based access | FastAPI **Dependency** functions (`get_current_user`, `require_role("admin")`) injected into route signatures | Enforces FR-10 cleanly at the framework level — dependencies compose naturally, no custom middleware needed |
| Request validation | Pydantic models per endpoint (`UserCreate`, `OrderCreate`, etc.) | Automatic validation + auto-documented request/response shapes |

### 3.3 Core Middleware/Utilities
| Concern | Choice | Why |
|---|---|---|
| Security headers | **secure** package or manual middleware | Sensible default HTTP security headers |
| CORS | FastAPI's built-in `CORSMiddleware` | Restrict API access to known frontend origins |
| Rate limiting | **slowapi** (FastAPI-compatible wrapper around `limits`) | Protects login/checkout endpoints from abuse |
| Logging | **structlog** or Python's standard `logging` configured for JSON output | Structured logs for debugging order/payment failures |
| File uploads | FastAPI's native `UploadFile` support | Handles product image uploads from the admin panel |
| Environment config | **pydantic-settings** (`BaseSettings`) | Type-validated env var loading, fails fast if a required var is missing |
| Background/async jobs | FastAPI `BackgroundTasks` for lightweight jobs (e.g., sending a confirmation email after response); **Celery** + Redis if job volume grows (e.g., bulk invoice regeneration, scheduled analytics jobs) | Start simple with `BackgroundTasks`, graduate to Celery only when actually needed |

### 3.4 Business-Logic Modules (mapped to PRD sections)
| Module | Responsibility | PRD Reference |
|---|---|---|
| `catalog` | CRUD for items/categories, search/filter queries | 6.1 |
| `auth` | Register, login, password reset, token issuance | 6.2 |
| `points` | Earn/redeem logic, ledger writes, balance reconciliation | 6.3 |
| `cart` | Server-side cart persistence for logged-in users | 6.4 |
| `checkout` | Stock validation, total calculation, order creation | 6.4–6.5 |
| `payments` | Gateway integration, webhook handling, idempotent confirmation | 6.5 |
| `billing` | Order/bill DB record creation, PDF invoice generation and file storage | 6.6 |
| `inventory` | Stock updates, low-stock alerts, audit log | 6.7 |
| `analytics` | Aggregation queries (SQL) for the admin dashboard | 6.8 |

### 3.5 Transactional Integrity (critical, per NFR-4/NFR-6)
This is where the PostgreSQL move pays off directly:
- Wrap stock decrement + order creation + order_items insert + points ledger insert in a **single SQLAlchemy transaction** (`async with session.begin():`) — PostgreSQL's native ACID guarantees mean this is a first-class, straightforward pattern rather than a workaround.
- Use a **row-level lock or optimistic concurrency check** on `items.stock_quantity` during checkout — e.g., `UPDATE items SET stock_quantity = stock_quantity - :qty WHERE id = :id AND stock_quantity >= :qty RETURNING stock_quantity`, checked for a returned row before committing the order. This prevents overselling under concurrent checkouts without needing application-level locking.
- Foreign key constraints (`orders.user_id → users.id`, `order_items.order_id → orders.id`, etc.) are enforced by the database itself, catching bugs that a document database would silently allow.

---

## 4. Database — PostgreSQL

### 4.1 Core
| Concern | Choice | Why |
|---|---|---|
| Database | **PostgreSQL 16+** | Full ACID transactions, foreign key constraints, mature ecosystem — the right fit for this genuinely relational data model |
| ORM | **SQLModel** (built on SQLAlchemy + Pydantic, by the same author as FastAPI) or plain **SQLAlchemy 2.0** if you want more control | SQLModel lets a single class define both the DB table and the API schema, reducing duplication between Pydantic request models and DB models |
| Migrations | **Alembic** | Versioned schema migrations, the standard companion to SQLAlchemy/SQLModel |

### 4.2 Schema (translating the PRD's data model into relational tables)

**`users`**
| Column | Type | Notes |
|---|---|---|
| id | UUID, PK | |
| name | text | |
| email | text, unique, indexed | |
| phone | text | |
| password_hash | text | |
| role | enum (`customer`, `admin`) | |
| points_balance | integer | denormalized for fast reads, reconciled against `points_ledger` |
| created_at | timestamptz | |

**`addresses`**
| Column | Type | Notes |
|---|---|---|
| id | UUID, PK | |
| user_id | UUID, FK → users.id | |
| line1, city, state, postal_code | text | |
| is_default | boolean | |

**`categories`**
| Column | Type | Notes |
|---|---|---|
| id | UUID, PK | |
| name | text | |
| parent_category_id | UUID, FK → categories.id, nullable | self-referencing for subcategories |

**`items`**
| Column | Type | Notes |
|---|---|---|
| id | UUID, PK | |
| category_id | UUID, FK → categories.id | |
| name | text | |
| description | text | |
| price | numeric(10,2) | |
| image_urls | text[] (Postgres array) or a separate `item_images` table | |
| tags | text[] | |
| stock_quantity | integer | |
| low_stock_threshold | integer | |
| status | enum (`active`, `inactive`, `out_of_stock`) | |

**`orders`**
| Column | Type | Notes |
|---|---|---|
| id | UUID, PK | |
| user_id | UUID, FK → users.id | |
| status | enum (`pending`, `paid`, `fulfilled`, `cancelled`, `refunded`) | |
| subtotal, tax, points_discount, total | numeric(10,2) | |
| payment_reference_id | text | |
| invoice_file_path | text | |
| created_at | timestamptz | |

**`order_items`**
| Column | Type | Notes |
|---|---|---|
| id | UUID, PK | |
| order_id | UUID, FK → orders.id | |
| item_id | UUID, FK → items.id | reference kept for reporting, but... |
| item_name_snapshot | text | ...name/price are **snapshotted at purchase time**, so historical invoices don't change if the product is later renamed/repriced |
| unit_price_at_purchase | numeric(10,2) | |
| quantity | integer | |

**`points_ledger`**
| Column | Type | Notes |
|---|---|---|
| id | UUID, PK | |
| user_id | UUID, FK → users.id | |
| order_id | UUID, FK → orders.id, nullable | nullable for manual adjustments |
| type | enum (`earn`, `redeem`, `adjustment`) | |
| points | integer | |
| created_at | timestamptz | |

**`stock_audit_log`**
| Column | Type | Notes |
|---|---|---|
| id | UUID, PK | |
| item_id | UUID, FK → items.id | |
| change_amount | integer | positive or negative |
| reason | enum (`order`, `restock`, `manual_correction`, `cancellation`) | |
| changed_by | UUID, FK → users.id | admin user |
| created_at | timestamptz | |

**`carts`** / **`cart_items`**
| Table | Notes |
|---|---|
| `carts` | one row per logged-in user (or session-keyed for guests, with a `expires_at` for cleanup) |
| `cart_items` | `cart_id` FK, `item_id` FK, `quantity` |

### 4.3 Indexing Strategy
- `items`: index on `category_id`; a **GIN index** on `tags` (array) and a **full-text search (`tsvector`) index** on `name`/`description` for FR-3's search/filter requirement
- `orders`: composite index on `(user_id, created_at)` for order history; index on `status` for the admin order queue
- `users`: unique index on `email`
- `points_ledger`: composite index on `(user_id, created_at)`
- `stock_audit_log`: composite index on `(item_id, created_at)`

### 4.4 Analytics Queries
Use plain **SQL aggregate queries** (via SQLAlchemy Core or raw SQL through `asyncpg`) for the admin dashboard — `GROUP BY`, window functions, and date-truncation (`date_trunc`) are native, fast, and simpler to reason about in Postgres than replicating the same logic in an aggregation-pipeline DSL. This directly satisfies NFR-3 (scalability) as order volume grows.

---

## 5. File Storage (Invoices & Product Images)

| Concern | Choice (MVP) | Migration Path |
|---|---|---|
| Invoice PDFs | Local file system, structured as `/invoices/{year}/{month}/{order_id}.pdf`; path stored in the `orders.invoice_file_path` column, binary never stored in Postgres | Migrate to **AWS S3 / Cloudflare R2** as traffic grows, using the same relative path as the object key |
| Product images | Local file system under `/uploads/products/`, served via a static FastAPI route (`StaticFiles`) or a CDN-fronted path | Same S3 migration path, or **Cloudinary** for managed optimization/resizing |
| PDF generation | **WeasyPrint** (renders an HTML/CSS invoice template to PDF — lets the invoice visually match the brand's design tokens with minimal effort) or **fpdf2**/**ReportLab** for a more code-defined layout | WeasyPrint recommended: write the invoice as an HTML template (reusing the same fonts/colors from the design spec) and let it handle PDF rendering |

---

## 6. Integrations

### 6.1 Payments
| Concern | Choice | Why |
|---|---|---|
| Gateway | **Razorpay** (India-first) or **Stripe** (global) — pick based on target market | Both have official Python SDKs and webhook support |
| Flow | Backend creates a payment intent/order → frontend completes payment via the gateway's checkout SDK → gateway webhook hits a FastAPI endpoint to confirm payment → backend creates the order/invoice only on confirmed webhook, not the client-side "success" callback | Prevents fraud/spoofed success states; webhook is the source of truth (NFR-4) |

### 6.2 Email/Notifications
| Concern | Choice | Why |
|---|---|---|
| Transactional email | **fastapi-mail** or plain `smtplib` + **Jinja2** templates, sent via **SendGrid**/**Resend**/**Amazon SES** | Order confirmation, invoice attachment, password reset, low-stock alerts |
| SMS (optional, Phase 2) | **Twilio** (Python SDK) | Order-ready pickup notifications |

### 6.3 Search (optional enhancement)
- For MVP, Postgres full-text search (Section 4.3) is sufficient and requires no extra infrastructure.
- If catalog search needs typo tolerance/relevance ranking later, **Algolia** or **MeiliSearch** remain natural upgrades without restructuring the core schema.

---

## 7. AI Layer (Optional but Recommended — Now More Natural in Python)

A Python backend makes this layer meaningfully easier than it would be bolted onto Node — everything below can live inside the same FastAPI service rather than needing a separate microservice.

| Feature | Approach | Value |
|---|---|---|
| **Smart product recommendations** | "Customers who bought X also bought Y" computed via a scheduled job using **pandas**, or a proper collaborative-filtering pass with **implicit** or **scikit-learn**, cached and served alongside item detail/cart pages | Increases average order value |
| **Admin analytics summarization** | Call the **Anthropic API** (Python SDK: `anthropic`) with the aggregated analytics numbers (Section 6.8) to generate a short plain-English weekly summary for the owner | Owners get actionable insight instead of raw charts |
| **Customer support chatbot** | Anthropic API-backed FAQ/order-status assistant, with a small tool/function-calling setup that queries order status or points balance for the logged-in user directly from Postgres | Reduces manual support load |
| **Demand forecasting for stock** | **Prophet** or **statsmodels** for time-series forecasting over historical `order_items` data, surfaced as reorder suggestions in the inventory module | Reduces stock-outs/overstock |
| **Product description generation (admin tool)** | Anthropic API call to draft a first-pass description when an admin adds a new item; admin reviews/edits before publishing | Speeds up catalog data entry |

**Implementation note:** All of these can live as additional FastAPI routers (`/api/admin/ai-summary`, `/api/support/chat`, `/api/admin/forecast`) inside the same service — no separate deployment needed for MVP. If the ML workloads (forecasting, recommendations) grow heavy enough to need their own scaling profile later, they can be split into a dedicated worker process using the same Python codebase.

---

## 8. DevOps & Deployment

| Concern | Choice | Why |
|---|---|---|
| Frontend hosting | **Vercel** or **Netlify** | Zero-config SPA hosting with CDN, preview deployments per PR |
| Backend hosting | **Render**, **Railway**, or **Fly.io** (all have first-class FastAPI/Uvicorn support) | Simple ASGI deployment with env var management |
| Database hosting | **Supabase**, **Neon**, or **Render PostgreSQL** (managed Postgres with backups/monitoring) | Managed backups, connection pooling (important for serverless-adjacent deployments), easy scaling |
| CI/CD | **GitHub Actions** | Lint (`ruff`), type-check (`mypy`), test on PR; auto-deploy on merge to `main` |
| Environment separation | `.env` files locally, secrets in the hosting platform's env var manager (never committed) | Basic hygiene, satisfies NFR-1 |
| Monitoring/errors | **Sentry** (frontend + FastAPI SDK) | Catches payment/checkout failures in production early |

---

## 9. Testing

| Layer | Tooling |
|---|---|
| Backend unit/integration | **pytest** + **httpx**'s `AsyncClient` (FastAPI's recommended test client) against a test Postgres database (via **pytest-postgresql** or a Dockerized test DB) |
| Frontend unit/component | **Vitest** + **React Testing Library** |
| End-to-end | **Playwright** — critical for the full checkout → payment → invoice flow |
| Linting/type-checking | **ruff** (lint) + **mypy** (type-check) for the Python backend; **ESLint** + **TypeScript** for the frontend |

---

## 10. Summary Package List (Quick Reference)

**Frontend:** react, react-dom, react-router-dom, @tanstack/react-query, zustand, react-hook-form, zod, tailwindcss, @radix-ui/* (via shadcn/ui), lucide-react, framer-motion, recharts, embla-carousel-react, date-fns, openapi-typescript

**Backend:** fastapi, uvicorn, gunicorn, pydantic, pydantic-settings, sqlmodel (or sqlalchemy + alembic), python-jose, passlib[bcrypt], slowapi, structlog, weasyprint, fastapi-mail, razorpay or stripe SDK, anthropic (for the AI layer)

**Database:** PostgreSQL, SQLModel/SQLAlchemy ORM, Alembic migrations

**DevOps/Testing:** GitHub Actions, Sentry, pytest, httpx, pytest-postgresql, Vitest, React Testing Library, Playwright, ruff, mypy

**Optional AI Layer:** Anthropic API (`anthropic` Python SDK), pandas, scikit-learn/implicit, Prophet/statsmodels

---

## 11. How This Maps Back to the PRD's Build Phases

| PRD Phase | Key Stack Pieces Introduced |
|---|---|
| Phase 1 (Catalog + Auth + Admin CRUD) | FastAPI + React core, SQLModel models, Alembic initial migration, OAuth2/JWT auth, `UploadFile` image uploads |
| Phase 2 (Cart, Checkout, Payment, Invoicing) | Razorpay/Stripe integration, SQLAlchemy transactions + row-level stock locking, WeasyPrint invoice generation, file system storage |
| Phase 3 (Points/Loyalty) | `points_ledger` table, points calculation service |
| Phase 4 (Analytics Dashboard) | SQL aggregate queries, Recharts on the frontend |
| Phase 5 (Polish: alerts, audit logs, exports) | fastapi-mail alerts, `stock_audit_log`, CSV/PDF export endpoints |
| Post-MVP (AI layer) | Anthropic API integration for summaries/chatbot/recommendations, Prophet-based forecasting |
