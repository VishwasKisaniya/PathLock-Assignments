# 🔐 Environment Variables Reference

This document lists all required environment variables for deployment.

## Backend (Render) - Required Environment Variables

Set these in Render Dashboard → Your Service → Environment:

```bash
# ASP.NET Core Configuration
ASPNETCORE_ENVIRONMENT=Production
ASPNETCORE_URLS=http://0.0.0.0:$PORT

# JWT Authentication (CHANGE THESE IN PRODUCTION!)
JWT_KEY=YourSuperSecretProductionKeyMustBeAtLeast32CharactersLongForSecurity!
JWT_ISSUER=ProjectManagerAPI
JWT_AUDIENCE=ProjectManagerClient

# Database Configuration
DATABASE_CONNECTION_STRING=Data Source=/var/data/projectmanager.db
```

### How to Generate Secure JWT_KEY:

**Option 1 - Using OpenSSL (macOS/Linux):**
```bash
openssl rand -base64 32
```

**Option 2 - Using PowerShell (Windows):**
```powershell
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | ForEach-Object {[char]$_})
```

**Option 3 - Online Generator:**
Visit: https://randomkeygen.com/ (use "CodeIgniter Encryption Keys")

---

## Frontend (Vercel) - Required Environment Variables

Set these in Vercel Dashboard → Your Project → Settings → Environment Variables:

```bash
# Backend API URL (update with your actual Render URL)
VITE_API_URL=https://pathlock-project-manager-api.onrender.com/api
```

**Note**: 
- Must start with `VITE_` prefix for Vite to expose it
- Update the URL after backend is deployed on Render
- Make sure to include `/api` at the end

---

## Local Development Environment Variables

### Backend (.env file in ProjectManagerAPI folder):

```bash
# JWT Configuration
JWT_KEY=YourSuperSecretKeyForJWTTokenGenerationMinimum32Characters!
JWT_ISSUER=ProjectManagerAPI
JWT_AUDIENCE=ProjectManagerClient

# Database Configuration
DATABASE_CONNECTION_STRING=Data Source=projectmanager.db
```

### Frontend (.env file in project-manager-frontend folder):

```bash
# Backend API URL for local development
VITE_API_URL=http://localhost:5102/api
```

---

## Security Best Practices

1. ✅ **Never commit .env files** to Git
2. ✅ **Use different JWT keys** for development and production
3. ✅ **JWT_KEY must be at least 32 characters** for security
4. ✅ **Keep .env.example files** updated but without real values
5. ✅ **Use environment-specific settings** (Production vs Development)
6. ✅ **Rotate JWT keys periodically** in production
7. ✅ **Store secrets in platform dashboards**, not in code

---

## Updating Environment Variables

### On Render:
1. Go to Dashboard → Your Service → Environment
2. Click on variable to edit or "Add Environment Variable"
3. Click "Save Changes"
4. Service will automatically redeploy

### On Vercel:
1. Go to Dashboard → Your Project → Settings → Environment Variables
2. Add/Edit variable
3. Select environment (Production/Preview/Development)
4. Trigger a new deployment for changes to take effect

---

## Troubleshooting

### "JWT Key not configured" error:
- Verify JWT_KEY is set in Render environment variables
- Ensure it's at least 32 characters long
- Check for typos in variable name

### "CORS error" in frontend:
- Verify VITE_API_URL matches your Render backend URL exactly
- Include `/api` at the end
- Check backend CORS configuration includes your Vercel URL

### Environment variables not loading:
- **Frontend**: Must start with `VITE_` prefix
- **Backend**: Variable names must match exactly (case-sensitive)
- Redeploy after adding/changing variables

---

## Quick Deployment Checklist

### Before Deploying Backend:
- [ ] Generate strong JWT_KEY (32+ chars)
- [ ] Prepare all environment variables
- [ ] Test locally with production database path

### Before Deploying Frontend:
- [ ] Get backend URL from Render
- [ ] Set VITE_API_URL in Vercel
- [ ] Update backend CORS with Vercel URL

### After First Deployment:
- [ ] Test registration and login
- [ ] Verify API calls work
- [ ] Check dark mode persists
- [ ] Test on mobile devices

---

**Last Updated**: October 31, 2025
