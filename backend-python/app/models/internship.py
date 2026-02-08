from sqlalchemy import Column, String, Integer, Boolean, DateTime, Text, Float, ForeignKey
from datetime import datetime
import uuid
from app.db.base_class import Base

class Internship(Base):
    __tablename__ = "internships"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    company_id = Column(String, ForeignKey('users.id'), nullable=False)
    
    # Basic Info
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    
    # Details
    stipend_amount = Column(Float)
    stipend_currency = Column(String, default='INR')
    duration_months = Column(Integer)
    work_mode = Column(String)  # remote, hybrid, office
    location = Column(String)
    hours_per_week = Column(Integer)
    positions = Column(Integer, default=1)
    
    # Requirements
    required_skills = Column(Text)  # JSON string
    education = Column(String)
    experience = Column(String)
    
    # Status
    status = Column(String, default='pending')  # pending, approved, active, paused, closed, rejected
    is_active = Column(Boolean, default=False)
    
    # Metadata
    views = Column(Integer, default=0)
    applications_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    approved_at = Column(DateTime)
    approved_by = Column(String)
    rejection_reason = Column(Text)
