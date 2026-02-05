#!/bin/bash

# ============================================================================
# ModelLab Railway Deployment Script
# Deploys backend to Railway with automatic setup
# ============================================================================

set -e  # Exit on error

echo "🚀 ModelLab Railway Deployment"
echo "================================"
echo ""

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI not found"
    echo ""
    echo "Install it with:"
    echo "  npm install -g @railway/cli"
    echo ""
    echo "Or with Homebrew:"
    echo "  brew install railway"
    exit 1
fi

echo "✅ Railway CLI found"
echo ""

# Check if logged in
if ! railway whoami &> /dev/null; then
    echo "🔐 Not logged in to Railway"
    echo "Logging in..."
    railway login
    echo ""
fi

echo "✅ Logged in to Railway"
echo ""

# Check if project exists
if ! railway status &> /dev/null; then
    echo "📦 No Railway project found"
    echo "Creating new project..."
    railway init
    echo ""
else
    echo "✅ Railway project exists"
    echo ""
fi

# Set environment variables
echo "🔧 Setting environment variables..."
railway variables set NODE_ENV=production
railway variables set PORT=3001

# Check if DATABASE_URL is set
if railway variables get DATABASE_URL &> /dev/null; then
    echo "✅ DATABASE_URL already set"
else
    echo "⚠️  DATABASE_URL not set"
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
        echo "✅ PostgreSQL added"
    fi
fi

echo ""

# Deploy
echo "🚀 Deploying to Railway..."
railway up

echo ""
echo "✅ Deployment initiated!"
echo ""

# Wait for deployment
echo "⏳ Waiting for deployment to complete..."
sleep 5

# Get the URL
URL=$(railway domain 2>/dev/null || echo "")

if [ -z "$URL" ]; then
    echo ""
    echo "⚠️  No domain found yet"
    echo "Run 'railway domain' to generate a domain"
    echo ""
    echo "Or add a custom domain with:"
    echo "  railway domain add yourdomain.com"
else
    echo ""
    echo "🎉 Deployment Complete!"
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
echo "📊 View logs: railway logs"
echo "🔧 Manage project: railway open"
echo ""
