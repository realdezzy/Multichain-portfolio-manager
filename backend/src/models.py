#!/usr/bin/python3
"""Portfolio database models module."""
from sqlalchemy import Column, Date, String, Integer, DateTime, text, Float, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from .db_config import Base

PG_UUID = UUID(as_uuid=False)


class User(Base):
    """User database model."""
    
    __tablename__ = 'users'
    
    id = Column(PG_UUID, primary_key=True, server_default=text("gen_random_uuid()"))
    username = Column(String, nullable=False, unique=True)
    email = Column(String, nullable=False, unique=True)
    password = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), nullable=False, server_default=text("now()"))
    updated_at = Column(DateTime(timezone=True), nullable=True, default=None)
    tokens = relationship("Token", back_populates="user")
    
    def __repr__(self):
        """Return User instances string representation."""
        return f"User - {self.username} - {self.email} - {self.tokens} - {self.created_at}"
    

class Token(Base):
    """Token database model."""
    
    __tablename__ = "tokens"
    
    id = Column(Integer, primary_key=True, nullable=False)
    tokenname = Column(String, nullable=False)
    ticker = Column(String, nullable=True)
    symbol = Column(String, nullable=False)
    quantity = Column(Float, nullable=False, default=0.0)
    coinrank_coin_uuid = Column(String, nullable=False)
    user_id = Column(PG_UUID, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    user = relationship("User", back_populates="tokens")
    created_at = Column(DateTime(timezone=True), nullable=False, server_default=text("now()"))
    updated_at = Column(DateTime(timezone=True), nullable=True, default=None)
    
    def __repr__(self):
        """Return Token instances string representation."""
        return f"Token - {self.tokenname} - {self.symbol} - {self.amount} - {self.user_id}"
