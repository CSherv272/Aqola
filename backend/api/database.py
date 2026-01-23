from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

from api.config import settings

# DB engine
engine = create_engine(
    settings.database_url,
    pool_pre_ping=True, #Pings the DB first to check its running
    pool_size=5, # Connection pools size
    max_overflow=10 # Max expansion
)

# Session Factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for ORM models
Base = declarative_base()

# Dependency for FastAPI
def get_db():
    """
    Creates a DB session for each request,
    and ensures it's closed afterwards
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
