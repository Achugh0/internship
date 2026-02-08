from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import os

# Use SQLite for easy setup (no PostgreSQL needed)
SQLALCHEMY_DATABASE_URL = "sqlite:///./internship_platform.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, 
    connect_args={"check_same_thread": False}  # Needed for SQLite
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
