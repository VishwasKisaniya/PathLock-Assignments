# ⚡ Quick Start Guide

## 🎯 Get Running in 60 Seconds

### Option 1: Using the Startup Script (Recommended)

```bash
cd "Home Assignment 2"
./start.sh
```

✅ This will start both backend and frontend automatically!

### Option 2: Manual Start

**Terminal 1 - Backend:**
```bash
cd "Home Assignment 2/ProjectManagerAPI"
dotnet run
```

**Terminal 2 - Frontend:**
```bash
cd "Home Assignment 2/project-manager-frontend"
npm run dev
```

---

## 🌐 Access the Application

- **Frontend:** http://localhost:5173 (or :5174 if 5173 is busy)
- **Backend API:** http://localhost:5102
- **Swagger Docs:** http://localhost:5102/swagger

---

## 🚀 First Steps

1. **Open the App:** Navigate to http://localhost:5173
   
2. **Register:**
   - Click "Register here"
   - Fill in:
     - Username: `demo`
     - Email: `demo@example.com`
     - Password: `demo123`
   
3. **Create a Project:**
   - Click "+ New Project"
   - Title: "My First Project"
   - Click "Create Project"
   
4. **Add Tasks:**
   - Click "View Details" on your project
   - Click "+ Add Task"
   - Title: "First Task"
   - Click "Add Task"

5. **Explore:**
   - Toggle task completion
   - Edit tasks
   - Delete tasks
   - Create more projects

---

## 🧪 Test the Smart Scheduler

1. Open Swagger UI: http://localhost:5102/swagger
2. Click "Authorize" and enter: `Bearer YOUR_TOKEN`
   (Get token from login response in browser DevTools)
3. Try POST `/api/projects/{projectId}/schedule`
4. Use this sample data:

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
      "title": "Build API",
      "estimatedHours": 8,
      "dueDate": "2024-12-05T00:00:00Z",
      "dependencies": ["Design Database"]
    },
    {
      "title": "Create Frontend",
      "estimatedHours": 12,
      "dueDate": "2024-12-10T00:00:00Z",
      "dependencies": ["Build API"]
    }
  ]
}
```

---

## 📱 Demo Account

For quick testing, use these credentials:
- Email: `demo@example.com`
- Password: `demo123`

(Register this account first!)

---

## 🛠️ Troubleshooting

### Port Already in Use
```bash
# Kill processes on ports
lsof -ti:5102 | xargs kill -9
lsof -ti:5173 | xargs kill -9
```

### Backend Not Starting
```bash
cd ProjectManagerAPI
dotnet clean
dotnet build
dotnet run
```

### Frontend Not Starting
```bash
cd project-manager-frontend
rm -rf node_modules
npm install
npm run dev
```

### Database Issues
```bash
cd ProjectManagerAPI
rm projectmanager.db*
dotnet run  # Will recreate database
```

---

## 📚 Need More Information?

- **Full Documentation:** See `README.md`
- **Testing Guide:** See `TESTING_GUIDE.md`
- **Deployment:** See `DEPLOYMENT.md`
- **Project Summary:** See `PROJECT_SUMMARY.md`

---

## ✅ Verification Checklist

After starting, verify:
- [ ] Backend is running on port 5102
- [ ] Frontend is running on port 5173/5174
- [ ] Can access Swagger UI
- [ ] Can register a new user
- [ ] Can login
- [ ] Can create a project
- [ ] Can add tasks
- [ ] Can toggle task completion

---

## 🎉 You're Ready!

Everything is set up and ready to use. Enjoy exploring the Mini Project Manager!

**Need help?** Check the comprehensive `README.md` for detailed information.

---

**Pro Tips:**
- Use Swagger UI to test the API directly
- Check browser DevTools Console for any errors
- Database file is in `ProjectManagerAPI/projectmanager.db`
- JWT tokens expire after 7 days
- Frontend auto-redirects to login if token expires
