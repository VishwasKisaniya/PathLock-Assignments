# Testing Guide - Mini Project Manager

## Quick Start Testing

### 1. Start Both Servers

**Backend (Terminal 1):**
```bash
cd ProjectManagerAPI
dotnet run
```
✅ Backend running at: http://localhost:5102
📚 Swagger UI: http://localhost:5102/swagger

**Frontend (Terminal 2):**
```bash
cd project-manager-frontend
npm run dev
```
✅ Frontend running at: http://localhost:5173

### 2. Test User Registration

1. Open browser to http://localhost:5173
2. Click "Register here"
3. Fill in the form:
   - Username: testuser
   - Email: test@example.com
   - Password: password123
   - Confirm Password: password123
4. Click "Register"
5. Should redirect to Dashboard

### 3. Test Project Creation

1. On Dashboard, click "+ New Project"
2. Fill in:
   - Title: My First Project
   - Description: This is a test project
3. Click "Create Project"
4. Project should appear in the list

### 4. Test Task Management

1. Click "View Details" on a project
2. Click "+ Add Task"
3. Fill in:
   - Title: Setup Environment
   - Due Date: Select a future date
4. Click "Add Task"
5. Task should appear in the list

**Test Task Completion:**
- Check the checkbox next to a task
- Task title should get strikethrough

**Test Task Editing:**
1. Click "Edit" on a task
2. Modify title or due date
3. Check "Mark as completed"
4. Click "Update Task"

**Test Task Deletion:**
1. Click "Delete" on a task
2. Confirm deletion
3. Task should be removed

### 5. Test Project Deletion

1. Go back to Dashboard
2. Click "Delete" on a project
3. Confirm deletion
4. Project and all its tasks should be deleted

### 6. Test Logout

1. Click "Logout" button
2. Should redirect to login page
3. Try accessing /dashboard directly
4. Should redirect to login (protected route)

### 7. Test Login

1. On login page, enter:
   - Email: test@example.com
   - Password: password123
2. Click "Login"
3. Should redirect to Dashboard with previous data

## API Testing with Swagger

### Test Authentication Endpoints

1. Open http://localhost:5102/swagger
2. Test POST /api/auth/register:
```json
{
  "username": "apiuser",
  "email": "api@example.com",
  "password": "password123"
}
```
3. Copy the token from response
4. Click "Authorize" button at top
5. Enter: `Bearer YOUR_TOKEN_HERE`
6. Now you can test protected endpoints

### Test Smart Scheduler (Bonus Feature)

1. Create a project first (or use existing project ID)
2. Test POST /api/projects/{projectId}/schedule:
```json
{
  "tasks": [
    {
      "title": "Design Database",
      "estimatedHours": 4,
      "dueDate": "2024-12-01T00:00:00Z",
      "dependencies": []
    },
    {
      "title": "Create Models",
      "estimatedHours": 3,
      "dueDate": "2024-12-02T00:00:00Z",
      "dependencies": ["Design Database"]
    },
    {
      "title": "Build API",
      "estimatedHours": 8,
      "dueDate": "2024-12-05T00:00:00Z",
      "dependencies": ["Create Models"]
    },
    {
      "title": "Write Tests",
      "estimatedHours": 5,
      "dueDate": "2024-12-03T00:00:00Z",
      "dependencies": ["Create Models"]
    },
    {
      "title": "Deploy",
      "estimatedHours": 2,
      "dueDate": "2024-12-10T00:00:00Z",
      "dependencies": ["Build API", "Write Tests"]
    }
  ]
}
```

Expected response - tasks in optimal order:
1. Design Database
2. Create Models
3. Write Tests (earlier due date than Build API)
4. Build API
5. Deploy

## Validation Testing

### Test Registration Validation

**Username Validation:**
- Too short (< 3 chars): ❌ Should show error
- Too long (> 30 chars): ❌ Should show error
- Valid (3-30 chars): ✅ Should pass

**Email Validation:**
- Invalid format (test): ❌ Should show error
- Invalid format (test@): ❌ Should show error
- Valid (test@example.com): ✅ Should pass

**Password Validation:**
- Too short (< 6 chars): ❌ Should show error
- Passwords don't match: ❌ Should show error
- Valid (≥ 6 chars, matching): ✅ Should pass

### Test Project Validation

**Title Validation:**
- Too short (< 3 chars): ❌ Should show error
- Too long (> 100 chars): ❌ Should show error
- Valid (3-100 chars): ✅ Should pass

**Description Validation:**
- Too long (> 500 chars): ❌ Should show error
- Empty: ✅ Should pass (optional)
- Valid (≤ 500 chars): ✅ Should pass

### Test Task Validation

**Title Validation:**
- Empty: ❌ Should show error
- Too long (> 200 chars): ❌ Should show error
- Valid (≤ 200 chars): ✅ Should pass

**Due Date Validation:**
- Empty: ✅ Should pass (optional)
- Valid date: ✅ Should pass

## Error Handling Testing

### Test Network Errors

1. Stop the backend server
2. Try to login
3. Should show error message
4. Restart backend
5. Try again - should work

### Test Unauthorized Access

1. Clear localStorage in browser DevTools
2. Try to access /dashboard
3. Should redirect to /login

### Test Invalid Credentials

1. Try to login with wrong password
2. Should show "Invalid email or password"
3. Try with non-existent email
4. Should show same error

### Test Duplicate Registration

1. Register a user
2. Try to register with same email
3. Should show "User with this email or username already exists"

## Performance Testing

### Test Multiple Projects

1. Create 10-20 projects
2. Dashboard should load quickly
3. All projects should display

### Test Multiple Tasks

1. Create a project
2. Add 20-30 tasks
3. Task list should load quickly
4. Scrolling should be smooth

## Security Testing

### Test User Isolation

1. Create user1 with email user1@example.com
2. Create some projects and tasks
3. Logout
4. Register user2 with email user2@example.com
5. user2 should not see user1's projects
6. user2 should not be able to access user1's project URLs

### Test Token Expiration

1. Login and copy token
2. Use browser DevTools to modify token in localStorage
3. Try to access protected routes
4. Should redirect to login

## Database Testing

### Check Database State

```bash
cd ProjectManagerAPI
sqlite3 projectmanager.db

# List tables
.tables

# Check users
SELECT * FROM Users;

# Check projects
SELECT * FROM Projects;

# Check tasks
SELECT * FROM Tasks;

# Exit
.exit
```

## Browser Compatibility

Test on:
- ✅ Chrome/Edge (Chromium)
- ✅ Firefox
- ✅ Safari

## Mobile Responsiveness

1. Open browser DevTools
2. Toggle device toolbar (Ctrl+Shift+M)
3. Test on different screen sizes:
   - Mobile (375px)
   - Tablet (768px)
   - Desktop (1920px)

## Common Issues & Solutions

### Backend won't start
- Check if port 5102 is already in use
- Run: `lsof -ti:5102 | xargs kill -9` (Mac/Linux)
- Or change port in launchSettings.json

### Frontend won't start
- Check if port 5173 is in use
- Delete node_modules and run `npm install`
- Clear npm cache: `npm cache clean --force`

### CORS errors
- Check backend CORS configuration
- Ensure frontend URL matches allowed origins
- Check browser console for specific error

### Database not created
- Check write permissions in project directory
- Delete existing .db file and restart backend
- Check EF Core logs in terminal

## Success Criteria Checklist

✅ User can register with validation
✅ User can login with JWT token
✅ User can create projects
✅ User can view their projects
✅ User can delete projects
✅ User can create tasks in projects
✅ User can update tasks
✅ User can delete tasks
✅ User can toggle task completion
✅ Cascade delete works (deleting project deletes tasks)
✅ Protected routes redirect to login
✅ Users only see their own data
✅ Smart scheduler works with dependencies
✅ Form validation works
✅ Error messages display properly
✅ Success messages display
✅ Logout works
✅ UI is responsive

## Test Data Examples

### Sample Projects
1. Website Redesign - Redesigning company website
2. Mobile App Development - Building iOS/Android app
3. Database Migration - Migrating to new database system
4. API Integration - Integrating third-party APIs

### Sample Tasks
- Research competitors
- Create wireframes
- Design mockups
- Write documentation
- Code review
- Unit testing
- Deployment

---

Happy Testing! 🚀
