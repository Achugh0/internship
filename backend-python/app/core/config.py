from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    PROJECT_NAME: str = "InternSafe"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Security
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    # Database
    POSTGRES_SERVER: str = "localhost"
    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str = "postgres"
    POSTGRES_DB: str = "internship_platform"
    MONGODB_URL: str = "mongodb://localhost:27017"
    MONGODB_DB: str = "internship_platform"
    REDIS_URL: str = "redis://localhost:6379"
    
    # Super Admins (pre-configured)
    SUPER_ADMIN_EMAILS: List[str] = [
        "ashchugh@gmail.com",
        "achugh@hotmail.com"
    ]
    
    # CORS
    BACKEND_CORS_ORIGINS: List[str] = ["http://localhost:5173"]
    
    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings()
