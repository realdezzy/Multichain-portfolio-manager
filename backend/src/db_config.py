#!/usr/bin/python3
"""Database connection module."""
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from src.settings import settings

PASSWORD = settings.PASSWORD
DB_NAME = settings.DB_NAME
DB_USER = settings.DB_USER
SQLALCHEMY_DATABASE_URL = f"postgresql://{DB_USER}:{PASSWORD}@localhost/{DB_NAME}"

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    """Get the database."""
    database = SessionLocal()
    try:
        yield database
    finally:
        database.close()
