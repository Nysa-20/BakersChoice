import sys
from sqlalchemy.orm import Session
from app.database import engine
from app import models
from app.core.security import get_password_hash

def create_admin():
    db = Session(engine)
    admin_user = db.query(models.User).filter(models.User.username == "admin").first()
    if admin_user:
        print("Admin user already exists.")
        return
    
    admin = models.User(
        username="admin",
        email="admin@bakerschoice.com",
        hashed_password=get_password_hash("admin123"),
        role="admin"
    )
    db.add(admin)
    db.commit()
    print("Admin user created (username: admin, password: admin123).")

if __name__ == "__main__":
    create_admin()
