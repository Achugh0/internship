from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.core.security import create_access_token, verify_password, get_password_hash
from app.core.config import settings
from app.models.user import User, UserRole
from app.db.session import get_db
from pydantic import BaseModel, EmailStr

router = APIRouter()

class UserRegister(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    role: UserRole
    login_portal: str  # 'student', 'company', 'admin'

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
        login_portal=user_data.login_portal
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
            "full_name": user.full_name
        }
    }

@router.post("/register/company", response_model=Token)
async def register_company(user_data: UserRegister, db: Session = Depends(get_db)):
    # Force company role and portal
    user_data.role = UserRole.COMPANY
    user_data.login_portal = "company"
    
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user = User(
        email=user_data.email,
        hashed_password=get_password_hash(user_data.password),
        full_name=user_data.full_name,
        role=user_data.role,
        login_portal=user_data.login_portal
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    
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
            "full_name": user.full_name
        }
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
            "full_name": user.full_name
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
            "full_name": user.full_name
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
            "full_name": user.full_name
        }
    }
