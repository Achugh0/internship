import sqlite3

# Connect to database
conn = sqlite3.connect('internship_platform.db')
cursor = conn.cursor()

try:
    # Drop and recreate company_profiles table with correct schema
    cursor.execute('DROP TABLE IF EXISTS company_profiles')
    
    cursor.execute('''
    CREATE TABLE company_profiles (
        id TEXT PRIMARY KEY,
        user_id TEXT UNIQUE NOT NULL,
        company_name TEXT NOT NULL,
        legal_name TEXT,
        registration_number TEXT,
        gst_number TEXT,
        pan_number TEXT,
        website TEXT,
        phone TEXT,
        alternate_email TEXT,
        address_line1 TEXT,
        address_line2 TEXT,
        city TEXT,
        state TEXT,
        country TEXT DEFAULT 'India',
        pincode TEXT,
        industry TEXT,
        company_size TEXT,
        founded_year INTEGER,
        description TEXT,
        linkedin_url TEXT,
        twitter_url TEXT,
        facebook_url TEXT,
        incorporation_certificate_url TEXT,
        gst_certificate_url TEXT,
        authorization_letter_url TEXT,
        verification_status TEXT DEFAULT 'pending',
        verification_notes TEXT,
        verified_by TEXT,
        verified_at DATETIME,
        rejection_reason TEXT,
        hr_name TEXT,
        hr_email TEXT,
        hr_phone TEXT,
        hr_designation TEXT,
        created_at DATETIME,
        updated_at DATETIME,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (verified_by) REFERENCES users(id)
    )
    ''')
    
    conn.commit()
    print("✅ Database migration successful!")
    print("✅ company_profiles table recreated with correct schema")
    
except Exception as e:
    print(f"❌ Migration failed: {e}")
    conn.rollback()
finally:
    conn.close()
