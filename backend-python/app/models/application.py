from sqlalchemy import Column, String, DateTime, Boolean, Text, Integer, ForeignKey
from sqlalchemy.sql import func
from app.db.base_class import Base
import uuid

class Application(Base):
    __tablename__ = "applications"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    internship_id = Column(String, ForeignKey('internships.id'), nullable=False)
    student_id = Column(String, ForeignKey('users.id'), nullable=False)
    company_id = Column(String, ForeignKey('users.id'), nullable=False)
    
    # Application details
    cover_letter = Column(Text)
    resume_url = Column(String)
    portfolio_url = Column(String)
    
    # Status tracking
    status = Column(String, default='submitted')  # submitted, viewed, shortlisted, interview_scheduled, rejected, offer_made, accepted, declined
    
    # Interview details
    interview_scheduled = Column(Boolean, default=False)
    interview_date = Column(DateTime, nullable=True)
    interview_mode = Column(String, nullable=True)  # video, phone, in-person
    interview_link = Column(String, nullable=True)
    
    # Feedback
    company_notes = Column(Text, nullable=True)
    rejection_reason = Column(Text, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
    viewed_at = Column(DateTime, nullable=True)
    responded_at = Column(DateTime, nullable=True)
