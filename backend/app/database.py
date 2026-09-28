import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Use PostgreSQL database URL from environment variable, or fallback to a default local instance
SQLALCHEMY_DATABASE_URL = os.environ.get("DATABASE_URL", "postgresql+psycopg2://postgres:postgres@localhost:5432/bakerschoice")

engine = create_engine(
    SQLALCHEMY_DATABASE_URL
    # Note: connect_args={"check_same_thread": False} is not needed for Postgres
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
