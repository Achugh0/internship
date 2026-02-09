from app.db.base_class import Base
from app.db.session import engine
from app.models.user import User
from app.models.internship import Internship
from app.models.application import Application
from app.models.company_profile import CompanyProfile
import sqlite3

async def init_db():
    # Drop company_profiles table if it exists with wrong schema
    try:
        conn = sqlite3.connect('internship_platform.db')
        cursor = conn.cursor()
        
        # Check if table exists and has wrong schema
        cursor.execute("PRAGMA table_info(company_profiles)")
        columns = [col[1] for col in cursor.fetchall()]
        
        if 'company_profiles' in [t[0] for t in cursor.execute("SELECT name FROM sqlite_master WHERE type='table'").fetchall()]:
            if 'registration_number' not in columns:
                print("Dropping old company_profiles table...")
                cursor.execute('DROP TABLE company_profiles')
                conn.commit()
        
        conn.close()
    except Exception as e:
        print(f"Migration check: {e}")
    
    # Create all tables
    Base.metadata.create_all(bind=engine)
    print("Database tables created successfully")
