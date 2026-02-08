# Setup Instructions

## Prerequisites

- Node.js 18+ and npm
- Docker and Docker Compose
- Git

## Quick Start

### 1. Clone and Install

```bash
# Install root dependencies
npm install

# Install workspace dependencies
npm install --workspaces
```

### 2. Start Databases

```bash
# Start PostgreSQL, MongoDB, and Redis
docker-compose up -d

# Verify databases are running
docker-compose ps
```

### 3. Configure Environment

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your configuration
# At minimum, set JWT_SECRET to a random string
```

### 4. Initialize Database

```bash
# PostgreSQL schema is auto-loaded via docker-compose
# Verify with:
docker exec -it <postgres-container> psql -U postgres -d internship_platform -c "\dt"
```

### 5. Start Development Servers

```bash
# Terminal 1: Start backend
npm run dev:backend

# Terminal 2: Start frontend
npm run dev:frontend
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000

## Project Structure

```
/backend          - Express.js API server
  /src
    /models       - MongoDB schemas
    /routes       - API endpoints
    /services     - Business logic
    /middleware   - Auth, validation, error handling
    /config       - Database connections
    /database     - SQL schemas

/frontend         - React web application
  /src
    /pages        - Route components
    /components   - Reusable UI components
    /lib          - API client, utilities
    /store        - Zustand state management

/shared           - Shared types and utilities
```

## Key Features Implemented

### Backend
- User authentication (JWT)
- Student & Company profiles
- Internship CRUD operations
- Application management
- Trust score calculation
- Scam detection service
- Escrow payment system
- Database schemas (PostgreSQL + MongoDB)

### Frontend
- Authentication (login/register)
- Internship browsing with filters
- Student dashboard
- Company dashboard
- Application tracking
- Responsive design with Tailwind CSS

## Next Steps

1. Implement payment gateway integration
2. Add file upload for resumes/portfolios
3. Build admin moderation panel
4. Implement real-time notifications
5. Add ML-based matching algorithm
6. Create mobile app with React Native
7. Add comprehensive testing

## Development Commands

```bash
# Run backend only
npm run dev:backend

# Run frontend only
npm run dev:frontend

# Run both concurrently
npm run dev

# Build for production
npm run build

# Run tests
npm run test
```

## Troubleshooting

### Database Connection Issues
```bash
# Check if containers are running
docker-compose ps

# View logs
docker-compose logs postgres
docker-compose logs mongodb

# Restart containers
docker-compose restart
```

### Port Conflicts
If ports 3000, 5173, 5432, 27017, or 6379 are in use, update:
- Backend port in `.env` and `backend/src/server.js`
- Frontend port in `frontend/vite.config.js`
- Database ports in `docker-compose.yml`
