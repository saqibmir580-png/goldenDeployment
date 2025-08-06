from pydantic import BaseModel
from datetime import date, datetime
from typing import Optional

class UserCreate(BaseModel):
    name: str
    email: str
    password: str
    role: str = "user"
    dob: Optional[date] = None
    contact_number: Optional[str] = None
    address: Optional[str] = None

class UserLogin(BaseModel):
    email: str
    password: str


class User(BaseModel):
    id: int
    name: str
    email: str
    dob: Optional[date] = None
    contact_number: Optional[str] = None
    address: Optional[str] = None
    image: Optional[str] = None
    is_verified: bool
    gender: str | None = None
    role: str | None = None
    created_at: datetime

    class Config:
        orm_mode = True

class Token(BaseModel):
    access_token: str

class Stats(BaseModel):
    total_users: int
    total_applications: int
    approved: int
    rejected: int
    pending: int

    class Config:
        orm_mode = True
