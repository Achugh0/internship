from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.user import User, UserRole
from app.models.company_profile import CompanyProfile
from app.api.deps import get_current_user
from app.core.security import get_password_hash
from typing import Optional
from pydantic import BaseModel, EmailStr
from datetime import datetime

router = APIRouter()

# Company Profile Models
class CompanyProfileCreate(BaseModel):
    company_name: str
    company_type: str
    legal_name: Optional[str] = None
    gst_number: Optional[str] = None
    pan_number: Optional[str] = None
    tan_number: Optional[str] = None
    cin_number: Optional[str] = None
    industry: Optional[str] = None
    description: Optional[str] = None
    website: Optional[str] = None
    founded_year: Optional[int] = None
    employee_count: Optional[str] = None
    primary_email: Optional[str] = None
    primary_phone: Optional[str] = None
    registered_address: Optional[str] = None
    registered_city: Optional[str] = None
    registered_state: Optional[str] = None
    registered_pincode: Optional[str] = None
    office_address: Optional[str] = None
    office_city: Optional[str] = None
    office_state: Optional[str] = None
    office_pincode: Optional[str] = None

class CompanyProfileUpdate(BaseModel):
    company_name: Optional[str] = None
    company_type: Optional[str] = None
    legal_name: Optional[str] = None
    gst_number: Optional[str] = None
    pan_number: Optional[str] = None
    industry: Optional[str] = None
    description: Optional[str] = None
    website: Optional[str] = None
    founded_year: Optional[int] = None
    employee_count: Optional[str] = None
    primary_email: Optional[str] = None
    primary_phone: Optional[str] = None
    registered_address: Optional[str] = None
    registered_city: Optional[str] = None
    registered_state: Optional[str] = None
    registered_pincode: Optional[str] = None
    office_address: Optional[str] = None
    office_city: Optional[str] = None
    office_state: Optional[str] = None
    office_pincode: Optional[str] = None
    linkedin_url: Optional[str] = None
    twitter_url: Optional[str] = None

class PasswordChange(BaseModel):
    current_password: str
    new_password: str

class ProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None

# Company Profile Endpoints
@router.post("/company/profile")
async def create_company_profile(
    profile_data: CompanyProfileCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create or update company profile"""
    if current_user.role != UserRole.COMPANY:
        raise HTTPException(status_code=403, detail="Only companies can create company profiles")
    
    # Check if profile exists
    existing = db.query(CompanyProfile).filter(CompanyProfile.user_id == str(current_user.id)).first()
    
    if existing:
        # Update existing profile
        for key, value in profile_data.dict(exclude_unset=True).items():
            setattr(existing, key, value)
        db.commit()
        db.refresh(existing)
        return {"message": "Profile updated successfully", "profile_id": existing.id}
    
    # Create new profile
    profile = CompanyProfile(
        user_id=str(current_user.id),
        **profile_data.dict()
    )
    
    db.add(profile)
    db.commit()
    db.refresh(profile)
    
    return {"message": "Profile created successfully", "profile_id": profile.id}

@router.get("/company/profile")
async def get_company_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get company profile"""
    if current_user.role != UserRole.COMPANY:
        raise HTTPException(status_code=403, detail="Only companies can access this")
    
    profile = db.query(CompanyProfile).filter(CompanyProfile.user_id == str(current_user.id)).first()
    
    if not profile:
        return {"message": "No profile found", "profile": None}
    
    return {
        "id": profile.id,
        "company_name": profile.company_name,
        "company_type": profile.company_type,
        "legal_name": profile.legal_name,
        "gst_number": profile.gst_number,
        "gst_verified": profile.gst_verified,
        "pan_number": profile.pan_number,
        "cin_number": profile.cin_number,
        "industry": profile.industry,
        "description": profile.description,
        "website": profile.website,
        "founded_year": profile.founded_year,
        "employee_count": profile.employee_count,
        "primary_email": profile.primary_email,
        "primary_phone": profile.primary_phone,
        "registered_address": profile.registered_address,
        "registered_city": profile.registered_city,
        "registered_state": profile.registered_state,
        "registered_pincode": profile.registered_pincode,
        "office_address": profile.office_address,
        "office_city": profile.office_city,
        "office_state": profile.office_state,
        "office_pincode": profile.office_pincode,
        "linkedin_url": profile.linkedin_url,
        "twitter_url": profile.twitter_url,
        "is_verified": profile.is_verified,
        "trust_score": profile.trust_score,
        "created_at": profile.created_at.isoformat() if profile.created_at else None
    }

@router.put("/company/profile")
async def update_company_profile(
    profile_data: CompanyProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update company profile"""
    if current_user.role != UserRole.COMPANY:
        raise HTTPException(status_code=403, detail="Only companies can update profiles")
    
    profile = db.query(CompanyProfile).filter(CompanyProfile.user_id == str(current_user.id)).first()
    
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found. Create one first.")
    
    for key, value in profile_data.dict(exclude_unset=True).items():
        setattr(profile, key, value)
    
    db.commit()
    db.refresh(profile)
    
    return {"message": "Profile updated successfully"}

# User Profile Endpoints
@router.get("/me")
async def get_current_user_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get current user profile"""
    user_data = {
        "id": str(current_user.id),
        "email": current_user.email,
        "full_name": current_user.full_name,
        "role": current_user.role.value,
        "is_active": current_user.is_active,
        "is_verified": current_user.is_verified,
        "created_at": current_user.created_at.isoformat()
    }
    
    # If company, include company profile
    if current_user.role == UserRole.COMPANY:
        profile = db.query(CompanyProfile).filter(CompanyProfile.user_id == str(current_user.id)).first()
        if profile:
            user_data["company_profile"] = {
                "company_name": profile.company_name,
                "company_type": profile.company_type,
                "gst_number": profile.gst_number,
                "gst_verified": profile.gst_verified,
                "employee_count": profile.employee_count,
                "is_verified": profile.is_verified
            }
    
    return user_data

@router.put("/me")
async def update_current_user_profile(
    profile_data: ProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update current user profile"""
    if profile_data.full_name:
        current_user.full_name = profile_data.full_name
    
    if profile_data.email:
        # Check if email already exists
        existing = db.query(User).filter(User.email == profile_data.email, User.id != current_user.id).first()
        if existing:
            raise HTTPException(status_code=400, detail="Email already in use")
        current_user.email = profile_data.email
    
    db.commit()
    db.refresh(current_user)
    
    return {"message": "Profile updated successfully"}

@router.post("/change-password")
async def change_password(
    password_data: PasswordChange,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Change user password"""
    from app.core.security import verify_password
    
    # Verify current password
    if not verify_password(password_data.current_password, current_user.hashed_password):
        raise HTTPException(status_code=400, detail="Current password is incorrect")
    
    # Update password
    current_user.hashed_password = get_password_hash(password_data.new_password)
    db.commit()
    
    return {"message": "Password changed successfully"}

# Admin endpoints for GST verification
@router.post("/admin/verify-gst/{user_id}")
async def verify_company_gst(
    user_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Verify company GST (admin only)"""
    if current_user.role not in [UserRole.ADMIN, UserRole.SUPER_ADMIN]:
        raise HTTPException(status_code=403, detail="Admin access required")
    
    profile = db.query(CompanyProfile).filter(CompanyProfile.user_id == user_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Company profile not found")
    
    profile.gst_verified = True
    profile.gst_verification_date = datetime.utcnow()
    db.commit()
    
    return {"message": "GST verified successfully"}

@router.get("/admin/company-profiles")
async def get_all_company_profiles(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all company profiles (admin only)"""
    if current_user.role not in [UserRole.ADMIN, UserRole.SUPER_ADMIN]:
        raise HTTPException(status_code=403, detail="Admin access required")
    
    profiles = db.query(CompanyProfile).all()
    
    result = []
    for profile in profiles:
        user = db.query(User).filter(User.id == profile.user_id).first()
        result.append({
            "id": profile.id,
            "user_id": profile.user_id,
            "user_email": user.email if user else None,
            "company_name": profile.company_name,
            "company_type": profile.company_type,
            "gst_number": profile.gst_number,
            "gst_verified": profile.gst_verified,
            "employee_count": profile.employee_count,
            "is_verified": profile.is_verified,
            "created_at": profile.created_at.isoformat()
        })
    
    return result
