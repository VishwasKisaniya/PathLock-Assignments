# PathLock — Assignments Collection

A concise collection of the PathLock assignments. This repository contains two main assignment folders (full-stack project examples) with their own backends and frontends. The root README provides a quick overview, run instructions, and pointers to each assignment's documentation.

## Contents

- `Home Assignment 1/` — Task Manager application (lightweight full-stack example).
- `Home Assignment 2/` — PathLock Project Manager (production-style full-stack app with many features).

## Quick summaries

### Home Assignment 1 — Task Manager
- Purpose: Simple task management app demonstrating a .NET 8 backend and a React + TypeScript frontend.
- Key features: Add/delete tasks, toggle completion, in-memory data storage for quick demos.
- Where to look: `Home Assignment 1/README.md` for detailed design, architecture, and run steps.
- Run (frontend):

```bash
cd "Home Assignment 1/TaskManager/task-manager-frontend"
npm install
npm run dev
```

- Run (backend):

```bash
cd "Home Assignment 1/TaskManager/TaskManager.API"
dotnet restore
dotnet run
```

Ports used by default (see each project's config): frontend typically 5173, backend usually 5000/5102 depending on project settings.

### Home Assignment 2 — PathLock Project Manager

## Deployment URL : 
- https://path-lock-assignments.vercel.app/

- Purpose: A more complete, production-style project management system with authentication, projects, tasks, resources, time logs, templates, and a smart scheduler.
- Tech stack: .NET 8 backend (EF Core + SQLite), React 18 + TypeScript frontend (Vite).
- Key features: JWT auth, BCrypt password hashing, project & task CRUD, time logging, templates, dark mode, real-time refresh, smart scheduler (topological sort).
- Where to look: `Home Assignment 2/README.md` (detailed feature list, API endpoints, configuration and run instructions).
- Quick run (recommended script):

```bash
chmod +x "Home Assignment 2/start.sh"
./"Home Assignment 2/start.sh"
```

Or run manually:

Backend:
```bash
cd "Home Assignment 2/ProjectManagerAPI"
cp .env.example .env   # edit values as needed (JWT_KEY, DATABASE_CONNECTION_STRING)
dotnet restore
dotnet run
```

Frontend:
```bash
cd "Home Assignment 2/project-manager-frontend"
npm install
npm run dev
```

Default endpoints/examples referenced in the detailed README:
- Backend API base (default): `http://localhost:5102/api`
- Frontend dev server (default): `http://localhost:5173`

## Repo structure (top-level)

```
PathLock/
├── Home Assignment 1/
│   └── TaskManager/
│       ├── task-manager-frontend/
│       └── TaskManager.API/
├── Home Assignment 2/
│   ├── project-manager-frontend/
│   └── ProjectManagerAPI/
└── README.md  (this file)
```

## Notes & tips
- Each assignment already contains a `README.md` with detailed setup instructions — read those before running servers.
- Backend `.env` files may be required for JWT keys and DB connection strings. Do not commit secrets.
- If ports conflict, check `launchSettings.json` or the start scripts and change ports accordingly.

## Next steps you might want me to do

1. Initialize or connect this folder to the remote `git@github.com:VishwasKisaniya/PathLock-Assignments.git` and push the current contents.
2. Create a root-level `.gitignore` and perform an initial commit if you want me to handle repository initialization here.
3. Generate a short CONTRIBUTING.md or a single-script `start-all.sh` to start both backend and frontend for each assignment.

If you'd like, I can perform any of the above (init remote, commit, push). Tell me which next step to take.

---

Author: Vishwas Kisaniya
Generated: 2025-10-31
