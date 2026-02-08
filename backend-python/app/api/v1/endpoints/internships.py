from fastapi import APIRouter, Depends, HTTPException, File, UploadFile
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.internship import Internship
from app.models.user import User, UserRole
from app.api.deps import get_current_user, get_current_admin_user
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime
import csv
import io

router = APIRouter()

class InternshipCreate(BaseModel):
    title: str
    description: str
    stipend_amount: float
    duration_months: int
    work_mode: str
    location: Optional[str] = None
    hours_per_week: Optional[int] = None
    positions: int = 1
    required_skills: Optional[str] = None
    education: Optional[str] = None
    experience: Optional[str] = None

class InternshipUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    stipend_amount: Optional[float] = None
    duration_months: Optional[int] = None
    work_mode: Optional[str] = None
    location: Optional[str] = None
    hours_per_week: Optional[int] = None
    positions: Optional[int] = None
    required_skills: Optional[str] = None
    status: Optional[str] = None

class InternshipResponse(BaseModel):
    id: str
    company_id: str
    title: str
    description: str
    stipend_amount: float
    duration_months: int
    work_mode: str
    location: str
    positions: int
    status: str
    is_active: bool
    views: int
    applications_count: int
    created_at: str

# Company endpoints
@router.post("/", response_model=InternshipResponse)
async def create_internship(
    internship_data: InternshipCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create internship (company only)"""
    if current_user.role != UserRole.COMPANY:
        raise HTTPException(status_code=403, detail="Only companies can post internships")
    
    internship = Internship(
        company_id=str(current_user.id),
        **internship_data.dict(),
        status='pending',
        is_active=False
    )
    db.add(internship)
    db.commit()
    db.refresh(internship)
    
    return {
        "id": internship.id,
        "company_id": internship.company_id,
        "title": internship.title,
        "description": internship.description,
        "stipend_amount": internship.stipend_amount,
        "duration_months": internship.duration_months,
        "work_mode": internship.work_mode,
        "location": internship.location or "",
        "positions": internship.positions,
        "status": internship.status,
        "is_active": internship.is_active,
        "views": internship.views,
        "applications_count": internship.applications_count,
        "created_at": internship.created_at.isoformat()
    }

@router.get("/my-internships", response_model=List[InternshipResponse])
async def get_my_internships(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get company's internships"""
    if current_user.role != UserRole.COMPANY:
        raise HTTPException(status_code=403, detail="Only companies can access this")
    
    internships = db.query(Internship).filter(
        Internship.company_id == str(current_user.id)
    ).all()
    
    return [
        {
            "id": i.id,
            "company_id": i.company_id,
            "title": i.title,
            "description": i.description,
            "stipend_amount": i.stipend_amount,
            "duration_months": i.duration_months,
            "work_mode": i.work_mode,
            "location": i.location or "",
            "positions": i.positions,
            "status": i.status,
            "is_active": i.is_active,
            "views": i.views,
            "applications_count": i.applications_count,
            "created_at": i.created_at.isoformat()
        }
        for i in internships
    ]

@router.put("/{internship_id}", response_model=InternshipResponse)
async def update_internship(
    internship_id: str,
    internship_data: InternshipUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update internship"""
    internship = db.query(Internship).filter(Internship.id == internship_id).first()
    if not internship:
        raise HTTPException(status_code=404, detail="Internship not found")
    
    if internship.company_id != str(current_user.id) and current_user.role not in [UserRole.ADMIN, UserRole.SUPER_ADMIN]:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    for key, value in internship_data.dict(exclude_unset=True).items():
        setattr(internship, key, value)
    
    db.commit()
    db.refresh(internship)
    
    return {
        "id": internship.id,
        "company_id": internship.company_id,
        "title": internship.title,
        "description": internship.description,
        "stipend_amount": internship.stipend_amount,
        "duration_months": internship.duration_months,
        "work_mode": internship.work_mode,
        "location": internship.location or "",
        "positions": internship.positions,
        "status": internship.status,
        "is_active": internship.is_active,
        "views": internship.views,
        "applications_count": internship.applications_count,
        "created_at": internship.created_at.isoformat()
    }

@router.delete("/{internship_id}")
async def delete_internship(
    internship_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete internship"""
    internship = db.query(Internship).filter(Internship.id == internship_id).first()
    if not internship:
        raise HTTPException(status_code=404, detail="Internship not found")
    
    if internship.company_id != str(current_user.id) and current_user.role not in [UserRole.ADMIN, UserRole.SUPER_ADMIN]:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    db.delete(internship)
    db.commit()
    
    return {"message": "Internship deleted successfully"}

# Admin endpoints
@router.get("/admin/all", response_model=List[InternshipResponse])
async def get_all_internships_admin(
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db),
    status: Optional[str] = None
):
    """Get all internships (admin only)"""
    query = db.query(Internship)
    
    if status:
        query = query.filter(Internship.status == status)
    
    internships = query.all()
    
    return [
        {
            "id": i.id,
            "company_id": i.company_id,
            "title": i.title,
            "description": i.description,
            "stipend_amount": i.stipend_amount,
            "duration_months": i.duration_months,
            "work_mode": i.work_mode,
            "location": i.location or "",
            "positions": i.positions,
            "status": i.status,
            "is_active": i.is_active,
            "views": i.views,
            "applications_count": i.applications_count,
            "created_at": i.created_at.isoformat()
        }
        for i in internships
    ]

@router.post("/admin/{internship_id}/approve")
async def approve_internship(
    internship_id: str,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Approve internship"""
    internship = db.query(Internship).filter(Internship.id == internship_id).first()
    if not internship:
        raise HTTPException(status_code=404, detail="Internship not found")
    
    internship.status = 'approved'
    internship.is_active = True
    internship.approved_by = str(current_user.id)
    internship.approved_at = datetime.utcnow()
    db.commit()
    
    return {"message": "Internship approved"}

@router.post("/admin/{internship_id}/reject")
async def reject_internship(
    internship_id: str,
    reason: str,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Reject internship"""
    internship = db.query(Internship).filter(Internship.id == internship_id).first()
    if not internship:
        raise HTTPException(status_code=404, detail="Internship not found")
    
    internship.status = 'rejected'
    internship.is_active = False
    internship.rejection_reason = reason
    db.commit()
    
    return {"message": "Internship rejected"}

@router.post("/admin/{internship_id}/activate")
async def activate_internship(
    internship_id: str,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Activate internship"""
    internship = db.query(Internship).filter(Internship.id == internship_id).first()
    if not internship:
        raise HTTPException(status_code=404, detail="Internship not found")
    
    internship.is_active = True
    internship.status = 'active'
    db.commit()
    
    return {"message": "Internship activated"}

@router.post("/admin/{internship_id}/deactivate")
async def deactivate_internship(
    internship_id: str,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Deactivate internship"""
    internship = db.query(Internship).filter(Internship.id == internship_id).first()
    if not internship:
        raise HTTPException(status_code=404, detail="Internship not found")
    
    internship.is_active = False
    internship.status = 'paused'
    db.commit()
    
    return {"message": "Internship deactivated"}

@router.post("/admin/bulk-import")
async def bulk_import_internships(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Bulk import internships from CSV"""
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="File must be CSV")
    
    content = await file.read()
    csv_file = io.StringIO(content.decode('utf-8'))
    csv_reader = csv.DictReader(csv_file)
    
    created = []
    errors = []
    
    for row in csv_reader:
        try:
            internship = Internship(
                company_id=row['company_id'],
                title=row['title'],
                description=row['description'],
                stipend_amount=float(row['stipend_amount']),
                duration_months=int(row['duration_months']),
                work_mode=row['work_mode'],
                location=row.get('location', ''),
                positions=int(row.get('positions', 1)),
                status='approved',
                is_active=True
            )
            db.add(internship)
            created.append(row['title'])
        except Exception as e:
            errors.append(f"Error: {str(e)}")
    
    db.commit()
    
    return {
        "created": len(created),
        "errors": errors,
        "created_internships": created
    }
