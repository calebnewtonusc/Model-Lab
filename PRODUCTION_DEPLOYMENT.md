# ModelLab Production Deployment Guide

Complete guide for deploying ModelLab to production with Railway (backend) and Vercel (frontend).

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│                   Production Stack                   │
├─────────────────────────────────────────────────────┤
│                                                       │
│  Frontend (Vercel)          Backend (Railway)        │
│  ┌──────────────────┐      ┌──────────────────┐    │
│  │   React App      │─────▶│  Express.js      │    │
│  │  modellab.studio │      │  Node.js API     │    │
│  └──────────────────┘      └─────────┬────────┘    │
│                                       │              │
│                             ┌─────────▼────────┐    │
│                             │   PostgreSQL     │    │
│                             │   (Railway)      │    │
│                             └──────────────────┘    │
└─────────────────────────────────────────────────────┘
```

---

## Part 1: Deploy Backend to Railway

### Prerequisites
- Railway account (free tier available)
- Railway CLI installed: `npm install -g @railway/cli`
- Git repository pushed to GitHub

### Step 1: Install Railway CLI

```bash
# Using npm
npm install -g @railway/cli

# Or using Homebrew (Mac)
brew install railway

# Verify installation
railway --version
```

### Step 2: Login to Railway

```bash
railway login
```

This will open your browser for authentication.

### Step 3: Deploy Backend

#### Option A: Using the Automated Script (Recommended)

```bash
cd /path/to/ModelLab
./scripts/deploy-railway.sh
```

The script will:
- ✅ Check Railway CLI installation
- ✅ Login if needed
- ✅ Create/link project
- ✅ Set environment variables
- ✅ Optionally add PostgreSQL
- ✅ Deploy the backend
- ✅ Generate domain URL

#### Option B: Manual Deployment

```bash
# 1. Initialize Railway project
railway init

# 2. Add PostgreSQL (recommended for production)
railway add postgresql

# 3. Set environment variables
railway variables set NODE_ENV=production
railway variables set PORT=3001

# 4. Deploy
railway up

# 5. Generate domain
railway domain
```

### Step 4: Configure Environment Variables

Set these in Railway dashboard or via CLI:

```bash
# Required
railway variables set NODE_ENV=production
railway variables set PORT=3001

# CORS - Add your frontend URL
railway variables set ALLOWED_ORIGINS=https://modellab.studio,https://www.modellab.studio

# Database (automatically set if you added PostgreSQL plugin)
# If using external database:
# railway variables set DATABASE_URL=postgresql://...

# Optional: API security
# railway variables set API_KEY=your-secret-key
```

### Step 5: Get Your Backend URL

```bash
railway domain
```

Output example:
```
modellab-production-xxxx.up.railway.app
```

Your backend URL is: `https://modellab-production-xxxx.up.railway.app`

### Step 6: Verify Backend

Test the deployed backend:

```bash
# Health check
curl https://your-backend-url.railway.app/api/health

# Should return:
{
  "status": "healthy",
  "timestamp": "...",
  "environment": "production",
  "database": { "status": "connected" }
}

# API documentation
open https://your-backend-url.railway.app/api-docs
```

---

## Part 2: Configure Frontend for Production

### Step 1: Create Production Environment File

```bash
cd frontend
cp .env.production.template .env.production
```

### Step 2: Update .env.production

Edit `frontend/.env.production`:

```env
# Replace with YOUR Railway backend URL
REACT_APP_API_URL=https://your-backend-url.railway.app

REACT_APP_ENABLE_ANALYTICS=false
REACT_APP_ENVIRONMENT=production
```

### Step 3: Test Locally

```bash
# Build with production config
cd frontend
npm run build

# Test production build locally
npx serve -s build

# Open http://localhost:3000 and verify API calls work
```

---

## Part 3: Deploy Frontend to Vercel

### Prerequisites
- Vercel account
- Vercel CLI (optional): `npm install -g vercel`

### Option A: Deploy via Vercel Dashboard (Easiest)

1. Go to [vercel.com](https://vercel.com) and login
2. Click "Add New Project"
3. Import your GitHub repository
4. Vercel will auto-detect the configuration
5. Add environment variable:
   - Key: `REACT_APP_API_URL`
   - Value: `https://your-backend-url.railway.app`
6. Click "Deploy"

### Option B: Deploy via CLI

```bash
# Login to Vercel
npx vercel login

# Deploy to production
npx vercel --prod

# When prompted:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? Yes (if exists) or No
# - What's your project's name? modellab
# - In which directory is your code located? ./
```

### Step 4: Set Environment Variables in Vercel

Via dashboard:
1. Go to Project Settings → Environment Variables
2. Add:
   ```
   REACT_APP_API_URL = https://your-backend-url.railway.app
   ```
3. Redeploy to apply changes

Via CLI:
```bash
vercel env add REACT_APP_API_URL production
# Enter: https://your-backend-url.railway.app
```

### Step 5: Verify Frontend

1. Visit https://modellab.studio
2. Open browser DevTools → Network tab
3. Interact with the app
4. Verify API calls go to your Railway backend URL
5. Check that all features work

---

## Part 4: Custom Domain Setup (Optional)

### Backend Custom Domain (Railway)

```bash
# Add custom domain to Railway
railway domain add api.modellab.studio
```

Then add DNS records:
- **Type**: CNAME
- **Name**: api
- **Value**: your-backend-url.railway.app

### Frontend Custom Domain (Vercel)

1. Vercel Dashboard → Project Settings → Domains
2. Add `modellab.studio`
3. Follow DNS configuration instructions
4. Vercel handles SSL automatically

---

## Part 5: Post-Deployment Verification

### Complete System Test

```bash
# 1. Backend health check
curl https://your-backend-url.railway.app/api/health

# 2. Frontend loads
curl -I https://modellab.studio

# 3. Test API through frontend
# Visit https://modellab.studio and:
# - Create a project
# - Upload a dataset
# - Create a run
# - View API docs

# 4. Check logs
railway logs
```

### Monitoring Setup

1. **Railway Logs**:
   ```bash
   railway logs
   railway logs --follow  # Real-time
   ```

2. **Vercel Logs**:
   - Visit Vercel Dashboard → Deployments → View Logs

3. **Health Check Monitoring**:
   - Set up UptimeRobot or similar
   - Monitor: `https://your-backend-url.railway.app/api/health`

---

## Part 6: Environment Variables Reference

### Backend (Railway)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NODE_ENV` | Yes | - | Set to `production` |
| `PORT` | Yes | 3001 | Server port |
| `DATABASE_URL` | Recommended | - | PostgreSQL connection string |
| `ALLOWED_ORIGINS` | Yes | - | Comma-separated frontend URLs |
| `API_KEY` | Optional | - | API authentication key |
| `LOG_LEVEL` | Optional | `info` | Logging level |

### Frontend (Vercel)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `REACT_APP_API_URL` | Yes | - | Backend URL |
| `REACT_APP_ENVIRONMENT` | No | `production` | Environment name |

---

## Troubleshooting

### Backend Issues

**Problem**: Health check returns 503
```bash
# Check logs
railway logs

# Check database connection
railway variables get DATABASE_URL

# Restart service
railway up --detach
```

**Problem**: CORS errors
```bash
# Check ALLOWED_ORIGINS includes frontend URL
railway variables get ALLOWED_ORIGINS

# Update if needed
railway variables set ALLOWED_ORIGINS=https://modellab.studio
```

### Frontend Issues

**Problem**: API calls fail
```bash
# Verify environment variable is set
vercel env ls

# Check browser console for actual URL being called
# Should be: https://your-backend-url.railway.app/api/...
```

**Problem**: Build fails
```bash
# Check build logs in Vercel dashboard
# Common issues:
# - Missing dependencies: npm install
# - Build command: npm run build
# - Output directory: frontend/build
```

---

## Updating the Deployment

### Update Backend

```bash
# Make changes, commit, then:
git push origin main

# Railway auto-deploys on push (if configured)
# Or manually deploy:
railway up
```

### Update Frontend

```bash
# Make changes, commit, then:
git push origin main

# Vercel auto-deploys on push
# Or manually deploy:
npx vercel --prod
```

---

## Cost Estimates

### Free Tier (Current Setup)

| Service | Free Tier | Limits |
|---------|-----------|--------|
| Railway | ✅ $5 credit/month | Enough for small apps |
| Vercel | ✅ Unlimited | Hobby tier |
| **Total** | **$0/month** | Perfect for portfolio |

### Paid Tier (If Needed)

| Service | Cost | When Needed |
|---------|------|-------------|
| Railway | $5-20/month | High traffic (>100k requests) |
| Vercel | $20/month | Team features, more bandwidth |
| PostgreSQL | Free on Railway | Or $7/month external |

---

## Production Checklist

Before going live:

- [ ] Backend deployed to Railway
- [ ] PostgreSQL database configured
- [ ] Backend health check passes
- [ ] Environment variables set correctly
- [ ] CORS configured with frontend URL
- [ ] Frontend deployed to Vercel
- [ ] Frontend environment variables set
- [ ] API calls working from frontend
- [ ] All features tested in production
- [ ] Monitoring set up (optional)
- [ ] Custom domain configured (optional)
- [ ] SSL certificates active (auto on Railway/Vercel)
- [ ] Backup strategy in place (optional)

---

## Quick Commands Reference

```bash
# Railway
railway login                    # Login
railway init                     # Initialize project
railway up                       # Deploy
railway logs                     # View logs
railway logs --follow           # Real-time logs
railway variables set KEY=VALUE # Set env var
railway domain                  # Get/generate domain
railway open                    # Open dashboard

# Vercel
vercel login                    # Login
vercel --prod                   # Deploy to production
vercel logs                     # View logs
vercel env add KEY              # Add env variable
vercel domains add DOMAIN       # Add custom domain

# Testing
curl https://backend-url/api/health           # Backend health
curl -I https://modellab.studio               # Frontend status
railway logs --follow                         # Monitor backend
```

---

## Support

- Railway docs: https://docs.railway.app
- Vercel docs: https://vercel.com/docs
- ModelLab issues: https://github.com/calebnewtonusc/ModelLab/issues

---

**Last Updated**: February 5, 2026
**Status**: Production-Ready ✅
