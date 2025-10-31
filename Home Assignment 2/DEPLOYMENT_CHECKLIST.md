# ✅ Deployment Checklist - PathLock Project Manager

Use this checklist to ensure smooth deployment to Render and Vercel.

## 📦 Pre-Deployment Preparation

### Code & Repository
- [ ] All code changes committed
- [ ] Code pushed to GitHub main branch
- [ ] `.env` files are in `.gitignore` (not committed)
- [ ] `README.md` updated with deployment info
- [ ] All local tests passing

### Files Created/Updated
- [ ] `ProjectManagerAPI/Dockerfile` - Docker configuration for Render
- [ ] `ProjectManagerAPI/.dockerignore` - Files to exclude from Docker
- [ ] `ProjectManagerAPI/appsettings.Production.json` - Production config
- [ ] `render.yaml` - Render service configuration (optional)
- [ ] `project-manager-frontend/vercel.json` - Vercel routing config
- [ ] `project-manager-frontend/.env.production` - Production API URL
- [ ] `project-manager-frontend/src/services/api.ts` - Updated with env variables
- [ ] `DEPLOYMENT_GUIDE.md` - Full deployment instructions
- [ ] `ENV_VARIABLES.md` - Environment variables reference

---

## 🚀 Backend Deployment (Render)

### Step 1: Render Account Setup
- [ ] Created account at https://render.com
- [ ] Verified email address
- [ ] Connected GitHub account

### Step 2: Create Web Service
- [ ] Clicked "New +" → "Web Service"
- [ ] Selected GitHub repository
- [ ] Chose `main` branch
- [ ] Set root directory: `ProjectManagerAPI`
- [ ] Selected Runtime: Docker
- [ ] Dockerfile auto-detected

### Step 3: Environment Variables
Set these in Render Dashboard → Environment:

- [ ] `ASPNETCORE_ENVIRONMENT=Production`
- [ ] `ASPNETCORE_URLS=http://0.0.0.0:$PORT`
- [ ] `JWT_KEY` (32+ characters, strong random key)
- [ ] `JWT_ISSUER=ProjectManagerAPI`
- [ ] `JWT_AUDIENCE=ProjectManagerClient`
- [ ] `DATABASE_CONNECTION_STRING=Data Source=/var/data/projectmanager.db`

### Step 4: Persistent Disk
- [ ] Added disk in Disks tab
- [ ] Name: `pathlock-database`
- [ ] Mount path: `/var/data`
- [ ] Size: 1 GB

### Step 5: Deploy
- [ ] Clicked "Manual Deploy" → "Deploy latest commit"
- [ ] Waited for build to complete (5-10 minutes)
- [ ] Deployment succeeded
- [ ] Noted backend URL: `https://pathlock-project-manager-api.onrender.com`

### Step 6: Test Backend
- [ ] Visited: `https://your-backend-url.onrender.com/swagger`
- [ ] Swagger UI loads successfully
- [ ] All endpoints visible
- [ ] Tried `/api/auth/register` endpoint (optional)

---

## 🎨 Frontend Deployment (Vercel)

### Step 1: Vercel Account Setup
- [ ] Created account at https://vercel.com
- [ ] Verified email address
- [ ] Connected GitHub account

### Step 2: Import Project
- [ ] Clicked "Add New..." → "Project"
- [ ] Selected GitHub repository
- [ ] Clicked "Import"

### Step 3: Configure Build Settings
- [ ] Framework Preset: Vite (auto-detected)
- [ ] Root Directory: `project-manager-frontend`
- [ ] Build Command: `npm run build` (auto-filled)
- [ ] Output Directory: `dist` (auto-filled)
- [ ] Install Command: `npm install` (auto-filled)

### Step 4: Environment Variables
Set in Vercel → Settings → Environment Variables:

- [ ] Variable: `VITE_API_URL`
- [ ] Value: `https://your-backend-url.onrender.com/api`
- [ ] Environment: Production
- [ ] Saved variable

### Step 5: Deploy
- [ ] Clicked "Deploy"
- [ ] Waited for build (2-5 minutes)
- [ ] Deployment succeeded
- [ ] Noted frontend URL: `https://your-app-name.vercel.app`

### Step 6: Test Frontend
- [ ] Visited frontend URL
- [ ] Page loads without errors
- [ ] Login page displays correctly
- [ ] Checked browser console (no errors)

---

## 🔧 Post-Deployment Configuration

### Update Backend CORS
- [ ] Updated `appsettings.Production.json` with Vercel URL:
  ```json
  {
    "AllowedOrigins": [
      "https://your-actual-vercel-url.vercel.app"
    ]
  }
  ```
- [ ] Committed and pushed changes
- [ ] Render auto-redeployed
- [ ] Waited for redeploy to complete

### Final Testing
- [ ] Visited frontend URL
- [ ] Registered new test account
- [ ] Logged in successfully
- [ ] Created a project
- [ ] Added tasks to project
- [ ] Tested dark mode toggle
- [ ] Checked all pages:
  - [ ] Dashboard
  - [ ] Projects
  - [ ] Project Details
  - [ ] Profile
  - [ ] Tasks
  - [ ] Resources
  - [ ] Time Log
  - [ ] Templates
- [ ] Tested on mobile device/responsive view
- [ ] Verified auto-refresh (wait 30 seconds)

---

## 🛡️ Security Verification

- [ ] No `.env` files in GitHub repository
- [ ] JWT_KEY is strong (32+ random characters)
- [ ] CORS only allows specific Vercel domain
- [ ] HTTPS enabled (automatic on both platforms)
- [ ] API requires authentication for protected routes
- [ ] No sensitive data in client-side code

---

## 📊 Optional: Monitoring Setup

### Keep Render Awake (Free Tier)
- [ ] Signed up for UptimeRobot (https://uptimerobot.com)
- [ ] Added monitor for Render backend URL
- [ ] Set check interval to 10 minutes
- [ ] Monitor active

### Analytics (Optional)
- [ ] Enabled Vercel Analytics
- [ ] Set up error tracking
- [ ] Configured performance monitoring

---

## 🎯 Custom Domain (Optional)

### Vercel Custom Domain
- [ ] Added domain in Vercel Settings
- [ ] Configured DNS records
- [ ] SSL certificate generated
- [ ] Domain verified

### Render Custom Domain
- [ ] Added domain in Render Settings
- [ ] Configured DNS records
- [ ] SSL certificate issued
- [ ] Domain verified

### Update CORS for Custom Domain
- [ ] Updated backend CORS with custom domain
- [ ] Redeployed backend
- [ ] Tested with custom domain

---

## 📝 Documentation Updates

- [ ] Updated README.md with deployment URLs
- [ ] Documented any custom configurations
- [ ] Added deployment badges (optional)
- [ ] Updated environment variable docs

---

## 🐛 Troubleshooting Completed

If you encountered issues, mark resolved:

- [ ] CORS errors → Fixed by updating AllowedOrigins
- [ ] Database not persisting → Fixed by adding persistent disk
- [ ] Environment variables not loading → Fixed by redeploying
- [ ] 404 on routes → Fixed by vercel.json configuration
- [ ] API connection failed → Fixed by updating VITE_API_URL
- [ ] Build errors → Fixed by updating dependencies

---

## ✅ Deployment Complete!

### Your Live URLs:

**Backend API**: https://pathlock-project-manager-api.onrender.com
**Frontend App**: https://your-app-name.vercel.app
**Swagger Docs**: https://pathlock-project-manager-api.onrender.com/swagger

### Share Your App:
- [ ] Tested with real users
- [ ] Collected feedback
- [ ] Shared with team/client
- [ ] Added to portfolio

---

## 📞 Support & Resources

- **Render Status**: https://status.render.com
- **Vercel Status**: https://www.vercel-status.com
- **Render Docs**: https://render.com/docs
- **Vercel Docs**: https://vercel.com/docs

---

**Deployment Date**: _______________
**Deployed By**: Vishwas Kisaniya
**Project**: PathLock Project Manager

🎉 Congratulations on your successful deployment!
