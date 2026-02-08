# InternSafe - Student-First Internship Platform

A comprehensive platform prioritizing student safety, transparency, and empowerment in the internship marketplace.

## 🎯 Core Features

### Student Protection
- 🛡️ **Scam Detection**: AI-powered fraud detection
- 💰 **Payment Escrow**: Stipends held securely
- ⭐ **Trust Scores**: Company ratings (0-100)
- 📊 **Transparent Reviews**: Anonymous student feedback
- 🚨 **Dispute Resolution**: Built-in complaint system

### Three Separate Portals

#### 1. Student Portal (`/student/*`)
- Browse verified internships
- Apply with one click
- Track application status
- View company trust scores
- Manage profile & portfolio

#### 2. Company Portal (`/company/*`)
- Post internships
- Manage applications
- View applicant profiles
- Track trust score
- Escrow management

#### 3. Admin Portal (`/admin/*`)
- Full platform oversight
- User management
- Company verification
- Dispute resolution
- Platform statistics

## 🚀 Quick Start

### Option 1: Using Batch Files (Windows)

```bash
# Terminal 1: Start Backend
start-backend.bat

# Terminal 2: Start Frontend
start-frontend.bat
```

### Option 2: Manual Start

**Backend (Python):**
```bash
cd backend-python
pip install -r requirements.txt
python run.py
```
Backend: http://localhost:8000

**Frontend (React):**
```bash
cd frontend
npm install
npm run dev
```
Frontend: http://localhost:5173

## 🔐 Access Portals

### Student Portal
- Register: http://localhost:5173/student/register
- Login: http://localhost:5173/student/login

### Company Portal
- Register: http://localhost:5173/company/register
- Login: http://localhost:5173/company/login

### Admin Portal (Super Admin)
- Login: http://localhost:5173/admin/login
- **Pre-configured Admins:**
  - ashchugh@gmail.com
  - achugh@hotmail.com

## 🏗️ Architecture

### Backend (Python FastAPI)
- **Framework**: FastAPI
- **Database**: PostgreSQL (users, transactions)
- **ORM**: SQLAlchemy
- **Auth**: JWT with Bcrypt
- **API Docs**: Auto-generated at `/docs`

### Frontend (React)
- **Framework**: React 18
- **Routing**: React Router v6
- **State**: Zustand
- **Styling**: Tailwind CSS
- **Data Fetching**: TanStack Query

### Security
- Separate login portals (no cross-portal access)
- Role-based access control (RBAC)
- JWT authentication
- Password hashing (Bcrypt)
- Protected API endpoints

## 📊 Role Hierarchy

```
SUPER_ADMIN (ashchugh@gmail.com, achugh@hotmail.com)
    ↓
ADMIN (promoted by super admin)
    ↓
MODERATOR (content moderation only)
    ↓
COMPANY / STUDENT (separate, equal level)
```

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Python, FastAPI, SQLAlchemy |
| Frontend | React, Vite, Tailwind CSS |
| Database | PostgreSQL, MongoDB, Redis |
| Auth | JWT, Bcrypt |
| API | RESTful, Auto-documented |

## 📁 Project Structure

```
internship-platform/
├── backend-python/          # Python FastAPI backend
│   ├── app/
│   │   ├── api/v1/endpoints/
│   │   ├── models/
│   │   ├── core/
│   │   └── db/
│   └── requirements.txt
│
├── frontend/                # React frontend
│   ├── src/
│   │   ├── pages/
│   │   │   ├── student/
│   │   │   ├── company/
│   │   │   └── admin/
│   │   ├── components/
│   │   └── lib/
│   └── package.json
│
├── QUICKSTART.md           # Detailed setup guide
├── ARCHITECTURE.md         # System architecture
└── README.md              # This file
```

## 🎨 Key Features Implemented

### ✅ Authentication System
- [x] Separate student/company/admin portals
- [x] JWT authentication
- [x] Role-based access control
- [x] Pre-configured super admins
- [x] Password hashing

### ✅ Student Features
- [x] Registration & login
- [x] Profile management
- [x] Browse internships
- [x] Application tracking
- [x] Dashboard

### ✅ Company Features
- [x] Registration & login
- [x] Post internships
- [x] Manage applications
- [x] Company profile
- [x] Dashboard

### ✅ Admin Features
- [x] Admin login portal
- [x] User management
- [x] Platform statistics
- [x] Suspend/activate users
- [x] Dashboard

### 🚧 Coming Soon
- [ ] Payment escrow integration
- [ ] Scam detection AI
- [ ] Trust score calculation
- [ ] Dispute resolution system
- [ ] File uploads (resume, portfolio)
- [ ] Real-time notifications
- [ ] Email/SMS alerts
- [ ] Advanced search & filters

## 📖 Documentation

- **QUICKSTART.md** - Step-by-step setup guide
- **ARCHITECTURE.md** - Detailed system design
- **API Docs** - http://localhost:8000/docs (auto-generated)

## 🧪 Testing

### Test as Student
1. Register at `/student/register`
2. Browse internships
3. Apply to positions
4. Track applications

### Test as Company
1. Register at `/company/register`
2. Post an internship
3. View applications
4. Manage candidates

### Test as Admin
1. Login at `/admin/login` with super admin email
2. View all users
3. Check platform statistics
4. Manage users

## 🐛 Troubleshooting

**Backend won't start:**
```bash
pip install -r requirements.txt --force-reinstall
```

**Frontend won't start:**
```bash
cd frontend
rm -rf node_modules
npm install
```

**Can't see homepage:**
- Check if both backend and frontend are running
- Frontend: http://localhost:5173
- Backend: http://localhost:8000

## 📞 Support

- Check API documentation: http://localhost:8000/docs
- Review QUICKSTART.md for setup help
- Check ARCHITECTURE.md for system design

---

**Built with ❤️ for student safety and empowerment**
