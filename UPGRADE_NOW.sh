#!/bin/bash
# ModelLab Production Upgrade Script
# Upgrades from SQLite + Local Storage to PostgreSQL + Cloud Storage

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo ""
echo "========================================================================"
echo -e "${BLUE}ModelLab Production Upgrade${NC}"
echo "========================================================================"
echo ""
echo "This will upgrade your deployment to:"
echo "  - PostgreSQL database (persistent, scalable)"
echo "  - Vercel Blob storage (persistent file storage)"
echo ""
echo "Current deployment: https://modellab.studio"
echo ""
echo "========================================================================"
echo ""

# Step 1: PostgreSQL Setup
echo -e "${BLUE}STEP 1: Set Up PostgreSQL Database${NC}"
echo "========================================================================"
echo ""
echo "We'll use Neon (FREE tier, perfect for ModelLab)"
echo ""
echo "Instructions:"
echo "  1. Open https://neon.tech in your browser"
echo "  2. Sign up (or log in)"
echo "  3. Click 'Create a Project'"
echo "  4. Give it a name: 'modellab'"
echo "  5. Select region: US East (or closest to you)"
echo "  6. Copy the connection string"
echo ""
echo -e "${YELLOW}Opening Neon in your browser...${NC}"
sleep 2
open "https://neon.tech"
echo ""
echo -e "${GREEN}After you've created the project, you'll see a connection string like:${NC}"
echo "postgresql://username:password@ep-xxx-xxx.us-east-2.aws.neon.tech/neondb"
echo ""
read -p "Press Enter when you have your connection string ready..."
echo ""
echo -n "Paste your PostgreSQL connection string: "
read DATABASE_URL
echo ""

if [[ -z "$DATABASE_URL" ]]; then
    echo -e "${RED}Error: No connection string provided${NC}"
    exit 1
fi

# Validate connection string format
if [[ ! "$DATABASE_URL" =~ ^postgresql:// ]]; then
    echo -e "${RED}Error: Connection string should start with 'postgresql://'${NC}"
    exit 1
fi

echo -e "${GREEN}✓ PostgreSQL connection string saved${NC}"
echo ""

# Step 2: Vercel Blob Setup
echo -e "${BLUE}STEP 2: Set Up Vercel Blob Storage${NC}"
echo "========================================================================"
echo ""
echo "Instructions:"
echo "  1. Go to https://vercel.com/dashboard"
echo "  2. Select your 'modellab' project"
echo "  3. Click 'Storage' tab"
echo "  4. Click 'Create Database' or 'Connect Store'"
echo "  5. Choose 'Blob'"
echo "  6. Click 'Create'"
echo "  7. Copy the 'BLOB_READ_WRITE_TOKEN'"
echo ""
echo -e "${YELLOW}Opening Vercel dashboard in your browser...${NC}"
sleep 2
open "https://vercel.com/calebs-projects-a6310ab2/modellab/stores"
echo ""
echo -e "${GREEN}After creating the Blob store, you'll see:${NC}"
echo "BLOB_READ_WRITE_TOKEN=vercel_blob_rw_XXXXXXXXXXXX"
echo ""
read -p "Press Enter when you have your token ready..."
echo ""
echo -n "Paste your BLOB_READ_WRITE_TOKEN: "
read BLOB_TOKEN
echo ""

if [[ -z "$BLOB_TOKEN" ]]; then
    echo -e "${RED}Error: No blob token provided${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Vercel Blob token saved${NC}"
echo ""

# Step 3: Set Environment Variables
echo -e "${BLUE}STEP 3: Configuring Environment Variables${NC}"
echo "========================================================================"
echo ""
echo "Setting the following environment variables in Vercel:"
echo "  - DATABASE_URL (PostgreSQL)"
echo "  - STORAGE_TYPE (vercel-blob)"
echo "  - BLOB_READ_WRITE_TOKEN"
echo "  - ALLOWED_ORIGINS (your domain)"
echo ""

# Use Vercel CLI to set environment variables
echo -e "${YELLOW}Setting DATABASE_URL...${NC}"
vercel env add DATABASE_URL production <<< "$DATABASE_URL"

echo -e "${YELLOW}Setting STORAGE_TYPE...${NC}"
vercel env add STORAGE_TYPE production <<< "vercel-blob"

echo -e "${YELLOW}Setting BLOB_READ_WRITE_TOKEN...${NC}"
vercel env add BLOB_READ_WRITE_TOKEN production <<< "$BLOB_TOKEN"

echo -e "${YELLOW}Setting ALLOWED_ORIGINS...${NC}"
vercel env add ALLOWED_ORIGINS production <<< "https://modellab.studio,https://www.modellab.studio"

echo ""
echo -e "${GREEN}✓ All environment variables configured!${NC}"
echo ""

# Step 4: Redeploy
echo -e "${BLUE}STEP 4: Redeploying with New Configuration${NC}"
echo "========================================================================"
echo ""
echo "Now redeploying ModelLab to production..."
echo ""

vercel --prod

echo ""
echo "========================================================================"
echo -e "${GREEN}✓✓✓ UPGRADE COMPLETE! ✓✓✓${NC}"
echo "========================================================================"
echo ""
echo "Your ModelLab deployment has been upgraded!"
echo ""
echo "New Configuration:"
echo "  ✓ PostgreSQL database (persistent)"
echo "  ✓ Vercel Blob storage (persistent files)"
echo "  ✓ CORS configured"
echo "  ✓ Production optimized"
echo ""
echo "Live at: https://modellab.studio"
echo ""
echo "Test the upgrade:"
echo "  curl https://modellab.studio/api/health"
echo ""
echo "Your data will now persist between deployments!"
echo ""
echo "========================================================================"
echo ""
