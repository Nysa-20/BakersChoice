# BakersChoice Feature Log

This document tracks all advanced features implemented in the BakersChoice project. AI agents should refer to this file to understand exact feature functionalities, how they intertwine with the backend, and what parts are currently operational.

## Feature 1: Customer Accounts & Loyalty Program
**Status: IMPLEMENTED**
- **Database Schema**: 
  - `User` model now includes `phone`, `address`, and `loyalty_points` (default 0).
  - `Order` model now includes an optional `user_id` linked to the `User`.
- **API Endpoints**:
  - `POST /api/auth/register`: Accepts new fields (`phone`, `address`).
  - `GET /api/orders/my-orders`: Returns the list of orders belonging to the currently authenticated customer (`current_user`).
  - `POST /api/orders/`: Calculates and adds `loyalty_points` to the user's account automatically (1 point for every ₹100 spent) if a valid user token is provided in the header.
- **Dependency**: 
  - `deps.get_current_user_optional` dynamically detects if a user is logged in during order placement without enforcing authentication.
- **Frontend Changes**:
  - Customers can now authenticate (logic supported in backend, UI placeholders created). Orders automatically link to the account when logged in.

## Upcoming Features (Not yet implemented)
- Feature 2: Inventory & Stock Management
- Feature 3: Analytics & Reporting Dashboard
- Feature 4: Delivery & Time Slots
- Feature 5: Automated Notifications (Email/SMS)
- Feature 6: Promo Codes & Discounts
- Feature 7: Robust Shopping Cart (Persistent)
