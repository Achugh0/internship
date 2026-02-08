from sqlalchemy import Column, String, DateTime, Boolean, Text, Integer, ForeignKey
from sqlalchemy.sql import func
from app.db.base_class import Base
from datetime import datetime
import uuid

class CompanyProfile(Base):
    __tablename__ = "company_profiles"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey('users.id'), unique=True, nullable=False)
    
    # Basic Information
    company_name = Column(String, nullable=False)
    legal_name = Column(String)
    registration_number = Column(String)
    gst_number = Column(String)
    pan_number = Column(String)
    
    # Contact Information
    website = Column(String)
    phone = Column(String)
    alternate_email = Column(String)
    
    # Address
    address_line1 = Column(String)
    address_line2 = Column(String)
    city = Column(String)
    state = Column(String)
    country = Column(String, default='India')
    pincode = Column(String)
    
    # Company Details
    industry = Column(String)
    company_size = Column(String)  # 1-10, 11-50, 51-200, 201-500, 500+
    founded_year = Column(Integer)
    description = Column(Text)
    
    # Social Media
    linkedin_url = Column(String)
    twitter_url = Column(String)
    facebook_url = Column(String)
    
    # Verification Documents
    incorporation_certificate_url = Column(String)
    gst_certificate_url = Column(String)
    authorization_letter_url = Column(String)
    
    # Verification Status
    verification_status = Column(String, default='pending')  # pending, under_review, verified, rejected
    verification_notes = Column(Text)
    verified_by = Column(String, ForeignKey('users.id'), nullable=True)
    verified_at = Column(DateTime, nullable=True)
    rejection_reason = Column(Text)
    
    # HR Contact Person
    hr_name = Column(String)
    hr_email = Column(String)
    hr_phone = Column(String)
    hr_designation = Column(String)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
