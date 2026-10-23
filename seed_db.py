import sys
import os

# Add backend directory to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), 'backend')))

from app.database import SessionLocal
from app.models import Item, Category, ItemStatusEnum
from constants.images import BAKERY_IMAGES if False else None

def seed_data():
    db = SessionLocal()
    
    # Clear existing items if any to refresh with Indian curated items
    try:
        db.query(Item).delete()
        db.query(Category).delete()
        db.commit()
    except Exception as e:
        db.rollback()
        
    print("Seeding database with Indian & Artisanal Bakery catalog...")
    
    # Create Indian-oriented categories
    cakes = Category(name="Celebration Cakes", description="Bespoke eggless cakes and artisanal fusion entremets")
    breads = Category(name="Artisanal Breads & Pav", description="Heirloom sourdough, multigrain loaves, and soft brioche pav")
    puffs = Category(name="Puffs & Viennoiserie", description="Flaky butter croissants, paneer tikka puffs, and danishes")
    tea_cakes = Category(name="Tea Cakes & Mithai Fusion", description="Heritage mawa cakes, nankhatai cookies, and tartlets")
    
    db.add(cakes)
    db.add(breads)
    db.add(puffs)
    db.add(tea_cakes)
    db.commit()
    
    # Create items with INR prices and Indian flavor profiles
    items = [
        Item(
            name="Classic Butter Croissant",
            description="Flaky, 27-layered French viennoiserie made with pure 84% cultured butter. Crisp and golden.",
            price=180.00,
            category_id=puffs.id,
            stock_quantity=40,
            low_stock_threshold=10,
            status=ItemStatusEnum.active,
            image_urls=["https://images.unsplash.com/photo-1550617931-e17a7b70dce2?auto=format&fit=crop&w=600&q=85"],
            tags=["Breakfast", "French", "Cultured Butter"]
        ),
        Item(
            name="Artisan Sourdough Country Loaf",
            description="36-hour slow cold fermentation with organic Sharbati stone-milled wheat and natural wild yeast.",
            price=280.00,
            category_id=breads.id,
            stock_quantity=18,
            low_stock_threshold=10,
            status=ItemStatusEnum.active,
            image_urls=["https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?auto=format&fit=crop&w=600&q=85"],
            tags=["100% Eggless", "Vegan", "Organic", "Sourdough"]
        ),
        Item(
            name="Belgian Dark Truffle Cake (Eggless)",
            description="Signature celebration cake layered with 70% dark Belgian ganache, Valrhona cocoa, and moist sponge.",
            price=950.00,
            category_id=cakes.id,
            stock_quantity=6,
            low_stock_threshold=5,
            status=ItemStatusEnum.active,
            image_urls=["https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=85"],
            tags=["100% Eggless", "Best Seller", "Chocolate", "Celebration"]
        ),
        Item(
            name="Cardamom & Saffron Mawa Cake",
            description="Classic Bombay Irani cafe heritage cake enriched with slow-cooked mawa, green cardamom, and pistachios.",
            price=320.00,
            category_id=tea_cakes.id,
            stock_quantity=22,
            low_stock_threshold=10,
            status=ItemStatusEnum.active,
            image_urls=["https://images.unsplash.com/photo-1608198093002-ad4e005484ec?auto=format&fit=crop&w=600&q=85"],
            tags=["Heritage", "Tea Cake", "Mawa", "Pistachio"]
        ),
        Item(
            name="Smoked Paneer Tikka Puff",
            description="Crisp multi-layered pastry pouch stuffed with tandoori-spiced malai paneer, bell peppers, and mint chutney.",
            price=140.00,
            category_id=puffs.id,
            stock_quantity=35,
            low_stock_threshold=10,
            status=ItemStatusEnum.active,
            image_urls=["https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=85"],
            tags=["100% Eggless", "Savory", "Hot Bake"]
        ),
        Item(
            name="Rasmalai Tres Leches Gateau",
            description="Cardamom-soaked sponge cake steeped in rich kesar rabdi, topped with fresh malai rosettes and silver vark.",
            price=1100.00,
            category_id=cakes.id,
            stock_quantity=4,
            low_stock_threshold=5,
            status=ItemStatusEnum.active,
            image_urls=["https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?auto=format&fit=crop&w=600&q=85"],
            tags=["100% Eggless", "Fusion", "Celebration", "Kesar"]
        ),
        Item(
            name="Brioche Sourdough Pav (Box of 6)",
            description="Pillowy soft artisanal pav baked with cultured white butter and slow sourdough starter. Perfect for bun maska.",
            price=120.00,
            category_id=breads.id,
            stock_quantity=30,
            low_stock_threshold=10,
            status=ItemStatusEnum.active,
            image_urls=["https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&w=600&q=85"],
            tags=["100% Eggless", "Daily Pav", "Cultured Butter"]
        ),
        Item(
            name="Almond Nankhatai Shortbread Tin",
            description="Melt-in-your-mouth spiced shortbread baked with pure desi ghee, crushed almonds, and nutmeg.",
            price=450.00,
            category_id=tea_cakes.id,
            stock_quantity=25,
            low_stock_threshold=10,
            status=ItemStatusEnum.active,
            image_urls=["https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=600&q=85"],
            tags=["100% Eggless", "Desi Ghee", "Festive Gift"]
        )
    ]
    
    for item in items:
        db.add(item)
        
    db.commit()
    print("Database seeded with Indian & Rupee catalog successfully!")

if __name__ == "__main__":
    seed_data()
