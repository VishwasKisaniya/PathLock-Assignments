# 🚀 Deployment Guide - Render & Vercel

This guide will help you deploy the PathLock Project Manager to Render (Backend) and Vercel (Frontend).

## 📋 Prerequisites

- [ ] GitHub account with repository access
- [ ] Render account (sign up at https://render.com)
- [ ] Vercel account (sign up at https://vercel.com)
- [ ] Code pushed to GitHub repository

---

## Part 1: Backend Deployment on Render (API)

### Step 1: Prepare Your Repository

Make sure all changes are committed and pushed to GitHub:

```bash
git add .
git commit -m "Prepare for production deployment"
git push origin main
```

### Step 2: Create Web Service on Render

1. Go to https://dashboard.render.com/
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Select your repository from the list

### Step 3: Configure the Web Service

**Basic Settings:**
- **Name**: `pathlock-project-manager-api`
- **Region**: Choose closest to your users (e.g., Oregon, Ohio, Frankfurt)
- **Branch**: `main` (or your default branch)
- **Root Directory**: `ProjectManagerAPI`
- **Runtime**: Docker
- **Dockerfile Path**: `./Dockerfile` (Render will auto-detect)

**Build & Deploy:**
- Render will automatically use the Dockerfile
- No need to specify build/start commands (they're in Dockerfile)

### Step 4: Set Environment Variables

In Render dashboard → Your service → **Environment** tab, add these variables:

```
ASPNETCORE_ENVIRONMENT=Production
ASPNETCORE_URLS=http://0.0.0.0:$PORT

JWT_KEY=YourSuperSecretProductionKeyMustBeAtLeast32CharactersLongForSecurity!
JWT_ISSUER=ProjectManagerAPI
JWT_AUDIENCE=ProjectManagerClient

DATABASE_CONNECTION_STRING=Data Source=/var/data/projectmanager.db
```

**Important**: 
- Generate a strong JWT_KEY (minimum 32 characters, use letters, numbers, special chars)
- The `$PORT` variable is automatically set by Render

### Step 5: Add Persistent Disk (for SQLite Database)

1. In Render dashboard → Your service → **Disks** tab
2. Click **"Add Disk"**
3. Configure:
   - **Name**: `pathlock-database`
   - **Mount Path**: `/var/data`
   - **Size**: 1 GB (free tier)
4. Click **"Save"**

### Step 6: Deploy the Backend

1. Click **"Manual Deploy"** → **"Deploy latest commit"**
2. Wait for deployment (5-10 minutes)
3. Once deployed, note your backend URL: `https://pathlock-project-manager-api.onrender.com`

### Step 7: Test Backend API

Visit: `https://pathlock-project-manager-api.onrender.com/swagger`

You should see the Swagger UI with all API endpoints.

---

## Part 2: Frontend Deployment on Vercel

### Step 1: Update Backend CORS

Before deploying frontend, we need to allow Vercel domain in backend CORS.

You'll do this AFTER getting your Vercel URL, but for now, remember to update:

**In Render Dashboard:**
1. Go to your service → **Environment**
2. Add or update `AllowedOrigins` variable (we'll do this after Step 4)

### Step 2: Push Frontend Changes

Make sure all frontend changes are committed:

```bash
git add .
git commit -m "Prepare frontend for Vercel deployment"
git push origin main
```

### Step 3: Import Project to Vercel

1. Go to https://vercel.com/dashboard
2. Click **"Add New..."** → **"Project"**
3. **Import Git Repository**
4. Select your GitHub repository
5. Click **"Import"**

### Step 4: Configure Build Settings

**Framework Preset**: Vite (should auto-detect)

**Root Directory**: `project-manager-frontend`

**Build & Output Settings:**
- Build Command: `npm run build` (auto-filled)
- Output Directory: `dist` (auto-filled)
- Install Command: `npm install` (auto-filled)

### Step 5: Set Environment Variables

In Vercel → Your project → **Settings** → **Environment Variables**, add:

**Variable Name**: `VITE_API_URL`
**Value**: `https://pathlock-project-manager-api.onrender.com/api`
**Environment**: Production

Click **"Save"**

### Step 6: Deploy Frontend

1. Click **"Deploy"**
2. Wait for deployment (2-5 minutes)
3. Once deployed, note your frontend URL: `https://your-app-name.vercel.app`

### Step 7: Update Backend CORS with Vercel URL

Now go back to **Render Dashboard**:

1. Navigate to your API service
2. Go to **Environment** tab
3. Update the `appsettings.Production.json` in your code:

```json
{
  "AllowedOrigins": [
    "https://your-actual-vercel-url.vercel.app/login",
    "http://localhost:5173"
  ]
}
```

4. Commit and push changes:
```bash
git add .
git commit -m "Update CORS for Vercel URL"
git push origin main
```

5. Render will automatically redeploy with new CORS settings

---

## 🧪 Testing Your Deployment

### Test Backend

1. Visit: `https://pathlock-project-manager-api.onrender.com/swagger`
2. Try the `/api/auth/register` endpoint
3. Create a test user

### Test Frontend

1. Visit: `https://your-app-name.vercel.app`
2. Register a new account
3. Login and test all features:
   - Create a project
   - Add tasks
   - Try dark mode toggle
   - Test responsive design on mobile

---

## 🔧 Post-Deployment Configuration

### Custom Domain (Optional)

**Vercel:**
1. Go to your project → **Settings** → **Domains**
2. Add your custom domain
3. Follow DNS configuration instructions

**Render:**
1. Go to your service → **Settings** → **Custom Domain**
2. Add your domain
3. Configure DNS records

### Keeping Render Free Tier Awake

Render free tier sleeps after 15 minutes of inactivity. Options:

1. **UptimeRobot** (Recommended):
   - Sign up at https://uptimerobot.com (free)
   - Add monitor for your Render URL
   - Set interval to 10 minutes
   - Keeps your API awake

2. **Accept the sleep**:
   - First request after sleep takes 30-60 seconds
   - Subsequent requests are fast

---

## 🐛 Troubleshooting

### Backend Issues

**Issue**: "Application failed to start"
**Solution**: 
- Check environment variables are set correctly
- Verify JWT_KEY is at least 32 characters
- Check logs in Render dashboard

**Issue**: "Database not found"
**Solution**:
- Verify persistent disk is mounted at `/var/data`
- Check DATABASE_CONNECTION_STRING points to `/var/data/projectmanager.db`

**Issue**: "CORS error"
**Solution**:
- Verify AllowedOrigins includes your exact Vercel URL
- Must include `https://` protocol
- Redeploy after updating

### Frontend Issues

**Issue**: "Network error" or "API not responding"
**Solution**:
- Check VITE_API_URL is set correctly in Vercel
- Verify backend is running on Render
- Check browser console for exact error

**Issue**: "404 on page refresh"
**Solution**:
- Verify `vercel.json` is present with correct routing config
- Redeploy if needed

**Issue**: "Environment variables not working"
**Solution**:
- Must start with `VITE_` prefix
- Redeploy after adding/changing environment variables
- Check they're set for "Production" environment

---

## 📊 Monitoring

### Render Dashboard
- View logs in real-time
- Monitor CPU and memory usage
- Check deployment history

### Vercel Dashboard
- View deployment logs
- Analytics and performance metrics
- Function logs (if using)

---

## 🔐 Security Checklist

- [ ] Strong JWT_KEY (32+ characters)
- [ ] CORS properly configured with specific origins
- [ ] No sensitive data in code/repository
- [ ] Environment variables used for all secrets
- [ ] .env files in .gitignore
- [ ] HTTPS enabled (automatic on both platforms)

---

## 💰 Cost Breakdown

### Render Free Tier
- ✅ 750 hours/month free
- ✅ Automatic sleep after 15 min inactivity
- ✅ 1GB persistent storage
- ✅ Automatic HTTPS
- ⚠️ Limited to 512MB RAM

### Vercel Free Tier
- ✅ Unlimited deployments
- ✅ 100GB bandwidth/month
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Preview deployments for branches

---

## 🚀 Next Steps

1. Set up custom domain (optional)
2. Configure UptimeRobot to keep Render awake
3. Set up monitoring and alerts
4. Add CI/CD pipeline (optional)
5. Consider upgrading for production workloads

---

## 📞 Support Resources

- **Render Docs**: https://render.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **Render Community**: https://community.render.com
- **Vercel Community**: https://github.com/vercel/vercel/discussions

---

**Deployment prepared by**: PathLock Team
**Last updated**: October 31, 2025

✅ Your application is now ready for deployment!
