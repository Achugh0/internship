from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.user import User, UserRole
from app.api.deps import get_current_admin_user
from typing import List
from pydantic import BaseModel

router = APIRouter()

class UserResponse(BaseModel):
    id: str
    email: str
    role: str
    full_name: str
    is_active: bool
    created_at: str

class DashboardStats(BaseModel):
    total_students: int
    total_companies: int
    total_internships: int
    pending_verifications: int
    active_disputes: int
    flagged_companies: int

@router.get("/dashboard", response_model=DashboardStats)
async def get_admin_dashboard(
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Admin dashboard statistics"""
    total_students = db.query(User).filter(User.role == UserRole.STUDENT).count()
    total_companies = db.query(User).filter(User.role == UserRole.COMPANY).count()
    
    return {
        "total_students": total_students,
        "total_companies": total_companies,
        "total_internships": 0,  # TODO: Implement
        "pending_verifications": 0,
        "active_disputes": 0,
        "flagged_companies": 0
    }

@router.get("/users", response_model=List[UserResponse])
async def list_all_users(
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100
):
    """List all users (admin only)"""
    users = db.query(User).offset(skip).limit(limit).all()
    return [
        {
            "id": str(user.id),
            "email": user.email,
            "role": user.role.value,
            "full_name": user.full_name or "",
            "is_active": user.is_active,
            "created_at": user.created_at.isoformat()
        }
        for user in users
    ]

@router.post("/users/{user_id}/suspend")
async def suspend_user(
    user_id: str,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Suspend a user account"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user.is_active = False
    db.commit()
    
    return {"message": "User suspended successfully"}

@router.post("/users/{user_id}/activate")
async def activate_user(
    user_id: str,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Activate a suspended user"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user.is_active = True
    db.commit()
    
    return {"message": "User activated successfully"}
