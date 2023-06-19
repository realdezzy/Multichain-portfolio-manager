#!/usr/bin/python3
"""Portfolio schemas module."""
from datetime import datetime, date
from typing import Optional
from pydantic import BaseModel, EmailStr


class AccessTokenData(BaseModel):
    """User access token data."""

    id: Optional[str]


class BaseUser(BaseModel):
    """
    User base schema.
    
    Attributes:
        username (str): username of the user
        email (str): email address of the user
    """
    
    username: str
    email: EmailStr


class CreateUser(BaseUser):
    """Create user schema."""
    
    password: str


class UpdateUser(BaseModel):
    """
    Update user schema.
    
    Attributes:
        username (str): username of the user
        email (str): email address of the user
    """

    username: Optional[str]
    email: Optional[str]


class UserRes(BaseUser):
    """
    User response schema.
    
    Attributes:
        id (str): ID of user
        created_at (datetime): Date the user was created
    
    Returns:
        Returns user object
    """
    
    id: str
    created_at: datetime
    
    class Config:
        orm_mode = True


class Login(BaseModel):
    """Sign in user schema."""

    username: str
    password: str


class ForgotPassword(BaseModel):
    """Forgot password schema."""
    
    email: EmailStr


class ResetPassword(BaseModel):
    """Reset password schema."""
    
    password: str
    password1: str
    user_id: str


class BaseToken(BaseModel):
    """
    Base token schema.
    
    Attributes:
        tokenname (str): name of the token
        ticker (optional str): ticker of the token
        symbol (str): symbol of the token
        amount (float): amount of the token
    """
    
    tokenname: str
    ticker: Optional[str]
    symbol: str
    quantity: float
    coinrank_coin_uuid: Optional[str]


class CreateToken(BaseToken):
    """Create new token schema."""


class UpdateToken(BaseToken):
    """
    Update token schema.
    
    Attributes:
        tokenname (optional str): name of the token
        ticker (optional str): ticker of the token
        symbol (optional str): symbol of the token
        amount (optional float): amount of the token
    """

    tokenname: Optional[str] = None
    ticker: Optional[str] = None
    symbol: Optional[str] = None
    quantity: Optional[float] = None


class TokenRes(BaseToken):
    """
    Token response schema.

    Attributes:
        id (int): ID of token
        created_at (datetime): Date the token was created

    Returns:
        Returns token object
    """

    id: int

    class Config:
        """Dictionary configuration."""

        orm_mode = True
