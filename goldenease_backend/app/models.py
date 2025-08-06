from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, JSON, Date, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    name = Column(String)
    email = Column(String, unique=True)
    password = Column(String)
    role = Column(String, default="user")
    dob = Column(Date)  # New field: Date of Birth
    contact_number = Column(String) 
    address = Column(String)  
    image = Column(String, nullable=True)
    is_verified = Column(Boolean, default=False)
    gender = Column(String, nullable=True)
    status = Column(String, default="pending")  # New field: pending, approved, rejected
    created_at = Column(DateTime, default=datetime.utcnow)

    documents = relationship("Document", back_populates="user")
    application = relationship("Application", uselist=False, back_populates="user")

class Application(Base):
    __tablename__ = "applications"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    overall_status = Column(String, default="pending")
    remarks = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="application")

class Document(Base):
    __tablename__ = "documents"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    document_type = Column(String)
    file_path = Column(String)
    validation_result = Column(JSON)
    status = Column(String, default="pending")

    user = relationship("User", back_populates="documents")
