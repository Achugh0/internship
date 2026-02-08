# InternSafe Architecture

## Authentication & Role System

### Separate Login Portals

1. **Student Portal** (`/student/login`)
   - Only students can register/login here
   - Role: `STUDENT`
   - Access: Student dashboard, applications, profile

2. **Company Portal** (`/company/login`)
   - Only companies can register/login here
   - Role: `COMPANY`
   - Access: Company dashboard, post internships, view applications

3. **Admin Portal** (`/admin/login`)
   - Restricted access for administrators
   - Roles: `ADMIN`, `MODERATOR`, `SUPER_ADMIN`
   - Access: Full platform oversight, user management, moderation

### Role Hierarchy

```
SUPER_ADMIN (ashchugh@gmail.com, achugh@hotmail.com)
    ↓
ADMIN (can be promoted by super admin)
    ↓
MODERATOR (content moderation only)
    ↓
COMPANY / STUDENT (separate, equal level)
```

### Super Admin Features

- **Pre-configured emails**: ashchugh@gmail.com, achugh@hotmail.com
- **Auto-creation**: First login creates super admin account
- **Full access**: Can manage all users, companies, internships
- **Cannot be suspended**: Protected accounts
- **Can promote**: Can make other users admins/moderators

### Security Features

1. **Portal Isolation**: Students can't login via company portal and vice versa
2. **Role Validation**: Each endpoint checks user role
3. **JWT Tokens**: Secure authentication with role embedded
4. **Password Hashing**: Bcrypt for password security
5. **Login Portal Tracking**: Each user tied to their registration portal

## API Endpoints

### Authentication
- `POST /api/v1/auth/register/student` - Student registration
- `POST /api/v1/auth/register/company` - Company registration
- `POST /api/v1/auth/login/student` - Student login
- `POST /api/v1/auth/login/company` - Company login
- `POST /api/v1/auth/login/admin` - Admin login

### Admin (Protected)
- `GET /api/v1/admin/dashboard` - Admin statistics
- `GET /api/v1/admin/users` - List all users
- `POST /api/v1/admin/users/{id}/suspend` - Suspend user
- `POST /api/v1/admin/users/{id}/activate` - Activate user

## Tech Stack

### Backend (Python)
- **FastAPI**: Modern, fast web framework
- **SQLAlchemy**: ORM for PostgreSQL
- **PostgreSQL**: User accounts, transactions, disputes
- **MongoDB**: Internships, applications, reviews
- **Redis**: Caching, sessions
- **JWT**: Authentication tokens
- **Bcrypt**: Password hashing

### Frontend (React)
- **React 18**: UI framework
- **React Router**: Routing with separate portals
- **TanStack Query**: Data fetching
- **Zustand**: State management
- **Tailwind CSS**: Styling
- **Axios**: API client

## Running the Application

### Backend (Python)
```bash
cd backend-python
pip install -r requirements.txt
python run.py
```
API: http://localhost:8000
Docs: http://localhost:8000/docs

### Frontend (React)
```bash
cd frontend
npm install
npm run dev
```
App: http://localhost:5173

## Admin Access

1. Go to: http://localhost:5173/admin/login
2. Use email: ashchugh@gmail.com or achugh@hotmail.com
3. Set your password (first time creates account)
4. Access admin dashboard

## Database Schema

### Users Table (PostgreSQL)
- id (UUID)
- email (unique)
- hashed_password
- role (enum: student, company, admin, moderator, super_admin)
- login_portal (student, company, admin)
- is_active
- is_verified
- created_at, updated_at
