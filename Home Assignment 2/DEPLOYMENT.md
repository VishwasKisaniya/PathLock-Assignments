# Deployment Guide - Mini Project Manager

## Prerequisites for Deployment

- Git repository
- Free accounts on cloud platforms
- Basic understanding of environment variables

## Option 1: Deploy Backend to Railway

### Step 1: Prepare Backend for Railway

1. Create a `railway.json` in ProjectManagerAPI folder:
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "dotnet ProjectManagerAPI.dll",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

2. Update appsettings.json to use environment variables:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Data Source=projectmanager.db"
  },
  "Jwt": {
    "Key": "${JWT_KEY}",
    "Issuer": "${JWT_ISSUER}",
    "Audience": "${JWT_AUDIENCE}"
  }
}
```

### Step 2: Deploy to Railway

1. Sign up at https://railway.app
2. Create new project
3. Connect GitHub repository
4. Select ProjectManagerAPI folder
5. Add environment variables:
   - `JWT_KEY`: Your secret key (min 32 chars)
   - `JWT_ISSUER`: ProjectManagerAPI
   - `JWT_AUDIENCE`: ProjectManagerClient
6. Deploy!
7. Railway will provide a public URL

### Step 3: Update CORS

In Program.cs, update CORS to include Railway URL:
```csharp
policy.WithOrigins(
    "http://localhost:5173",
    "http://localhost:3000",
    "https://your-frontend-url.vercel.app"
)
```

## Option 2: Deploy Backend to Render

### Step 1: Prepare for Render

1. Ensure Program.cs reads port from environment:
```csharp
var port = Environment.GetEnvironmentVariable("PORT") ?? "5102";
builder.WebHost.UseUrls($"http://0.0.0.0:{port}");
```

### Step 2: Deploy to Render

1. Sign up at https://render.com
2. Create new Web Service
3. Connect GitHub repository
4. Configure:
   - Build Command: `dotnet restore && dotnet publish -c Release -o out`
   - Start Command: `dotnet out/ProjectManagerAPI.dll`
5. Add environment variables (same as Railway)
6. Deploy!

## Deploy Frontend to Vercel

### Step 1: Update API URL

Create `.env` file in project-manager-frontend:
```
VITE_API_URL=https://your-backend-url.railway.app/api
```

Update `src/services/api.ts`:
```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5102/api';
```

### Step 2: Deploy to Vercel

1. Sign up at https://vercel.com
2. Import project from GitHub
3. Select project-manager-frontend folder
4. Add environment variable:
   - `VITE_API_URL`: Your backend URL
5. Deploy!

## Deploy Frontend to Netlify

Alternative to Vercel:

1. Build the project:
```bash
cd project-manager-frontend
npm run build
```

2. Sign up at https://netlify.com
3. Drag and drop `dist` folder
4. Or connect GitHub repository
5. Configure:
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Add environment variable in Netlify dashboard

## Database Options for Production

### Option 1: PostgreSQL (Recommended)

1. Update NuGet packages:
```bash
dotnet add package Npgsql.EntityFrameworkCore.PostgreSQL
```

2. Update Program.cs:
```csharp
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));
```

3. Use free PostgreSQL from:
   - Railway (included)
   - Supabase
   - ElephantSQL
   - Heroku Postgres

### Option 2: Keep SQLite

SQLite works for small applications but has limitations:
- File-based (may not persist on some platforms)
- Limited concurrent writes
- Not ideal for production

## Environment Variables Summary

### Backend
- `JWT_KEY`: Your secret key (32+ characters)
- `JWT_ISSUER`: ProjectManagerAPI
- `JWT_AUDIENCE`: ProjectManagerClient
- `DATABASE_URL`: Connection string (if using PostgreSQL)
- `PORT`: Server port (auto-assigned by platform)

### Frontend
- `VITE_API_URL`: Backend API URL

## Post-Deployment Checklist

### Backend
- ✅ API is accessible
- ✅ Swagger UI works (if enabled for production)
- ✅ Database is created
- ✅ CORS is configured correctly
- ✅ JWT authentication works
- ✅ All endpoints return correct responses

### Frontend
- ✅ App loads correctly
- ✅ API calls work
- ✅ Login/Register works
- ✅ Protected routes work
- ✅ All features function correctly

## Testing Production Deployment

1. Register a new user
2. Create a project
3. Add tasks
4. Test all CRUD operations
5. Test logout/login
6. Verify data persistence

## Monitoring & Logging

### Backend Monitoring

Add to Program.cs for production:
```csharp
if (app.Environment.IsProduction())
{
    app.UseExceptionHandler("/error");
    app.UseHsts();
}

app.MapGet("/health", () => Results.Ok(new { status = "healthy" }));
```

### Frontend Error Tracking

Consider adding:
- Sentry for error tracking
- Google Analytics for usage
- LogRocket for session replay

## Security Enhancements for Production

1. **Use HTTPS only**
```csharp
app.UseHttpsRedirection();
app.UseHsts();
```

2. **Strong JWT secret**
   - Use 64+ character random string
   - Store in environment variables
   - Never commit to Git

3. **Rate limiting**
```csharp
builder.Services.AddRateLimiter(options => { /* configure */ });
```

4. **Input sanitization**
   - Already using DataAnnotations
   - Consider adding AntiXss library

## Scaling Considerations

### Horizontal Scaling
- Use PostgreSQL instead of SQLite
- Implement distributed caching (Redis)
- Use load balancer

### Performance Optimization
- Enable response caching
- Implement pagination for large lists
- Add database indexes
- Optimize queries with EF Core

## Backup Strategy

### Database Backups
- Railway: Automatic backups included
- Render: Configure in dashboard
- Manual: Schedule regular exports

### Code Backups
- Use Git (already done)
- Tag releases
- Maintain staging environment

## CI/CD Pipeline

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup .NET
        uses: actions/setup-dotnet@v1
        with:
          dotnet-version: 8.0.x
      - name: Run tests
        run: dotnet test
      - name: Deploy to Railway
        # Add deployment steps

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      - name: Build
        run: |
          cd project-manager-frontend
          npm install
          npm run build
      - name: Deploy to Vercel
        # Add deployment steps
```

## Troubleshooting

### Common Issues

**CORS Error:**
- Check backend CORS configuration
- Verify frontend URL is in allowed origins
- Ensure credentials are allowed

**Authentication Fails:**
- Verify JWT secret is same everywhere
- Check token expiration
- Verify Authorization header format

**Database Connection Fails:**
- Check connection string
- Verify database server is running
- Check firewall rules

**Build Fails:**
- Clear build cache
- Check dependencies versions
- Verify Node/dotnet versions

## Cost Estimates (Free Tiers)

- **Railway**: Free for 500 hours/month
- **Render**: Free tier available
- **Vercel**: Free for personal projects
- **Netlify**: Free for personal projects
- **Supabase**: Free PostgreSQL (500MB)

## Maintenance

### Regular Tasks
- Monitor error logs
- Update dependencies monthly
- Review security advisories
- Backup database regularly
- Monitor performance metrics

### Updates
- Keep .NET 8 updated
- Update npm packages
- Review and update documentation

---

## Quick Deploy Commands

### Backend (Railway)
```bash
git add .
git commit -m "Deploy backend"
git push railway main
```

### Frontend (Vercel)
```bash
git add .
git commit -m "Deploy frontend"
git push origin main
# Vercel auto-deploys on push
```

---

**Ready to deploy!** 🚀

Choose your preferred platforms and follow the steps above. Both backend and frontend can be deployed for free using the recommended platforms.
