# InternSafe Backend (Python FastAPI)

## Features

- ✅ FastAPI framework
- ✅ SQLAlchemy ORM
- ✅ JWT authentication
- ✅ Separate login portals (student/company/admin)
- ✅ Role-based access control
- ✅ Pre-configured super admins
- ✅ PostgreSQL support
- ✅ Automatic API documentation

## Installation

```bash
pip install -r requirements.txt
```

## Configuration

Edit `.env` file:

```env
SECRET_KEY=your-secret-key
POSTGRES_SERVER=localhost
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=internship_platform
```

## Run

```bash
python run.py
```

Server: http://localhost:8000
Docs: http://localhost:8000/docs

## API Endpoints

### Authentication
- POST `/api/v1/auth/register/student` - Student registration
- POST `/api/v1/auth/register/company` - Company registration
- POST `/api/v1/auth/login/student` - Student login
- POST `/api/v1/auth/login/company` - Company login
- POST `/api/v1/auth/login/admin` - Admin login

### Admin (Protected)
- GET `/api/v1/admin/dashboard` - Statistics
- GET `/api/v1/admin/users` - List users
- POST `/api/v1/admin/users/{id}/suspend` - Suspend user
- POST `/api/v1/admin/users/{id}/activate` - Activate user

## Super Admins

Pre-configured emails:
- ashchugh@gmail.com
- achugh@hotmail.com

First login creates the account automatically.
