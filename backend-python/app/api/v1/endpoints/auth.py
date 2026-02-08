from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.core.security import create_access_token, verify_password, get_password_hash
from app.core.config import settings
from app.models.user import User, UserRole
from app.models.company_profile import CompanyProfile
from app.db.session import get_db
from pydantic import BaseModel, EmailStr
from typing import Optional

router = APIRouter()

class UserRegister(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    role: UserRole
    login_portal: str  # 'student', 'company', 'admin'

class CompanyRegister(BaseModel):
    # Account
    email: EmailStr
    password: str
    
    # Company Information
    company_name: str
    legal_name: Optional[str] = None
    registration_number: Optional[str] = None
    gst_number: Optional[str] = None
    pan_number: Optional[str] = None
    
    # Contact
    website: Optional[str] = None
    phone: Optional[str] = None
    alternate_email: Optional[str] = None
    
    # Address
    address_line1: Optional[str] = None
    address_line2: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    country: str = 'India'
    pincode: Optional[str] = None
    
    # Company Details
    industry: Optional[str] = None
    company_size: Optional[str] = None
    founded_year: Optional[int] = None
    description: Optional[str] = None
    
    # Social Media
    linkedin_url: Optional[str] = None
    twitter_url: Optional[str] = None
    
    # HR Contact
    hr_name: Optional[str] = None
    hr_email: Optional[str] = None
    hr_phone: Optional[str] = None
    hr_designation: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str
    login_portal: str

class Token(BaseModel):
    access_token: str
    token_type: str
    user: dict

@router.post("/register/student", response_model=Token)
async def register_student(user_data: UserRegister, db: Session = Depends(get_db)):
    # Force student role and portal
    user_data.role = UserRole.STUDENT
    user_data.login_portal = "student"
    
    # Check if user exists
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create user
    user = User(
        email=user_data.email,
        hashed_password=get_password_hash(user_data.password),
        full_name=user_data.full_name,
        role=user_data.role,
        login_portal=user_data.login_portal,
        is_verified=True  # Students are auto-verified
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    
    # Create token
    access_token = create_access_token(data={
        "sub": str(user.id),
        "email": user.email,
        "role": user.role.value
    })
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": str(user.id),
            "email": user.email,
            "role": user.role.value,
            "full_name": user.full_name,
            "is_verified": user.is_verified
        }
    }

@router.post("/register/company")
async def register_company(company_data: CompanyRegister, db: Session = Depends(get_db)):
    # Check if user exists
    existing_user = db.query(User).filter(User.email == company_data.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create user account (inactive until admin approves)
    user = User(
        email=company_data.email,
        hashed_password=get_password_hash(company_data.password),
        full_name=company_data.company_name,
        role=UserRole.COMPANY,
        login_portal="company",
        is_active=False,  # Inactive until admin approval
        is_verified=False  # Not verified until admin approval
    )
    db.add(user)
    db.flush()  # Get user ID without committing
    
    # Create company profile
    company_profile = CompanyProfile(
        user_id=str(user.id),
        company_name=company_data.company_name,
        legal_name=company_data.legal_name,
        registration_number=company_data.registration_number,
        gst_number=company_data.gst_number,
        pan_number=company_data.pan_number,
        website=company_data.website,
        phone=company_data.phone,
        alternate_email=company_data.alternate_email,
        address_line1=company_data.address_line1,
        address_line2=company_data.address_line2,
        city=company_data.city,
        state=company_data.state,
        country=company_data.country,
        pincode=company_data.pincode,
        industry=company_data.industry,
        company_size=company_data.company_size,
        founded_year=company_data.founded_year,
        description=company_data.description,
        linkedin_url=company_data.linkedin_url,
        twitter_url=company_data.twitter_url,
        hr_name=company_data.hr_name,
        hr_email=company_data.hr_email,
        hr_phone=company_data.hr_phone,
        hr_designation=company_data.hr_designation,
        verification_status='pending'
    )
    db.add(company_profile)
    db.commit()
    
    return {
        "message": "Registration successful! Your account is pending admin approval. You will receive an email notification once approved.",
        "email": user.email,
        "status": "pending_approval"
    }

@router.post("/login/student", response_model=Token)
async def login_student(credentials: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(
        User.email == credentials.email,
        User.login_portal == "student"
    ).first()
    
    if not user or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    if user.role != UserRole.STUDENT:
        raise HTTPException(status_code=403, detail="Access denied. Use company or admin portal.")
    
    access_token = create_access_token(data={
        "sub": str(user.id),
        "email": user.email,
        "role": user.role.value
    })
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": str(user.id),
            "email": user.email,
            "role": user.role.value,
            "full_name": user.full_name,
            "is_verified": user.is_verified
        }
    }

@router.post("/login/company", response_model=Token)
async def login_company(credentials: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(
        User.email == credentials.email,
        User.login_portal == "company"
    ).first()
    
    if not user or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    if user.role != UserRole.COMPANY:
        raise HTTPException(status_code=403, detail="Access denied. Use student or admin portal.")
    
    # Check if account is approved
    if not user.is_active:
        raise HTTPException(
            status_code=403, 
            detail="Your account is pending admin approval. You will receive an email once approved."
        )
    
    access_token = create_access_token(data={
        "sub": str(user.id),
        "email": user.email,
        "role": user.role.value
    })
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": str(user.id),
            "email": user.email,
            "role": user.role.value,
            "full_name": user.full_name,
            "is_verified": user.is_verified
        }
    }

@router.post("/login/admin", response_model=Token)
async def login_admin(credentials: UserLogin, db: Session = Depends(get_db)):
    # Check if email is in super admin list
    is_super_admin = credentials.email in settings.SUPER_ADMIN_EMAILS
    
    user = db.query(User).filter(User.email == credentials.email).first()
    
    # If super admin email and no user exists, create one
    if is_super_admin and not user:
        user = User(
            email=credentials.email,
            hashed_password=get_password_hash(credentials.password),
            full_name="Super Admin",
            role=UserRole.SUPER_ADMIN,
            login_portal="admin",
            is_verified=True
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    
    if not user or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    if user.role not in [UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.MODERATOR]:
        raise HTTPException(status_code=403, detail="Access denied. Admin access required.")
    
    access_token = create_access_token(data={
        "sub": str(user.id),
        "email": user.email,
        "role": user.role.value
    })
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": str(user.id),
            "email": user.email,
            "role": user.role.value,
            "full_name": user.full_name,
            "is_verified": user.is_verified
        }
    }
