# Troubleshooting Guide

## Common Issues & Solutions

### 1. Register Page Shows Blank

**Symptoms**: White/blank page when visiting `/student/register` or `/company/register`

**Solutions**:

#### A. Clear Browser Cache
```
1. Press Ctrl+Shift+Delete
2. Select "Cached images and files"
3. Click "Clear data"
4. Refresh page (F5)
```

#### B. Hard Refresh
```
Press Ctrl+F5 (Windows) or Cmd+Shift+R (Mac)
```

#### C. Check Browser Console
```
1. Press F12 to open Developer Tools
2. Click "Console" tab
3. Look for red error messages
4. Share errors if you need help
```

#### D. Verify Backend is Running
```bash
# Check if backend is running
curl http://localhost:8000/health

# Should return: {"status":"ok"}
```

#### E. Restart Frontend
```bash
# Stop frontend (Ctrl+C)
cd frontend
npm run dev
```

### 2. Admin Login Failed

**Symptoms**: "Admin login failed" error

**Solutions**:

#### A. Check Backend Logs
```bash
# Backend should show no errors
# Look for password hashing errors
```

#### B. Use Correct Email
```
Only these emails work:
- ashchugh@gmail.com
- achugh@hotmail.com
```

#### C. First Time Login
```
1. Enter your super admin email
2. Enter ANY password (8+ characters)
3. System creates account automatically
4. Remember this password for future logins
```

#### D. Already Registered
```
If you already logged in once:
- Use the SAME password you set before
- Password is NOT "MySecurePass123" unless you set it
```

### 3. Backend Won't Start

**Symptoms**: Python errors when running `python run.py`

**Solutions**:

#### A. Install Dependencies
```bash
cd backend-python
pip install -r requirements.txt
```

#### B. Check Python Version
```bash
python --version
# Should be 3.9 or higher
```

#### C. Port Already in Use
```bash
# Kill process on port 8000
# Windows:
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Then restart
python run.py
```

### 4. Frontend Won't Start

**Symptoms**: npm errors or blank page

**Solutions**:

#### A. Reinstall Dependencies
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

#### B. Check Node Version
```bash
node --version
# Should be 18 or higher
```

#### C. Port Already in Use
```bash
# Change port in vite.config.js
# Or kill process on port 5173
```

### 5. CSV Import Fails

**Symptoms**: "Import failed" or errors during CSV upload

**Solutions**:

#### A. Check CSV Format
```
- Use exact column names from template
- No extra columns
- UTF-8 encoding
- Comma-separated (not semicolon)
```

#### B. Download Template
```
Use templates from:
sample-csv-templates/users-import-template.csv
sample-csv-templates/internships-import-template.csv
```

#### C. Check for Duplicates
```
- Email addresses must be unique
- Company IDs must exist
```

### 6. Can't See Internships

**Symptoms**: Internship list is empty

**Solutions**:

#### A. Check Status
```
- Internships must be "approved" and "active"
- Admin must approve company-posted internships
```

#### B. Post Test Internship
```
1. Login as company
2. Go to /company/post-internship
3. Fill form and submit
4. Login as admin
5. Approve the internship
```

### 7. Database Errors

**Symptoms**: SQLAlchemy errors or "table not found"

**Solutions**:

#### A. Delete and Recreate Database
```bash
cd backend-python
rm internship_platform.db
python run.py
# Tables will be auto-created
```

#### B. Check Database File
```bash
# Should exist in backend-python/
ls internship_platform.db
```

### 8. CORS Errors

**Symptoms**: "CORS policy" errors in browser console

**Solutions**:

#### A. Check Backend CORS Settings
```python
# In backend-python/app/main.py
# Should allow http://localhost:5173
```

#### B. Restart Both Servers
```bash
# Stop both backend and frontend
# Start backend first, then frontend
```

### 9. Token/Authentication Errors

**Symptoms**: "Invalid token" or "Unauthorized" errors

**Solutions**:

#### A. Logout and Login Again
```
1. Click Logout
2. Clear browser storage (F12 > Application > Storage > Clear)
3. Login again
```

#### B. Check Token in Storage
```
F12 > Application > Local Storage > auth-storage
Should have: user, token, isAuthenticated
```

### 10. Slow Performance

**Symptoms**: Pages load slowly

**Solutions**:

#### A. Check Database Size
```bash
# If database is large, consider cleanup
ls -lh backend-python/internship_platform.db
```

#### B. Restart Servers
```bash
# Fresh start often helps
```

#### C. Clear Browser Data
```
Clear cache and cookies
```

## Getting Help

### Check Logs

**Backend Logs**:
```bash
# Terminal where backend is running
# Look for ERROR or WARNING messages
```

**Frontend Logs**:
```
F12 > Console tab
Look for red error messages
```

### Common Error Messages

| Error | Solution |
|-------|----------|
| "Module not found" | Run `pip install -r requirements.txt` |
| "Port already in use" | Kill process or change port |
| "Invalid credentials" | Check email/password |
| "CORS error" | Restart backend |
| "Network error" | Check if backend is running |
| "Token expired" | Logout and login again |

### Still Having Issues?

1. **Check all servers are running**:
   - Backend: http://localhost:8000/health
   - Frontend: http://localhost:5173

2. **Try incognito mode**:
   - Rules out cache/extension issues

3. **Check firewall**:
   - Allow ports 8000 and 5173

4. **Restart computer**:
   - Sometimes helps with port conflicts

## Quick Health Check

Run these commands to verify everything is working:

```bash
# 1. Check backend
curl http://localhost:8000/health
# Should return: {"status":"ok"}

# 2. Check frontend
curl http://localhost:5173
# Should return HTML

# 3. Check API
curl http://localhost:8000/api/v1/admin/dashboard
# Should return JSON (if logged in) or 401 error

# 4. Check database
ls backend-python/internship_platform.db
# Should exist
```

If all checks pass, the system is working correctly!
