from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.application import Application
from app.models.internship import Internship
from app.models.user import User, UserRole
from app.api.deps import get_current_user
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime

router = APIRouter()

class ApplicationCreate(BaseModel):
    internship_id: str
    cover_letter: Optional[str] = None
    resume_url: Optional[str] = None
    portfolio_url: Optional[str] = None

class ApplicationUpdate(BaseModel):
    status: Optional[str] = None
    interview_scheduled: Optional[bool] = None
    interview_date: Optional[datetime] = None
    interview_mode: Optional[str] = None
    interview_link: Optional[str] = None
    company_notes: Optional[str] = None
    rejection_reason: Optional[str] = None

class ApplicationResponse(BaseModel):
    id: str
    internship_id: str
    student_id: str
    company_id: str
    status: str
    cover_letter: Optional[str]
    interview_scheduled: bool
    interview_date: Optional[str]
    created_at: str
    internship_title: Optional[str]
    company_name: Optional[str]
    student_name: Optional[str]

# Student endpoints
@router.post("/apply")
async def apply_to_internship(
    application_data: ApplicationCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Apply to an internship"""
    if current_user.role != UserRole.STUDENT:
        raise HTTPException(status_code=403, detail="Only students can apply")
    
    # Check if internship exists and is active
    internship = db.query(Internship).filter(
        Internship.id == application_data.internship_id,
        Internship.is_active == True
    ).first()
    
    if not internship:
        raise HTTPException(status_code=404, detail="Internship not found or not active")
    
    # Check if already applied
    existing = db.query(Application).filter(
        Application.internship_id == application_data.internship_id,
        Application.student_id == str(current_user.id)
    ).first()
    
    if existing:
        raise HTTPException(status_code=400, detail="Already applied to this internship")
    
    # Create application
    application = Application(
        internship_id=application_data.internship_id,
        student_id=str(current_user.id),
        company_id=internship.company_id,
        cover_letter=application_data.cover_letter,
        resume_url=application_data.resume_url,
        portfolio_url=application_data.portfolio_url,
        status='submitted'
    )
    
    db.add(application)
    
    # Update internship applications count
    internship.applications_count += 1
    
    db.commit()
    db.refresh(application)
    
    return {"message": "Application submitted successfully", "application_id": application.id}

@router.get("/my-applications", response_model=List[ApplicationResponse])
async def get_my_applications(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get student's applications"""
    if current_user.role != UserRole.STUDENT:
        raise HTTPException(status_code=403, detail="Only students can access this")
    
    applications = db.query(Application).filter(
        Application.student_id == str(current_user.id)
    ).all()
    
    result = []
    for app in applications:
        internship = db.query(Internship).filter(Internship.id == app.internship_id).first()
        company = db.query(User).filter(User.id == app.company_id).first()
        
        result.append({
            "id": app.id,
            "internship_id": app.internship_id,
            "student_id": app.student_id,
            "company_id": app.company_id,
            "status": app.status,
            "cover_letter": app.cover_letter,
            "interview_scheduled": app.interview_scheduled,
            "interview_date": app.interview_date.isoformat() if app.interview_date else None,
            "created_at": app.created_at.isoformat(),
            "internship_title": internship.title if internship else None,
            "company_name": company.full_name if company else None,
            "student_name": None
        })
    
    return result

@router.delete("/{application_id}")
async def withdraw_application(
    application_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Withdraw application"""
    application = db.query(Application).filter(Application.id == application_id).first()
    
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    
    if application.student_id != str(current_user.id):
        raise HTTPException(status_code=403, detail="Not authorized")
    
    if application.status in ['offer_made', 'accepted']:
        raise HTTPException(status_code=400, detail="Cannot withdraw after offer")
    
    # Update internship count
    internship = db.query(Internship).filter(Internship.id == application.internship_id).first()
    if internship:
        internship.applications_count = max(0, internship.applications_count - 1)
    
    db.delete(application)
    db.commit()
    
    return {"message": "Application withdrawn successfully"}

# Company endpoints
@router.get("/company/applications", response_model=List[ApplicationResponse])
async def get_company_applications(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    internship_id: Optional[str] = None,
    status: Optional[str] = None
):
    """Get applications for company's internships"""
    if current_user.role != UserRole.COMPANY:
        raise HTTPException(status_code=403, detail="Only companies can access this")
    
    query = db.query(Application).filter(Application.company_id == str(current_user.id))
    
    if internship_id:
        query = query.filter(Application.internship_id == internship_id)
    if status:
        query = query.filter(Application.status == status)
    
    applications = query.all()
    
    result = []
    for app in applications:
        internship = db.query(Internship).filter(Internship.id == app.internship_id).first()
        student = db.query(User).filter(User.id == app.student_id).first()
        
        result.append({
            "id": app.id,
            "internship_id": app.internship_id,
            "student_id": app.student_id,
            "company_id": app.company_id,
            "status": app.status,
            "cover_letter": app.cover_letter,
            "interview_scheduled": app.interview_scheduled,
            "interview_date": app.interview_date.isoformat() if app.interview_date else None,
            "created_at": app.created_at.isoformat(),
            "internship_title": internship.title if internship else None,
            "company_name": None,
            "student_name": student.full_name if student else None
        })
    
    return result

@router.put("/{application_id}")
async def update_application_status(
    application_id: str,
    update_data: ApplicationUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update application status (company only)"""
    application = db.query(Application).filter(Application.id == application_id).first()
    
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    
    if application.company_id != str(current_user.id):
        raise HTTPException(status_code=403, detail="Not authorized")
    
    # Update fields
    for key, value in update_data.dict(exclude_unset=True).items():
        setattr(application, key, value)
    
    if update_data.status and not application.viewed_at:
        application.viewed_at = datetime.utcnow()
    
    if update_data.status in ['rejected', 'offer_made']:
        application.responded_at = datetime.utcnow()
    
    db.commit()
    db.refresh(application)
    
    return {"message": "Application updated successfully"}

@router.get("/{application_id}", response_model=ApplicationResponse)
async def get_application_details(
    application_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get application details"""
    application = db.query(Application).filter(Application.id == application_id).first()
    
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    
    # Check authorization
    if (application.student_id != str(current_user.id) and 
        application.company_id != str(current_user.id) and
        current_user.role not in [UserRole.ADMIN, UserRole.SUPER_ADMIN]):
        raise HTTPException(status_code=403, detail="Not authorized")
    
    internship = db.query(Internship).filter(Internship.id == application.internship_id).first()
    company = db.query(User).filter(User.id == application.company_id).first()
    student = db.query(User).filter(User.id == application.student_id).first()
    
    return {
        "id": application.id,
        "internship_id": application.internship_id,
        "student_id": application.student_id,
        "company_id": application.company_id,
        "status": application.status,
        "cover_letter": application.cover_letter,
        "interview_scheduled": application.interview_scheduled,
        "interview_date": application.interview_date.isoformat() if application.interview_date else None,
        "created_at": application.created_at.isoformat(),
        "internship_title": internship.title if internship else None,
        "company_name": company.full_name if company else None,
        "student_name": student.full_name if student else None
    }
