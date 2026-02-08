# InternSafe - Quick Start Guide

## 🚀 Complete Setup in 5 Minutes

### Prerequisites
- Python 3.9+
- Node.js 18+
- PostgreSQL (or use SQLite for testing)

### Step 1: Backend Setup (Python FastAPI)

```bash
# Navigate to Python backend
cd backend-python

# Install dependencies
pip install -r requirements.txt

# Start the server
python run.py
```

Backend will run on: **http://localhost:8000**
API Docs: **http://localhost:8000/docs**

### Step 2: Frontend Setup (React)

```bash
# Open new terminal
cd frontend

# Install dependencies (if not already done)
npm install

# Start development server
npm run dev
```

Frontend will run on: **http://localhost:5173**

---

## 🎯 Access the Platform

### 1. **Student Portal**
- Register: http://localhost:5173/student/register
- Login: http://localhost:5173/student/login
- Dashboard: Browse internships, apply, track applications

### 2. **Company Portal**
- Register: http://localhost:5173/company/register
- Login: http://localhost:5173/company/login
- Dashboard: Post internships, manage applications

### 3. **Admin Portal** (Super Admin Access)
- Login: http://localhost:5173/admin/login
- **Pre-configured Super Admins:**
  - ashchugh@gmail.com
  - achugh@hotmail.com
- Set your password on first login
- Full platform management access

---

## 🔐 Authentication System

### Separate Login Portals
- **Students** can ONLY login via `/student/login`
- **Companies** can ONLY login via `/company/login`
- **Admins** can ONLY login via `/admin/login`

### Role Hierarchy
```
SUPER_ADMIN (ashchugh@gmail.com, achugh@hotmail.com)
    ↓
ADMIN (promoted by super admin)
    ↓
MODERATOR (content moderation)
    ↓
COMPANY / STUDENT (separate portals)
```

---

## 📊 Admin Dashboard Features

Once logged in as admin, you can:
- ✅ View all users (students + companies)
- ✅ Suspend/activate accounts
- ✅ Monitor platform statistics
- ✅ Verify company registrations
- ✅ Resolve disputes
- ✅ Moderate content

---

## 🛠️ Database Setup (Optional)

### Using PostgreSQL (Recommended)
```bash
# Create database
createdb internship_platform

# Update backend-python/.env
POSTGRES_SERVER=localhost
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_password
POSTGRES_DB=internship_platform
```

### Using SQLite (Quick Testing)
The app will auto-create tables on first run.

---

## 🎨 Key Features Implemented

### Student Features
- ✅ Separate registration/login portal
- ✅ Profile management
- ✅ Browse internships with filters
- ✅ Application tracking
- ✅ Trust score visibility

### Company Features
- ✅ Separate registration/login portal
- ✅ Post internships
- ✅ Manage applications
- ✅ Company profile

### Admin Features
- ✅ Separate admin portal
- ✅ User management dashboard
- ✅ Platform statistics
- ✅ Suspend/activate users
- ✅ Pre-configured super admins

### Security
- ✅ JWT authentication
- ✅ Bcrypt password hashing
- ✅ Role-based access control
- ✅ Portal isolation
- ✅ Protected routes

---

## 🧪 Testing the System

### Test as Student
1. Go to http://localhost:5173/student/register
2. Create account
3. Browse internships
4. Apply to internships

### Test as Company
1. Go to http://localhost:5173/company/register
2. Create company account
3. Post an internship
4. View applications

### Test as Admin
1. Go to http://localhost:5173/admin/login
2. Login with: ashchugh@gmail.com
3. Set your password
4. Access admin dashboard
5. View all users and statistics

---

## 📁 Project Structure

```
internship-platform/
├── backend-python/          # Python FastAPI backend
│   ├── app/
│   │   ├── api/v1/
│   │   │   └── endpoints/
│   │   │       ├── auth.py      # Separate login endpoints
│   │   │       └── admin.py     # Admin endpoints
│   │   ├── models/
│   │   │   └── user.py          # User model with roles
│   │   ├── core/
│   │   │   ├── config.py        # Super admin emails
│   │   │   └── security.py      # JWT & hashing
│   │   └── main.py
│   ├── requirements.txt
│   └── run.py
│
├── frontend/                # React frontend
│   ├── src/
│   │   ├── pages/
│   │   │   ├── student/         # Student portal
│   │   │   ├── company/         # Company portal
│   │   │   └── admin/           # Admin portal
│   │   ├── components/
│   │   └── lib/
│   └── package.json
│
└── QUICKSTART.md            # This file
```

---

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check Python version
python --version  # Should be 3.9+

# Reinstall dependencies
pip install -r requirements.txt --force-reinstall
```

### Frontend won't start
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Can't login as admin
- Make sure you're using: ashchugh@gmail.com or achugh@hotmail.com
- First login will create the account
- Check backend logs for errors

### Database errors
- For quick testing, the app works without PostgreSQL
- Tables are auto-created on first run
- Check `.env` file for correct database credentials

---

## 🎯 Next Steps

1. ✅ Test all three portals (student, company, admin)
2. ✅ Create test accounts
3. ✅ Post sample internships
4. ✅ Test application flow
5. ✅ Explore admin dashboard

---

## 📞 Support

For issues or questions:
- Check API docs: http://localhost:8000/docs
- Review ARCHITECTURE.md for detailed system design
- Check backend logs for errors

---

**You're all set! Start exploring InternSafe! 🎉**
