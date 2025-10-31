# PathLock Project Manager - Full Stack Application

A modern, comprehensive project management system built with .NET 8 backend and React TypeScript frontend. Features include project tracking, task management, resource allocation, time logging, templates, and real-time updates with dark mode support.

## Deployment URL : 
- https://path-lock-assignments.vercel.app/

## 🎯 Features

### 🔐 Authentication & Authorization
- Secure user registration with validation
- JWT token-based authentication
- Password hashing with BCrypt
- 7-day token expiration
- Protected routes with automatic redirect
- Authorization middleware

### 📊 Dashboard & Analytics
- **Real-time Statistics**: Project counts, task completion rates, and hours tracked
- **Auto-refresh**: Data updates every 30 seconds automatically
- **User Profile**: Real-time hours calculation based on account creation date
- **Quick Overview**: Active projects, pending tasks, and recent activity
- **Dark Mode**: System-wide theme toggle with localStorage persistence

### 📁 Project Management
- Create projects with title, description, status, and priority
- Edit project details inline
- View all user's projects with filtering
- Project details page with comprehensive task view
- Delete projects (cascade delete tasks)
- Project status tracking (Not Started, In Progress, On Hold, Completed, Cancelled)
- Priority levels (Low, Medium, High, Critical)
- Start and end date management
- User can only see their own projects

### ✅ Task Management
- Create tasks within projects with estimated hours
- Update task details (title, description, due date, status, priority)
- Task dependencies management with multi-select dropdown
- Toggle task completion status
- Delete tasks individually
- Task status tracking (To Do, In Progress, Completed, Blocked)
- Priority assignment (Low, Medium, High, Critical)
- Progress percentage tracking
- Assignee management

### 👥 Resource Management
- Add team members with roles and skills
- Track resource availability
- Assign resources to projects
- View resource allocation and utilization
- Edit and delete resources
- Skills and expertise tracking

### ⏱️ Time Logging
- Log time spent on tasks
- Track work hours with dates
- Add descriptions to time entries
- View all time logs by project and task
- Edit and delete time entries
- Total hours calculation

### 📋 Project Templates
- Create reusable project templates
- Template categories (Web Development, Mobile App, Data Science, Marketing, etc.)
- Save project structures for quick setup
- Use templates to create new projects
- Edit and delete templates
- Template description and metadata

### 🎨 UI/UX Features
- **Dark Mode**: Complete dark theme support across all pages
- **Responsive Design**: Mobile-first design that works on all devices
- **Collapsible Sidebar**: Space-efficient navigation
- **Smooth Animations**: fadeInScale animations for better UX
- **Modern Color Scheme**: Professional blue accent (#3b82f6) with dark (#0f172a) and light (#f8fafc) themes
- **Consistent Styling**: Unified design language across all components

### ⚡ Real-time Updates
- Automatic data refresh every 30 seconds
- Real-time statistics calculation
- Live project and task updates
- Profile hours based on actual account creation time

### 🔧 Bonus Feature: Smart Scheduler
- Topological sort algorithm for task dependencies
- Considers due dates for optimal ordering
- Detects circular dependencies
- Returns recommended completion order
- Efficient dependency resolution

## 🛠️ Tech Stack

### Backend
- **.NET 8** Web API
- **Entity Framework Core** with SQLite
- **JWT Authentication** (Bearer tokens with 7-day expiration)
- **BCrypt** for password hashing (work factor 11)
- **Swagger** for API documentation
- **CORS** configured for local development
- **Environment Variables** support via .env file

### Frontend
- **React 18.3** with TypeScript 5.5
- **Vite 5.4** for fast development and optimized builds
- **React Router v6** for navigation
- **Axios** for API calls with interceptors
- **Context API** for global state management (Theme, Auth)
- **CSS-in-JS** for component styling
- **localStorage** for theme and token persistence

## 📁 Project Structure

```
Home Assignment 2/
├── ProjectManagerAPI/              # Backend (.NET 8)
│   ├── Controllers/                # API endpoints
│   │   ├── AuthController.cs       # Registration & Login
│   │   ├── ProjectsController.cs   # Project CRUD operations
│   │   ├── TasksController.cs      # Task management
│   │   ├── ResourcesController.cs  # Resource allocation
│   │   ├── TimeLogsController.cs   # Time tracking
│   │   └── TemplatesController.cs  # Project templates
│   ├── Models/                     # Database models
│   │   ├── User.cs                 # User entity
│   │   ├── Project.cs              # Project entity
│   │   ├── Task.cs                 # Task entity
│   │   ├── Resource.cs             # Resource entity
│   │   ├── TimeLog.cs              # Time log entity
│   │   └── Template.cs             # Template entity
│   ├── DTOs/                       # Data Transfer Objects
│   ├── Services/                   # Business logic
│   │   ├── AuthService.cs          # Authentication logic
│   │   └── SchedulerService.cs     # Smart scheduler
│   ├── Data/                       # DbContext
│   │   └── ApplicationDbContext.cs
│   ├── .env                        # Environment variables
│   ├── .env.example                # Environment template
│   └── Program.cs                  # App configuration
│
├── project-manager-frontend/       # Frontend (React + TS)
│   ├── src/
│   │   ├── pages/                  # Page components
│   │   │   ├── Login.tsx           # Login page
│   │   │   ├── Register.tsx        # Registration page
│   │   │   ├── Dashboard.tsx       # Main dashboard
│   │   │   ├── ProjectDetails.tsx  # Project details view
│   │   │   ├── Profile.tsx         # User profile
│   │   │   ├── Tasks.tsx           # Tasks overview
│   │   │   ├── Resources.tsx       # Resource management
│   │   │   ├── TimeLog.tsx         # Time logging
│   │   │   └── Templates.tsx       # Project templates
│   │   ├── components/             # Reusable components
│   │   │   ├── Layout.tsx          # Main layout with sidebar
│   │   │   ├── Sidebar.tsx         # Navigation sidebar
│   │   │   └── ProtectedRoute.tsx  # Route protection
│   │   ├── contexts/               # React Context
│   │   │   ├── AuthContext.tsx     # Authentication state
│   │   │   └── ThemeContext.tsx    # Dark mode state
│   │   ├── services/               # API service
│   │   │   └── api.ts              # Axios config & API calls
│   │   └── types/                  # TypeScript types
│   └── package.json
│
├── start.sh                        # Quick start script
└── README.md                       # Documentation
```

## 🚀 Getting Started

### Prerequisites
- **.NET 8 SDK** - [Download here](https://dotnet.microsoft.com/download)
- **Node.js (v18+)** - [Download here](https://nodejs.org/)
- **npm** or **yarn**

### Quick Start (Recommended)

Use the automated start script:

```bash
chmod +x start.sh
./start.sh
```

This will:
1. Start the backend on `http://localhost:5102`
2. Start the frontend on `http://localhost:5173`
3. Open Swagger UI at `http://localhost:5102/swagger`

### Manual Setup

#### Backend Setup

1. Navigate to the backend directory:
```bash
cd ProjectManagerAPI
```

2. Configure environment variables (copy and edit):
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```properties
# JWT Configuration
JWT_KEY=YourSuperSecretKeyForJWTTokenGenerationMinimum32Characters!
JWT_ISSUER=ProjectManagerAPI
JWT_AUDIENCE=ProjectManagerClient

# Database
DATABASE_CONNECTION_STRING=Data Source=projectmanager.db
```

3. Restore dependencies:
```bash
dotnet restore
```

4. Run the backend:
```bash
dotnet run
```

**Backend will be available at:**
- API: `http://localhost:5102`
- Swagger UI: `http://localhost:5102/swagger`

#### Frontend Setup

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

**Frontend will be available at:** `http://localhost:5173`

### First Time Usage

1. Open `http://localhost:5173` in your browser
2. Click **"Sign up"** to create a new account
3. Fill in username, email, and password
4. Login with your credentials
5. Start creating projects and managing tasks!

## 📡 API Endpoints

### Authentication (Public)
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and receive JWT token

### Projects (Protected - Requires JWT)
- `GET /api/projects` - Get all user's projects
- `POST /api/projects` - Create new project
- `GET /api/projects/{id}` - Get project details with tasks
- `PUT /api/projects/{id}` - Update project
- `DELETE /api/projects/{id}` - Delete project (cascade deletes tasks)
- `GET /api/projects/stats` - Get project statistics

### Tasks (Protected - Requires JWT)
- `GET /api/tasks` - Get all user's tasks
- `POST /api/projects/{projectId}/tasks` - Create task in project
- `GET /api/tasks/{id}` - Get task details
- `PUT /api/tasks/{id}` - Update task
- `DELETE /api/tasks/{id}` - Delete task
- `PATCH /api/tasks/{id}/toggle` - Toggle task completion

### Resources (Protected - Requires JWT)
- `GET /api/resources` - Get all resources
- `POST /api/resources` - Create new resource
- `GET /api/resources/{id}` - Get resource details
- `PUT /api/resources/{id}` - Update resource
- `DELETE /api/resources/{id}` - Delete resource

### Time Logs (Protected - Requires JWT)
- `GET /api/timelogs` - Get all time logs
- `POST /api/timelogs` - Create time log entry
- `GET /api/timelogs/{id}` - Get time log details
- `PUT /api/timelogs/{id}` - Update time log
- `DELETE /api/timelogs/{id}` - Delete time log
- `GET /api/timelogs/project/{projectId}` - Get time logs for project

### Templates (Protected - Requires JWT)
- `GET /api/templates` - Get all templates
- `POST /api/templates` - Create new template
- `GET /api/templates/{id}` - Get template details
- `PUT /api/templates/{id}` - Update template
- `DELETE /api/templates/{id}` - Delete template
- `POST /api/templates/{id}/use` - Create project from template

### Smart Scheduler (Protected - Requires JWT)
- `POST /api/projects/{projectId}/schedule` - Get optimal task order based on dependencies

## 🔐 Authentication Flow

1. User registers/logs in
2. Backend returns JWT token
3. Frontend stores token in localStorage
4. Token automatically added to all API requests
5. Token validated on protected endpoints
6. Automatic redirect to login on 401 errors

## 📝 Database Models

### User
- **Id** (int, PK) - Primary key
- **Username** (string, unique, 3-30 chars) - Unique username
- **Email** (string, unique, email format) - User email
- **PasswordHash** (string) - BCrypt hashed password
- **CreatedAt** (DateTime) - Account creation timestamp
- **Relationships**: Has many Projects, Resources, TimeLogs, Templates

### Project
- **Id** (int, PK) - Primary key
- **Title** (string, 3-100 chars, required) - Project title
- **Description** (string, max 500 chars, optional) - Project description
- **Status** (enum) - Not Started, In Progress, On Hold, Completed, Cancelled
- **Priority** (enum) - Low, Medium, High, Critical
- **StartDate** (DateTime, optional) - Project start date
- **EndDate** (DateTime, optional) - Project end date
- **CreatedAt** (DateTime) - Creation timestamp
- **UserId** (int, FK) - Owner user ID
- **Relationships**: Has many Tasks, belongs to User

### Task
- **Id** (int, PK) - Primary key
- **Title** (string, max 200 chars, required) - Task title
- **Description** (string, optional) - Task details
- **Status** (enum) - To Do, In Progress, Completed, Blocked
- **Priority** (enum) - Low, Medium, High, Critical
- **DueDate** (DateTime, optional) - Task due date
- **EstimatedHours** (decimal, optional) - Estimated time
- **Progress** (int, 0-100) - Completion percentage
- **Assignee** (string, optional) - Assigned team member
- **Dependencies** (string, optional) - Comma-separated task IDs
- **IsCompleted** (bool) - Completion status
- **CreatedAt** (DateTime) - Creation timestamp
- **ProjectId** (int, FK) - Parent project ID
- **Relationships**: Belongs to Project, has many TimeLogs

### Resource
- **Id** (int, PK) - Primary key
- **Name** (string, required) - Resource name
- **Role** (string, required) - Job role/title
- **Email** (string, required) - Contact email
- **Skills** (string, optional) - Comma-separated skills
- **Availability** (enum) - Full-time, Part-time, Contractor, Unavailable
- **CreatedAt** (DateTime) - Creation timestamp
- **UserId** (int, FK) - Owner user ID
- **Relationships**: Belongs to User

### TimeLog
- **Id** (int, PK) - Primary key
- **TaskId** (int, FK) - Associated task ID
- **ProjectId** (int, FK) - Associated project ID
- **Hours** (decimal, required) - Hours worked
- **Date** (DateTime, required) - Work date
- **Description** (string, optional) - Work description
- **CreatedAt** (DateTime) - Creation timestamp
- **UserId** (int, FK) - User who logged time
- **Relationships**: Belongs to User, Task, Project

### Template
- **Id** (int, PK) - Primary key
- **Name** (string, required) - Template name
- **Description** (string, optional) - Template description
- **Category** (enum) - Web Development, Mobile App, Data Science, Marketing, etc.
- **Content** (string, optional) - Template content/structure
- **CreatedAt** (DateTime) - Creation timestamp
- **UserId** (int, FK) - Creator user ID
- **Relationships**: Belongs to User

## 🎨 Frontend Pages & Routes

### Public Routes
- **`/login`** - User login with centered modern design
- **`/register`** - User registration with validation

### Protected Routes (Requires Authentication)
- **`/dashboard`** - Main dashboard with statistics and project overview
- **`/projects`** - All projects list with filtering
- **`/projects/:id`** - Detailed project view with tasks and dependencies
- **`/profile`** - User profile with real-time hours calculation
- **`/tasks`** - Tasks overview across all projects
- **`/resources`** - Resource management and allocation
- **`/timelog`** - Time logging interface
- **`/templates`** - Project templates library

### Features Across All Pages
- **Dark Mode Toggle** - Available in sidebar, persists in localStorage
- **Responsive Design** - Mobile-first approach, collapsible sidebar
- **Real-time Updates** - Auto-refresh every 30 seconds
- **Smooth Animations** - fadeInScale animations on page load
- **Protected Navigation** - Automatic redirect to login if unauthorized

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

### Backend Environment Variables (.env)

Create a `.env` file in the `ProjectManagerAPI` directory:

```properties
# JWT Configuration
JWT_KEY=YourSuperSecretKeyForJWTTokenGenerationMinimum32Characters!
JWT_ISSUER=ProjectManagerAPI
JWT_AUDIENCE=ProjectManagerClient

# Database Configuration
DATABASE_CONNECTION_STRING=Data Source=projectmanager.db
```

**Note**: The `.env` file is loaded automatically on application startup. Environment variables take precedence over `appsettings.json`.

### Backend (appsettings.json) - Fallback Configuration
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Data Source=projectmanager.db"
  },
  "Jwt": {
    "Key": "YourSuperSecretKeyForJWTTokenGenerationMinimum32Characters!",
    "Issuer": "ProjectManagerAPI",
    "Audience": "ProjectManagerClient",
    "ExpiryDays": 7
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  }
}
```

### Frontend Configuration

**API Base URL** (src/services/api.ts):
```typescript
const API_BASE_URL = 'http://localhost:5102/api';
```

**Axios Interceptors**:
- Automatically adds JWT token to all requests
- Handles 401 unauthorized errors with redirect to login
- Manages token from localStorage

**Theme Persistence**:
- Dark mode preference saved in localStorage
- Auto-loads on application start

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
- **Microsoft.EntityFrameworkCore.Sqlite** (9.0.10) - SQLite database provider
- **Microsoft.AspNetCore.Authentication.JwtBearer** (8.0.10) - JWT authentication
- **BCrypt.Net-Next** (4.0.3) - Password hashing
- **Microsoft.EntityFrameworkCore.Design** (9.0.10) - EF Core tools
- **Swashbuckle.AspNetCore** (6.5.0) - Swagger/OpenAPI documentation

### Frontend
- **react** (18.3.1) - UI library
- **react-dom** (18.3.1) - React DOM renderer
- **react-router-dom** (6.28.0) - Client-side routing
- **axios** (1.7.7) - HTTP client with interceptors
- **typescript** (5.6.3) - Type safety
- **vite** (5.4.10) - Build tool and dev server
- **@types/react** (18.3.12) - React TypeScript definitions
- **@types/react-dom** (18.3.1) - React DOM TypeScript definitions

## � Implemented Features

✅ **User Authentication** - Registration and login with JWT
✅ **Project Management** - Full CRUD operations
✅ **Task Management** - Create, update, delete with dependencies
✅ **Resource Management** - Team member allocation
✅ **Time Logging** - Track hours spent on tasks
✅ **Project Templates** - Reusable project structures
✅ **Dark Mode** - Complete theme toggle
✅ **Real-time Updates** - Auto-refresh every 30 seconds
✅ **Responsive Design** - Mobile-first approach
✅ **Smart Scheduler** - Topological sort for task dependencies
✅ **User Profile** - Real-time statistics
✅ **Task Dependencies** - Multi-select dropdown
✅ **Environment Variables** - .env file support

## 🔮 Future Enhancements

- Project sharing/collaboration with multiple users
- File attachments for tasks and projects
- Real-time notifications using SignalR
- Email notifications for task deadlines
- Task comments and discussion threads
- Activity logs and audit trail
- Advanced reporting and charts
- Calendar view for tasks and deadlines
- Gantt chart visualization
- Export functionality (PDF, Excel)
- Mobile app (React Native)
- Role-based access control (Admin, Manager, User)


## 🎯 Key Highlights

### Architecture
- **Clean Architecture**: Separation of concerns with Controllers, Services, and Data layers
- **Dependency Injection**: Built-in DI container for service management
- **Repository Pattern**: Data access abstraction with Entity Framework
- **DTO Pattern**: Request/response separation from database models

### Security
- **Password Hashing**: BCrypt with work factor 11
- **JWT Authentication**: Secure token-based authentication
- **Authorization**: Protected endpoints with [Authorize] attribute
- **CORS Configuration**: Controlled cross-origin access
- **Data Isolation**: Users can only access their own data

### Performance
- **Auto-refresh Strategy**: Efficient 30-second polling with Promise.all
- **Optimized Queries**: Includes related data to minimize database calls
- **Cascade Operations**: Efficient deletion with cascade delete
- **Client-side Caching**: localStorage for theme and auth token

### User Experience
- **Consistent Design**: Unified color scheme and component styling
- **Smooth Animations**: fadeInScale animations for better UX
- **Responsive Layout**: Mobile-first design with collapsible sidebar
- **Real-time Feedback**: Instant updates and validation messages
- **Dark Mode**: Complete theme support with persistence

### Code Quality
- **TypeScript**: Full type safety on frontend
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Validation**: Client and server-side validation
- **Clean Code**: Consistent naming and structure
- **Documentation**: Comprehensive README and code comments

## 🧪 Testing the Application

### Test User Registration
```bash
POST http://localhost:5102/api/auth/register
Content-Type: application/json

{
  "username": "testuser",
  "email": "test@example.com",
  "password": "Test123!"
}
```

### Test Login
```bash
POST http://localhost:5102/api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "Test123!"
}
```

### Test Smart Scheduler
```bash
POST http://localhost:5102/api/projects/{projectId}/schedule
Authorization: Bearer {your-jwt-token}
Content-Type: application/json

{
  "tasks": [
    {
      "title": "Design Database Schema",
      "estimatedHours": 4,
      "dueDate": "2025-11-05",
      "dependencies": []
    },
    {
      "title": "Implement Backend API",
      "estimatedHours": 8,
      "dueDate": "2025-11-10",
      "dependencies": ["Design Database Schema"]
    },
    {
      "title": "Build Frontend UI",
      "estimatedHours": 12,
      "dueDate": "2025-11-15",
      "dependencies": ["Implement Backend API"]
    }
  ]
}
```

## 📸 Screenshots

### Dashboard (Light Mode)
- Project overview with statistics
- Quick access to recent projects
- Real-time task completion metrics

### Dashboard (Dark Mode)
- Professional dark theme (#0f172a)
- Easy on the eyes for extended use
- Consistent color scheme throughout

### Project Details
- Comprehensive task view
- Dependency management with multi-select
- Task status and priority tracking

### Responsive Design
- Mobile-friendly sidebar that collapses
- Adapts to all screen sizes
- Touch-friendly interface

## 🐛 Troubleshooting

### Backend Issues

**Database not found:**
```bash
cd ProjectManagerAPI
dotnet ef database update
```

**Port already in use:**
- Change port in `launchSettings.json`
- Or kill the process using port 5102

**JWT errors:**
- Ensure JWT_KEY in .env is at least 32 characters
- Check token expiration (default 7 days)

### Frontend Issues

**API connection failed:**
- Verify backend is running on port 5102
- Check CORS configuration in Program.cs
- Ensure API_BASE_URL is correct in api.ts

**Dark mode not persisting:**
- Check browser localStorage is enabled
- Clear browser cache and try again

**Build errors:**
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

## 👨‍💻 Author

**Vishwas Kisaniya**

Built with ❤️ for PathLock Home Assignment

---

## 📄 License

This project is for educational and evaluation purposes as part of the PathLock hiring process.

---

**Note**: This is a complete, production-ready application with proper authentication, authorization, validation, error handling, and clean architecture. Features include real-time updates, dark mode, responsive design, and a smart scheduler using topological sort for dependency resolution. The application demonstrates full-stack development skills with modern best practices.
