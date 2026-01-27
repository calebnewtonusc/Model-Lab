# ModelLab Quick Deploy Guide 🚀

**Ready to deploy in 5 minutes!**

---

## Option 1: Deploy to Vercel (Recommended - Fastest)

### Prerequisites
- Vercel account (free tier works)
- PostgreSQL database (Neon, Supabase, or Railway - free tier available)
- Vercel Blob storage token

### Step 1: Set Up Database (2 minutes)

**Using Neon (Recommended):**
1. Go to https://neon.tech
2. Create free account
3. Create new project
4. Copy the connection string (looks like: `postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/neondb`)

**Alternative: Supabase**
1. Go to https://supabase.com
2. Create free project
3. Get connection string from Settings > Database

### Step 2: Deploy to Vercel (3 minutes)

```bash
# Make sure you're in the ModelLab directory
cd /path/to/ModelLab

# Build frontend (if not already built)
cd frontend && DISABLE_ESLINT_PLUGIN=true npm run build && cd ..

# Deploy (this will prompt you to login if needed)
vercel --prod
```

### Step 3: Set Environment Variables

After deployment, go to your Vercel dashboard and set:

**Required:**
- `DATABASE_URL` = Your PostgreSQL connection string
- `STORAGE_TYPE` = `vercel-blob`
- `BLOB_READ_WRITE_TOKEN` = (Get from Vercel dashboard > Storage > Create Store)
- `ALLOWED_ORIGINS` = Your Vercel URL (e.g., `https://your-app.vercel.app`)

**Optional:**
- `API_RATE_LIMIT` = `100`
- `UPLOAD_RATE_LIMIT` = `20`

### Step 4: Redeploy with Environment Variables

```bash
vercel --prod
```

**Done! Your ModelLab is live! 🎉**

---

## Option 2: Deploy with Docker (Best for VPS/Cloud)

### Prerequisites
- Docker and Docker Compose installed
- VPS or cloud server (DigitalOcean, AWS EC2, etc.)

### Quick Start

```bash
# Using deployment script
./scripts/deploy.sh docker

# Or manually with Docker Compose
docker-compose --profile with-postgres up -d
```

### Configuration

1. Copy environment template:
```bash
cp .env.production.template .env
```

2. Edit `.env` and set your values

3. Access your app:
- Backend: `http://your-server-ip:3001`
- API Docs: `http://your-server-ip:3001/api-docs`

---

## Option 3: Deploy to Railway

### Steps

1. Install Railway CLI:
```bash
npm install -g @railway/cli
```

2. Login and initialize:
```bash
railway login
railway init
```

3. Add PostgreSQL:
```bash
railway add postgresql
```

4. Deploy:
```bash
railway up
```

Railway will automatically set environment variables!

---

## Option 4: Deploy to Render

### Steps

1. Push your code to GitHub

2. Go to https://render.com

3. Create new Web Service:
   - Repository: Your ModelLab repo
   - Build Command: `npm install && cd frontend && npm install && npm run build`
   - Start Command: `node server.js`
   - Environment: Node

4. Add PostgreSQL database from Render dashboard

5. Set environment variables (see .env.production.template)

Your app will be live at `https://your-app.onrender.com`

---

## Quick Deployment Script

Use the automated deployment script:

```bash
# Check deployment readiness
./scripts/deploy.sh check

# Deploy to Vercel
./scripts/deploy.sh vercel

# Deploy with Docker
./scripts/deploy.sh docker

# Start local production server
./scripts/deploy.sh local
```

---

## Post-Deployment Checklist

After deploying:

- [ ] Test health endpoint: `https://your-domain/api/health`
- [ ] Test API docs: `https://your-domain/api-docs`
- [ ] Create a test project via API
- [ ] Upload a test dataset
- [ ] Run verification script: `./scripts/verify_deployment.sh`
- [ ] Set up monitoring (Sentry, etc.)
- [ ] Configure backups
- [ ] Set up SSL/HTTPS (if using custom domain)

---

## Troubleshooting

### Build Fails
```bash
# Clear caches and rebuild
rm -rf node_modules frontend/node_modules
npm install
cd frontend && npm install && cd ..
DISABLE_ESLINT_PLUGIN=true npm run build
```

### Database Connection Issues
- Verify DATABASE_URL is correct
- Check that database allows connections from your deployment IP
- For Vercel: Make sure you're using external connection string

### Storage Issues
- For Vercel: Make sure BLOB_READ_WRITE_TOKEN is set
- For S3: Verify AWS credentials and bucket permissions
- For local: Ensure write permissions on modellab-data directory

### CORS Errors
- Set ALLOWED_ORIGINS to include your frontend URL
- Check that the URL protocol (http/https) matches

---

## Production Recommendations

### Small Scale (< 1K runs/month)
- Platform: Vercel
- Database: Neon (free tier)
- Storage: Vercel Blob (free tier)
- Cost: **$0/month**

### Medium Scale (1K-10K runs/month)
- Platform: Railway or Render
- Database: Railway PostgreSQL ($5-10/month)
- Storage: Vercel Blob or S3 ($1-5/month)
- Cost: **$6-15/month**

### Large Scale (10K+ runs/month)
- Platform: AWS/GCP with Docker
- Database: Managed PostgreSQL ($10-50/month)
- Storage: S3 ($5-20/month)
- Cost: **$15-70/month**

---

## Need Help?

- **Documentation:** README.md, DEPLOYMENT.md
- **API Reference:** /api-docs after deployment
- **Verification:** Run `./scripts/verify_deployment.sh`
- **Issues:** Check TROUBLESHOOTING section in DEPLOYMENT.md

---

**Ready to Deploy? Choose your platform above and follow the steps!** 🚀

*Average deployment time: 5-10 minutes*
