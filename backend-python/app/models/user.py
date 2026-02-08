from sqlalchemy import Column, String, Boolean, DateTime, Enum as SQLEnum
from datetime import datetime
import uuid
import enum
from app.db.base_class import Base

class UserRole(str, enum.Enum):
    STUDENT = "student"
    COMPANY = "company"
    ADMIN = "admin"
    MODERATOR = "moderator"
    SUPER_ADMIN = "super_admin"

class User(Base):
    __tablename__ = "users"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(SQLEnum(UserRole), nullable=False)
    full_name = Column(String)
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Login portal tracking
    login_portal = Column(String)  # 'student', 'company', 'admin'
