import sys
import os

# Add backend directory to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), 'backend')))

from app.database import SessionLocal
from app.models import Item, Category, ItemStatusEnum

def seed_data():
    db = SessionLocal()
    
    # Check if items exist
    if db.query(Item).count() > 0:
        print("Database already seeded")
        return
        
    print("Seeding database...")
    
    # Create categories
    bread = Category(name="Bread", description="Freshly baked artisan bread")
    pastry = Category(name="Pastry", description="Sweet and savory pastries")
    cake = Category(name="Cakes", description="Beautiful cakes for all occasions")
    
    db.add(bread)
    db.add(pastry)
    db.add(cake)
    db.commit()
    
    # Create items
    items = [
        Item(
            name="Classic Croissant",
            description="Flaky, buttery, and perfectly golden brown.",
            price=3.50,
            category_id=pastry.id,
            stock_quantity=50,
            status=ItemStatusEnum.active,
            image_urls=["https://images.unsplash.com/photo-1555507036-ab1f40ce88cb?auto=format&fit=crop&w=500&q=80"]
        ),
        Item(
            name="Sourdough Loaf",
            description="Naturally leavened bread with a crispy crust and chewy interior.",
            price=7.00,
            category_id=bread.id,
            stock_quantity=20,
            status=ItemStatusEnum.active,
            image_urls=["https://images.unsplash.com/photo-1585478259715-876acc5be8eb?auto=format&fit=crop&w=500&q=80"]
        ),
        Item(
            name="Chocolate Truffle Cake",
            description="Rich, decadent chocolate cake layered with dark chocolate ganache.",
            price=35.00,
            category_id=cake.id,
            stock_quantity=5,
            status=ItemStatusEnum.active,
            image_urls=["https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=500&q=80"]
        ),
        Item(
            name="Almond Croissant",
            description="Twice-baked croissant filled with sweet almond frangipane.",
            price=4.50,
            category_id=pastry.id,
            stock_quantity=30,
            status=ItemStatusEnum.active,
            image_urls=["https://images.unsplash.com/photo-1623366302587-bca97c8d8108?auto=format&fit=crop&w=500&q=80"]
        )
    ]
    
    for item in items:
        db.add(item)
        
    db.commit()
    print("Database seeded successfully!")

if __name__ == "__main__":
    seed_data()
