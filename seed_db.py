import sys
import os

from sqlalchemy.orm import Session
from app.database import engine
from app import models

def seed_data():
    models.Base.metadata.create_all(bind=engine)
    db = Session(engine)

    if db.query(models.Category).first():
        print("Database already seeded.")
        return

    # Categories
    cat_cakes = models.Category(name="Cakes", description="Signature Cakes")
    cat_cookies = models.Category(name="Cookies & Muffins", description="Freshly baked small indulgences")
    cat_breads = models.Category(name="Breads & Others", description="Wholesome baked goods")

    db.add_all([cat_cakes, cat_cookies, cat_breads])
    db.commit()
    db.refresh(cat_cakes)
    db.refresh(cat_cookies)
    db.refresh(cat_breads)

    products = [
        # Cakes
        {"name": "Chocolate Overload", "price": 550.0, "category_id": cat_cakes.id, "image_url": "/static/images/Smoor.jpg"},
        {"name": "Pineapple Cake", "price": 550.0, "category_id": cat_cakes.id, "image_url": "/static/images/smoorpic3.png"},
        {"name": "Black Forest", "price": 550.0, "category_id": cat_cakes.id, "image_url": "/static/images/black.webp"},
        {"name": "Mixed Berry", "price": 600.0, "category_id": cat_cakes.id, "image_url": "/static/images/berry.jpg"},
        {"name": "Red Velvet", "price": 600.0, "category_id": cat_cakes.id, "image_url": "/static/images/RVCake.jpg"},
        {"name": "Ferrero Rocher", "price": 650.0, "category_id": cat_cakes.id, "image_url": "/static/images/FerroCake.jpg"},
        {"name": "Cheesecake", "price": 650.0, "category_id": cat_cakes.id, "image_url": "/static/images/cheese.jpg"},

        # Cookies & Muffins
        {"name": "Chocochip Cookie", "price": 20.0, "category_id": cat_cookies.id, "image_url": "/static/images/doublec.webp"},
        {"name": "Red Velvet Cookie", "price": 25.0, "category_id": cat_cookies.id, "image_url": "/static/images/RVCook.jpg"},
        {"name": "Oatmeal Cookie", "price": 20.0, "category_id": cat_cookies.id, "image_url": "/static/images/cookies.jpg"},
        {"name": "Vanilla Muffin", "price": 30.0, "category_id": cat_cookies.id, "image_url": "/static/images/muffins1.jpg"},
        {"name": "Blueberry Muffin", "price": 35.0, "category_id": cat_cookies.id, "image_url": "/static/images/muffins2.jpg"},
        {"name": "Chocolate Muffin", "price": 35.0, "category_id": cat_cookies.id, "image_url": "/static/images/muff.jpg"},

        # Breads
        {"name": "Plain Bread", "price": 80.0, "category_id": cat_breads.id, "image_url": "/static/images/bread.jpg"},
        {"name": "Multigrain Bread", "price": 100.0, "category_id": cat_breads.id, "image_url": "/static/images/bread1.jpg"},
        {"name": "Classic Brownie", "price": 45.0, "category_id": cat_breads.id, "image_url": "/static/images/brownie.jpg"},
        {"name": "Walnut Brownie", "price": 55.0, "category_id": cat_breads.id, "image_url": "/static/images/brownie1.jpg"},
        {"name": "Fudge Brownie", "price": 60.0, "category_id": cat_breads.id, "image_url": "/static/images/brownie2.jpg"},
    ]

    for p in products:
        prod = models.Product(**p)
        db.add(prod)

    db.commit()
    print("Database successfully seeded.")

if __name__ == "__main__":
    seed_data()
