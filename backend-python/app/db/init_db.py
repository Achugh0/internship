from app.db.base_class import Base
from app.db.session import engine
from app.models.user import User
from app.models.internship import Internship
from app.models.application import Application
from app.models.company_profile import CompanyProfile

async def init_db():
    # Create all tables
    Base.metadata.create_all(bind=engine)
    print("Database tables created successfully")
