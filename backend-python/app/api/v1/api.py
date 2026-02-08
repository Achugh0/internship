from fastapi import APIRouter
from app.api.v1.endpoints import auth, admin, internships, applications

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["authentication"])
api_router.include_router(admin.router, prefix="/admin", tags=["admin"])
api_router.include_router(internships.router, prefix="/internships", tags=["internships"])
api_router.include_router(applications.router, prefix="/applications", tags=["applications"])
