#!/bin/bash

# ============================================================================
# ModelLab Railway Deployment Script
# Deploys backend to Railway with automatic setup
# ============================================================================

set -e  # Exit on error

echo "SF Symbol: rocket.fill - ModelLab Railway Deployment"
echo "================================"
echo ""

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "SF Symbol: xmark.circle - Railway CLI not found"
    echo ""
    echo "Install it with:"
    echo "  npm install -g @railway/cli"
    echo ""
    echo "Or with Homebrew:"
    echo "  brew install railway"
    exit 1
fi

echo "SF Symbol: checkmark.circle - Railway CLI found"
echo ""

# Check if logged in
if ! railway whoami &> /dev/null; then
    echo "SF Symbol: lock.fill - Not logged in to Railway"
    echo "Logging in..."
    railway login
    echo ""
fi

echo "SF Symbol: checkmark.circle - Logged in to Railway"
echo ""

# Check if project exists
if ! railway status &> /dev/null; then
    echo "SF Symbol: shippingbox - No Railway project found"
    echo "Creating new project..."
    railway init
    echo ""
else
    echo "SF Symbol: checkmark.circle - Railway project exists"
    echo ""
fi

# Set environment variables
echo "SF Symbol: wrench.and.screwdriver.fill - Setting environment variables..."
railway variables set NODE_ENV=production
railway variables set PORT=3001

# Check if DATABASE_URL is set
if railway variables get DATABASE_URL &> /dev/null; then
    echo "SF Symbol: checkmark.circle - DATABASE_URL already set"
else
    echo "SF Symbol: exclamationmark.triangle - DATABASE_URL not set"
    echo ""
    echo "Options:"
    echo "  1. Add PostgreSQL plugin: railway add postgresql"
    echo "  2. Use external database: railway variables set DATABASE_URL=postgresql://..."
    echo "  3. Use SQLite (not recommended for production)"
    echo ""
    read -p "Do you want to add PostgreSQL now? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        railway add postgresql
        echo "SF Symbol: checkmark.circle - PostgreSQL added"
    fi
fi

echo ""

# Deploy
echo "SF Symbol: rocket.fill - Deploying to Railway..."
railway up

echo ""
echo "SF Symbol: checkmark.circle - Deployment initiated!"
echo ""

# Wait for deployment
echo "SF Symbol: hourglass - Waiting for deployment to complete..."
sleep 5

# Get the URL
URL=$(railway domain 2>/dev/null || echo "")

if [ -z "$URL" ]; then
    echo ""
    echo "SF Symbol: exclamationmark.triangle - No domain found yet"
    echo "Run 'railway domain' to generate a domain"
    echo ""
    echo "Or add a custom domain with:"
    echo "  railway domain add yourdomain.com"
else
    echo ""
    echo "SF Symbol: party.popper - Deployment Complete!"
    echo ""
    echo "Backend URL: https://$URL"
    echo "Health Check: https://$URL/api/health"
    echo "API Docs: https://$URL/api-docs"
    echo ""
    echo "Next steps:"
    echo "  1. Test health endpoint: curl https://$URL/api/health"
    echo "  2. Update frontend .env with: REACT_APP_API_URL=https://$URL"
    echo "  3. Redeploy frontend to Vercel"
fi

echo ""
echo "SF Symbol: chart.bar.fill - View logs: railway logs"
echo "SF Symbol: wrench.and.screwdriver.fill - Manage project: railway open"
echo ""
