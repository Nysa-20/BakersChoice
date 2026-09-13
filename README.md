# BakersChoice

BakersChoice is a web-based ordering system for a bakery, built with FastAPI. It provides a simple interface for customers to browse available bakery items and place orders, with each completed order recorded as a bill.

## Overview

The application serves a bakery storefront page where customers can select items and submit an order. Submitted orders are saved as itemized bills, with an optional integration for persisting order records to a MySQL database.

## Features

- Web interface for browsing bakery items and placing orders
- Automatic bill generation for each order, saved to `Bill.txt`
- Optional database persistence for order details (customer name, phone number, bill number, total amount)

## Tech Stack

| Component        | Technology                          |
|-------------------|--------------------------------------|
| Backend Framework | FastAPI                             |
| Templating Engine | Jinja2                              |
| Application Server| Uvicorn                             |
| Package Manager   | uv                                   |
| Database (optional)| MySQL (via `mysql-connector-python`)|

## Project Structure
BakersChoice/
├── main.py # FastAPI application and route definitions
├── templates/ # HTML templates rendered via Jinja2
├── static/images/ # Static image assets used by the website
├── Bill.txt # Generated order bills are appended here
├── pyproject.toml # Project metadata and dependencies
└── uv.lock # Locked dependency versions


## Prerequisites

- Python 3.13 or higher
- [uv](https://github.com/astral-sh/uv) package manager installed

## Installation

```bash
git clone https://github.com/Nysa-20/BakersChoice.git
cd BakersChoice
uv sync
```

## Running the Application

```bash
uv run uvicorn main:app --reload
```

The application will be available at `http://127.0.0.1:8000`.

## API Routes

| Method | Path          | Description                                                        |
|--------|---------------|----------------------------------------------------------------------|
| GET    | `/`           | Renders the home page where customers can view items and place orders |
| POST   | `/save_bill`  | Accepts order/bill text and appends it to `Bill.txt`                  |
| POST   | `/db_save`    | Saves order details (name, phone, bill number, total) to a MySQL database |

## Optional Database Setup

To use the MySQL-backed order storage, create a database and table matching the following schema:

```sql
CREATE TABLE info (
  Name VARCHAR(255),
  Phone VARCHAR(20),
  bill_no INT,
  total FLOAT
);
```

Update the connection parameters (`host`, `user`, `password`, `database`) in `main.py` to match your database configuration before using this route.
