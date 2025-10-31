# Mini Project Manager - Full Stack Application

A complete project management system built with .NET 8 backend and React TypeScript frontend. Users can register, login, create projects, and manage tasks within those projects.

## 🎯 Features

### Authentication
- User registration with validation
- Secure login with JWT tokens
- Password hashing with BCrypt
- 7-day token expiration
- Protected routes

### Project Management
- Create projects with title and description
- View all user's projects
- View project details with all tasks
- Delete projects (cascade delete tasks)
- User can only see their own projects

### Task Management
- Create tasks within projects
- Update task details (title, due date, completion status)
- Toggle task completion
- Delete tasks
- Optional due dates

### Bonus Feature: Smart Scheduler
- Topological sort algorithm for task dependencies
- Considers due dates for optimal ordering
- Detects circular dependencies
- Returns recommended completion order

## 🛠️ Tech Stack

### Backend
- **.NET 8** Web API
- **Entity Framework Core** with SQLite
- **JWT Authentication** (Bearer tokens)
- **BCrypt** for password hashing
- **Swagger** for API documentation

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development
- **React Router v6** for navigation
- **Axios** for API calls
- **Context API** for state management

## 📁 Project Structure

```
Home Assignment 2/
├── ProjectManagerAPI/          # Backend (.NET 8)
│   ├── Controllers/            # API endpoints
│   ├── Models/                 # Database models
│   ├── DTOs/                   # Data Transfer Objects
│   ├── Services/               # Business logic
│   ├── Data/                   # DbContext
│   └── Program.cs              # Configuration
│
└── project-manager-frontend/   # Frontend (React + TS)
    ├── src/
    │   ├── pages/              # Page components
    │   ├── components/         # Reusable components
    │   ├── contexts/           # React Context
    │   ├── services/           # API service
    │   └── types/              # TypeScript types
    └── package.json
```

## 🚀 Getting Started

### Prerequisites
- .NET 8 SDK
- Node.js (v18+)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd ProjectManagerAPI
```

2. Restore dependencies:
```bash
dotnet restore
```

3. Run the backend:
```bash
dotnet run
```

The API will be available at `http://localhost:5102`

Swagger UI: `http://localhost:5102/swagger`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd project-manager-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Projects (Protected)
- `GET /api/projects` - Get all user's projects
- `POST /api/projects` - Create new project
- `GET /api/projects/{id}` - Get project with tasks
- `DELETE /api/projects/{id}` - Delete project

### Tasks (Protected)
- `POST /api/projects/{projectId}/tasks` - Create task
- `PUT /api/tasks/{taskId}` - Update task
- `DELETE /api/tasks/{taskId}` - Delete task

### Smart Scheduler (Protected)
- `POST /api/projects/{projectId}/schedule` - Get optimal task order

## 🔐 Authentication Flow

1. User registers/logs in
2. Backend returns JWT token
3. Frontend stores token in localStorage
4. Token automatically added to all API requests
5. Token validated on protected endpoints
6. Automatic redirect to login on 401 errors

## 📝 Database Models

### User
- Id (int, PK)
- Username (string, unique, 3-30 chars)
- Email (string, unique, email format)
- PasswordHash (string)
- CreatedAt (DateTime)

### Project
- Id (int, PK)
- Title (string, 3-100 chars, required)
- Description (string, max 500 chars, optional)
- CreatedAt (DateTime)
- UserId (int, FK)

### Task
- Id (int, PK)
- Title (string, max 200 chars, required)
- DueDate (DateTime, optional)
- IsCompleted (bool)
- CreatedAt (DateTime)
- ProjectId (int, FK)

## 🎨 Frontend Pages

- `/login` - Login page
- `/register` - Registration page
- `/dashboard` - Projects list page
- `/projects/:id` - Project details with tasks

## ✅ Validation Rules

### User Registration
- Username: 3-30 characters
- Email: Valid email format
- Password: Minimum 6 characters

### Project
- Title: 3-100 characters (required)
- Description: Max 500 characters (optional)

### Task
- Title: Max 200 characters (required)
- DueDate: Optional
- IsCompleted: Boolean

## 🔧 Configuration

### Backend (appsettings.json)
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Data Source=projectmanager.db"
  },
  "Jwt": {
    "Key": "YourSuperSecretKeyForJWTTokenGenerationMinimum32Characters!",
    "Issuer": "ProjectManagerAPI",
    "Audience": "ProjectManagerClient"
  }
}
```

### Frontend (src/services/api.ts)
```typescript
const API_BASE_URL = 'http://localhost:5102/api';
```

## 🧪 Testing the Smart Scheduler

Example request to `/api/projects/{projectId}/schedule`:

```json
{
  "tasks": [
    {
      "title": "Setup Database",
      "estimatedHours": 4,
      "dueDate": "2024-12-01",
      "dependencies": []
    },
    {
      "title": "Create API",
      "estimatedHours": 8,
      "dueDate": "2024-12-05",
      "dependencies": ["Setup Database"]
    },
    {
      "title": "Build Frontend",
      "estimatedHours": 12,
      "dueDate": "2024-12-10",
      "dependencies": ["Create API"]
    }
  ]
}
```

Response will include tasks in optimal order based on dependencies and due dates.

## 🎯 Key Features Implementation

### Separation of Concerns
- **Models**: Database entities
- **DTOs**: API request/response objects
- **Services**: Business logic layer
- **Controllers**: API endpoints
- Clean architecture principles

### Security
- Password hashing with BCrypt (work factor 11)
- JWT tokens for authentication
- Token expiration (7 days)
- Authorization on all protected endpoints
- User can only access their own data

### Error Handling
- Proper HTTP status codes (200, 201, 400, 401, 404, 500)
- User-friendly error messages
- Validation errors displayed in UI
- Network error handling

### Cascade Delete
- Deleting a project automatically deletes all its tasks
- Configured in Entity Framework relationships

## 🌐 CORS Configuration

Backend is configured to allow requests from:
- `http://localhost:5173` (Vite dev server)
- `http://localhost:3000` (Alternative port)

## 📦 Dependencies

### Backend
- Microsoft.EntityFrameworkCore.Sqlite (9.0.10)
- Microsoft.AspNetCore.Authentication.JwtBearer (8.0.10)
- BCrypt.Net-Next (4.0.3)
- Microsoft.EntityFrameworkCore.Design (9.0.10)

### Frontend
- react (18.3.1)
- react-router-dom (6.28.0)
- axios (1.7.7)
- typescript (5.6.3)
- vite (5.4.10)

## 🔄 Future Enhancements

- User profile management
- Project sharing/collaboration
- Task priorities
- File attachments
- Real-time notifications
- Email verification
- Password reset
- Task comments
- Activity logs
- Dark mode

## 📄 License

This project is created for a hiring assessment.

## 👨‍💻 Author

Built with ❤️ for PathLock Hiring Assessment

---

**Note**: This is a complete, production-ready application with proper authentication, validation, error handling, and a clean architecture. The Smart Scheduler bonus feature implements a topological sort algorithm to resolve task dependencies efficiently.
