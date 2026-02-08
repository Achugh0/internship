from fastapi import APIRouter, Depends, HTTPException, File, UploadFile
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.user import User, UserRole
from app.api.deps import get_current_admin_user
from app.core.security import get_password_hash
from typing import List, Optional
from pydantic import BaseModel, EmailStr
import csv
import io

router = APIRouter()

class UserResponse(BaseModel):
    id: str
    email: str
    role: str
    full_name: str
    is_active: bool
    is_verified: bool
    created_at: str

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    role: UserRole

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    is_active: Optional[bool] = None
    is_verified: Optional[bool] = None

class BulkUserCreate(BaseModel):
    users: List[UserCreate]

class BulkAction(BaseModel):
    user_ids: List[str]
    action: str  # 'activate', 'deactivate', 'delete'

class DashboardStats(BaseModel):
    total_students: int
    total_companies: int
    total_internships: int
    pending_verifications: int
    active_disputes: int
    flagged_companies: int
    active_users: int
    inactive_users: int

@router.get("/dashboard", response_model=DashboardStats)
async def get_admin_dashboard(
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Admin dashboard statistics"""
    total_students = db.query(User).filter(User.role == UserRole.STUDENT).count()
    total_companies = db.query(User).filter(User.role == UserRole.COMPANY).count()
    active_users = db.query(User).filter(User.is_active == True).count()
    inactive_users = db.query(User).filter(User.is_active == False).count()
    
    return {
        "total_students": total_students,
        "total_companies": total_companies,
        "total_internships": 0,
        "pending_verifications": 0,
        "active_disputes": 0,
        "flagged_companies": 0,
        "active_users": active_users,
        "inactive_users": inactive_users
    }

@router.get("/users", response_model=List[UserResponse])
async def list_all_users(
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    role: Optional[str] = None,
    is_active: Optional[bool] = None
):
    """List all users with filters"""
    query = db.query(User)
    
    if role:
        query = query.filter(User.role == role)
    if is_active is not None:
        query = query.filter(User.is_active == is_active)
    
    users = query.offset(skip).limit(limit).all()
    return [
        {
            "id": str(user.id),
            "email": user.email,
            "role": user.role.value,
            "full_name": user.full_name or "",
            "is_active": user.is_active,
            "is_verified": user.is_verified,
            "created_at": user.created_at.isoformat()
        }
        for user in users
    ]

@router.get("/users/{user_id}", response_model=UserResponse)
async def get_user(
    user_id: str,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Get single user details"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {
        "id": str(user.id),
        "email": user.email,
        "role": user.role.value,
        "full_name": user.full_name or "",
        "is_active": user.is_active,
        "is_verified": user.is_verified,
        "created_at": user.created_at.isoformat()
    }

@router.post("/users", response_model=UserResponse)
async def create_user(
    user_data: UserCreate,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Create a new user (admin only)"""
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user = User(
        email=user_data.email,
        hashed_password=get_password_hash(user_data.password),
        full_name=user_data.full_name,
        role=user_data.role,
        login_portal=user_data.role.value,
        is_active=True
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    
    return {
        "id": str(user.id),
        "email": user.email,
        "role": user.role.value,
        "full_name": user.full_name,
        "is_active": user.is_active,
        "is_verified": user.is_verified,
        "created_at": user.created_at.isoformat()
    }

@router.put("/users/{user_id}", response_model=UserResponse)
async def update_user(
    user_id: str,
    user_data: UserUpdate,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Update user details"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if user_data.email:
        # Check if email already exists
        existing = db.query(User).filter(User.email == user_data.email, User.id != user_id).first()
        if existing:
            raise HTTPException(status_code=400, detail="Email already in use")
        user.email = user_data.email
    
    if user_data.full_name:
        user.full_name = user_data.full_name
    if user_data.is_active is not None:
        user.is_active = user_data.is_active
    if user_data.is_verified is not None:
        user.is_verified = user_data.is_verified
    
    db.commit()
    db.refresh(user)
    
    return {
        "id": str(user.id),
        "email": user.email,
        "role": user.role.value,
        "full_name": user.full_name,
        "is_active": user.is_active,
        "is_verified": user.is_verified,
        "created_at": user.created_at.isoformat()
    }

@router.post("/users/{user_id}/reset-password")
async def reset_user_password(
    user_id: str,
    new_password: str,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Reset user password (admin only)"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user.hashed_password = get_password_hash(new_password)
    db.commit()
    
    return {"message": "Password reset successfully"}

@router.delete("/users/{user_id}")
async def delete_user(
    user_id: str,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Delete a user permanently"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Prevent deleting super admins
    if user.role == UserRole.SUPER_ADMIN:
        raise HTTPException(status_code=403, detail="Cannot delete super admin")
    
    db.delete(user)
    db.commit()
    
    return {"message": "User deleted successfully"}

@router.post("/users/{user_id}/activate")
async def activate_user(
    user_id: str,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Activate a user"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user.is_active = True
    db.commit()
    
    return {"message": "User activated successfully"}

@router.post("/users/{user_id}/deactivate")
async def deactivate_user(
    user_id: str,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Deactivate a user"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if user.role == UserRole.SUPER_ADMIN:
        raise HTTPException(status_code=403, detail="Cannot deactivate super admin")
    
    user.is_active = False
    db.commit()
    
    return {"message": "User deactivated successfully"}

@router.post("/users/bulk-create")
async def bulk_create_users(
    bulk_data: BulkUserCreate,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Bulk create users"""
    created_users = []
    errors = []
    
    for user_data in bulk_data.users:
        try:
            existing_user = db.query(User).filter(User.email == user_data.email).first()
            if existing_user:
                errors.append(f"Email {user_data.email} already exists")
                continue
            
            user = User(
                email=user_data.email,
                hashed_password=get_password_hash(user_data.password),
                full_name=user_data.full_name,
                role=user_data.role,
                login_portal=user_data.role.value,
                is_active=True
            )
            db.add(user)
            created_users.append(user_data.email)
        except Exception as e:
            errors.append(f"Error creating {user_data.email}: {str(e)}")
    
    db.commit()
    
    return {
        "created": len(created_users),
        "errors": errors,
        "created_users": created_users
    }

@router.post("/users/bulk-action")
async def bulk_action_users(
    bulk_action: BulkAction,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Perform bulk actions on users"""
    affected = 0
    errors = []
    
    for user_id in bulk_action.user_ids:
        try:
            user = db.query(User).filter(User.id == user_id).first()
            if not user:
                errors.append(f"User {user_id} not found")
                continue
            
            if user.role == UserRole.SUPER_ADMIN and bulk_action.action in ['deactivate', 'delete']:
                errors.append(f"Cannot {bulk_action.action} super admin")
                continue
            
            if bulk_action.action == 'activate':
                user.is_active = True
                affected += 1
            elif bulk_action.action == 'deactivate':
                user.is_active = False
                affected += 1
            elif bulk_action.action == 'delete':
                db.delete(user)
                affected += 1
        except Exception as e:
            errors.append(f"Error processing {user_id}: {str(e)}")
    
    db.commit()
    
    return {
        "affected": affected,
        "errors": errors
    }

@router.post("/users/import-csv")
async def import_users_csv(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Import users from CSV file"""
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="File must be CSV")
    
    content = await file.read()
    csv_file = io.StringIO(content.decode('utf-8'))
    csv_reader = csv.DictReader(csv_file)
    
    created_users = []
    errors = []
    
    for row in csv_reader:
        try:
            email = row.get('email')
            password = row.get('password', 'ChangeMe123')
            full_name = row.get('full_name', '')
            role = row.get('role', 'student')
            
            if not email:
                errors.append(f"Missing email in row")
                continue
            
            existing_user = db.query(User).filter(User.email == email).first()
            if existing_user:
                errors.append(f"Email {email} already exists")
                continue
            
            user = User(
                email=email,
                hashed_password=get_password_hash(password),
                full_name=full_name,
                role=UserRole(role),
                login_portal=role,
                is_active=True
            )
            db.add(user)
            created_users.append(email)
        except Exception as e:
            errors.append(f"Error: {str(e)}")
    
    db.commit()
    
    return {
        "created": len(created_users),
        "errors": errors,
        "created_users": created_users
    }


# Company Profile Management
from app.models.company_profile import CompanyProfile
from datetime import datetime

class CompanyProfileResponse(BaseModel):
    id: str
    user_id: str
    company_name: str
    email: str
    phone: Optional[str]
    city: Optional[str]
    industry: Optional[str]
    verification_status: str
    is_active: bool
    created_at: str

@router.get("/companies/pending", response_model=List[CompanyProfileResponse])
async def get_pending_companies(
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Get companies pending verification"""
    profiles = db.query(CompanyProfile).filter(
        CompanyProfile.verification_status == 'pending'
    ).all()
    
    result = []
    for profile in profiles:
        user = db.query(User).filter(User.id == profile.user_id).first()
        if user:
            result.append({
                "id": profile.id,
                "user_id": profile.user_id,
                "company_name": profile.company_name,
                "email": user.email,
                "phone": profile.phone,
                "city": profile.city,
                "industry": profile.industry,
                "verification_status": profile.verification_status,
                "is_active": user.is_active,
                "created_at": profile.created_at.isoformat()
            })
    
    return result

@router.get("/companies/{user_id}/profile")
async def get_company_profile(
    user_id: str,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Get detailed company profile"""
    profile = db.query(CompanyProfile).filter(CompanyProfile.user_id == user_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Company profile not found")
    
    user = db.query(User).filter(User.id == user_id).first()
    
    return {
        "user": {
            "id": str(user.id),
            "email": user.email,
            "is_active": user.is_active,
            "is_verified": user.is_verified,
            "created_at": user.created_at.isoformat()
        },
        "profile": {
            "company_name": profile.company_name,
            "legal_name": profile.legal_name,
            "registration_number": profile.registration_number,
            "gst_number": profile.gst_number,
            "pan_number": profile.pan_number,
            "website": profile.website,
            "phone": profile.phone,
            "address_line1": profile.address_line1,
            "address_line2": profile.address_line2,
            "city": profile.city,
            "state": profile.state,
            "pincode": profile.pincode,
            "industry": profile.industry,
            "company_size": profile.company_size,
            "founded_year": profile.founded_year,
            "description": profile.description,
            "linkedin_url": profile.linkedin_url,
            "twitter_url": profile.twitter_url,
            "hr_name": profile.hr_name,
            "hr_email": profile.hr_email,
            "hr_phone": profile.hr_phone,
            "hr_designation": profile.hr_designation,
            "verification_status": profile.verification_status,
            "verification_notes": profile.verification_notes,
            "rejection_reason": profile.rejection_reason
        }
    }

@router.post("/companies/{user_id}/approve")
async def approve_company(
    user_id: str,
    notes: Optional[str] = None,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Approve company registration"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    profile = db.query(CompanyProfile).filter(CompanyProfile.user_id == user_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Company profile not found")
    
    # Activate user account
    user.is_active = True
    user.is_verified = True
    
    # Update profile
    profile.verification_status = 'verified'
    profile.verified_by = str(current_user.id)
    profile.verified_at = datetime.utcnow()
    if notes:
        profile.verification_notes = notes
    
    db.commit()
    
    return {"message": "Company approved successfully"}

@router.post("/companies/{user_id}/reject")
async def reject_company(
    user_id: str,
    reason: str,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Reject company registration"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    profile = db.query(CompanyProfile).filter(CompanyProfile.user_id == user_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Company profile not found")
    
    # Keep user inactive
    user.is_active = False
    user.is_verified = False
    
    # Update profile
    profile.verification_status = 'rejected'
    profile.rejection_reason = reason
    
    db.commit()
    
    return {"message": "Company rejected"}
