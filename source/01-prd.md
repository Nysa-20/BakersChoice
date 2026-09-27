# Product Requirements Document: Artisan Bakery E-Commerce Platform

## Document Control
| Field | Detail |
|---|---|
| Document Type | Product Requirements Document (PRD) |
| Project Name | Bakery Website (working title) |
| Version | 1.0 |
| Status | Draft — for engineering scoping |
| Owner | Product/Founder |

---

## 1. Overview

A fully interactive, e-commerce style bakery website that lets customers browse a categorized catalog of baked goods with images, create an account, earn and redeem loyalty points, add items to a cart, and complete a purchase. On the backend, the business owner gets an admin dashboard for inventory/stock management, order management, and analytics/reporting. Every completed order writes a customer record to the database and generates a persisted bill/invoice file on the file system.

## 2. Goals & Objectives

- Let customers self-serve: browse, select, and pay for bakery items online without staff intervention.
- Build repeat business through a points-based loyalty system tied to user accounts.
- Give the owner real-time visibility into stock levels, sales, and revenue trends.
- Maintain an auditable trail of every transaction (DB record + physical invoice file).
- Ship a clean, maintainable MVP that can scale in features over time (delivery, coupons, multi-store, etc.) without a rewrite.

## 3. Target Users / Personas

| Persona | Description | Key Needs |
|---|---|---|
| **Customer** | Walk-in or online shopper wanting to order cakes, pastries, breads, etc. | Easy browsing, clear pricing, fast checkout, order history, loyalty rewards |
| **Bakery Owner/Admin** | Manages the catalog, stock, and business performance | Inventory control, sales visibility, order fulfillment, low-stock alerts |
| **Staff (optional, Phase 2)** | Fulfills orders, updates stock day-to-day | Order queue view, quick stock adjustment |

## 4. Scope

### 4.1 In Scope (MVP)
- Public storefront with categorized item listing and images
- User registration/login (customer-facing) with session/token-based auth
- Points/loyalty system tied to purchases
- Shopping cart and checkout flow
- Payment processing (integration with a payment gateway, sandbox/test mode acceptable for MVP)
- Order + billing record persisted to database
- Invoice/bill file generated and stored on file system (PDF), downloadable by user
- Admin panel: product CRUD, category management, inventory/stock tracking
- Analytics & reporting dashboard (sales, top items, stock trends, revenue)

### 4.2 Out of Scope (MVP) — Candidate for Later Phases
- Delivery logistics / rider tracking
- Multi-store / multi-location inventory
- Coupon and discount engine
- Subscription-based orders ("cake of the month")
- Native mobile apps (mobile-responsive web only for MVP)
- Multi-currency / multi-language support
- Reviews & ratings system

## 5. User Personas & Core Flows

### 5.1 Customer Flow
1. Land on homepage → browse categories (Cakes, Pastries, Breads, Cookies, Beverages, Custom Orders, etc.)
2. View item detail (image, description, price, stock availability)
3. Sign up / log in (guest browsing allowed, login required at checkout)
4. Add items to cart, adjust quantities
5. View cart → apply available points as discount (optional)
6. Proceed to checkout → enter/confirm delivery or pickup details
7. Make payment
8. Receive on-screen confirmation + downloadable invoice
9. Points credited to account based on order value
10. View past orders and points balance in "My Account"

### 5.2 Owner/Admin Flow
1. Log in to admin dashboard (separate role/auth)
2. Add/edit/remove products, assign categories, upload images, set price and stock quantity
3. Monitor real-time stock levels; receive low-stock indicators
4. View incoming orders, mark as fulfilled/packed/delivered
5. View analytics dashboard: revenue over time, best sellers, category performance, customer counts, points liability
6. Export/view reports (daily/weekly/monthly)

---

## 6. Functional Requirements

### 6.1 Item Catalog & Listing
- FR-1: Items are organized into categories and subcategories (e.g., Cakes → Birthday, Wedding, Eggless).
- FR-2: Each item has: name, description, price, image(s), category, tags (e.g., eggless, vegan, gluten-free), stock quantity, and status (active/inactive/out-of-stock).
- FR-3: Storefront supports filtering (category, price range, tags) and search by name/keyword.
- FR-4: Out-of-stock items are visibly marked and disabled from being added to cart.
- FR-5: Item detail page shows image gallery, full description, price, and estimated preparation time if applicable.

### 6.2 User Authentication & Profile
- FR-6: Users can register with email/phone + password; email verification recommended (can be stubbed in MVP).
- FR-7: Login via email/password; session managed via secure token (JWT or server session).
- FR-8: Password reset flow (forgot password via email link).
- FR-9: User profile stores: name, email, phone, delivery address(es), and current points balance.
- FR-10: Role-based access: `customer` vs `admin` roles, enforced on both API and UI routes.

### 6.3 Points / Loyalty System
- FR-11: Users earn points on every completed order — configurable rule, e.g., 1 point per ₹100 spent (store as a config value, not hardcoded).
- FR-12: Points are credited only after successful payment confirmation, not at cart stage.
- FR-13: Users can redeem points at checkout for a discount, subject to a minimum redemption threshold and a maximum % of order value it can offset (both configurable).
- FR-14: Points ledger is maintained (earn/redeem history) per user for transparency and reconciliation.
- FR-15: Points do not go negative; redemption is capped at the user's current balance.

### 6.4 Cart & Checkout
- FR-16: Cart persists across sessions for logged-in users (stored server-side); guest cart stored client-side until login.
- FR-17: Cart validates stock availability at checkout time before payment (prevents overselling).
- FR-18: Checkout collects/confirms delivery method (pickup or delivery) and address if delivery.
- FR-19: Order summary shown before payment: item list, subtotal, points discount applied, taxes, final total.

### 6.5 Payment
- FR-20: Integration with a payment gateway (e.g., Razorpay/Stripe depending on target market) supporting cards, UPI, wallets as available.
- FR-21: Payment failure is handled gracefully — cart is preserved, user is notified, no order/bill is created on failure.
- FR-22: On payment success, an order is created atomically with: order ID, user reference, itemized list, amounts, payment reference ID, and timestamp.

### 6.6 Billing & Invoice Generation
- FR-23: On order confirmation, a structured order + billing record (user basic data: name, contact, order items, amounts, payment status) is stored in the database.
- FR-24: A formatted invoice/bill (PDF) is generated per order and saved to the file system in an organized directory structure (e.g., `/invoices/{year}/{month}/{order_id}.pdf`).
- FR-25: Invoice includes: bakery details, order ID, date/time, itemized list with quantity and price, subtotal, points discount, tax, grand total, and payment reference.
- FR-26: User can download their invoice from order history at any time.
- FR-27: File system storage path is referenced (not duplicated) in the database — DB stores a file path/URL, not the binary, to keep DB lean.

### 6.7 Inventory & Stock Management (Admin)
- FR-28: Admin can view and update stock quantity per item.
- FR-29: Stock auto-decrements on successful order; auto-restoration on cancellation/refund (if implemented).
- FR-30: Low-stock threshold per item triggers a visual alert/badge in the admin dashboard.
- FR-31: Stock change history/audit log (who changed what, when) for accountability.

### 6.8 Analytics & Reporting Dashboard (Admin)
- FR-32: Revenue overview — daily/weekly/monthly totals, trend chart.
- FR-33: Top-selling items and category-wise performance.
- FR-34: Order volume trends and average order value.
- FR-35: Customer metrics — new vs returning customers, total registered users.
- FR-36: Points liability report (total outstanding points across users, as a proxy for future discount exposure).
- FR-37: Exportable reports (CSV/PDF) for a selected date range.

---

## 7. Non-Functional Requirements

- NFR-1: **Security** — Passwords hashed (e.g., bcrypt/argon2); all payment handling via PCI-compliant gateway (no raw card data touches our servers); HTTPS everywhere; input validation/sanitization on all forms.
- NFR-2: **Performance** — Catalog pages should load key content within ~2 seconds on average broadband; images optimized/lazy-loaded.
- NFR-3: **Scalability** — Architecture should support growth from tens to thousands of daily orders without redesign (stateless API layer, indexed DB queries).
- NFR-4: **Reliability** — Order + payment + invoice generation should be transactional: a paid order must never be "lost" (no DB record, no invoice) due to a mid-process failure.
- NFR-5: **Availability** — Target uptime suitable for a small business storefront, e.g., 99% (informal SLA for MVP).
- NFR-6: **Data Integrity** — Stock counts and points balances must never go negative; use DB-level constraints or transactions to prevent race conditions on concurrent orders.
- NFR-7: **Responsiveness** — Fully usable on mobile, tablet, and desktop breakpoints.
- NFR-8: **Maintainability** — Clear separation of frontend, backend/API, and admin modules; documented API contracts.

---

## 8. Proposed System Architecture (High Level)

```
[ Customer Web App ]        [ Admin Web App ]
        |                          |
        └────────────┬─────────────┘
                      |
              [ Backend API Layer ]
        (Auth, Catalog, Cart, Orders,
         Points, Inventory, Analytics)
                      |
        ┌─────────────┼──────────────┐
        |             |              |
 [ Database ]   [ File Storage ]  [ Payment Gateway ]
 (Users, Items,  (Invoices/PDFs,     (external API)
  Orders, Points,  Product Images)
  Inventory logs)
```

## 8. Data Model (Core Entities)

### `users`
| Field | Type | Notes |
|---|---|---|
| id | UUID/PK | |
| name | string | |
| email | string, unique | |
| phone | string | |
| password_hash | string | |
| role | enum (`customer`, `admin`) | |
| points_balance | integer | denormalized for fast reads; reconciled against ledger |
| created_at | timestamp | |

### `addresses`
| Field | Type |
|---|---|
| id | UUID/PK |
| user_id | FK → users |
| line1, city, state, postal_code | string |
| is_default | boolean |

### `categories`
| Field | Type |
|---|---|
| id | UUID/PK |
| name | string |
| parent_category_id | FK → categories (nullable, for subcategories) |

### `items`
| Field | Type |
|---|---|
| id | UUID/PK |
| category_id | FK → categories |
| name | string |
| description | text |
| price | decimal |
| image_urls | string[] / JSON |
| tags | string[] / JSON |
| stock_quantity | integer |
| low_stock_threshold | integer |
| status | enum (`active`, `inactive`, `out_of_stock`) |

### `orders`
| Field | Type |
|---|---|
| id | UUID/PK |
| user_id | FK → users |
| status | enum (`pending`, `paid`, `fulfilled`, `cancelled`, `refunded`) |
| subtotal, tax, points_discount, total | decimal |
| payment_reference_id | string |
| invoice_file_path | string |
| created_at | timestamp |

### `order_items`
| Field | Type |
|---|---|
| id | UUID/PK |
| order_id | FK → orders |
| item_id | FK → items |
| quantity | integer |
| unit_price_at_purchase | decimal |

### `points_ledger`
| Field | Type |
|---|---|
| id | UUID/PK |
| user_id | FK → users |
| order_id | FK → orders (nullable, for manual adjustments) |
| type | enum (`earn`, `redeem`, `adjustment`) |
| points | integer |
| created_at | timestamp |

### `stock_audit_log`
| Field | Type |
|---|---|
| id | UUID/PK |
| item_id | FK → items |
| change_amount | integer (+/-) |
| reason | enum (`order`, `restock`, `manual_correction`, `cancellation`) |
| changed_by | FK → users (admin) |
| created_at | timestamp |

---

## 9. Key API Endpoints (Illustrative, not exhaustive)

**Public/Customer**
- `GET /api/categories`
- `GET /api/items?category=&search=&tags=`
- `GET /api/items/:id`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/cart` / `POST /api/cart/items` / `DELETE /api/cart/items/:id`
- `POST /api/checkout` (validates stock, calculates totals)
- `POST /api/payment/confirm` (webhook or callback from gateway)
- `GET /api/orders` (user's own order history)
- `GET /api/orders/:id/invoice` (download PDF)
- `GET /api/points/balance` / `GET /api/points/history`

**Admin**
- `POST /api/admin/items` / `PUT /api/admin/items/:id` / `DELETE /api/admin/items/:id`
- `PUT /api/admin/items/:id/stock`
- `GET /api/admin/orders` / `PUT /api/admin/orders/:id/status`
- `GET /api/admin/analytics/revenue?range=`
- `GET /api/admin/analytics/top-items`
- `GET /api/admin/analytics/customers`
- `GET /api/admin/reports/export?range=&format=`

---

## 10. Success Metrics

- Checkout conversion rate (cart → completed payment)
- % of orders using points redemption (loyalty engagement)
- Repeat customer rate month-over-month
- Average order value (AOV)
- Stock-out incidents (should trend toward zero with good inventory alerts)
- Admin time spent per day on manual reconciliation (should decrease post-launch)

---

## 11. Assumptions & Constraints

- Single bakery/single location for MVP.
- Currency, tax rate, and points-earning ratio are configurable constants, not hardcoded.
- Payment gateway sandbox/test credentials are acceptable for initial build; production keys swapped in before real launch.
- File system storage for invoices/images is acceptable for MVP traffic levels; cloud storage migration is a Phase 2 concern.
- Delivery logistics (assigning riders, live tracking) is not part of MVP — order status is manually updated by admin (e.g., "Ready for Pickup").



## 12. Open Questions (to resolve before/while building)

- Which payment gateway/region (affects currency, tax handling, gateway choice)?
- Is delivery in scope for MVP, or pickup-only?
- What is the exact points-earning ratio and redemption cap policy?
- Should guest checkout be allowed, or is login mandatory before payment?
- Any tax/GST-style calculation requirements specific to the business's jurisdiction?

---

## 14. Future Enhancements (Post-MVP)

- Discount coupons and promotional campaigns
- Multi-location/franchise support
- Customer reviews and ratings per item
- SMS/email order notifications
- Subscription/recurring orders
- Native mobile app
- Multi-language/multi-currency support
