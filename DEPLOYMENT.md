# ModelLab Deployment Guide

Complete guide for deploying ModelLab to production environments.

---

## Table of Contents

1. [Vercel Deployment (Recommended)](#vercel-deployment)
2. [Self-Hosted Deployment](#self-hosted-deployment)
3. [Environment Variables](#environment-variables)
4. [Database Configuration](#database-configuration)
5. [Domain Configuration](#domain-configuration)
6. [Post-Deployment Verification](#post-deployment-verification)
7. [Troubleshooting](#troubleshooting)

---

## Vercel Deployment (Recommended)

ModelLab is optimized for Vercel deployment with automatic CI/CD from GitHub.

### Prerequisites

- GitHub account
- Vercel account (free tier works)
- GoDaddy or other domain provider (optional)

### Step 1: Fork or Clone Repository

```bash
git clone https://github.com/calebnewtonusc/ModelLab.git
cd ModelLab
```

### Step 2: Install Vercel CLI (Optional)

```bash
npm install -g vercel
```

### Step 3: Deploy to Vercel

**Option A: Deploy via Vercel Dashboard**

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Configure project:
   - **Framework Preset:** Other
   - **Build Command:** `npm install && cd frontend && npm install && npm run build`
   - **Output Directory:** `frontend/build`
   - **Install Command:** `npm install`
5. Add environment variables (see [Environment Variables](#environment-variables))
6. Click "Deploy"

**Option B: Deploy via CLI**

```bash
vercel --prod
```

### Step 4: Configure Environment Variables

In Vercel Dashboard:

1. Go to Project Settings → Environment Variables
2. Add the following:

```
NODE_ENV=production
ALLOWED_ORIGINS=https://your-domain.com,https://modellab-yourname.vercel.app
```

### Step 5: Set Up Custom Domain (Optional)

1. In Vercel Dashboard → Domains
2. Add your custom domain (e.g., modellab.studio)
3. Configure DNS records as instructed by Vercel
4. Wait for SSL certificate provisioning (automatic)

**GoDaddy DNS Configuration:**
```
Type: A
Name: @
Value: 76.76.19.19 (Vercel IP)
TTL: 600

Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 600
```

---

## Self-Hosted Deployment

Deploy ModelLab on your own server (VPS, AWS, DigitalOcean, etc.).

### Prerequisites

- Node.js 18+
- npm or yarn
- PM2 (for process management)
- Nginx (for reverse proxy)
- SSL certificate (Let's Encrypt recommended)

### Step 1: Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2
sudo npm install -g pm2

# Install Nginx
sudo apt install -y nginx

# Install Certbot for SSL
sudo apt install -y certbot python3-certbot-nginx
```

### Step 2: Clone and Build

```bash
# Clone repository
git clone https://github.com/calebnewtonusc/ModelLab.git
cd ModelLab

# Install dependencies
npm run install-all

# Build frontend
cd frontend
npm run build
cd ..

# Create environment file
cp .env.example .env
nano .env  # Edit configuration
```

### Step 3: Configure PM2

Create `ecosystem.config.js`:

```javascript
module.exports = {
  apps: [{
    name: 'modellab',
    script: 'server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3001
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm Z'
  }]
};
```

Start the application:

```bash
# Create logs directory
mkdir logs

# Start with PM2
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Enable PM2 startup on boot
pm2 startup
```

### Step 4: Configure Nginx

Create `/etc/nginx/sites-available/modellab`:

```nginx
server {
    listen 80;
    server_name modellab.yourdomain.com;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name modellab.yourdomain.com;

    # SSL certificates (managed by Certbot)
    ssl_certificate /etc/letsencrypt/live/modellab.yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/modellab.yourdomain.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # API proxy
    location /api/ {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts for large file uploads
        proxy_connect_timeout 600s;
        proxy_send_timeout 600s;
        proxy_read_timeout 600s;
    }

    # Static files
    location / {
        root /path/to/ModelLab/frontend/build;
        try_files $uri $uri/ /index.html;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    # File upload size limit
    client_max_body_size 100M;
}
```

Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/modellab /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### Step 5: Set Up SSL

```bash
sudo certbot --nginx -d modellab.yourdomain.com
```

Follow the prompts to obtain and install SSL certificate.

### Step 6: Set Up Automatic Backups

Create `/home/ubuntu/backup-modellab.sh`:

```bash
#!/bin/bash

# Configuration
BACKUP_DIR="/home/ubuntu/modellab-backups"
DB_PATH="/path/to/ModelLab/data/modellab.db"
DATA_PATH="/path/to/ModelLab/modellab-data"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup database
sqlite3 $DB_PATH ".backup $BACKUP_DIR/modellab-$TIMESTAMP.db"

# Backup data files (optional - can be large)
tar -czf $BACKUP_DIR/data-$TIMESTAMP.tar.gz $DATA_PATH

# Keep only last 7 days of backups
find $BACKUP_DIR -name "modellab-*.db" -mtime +7 -delete
find $BACKUP_DIR -name "data-*.tar.gz" -mtime +7 -delete

echo "Backup completed: $TIMESTAMP"
```

Make executable and add to cron:

```bash
chmod +x /home/ubuntu/backup-modellab.sh

# Add to crontab (daily at 2 AM)
crontab -e
# Add line:
0 2 * * * /home/ubuntu/backup-modellab.sh >> /home/ubuntu/backup.log 2>&1
```

---

## Environment Variables

### Required Variables

| Variable | Description | Example | Environment |
|----------|-------------|---------|-------------|
| `NODE_ENV` | Environment mode | `production` | Production |
| `PORT` | Server port | `3001` | All |
| `ALLOWED_ORIGINS` | CORS whitelist | `https://modellab.studio` | Production |

### Optional Variables

| Variable | Description | Default | Example |
|----------|-------------|---------|---------|
| `API_RATE_LIMIT` | General API rate limit | `100` | `200` |
| `UPLOAD_RATE_LIMIT` | Upload rate limit | `20` | `50` |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window (ms) | `900000` | `300000` |
| `DB_PATH` | Database path | `./data/modellab.db` | `/var/lib/modellab/db` |
| `STORAGE_PATH` | File storage path | `./modellab-data` | `/var/lib/modellab/data` |
| `LOG_LEVEL` | Logging verbosity | `info` | `debug` |

### Example .env File

```bash
# Server Configuration
NODE_ENV=production
PORT=3001

# CORS Configuration
ALLOWED_ORIGINS=https://modellab.studio,https://www.modellab.studio

# Rate Limiting
API_RATE_LIMIT=100
UPLOAD_RATE_LIMIT=20

# Paths
DB_PATH=./data/modellab.db
STORAGE_PATH=./modellab-data

# Logging
LOG_LEVEL=info
```

---

## Database Configuration

### SQLite (Default)

ModelLab uses SQLite with WAL mode for better performance.

**Pros:**
- Zero configuration
- Perfect for single-server deployments
- Great performance for < 10K runs

**Cons:**
- Not suitable for distributed deployments
- Limited concurrent writes
- **Vercel: Database resets on each deployment**

**Location:** `./data/modellab.db`

### PostgreSQL (Recommended for Production Scale)

For larger deployments or Vercel production, migrate to PostgreSQL.

**Setup:**

1. Create PostgreSQL database (Vercel Postgres, Supabase, or Neon)
2. Update `lib/database.js` to use PostgreSQL connection
3. Run migrations to create schema

**Example connection:**

```javascript
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});
```

### MongoDB (Alternative)

For document-based storage:

```bash
npm install mongoose
```

Update database layer to use MongoDB connection string.

---

## Domain Configuration

### DNS Records

**For apex domain (modellab.studio):**
```
Type: A
Name: @
Value: [Your server IP or Vercel IP]
TTL: 600
```

**For www subdomain:**
```
Type: CNAME
Name: www
Value: [Your domain or Vercel CNAME]
TTL: 600
```

**For API subdomain (optional):**
```
Type: CNAME
Name: api
Value: [Your server or Vercel]
TTL: 600
```

### SSL Certificate

**Vercel:** Automatic via Let's Encrypt  
**Self-hosted:** Use Certbot

```bash
sudo certbot --nginx -d modellab.yourdomain.com -d www.modellab.yourdomain.com
```

Auto-renewal:
```bash
sudo certbot renew --dry-run
```

---

## Post-Deployment Verification

### 1. Health Check

```bash
curl https://your-domain.com/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2026-01-27T08:00:00.000Z",
  "environment": "production",
  "version": "1.0.0",
  "uptime": 123.45,
  "database": {
    "status": "connected",
    "runs": 0
  }
}
```

### 2. API Documentation

Visit: `https://your-domain.com/api/docs`

### 3. Test Dataset Upload

```bash
curl -X POST https://your-domain.com/api/modellab/datasets \
  -F "file=@test.csv" \
  -F "name=Test Dataset"
```

### 4. Test Python SDK

```python
import modellab

modellab.configure(api_url="https://your-domain.com")

with modellab.run("test-deployment"):
    modellab.log_param("test", "success")
    modellab.log_metric("accuracy", 1.0)

print("Deployment successful!")
```

### 5. Monitor Logs

**Vercel:**
```bash
vercel logs --follow
```

**Self-hosted:**
```bash
pm2 logs modellab
```

### 6. Performance Test

```bash
# Install Apache Bench
sudo apt install apache2-utils

# Test API performance
ab -n 1000 -c 10 https://your-domain.com/api/health
```

Expected: >100 requests/second for health endpoint

---

## Troubleshooting

### Common Issues

#### 1. Database Connection Errors

**Symptom:** Health check returns "unhealthy"

**Solution:**
```bash
# Check database file exists
ls -la ./data/modellab.db

# Check permissions
chmod 644 ./data/modellab.db
chmod 755 ./data/

# Check WAL files
ls -la ./data/modellab.db-*
```

#### 2. CORS Errors

**Symptom:** Frontend can't connect to API

**Solution:**
```bash
# Update .env
ALLOWED_ORIGINS=https://your-frontend-domain.com,https://your-backend-domain.com

# Restart server
pm2 restart modellab
```

#### 3. File Upload Fails

**Symptom:** "File too large" or timeout errors

**Solution:**
```nginx
# Update Nginx config
client_max_body_size 100M;
proxy_read_timeout 600s;

# Reload Nginx
sudo systemctl reload nginx
```

#### 4. Rate Limiting Too Aggressive

**Symptom:** "Too many requests" errors

**Solution:**
```bash
# Update .env
API_RATE_LIMIT=1000
UPLOAD_RATE_LIMIT=100

# Restart server
pm2 restart modellab
```

#### 5. SSL Certificate Issues

**Symptom:** HTTPS errors

**Solution:**
```bash
# Renew certificate
sudo certbot renew

# Check certificate expiry
sudo certbot certificates

# Force renewal
sudo certbot renew --force-renewal
```

#### 6. PM2 Process Crashes

**Symptom:** Server stops responding

**Solution:**
```bash
# Check logs
pm2 logs modellab --lines 100

# Restart
pm2 restart modellab

# Check status
pm2 status
```

#### 7. High Memory Usage

**Symptom:** Server becomes slow

**Solution:**
```bash
# Check memory usage
pm2 monit

# Restart with memory limit
pm2 restart modellab --max-memory-restart 500M

# Add to ecosystem.config.js
max_memory_restart: '500M'
```

---

## Monitoring

### Application Monitoring

**Recommended: Sentry**

```bash
npm install @sentry/node @sentry/tracing
```

```javascript
// Add to server.js
const Sentry = require('@sentry/node');

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0
});
```

### Uptime Monitoring

**Options:**
- UptimeRobot (free)
- Pingdom
- Better Uptime

Configure to ping: `https://your-domain.com/api/health`

### Log Aggregation

**Self-hosted:**

```bash
# Install Logrotate
sudo apt install logrotate

# Create /etc/logrotate.d/modellab
/home/ubuntu/ModelLab/logs/*.log {
    daily
    rotate 7
    compress
    delaycompress
    notifempty
    create 0644 ubuntu ubuntu
    postrotate
        pm2 reloadLogs
    endscript
}
```

---

## Security Checklist

Before going to production:

- [ ] Environment variables configured
- [ ] CORS origins whitelist set
- [ ] SSL certificate installed
- [ ] Rate limiting enabled
- [ ] Database backups scheduled
- [ ] Firewall configured (ports 80, 443 only)
- [ ] SSH key-only authentication
- [ ] Fail2ban installed (self-hosted)
- [ ] Security headers verified
- [ ] Input validation tested
- [ ] Error messages sanitized

---

## Performance Optimization

### 1. Enable Compression

```nginx
# Add to Nginx config
gzip on;
gzip_vary on;
gzip_proxied any;
gzip_comp_level 6;
gzip_types text/plain text/css text/xml text/javascript application/json application/javascript application/xml+rss;
```

### 2. Add Redis Caching (Optional)

```bash
npm install redis
```

```javascript
const redis = require('redis');
const client = redis.createClient({
  url: process.env.REDIS_URL
});

// Cache health check response for 1 minute
app.get('/api/health', async (req, res) => {
  const cached = await client.get('health:status');
  if (cached) return res.json(JSON.parse(cached));
  
  // ... health check logic
  await client.setEx('health:status', 60, JSON.stringify(response));
  res.json(response);
});
```

### 3. Enable HTTP/2

```nginx
listen 443 ssl http2;
```

### 4. CDN Integration

Use Vercel Edge Network (automatic) or Cloudflare for CDN.

---

## Scaling

### Horizontal Scaling

**Vercel:** Automatic serverless scaling  
**Self-hosted:** Use PM2 cluster mode

```javascript
// ecosystem.config.js
instances: 'max',  // Use all CPU cores
exec_mode: 'cluster'
```

### Database Scaling

1. **Read replicas** for high-read workloads
2. **Connection pooling** with PgBouncer
3. **Database sharding** for > 1M runs

### File Storage Scaling

Migrate to S3, Cloudflare R2, or Vercel Blob:

```javascript
const { put } = require('@vercel/blob');

// Upload to Blob
const { url } = await put('datasets/file.csv', fileBuffer, {
  access: 'public'
});
```

---

## Maintenance

### Regular Tasks

**Daily:**
- Monitor error logs
- Check disk space
- Verify backups

**Weekly:**
- Review performance metrics
- Check rate limit effectiveness
- Update dependencies (security patches)

**Monthly:**
- Database optimization
- Security audit
- Capacity planning

### Update Procedure

```bash
# Backup database
sqlite3 data/modellab.db ".backup data/modellab-backup.db"

# Pull latest code
git pull origin main

# Install dependencies
npm install
cd frontend && npm install && npm run build && cd ..

# Restart server
pm2 restart modellab

# Verify
curl https://your-domain.com/api/health
```

---

## Support

- **Documentation:** [README.md](./README.md)
- **Issues:** [GitHub Issues](https://github.com/calebnewtonusc/ModelLab/issues)
- **Security:** [SECURITY.md](./SECURITY.md)

---

*Last updated: 2026-01-27*
