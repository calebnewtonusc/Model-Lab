#!/bin/bash
# ModelLab - One-Command Deployment to Vercel
# This script will deploy ModelLab to Vercel in under 5 minutes

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo ""
echo "========================================================================"
echo -e "${BLUE}ModelLab - Quick Deploy to Vercel${NC}"
echo "========================================================================"
echo ""

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo -e "${YELLOW}Installing Vercel CLI...${NC}"
    npm install -g vercel
fi

echo -e "${GREEN}✓ Vercel CLI ready${NC}"
echo ""

# Check if frontend is built
if [ ! -d "frontend/build" ]; then
    echo -e "${BLUE}Building frontend...${NC}"
    cd frontend && DISABLE_ESLINT_PLUGIN=true npm run build && cd ..
    echo -e "${GREEN}✓ Frontend built${NC}"
else
    echo -e "${GREEN}✓ Frontend already built${NC}"
fi

echo ""
echo "========================================================================"
echo -e "${BLUE}BEFORE YOU DEPLOY:${NC}"
echo "========================================================================"
echo ""
echo "You'll need:"
echo ""
echo "1. ${YELLOW}PostgreSQL Database${NC} (recommended: Neon.tech - FREE)"
echo "   → Go to https://neon.tech"
echo "   → Create account & project"
echo "   → Copy connection string"
echo ""
echo "2. ${YELLOW}Vercel Blob Storage${NC} (FREE tier available)"
echo "   → After first deploy, go to Vercel dashboard"
echo "   → Storage → Create Blob Store"
echo "   → Copy token"
echo ""
echo "3. ${YELLOW}Set Environment Variables${NC} in Vercel dashboard:"
echo "   → DATABASE_URL = postgresql://..."
echo "   → STORAGE_TYPE = vercel-blob"
echo "   → BLOB_READ_WRITE_TOKEN = vercel_blob_..."
echo "   → ALLOWED_ORIGINS = https://your-app.vercel.app"
echo ""
echo "========================================================================"
echo ""

read -p "Ready to deploy? (y/n) " -n 1 -r
echo
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Deployment cancelled. Run this script again when ready!"
    exit 0
fi

echo -e "${BLUE}Deploying to Vercel...${NC}"
echo ""

# Deploy to Vercel
vercel --prod

echo ""
echo "========================================================================"
echo -e "${GREEN}✓ DEPLOYMENT INITIATED!${NC}"
echo "========================================================================"
echo ""
echo "Next steps:"
echo ""
echo "1. ${YELLOW}Go to your Vercel dashboard:${NC}"
echo "   https://vercel.com/dashboard"
echo ""
echo "2. ${YELLOW}Set environment variables:${NC}"
echo "   Settings → Environment Variables → Add:"
echo "   - DATABASE_URL"
echo "   - STORAGE_TYPE"
echo "   - BLOB_READ_WRITE_TOKEN"
echo "   - ALLOWED_ORIGINS"
echo ""
echo "3. ${YELLOW}Redeploy with environment variables:${NC}"
echo "   vercel --prod"
echo ""
echo "4. ${YELLOW}Test your deployment:${NC}"
echo "   curl https://your-app.vercel.app/api/health"
echo ""
echo "========================================================================"
echo ""
echo -e "${GREEN}Need help? Check QUICK_DEPLOY.md for detailed instructions!${NC}"
echo ""
