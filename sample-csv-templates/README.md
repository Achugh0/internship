# CSV Import Templates

## Users Import Template

**File**: `users-import-template.csv`

### Format
```csv
email,password,full_name,role
```

### Fields
- **email**: User's email address (required, unique)
- **password**: Initial password (required, min 8 characters)
- **full_name**: User's full name or company name (required)
- **role**: User role - `student`, `company`, or `admin` (required)

### Example
```csv
email,password,full_name,role
student1@example.com,ChangeMe123,John Doe,student
company1@example.com,SecurePass456,Tech Corp,company
```

### Notes
- Users will need to change their password on first login
- Duplicate emails will be skipped
- Invalid roles will cause errors

---

## Internships Import Template

**File**: `internships-import-template.csv`

### Format
```csv
company_id,title,description,stipend_amount,duration_months,work_mode,location,positions
```

### Fields
- **company_id**: UUID of the company posting (required)
- **title**: Internship title (required)
- **description**: Detailed description (required)
- **stipend_amount**: Monthly stipend in INR (required)
- **duration_months**: Duration in months (required)
- **work_mode**: `remote`, `hybrid`, or `office` (required)
- **location**: City/location (optional)
- **positions**: Number of openings (default: 1)

### Example
```csv
company_id,title,description,stipend_amount,duration_months,work_mode,location,positions
abc-123-uuid,Full Stack Developer,Build web apps,15000,6,remote,Bangalore,2
def-456-uuid,Data Science Intern,ML projects,20000,3,hybrid,Mumbai,1
```

### Notes
- Company ID must exist in the system
- Imported internships are auto-approved
- Invalid company IDs will be skipped

---

## How to Use

### In Admin Panel

1. **Navigate to User Management** or **Internship Management**
2. **Click "Bulk Import"** button
3. **Download template** (optional)
4. **Fill in your data** following the format
5. **Upload CSV file**
6. **Review results** - see created items and errors

### Tips
- Keep headers exactly as shown
- Don't add extra columns
- Use UTF-8 encoding
- Test with small batches first
- Check for errors after import
