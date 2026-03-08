# ============================================================
# Database Engine & Session Management (SQLite for dev)
# ============================================================

import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from .models import Base

# Detect production database (PostgreSQL/Supabase)
DATABASE_URL = os.getenv("DATABASE_URL")

if DATABASE_URL:
    # Vercel/Supabase Connection (PostgreSQL)
    if DATABASE_URL.startswith("postgres://"):
        DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)
    engine = create_engine(DATABASE_URL)
else:
    # Local Development (SQLite)
    DATABASE_URL = "sqlite:///./medvault.db"
    engine = create_engine(
        DATABASE_URL,
        connect_args={"check_same_thread": False}
    )


SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def init_db():
    """Create all tables defined in models.py"""
    Base.metadata.create_all(bind=engine)

def get_db():
    """FastAPI dependency that yields a database session per request."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
