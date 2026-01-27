#!/bin/bash
# ModelLab Deployment Script
# Helps deploy ModelLab to various platforms

set -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$( cd "$SCRIPT_DIR/.." && pwd )"

cd "$PROJECT_ROOT"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo ""
echo "========================================================================"
echo -e "${BLUE}ModelLab Deployment Script${NC}"
echo "========================================================================"
echo ""

# Function to show usage
show_usage() {
    echo "Usage: ./scripts/deploy.sh [platform]"
    echo ""
    echo "Platforms:"
    echo "  vercel      - Deploy to Vercel (recommended for quick start)"
    echo "  docker      - Build and start Docker containers"
    echo "  railway     - Deploy to Railway"
    echo "  render      - Deploy to Render"
    echo "  local       - Start local production server"
    echo "  check       - Check deployment readiness"
    echo ""
    echo "Examples:"
    echo "  ./scripts/deploy.sh vercel"
    echo "  ./scripts/deploy.sh docker"
    echo "  ./scripts/deploy.sh check"
    echo ""
}

# Function to check prerequisites
check_prerequisites() {
    echo -e "${BLUE}Checking prerequisites...${NC}"
    echo ""

    # Check Node.js
    if ! command -v node &> /dev/null; then
        echo -e "${RED}✗ Node.js not found${NC}"
        exit 1
    fi
    echo -e "${GREEN}✓ Node.js installed: $(node --version)${NC}"

    # Check npm
    if ! command -v npm &> /dev/null; then
        echo -e "${RED}✗ npm not found${NC}"
        exit 1
    fi
    echo -e "${GREEN}✓ npm installed: $(npm --version)${NC}"

    # Check Python
    if ! command -v python3 &> /dev/null; then
        echo -e "${RED}✗ Python not found${NC}"
        exit 1
    fi
    echo -e "${GREEN}✓ Python installed: $(python3 --version)${NC}"

    # Check if node_modules exists
    if [ ! -d "node_modules" ]; then
        echo -e "${YELLOW}⚠ node_modules not found, running npm install...${NC}"
        npm install
    else
        echo -e "${GREEN}✓ node_modules installed${NC}"
    fi

    # Check if frontend build exists
    if [ ! -d "frontend/build" ]; then
        echo -e "${YELLOW}⚠ Frontend build not found, building...${NC}"
        cd frontend && DISABLE_ESLINT_PLUGIN=true npm run build && cd ..
    else
        echo -e "${GREEN}✓ Frontend build exists${NC}"
    fi

    echo ""
}

# Function to deploy to Vercel
deploy_vercel() {
    echo -e "${BLUE}Deploying to Vercel...${NC}"
    echo ""

    # Check if vercel CLI is installed
    if ! command -v vercel &> /dev/null; then
        echo -e "${YELLOW}Vercel CLI not found. Installing...${NC}"
        npm install -g vercel
    fi

    # Check if .env exists
    if [ ! -f ".env" ]; then
        echo -e "${YELLOW}⚠ .env file not found${NC}"
        echo "Please create a .env file with your production variables."
        echo "See .env.production.template for reference."
        echo ""
        read -p "Continue anyway? (y/n) " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
    fi

    echo -e "${GREEN}Running vercel deployment...${NC}"
    echo ""
    echo "Make sure to set these environment variables in Vercel dashboard:"
    echo "  - DATABASE_URL (PostgreSQL connection string)"
    echo "  - STORAGE_TYPE (vercel-blob recommended)"
    echo "  - BLOB_READ_WRITE_TOKEN (if using Vercel Blob)"
    echo "  - ALLOWED_ORIGINS (your Vercel domain)"
    echo ""

    vercel --prod

    echo ""
    echo -e "${GREEN}✓ Deployment complete!${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Set environment variables in Vercel dashboard"
    echo "2. Set up PostgreSQL database (Neon, Supabase, or Railway)"
    echo "3. Configure Vercel Blob storage"
    echo "4. Test your deployment"
    echo ""
}

# Function to deploy with Docker
deploy_docker() {
    echo -e "${BLUE}Deploying with Docker...${NC}"
    echo ""

    # Check if Docker is installed
    if ! command -v docker &> /dev/null; then
        echo -e "${RED}✗ Docker not found${NC}"
        echo "Please install Docker: https://docs.docker.com/get-docker/"
        exit 1
    fi
    echo -e "${GREEN}✓ Docker installed${NC}"

    # Check if docker-compose is available
    if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
        echo -e "${RED}✗ docker-compose not found${NC}"
        echo "Please install docker-compose: https://docs.docker.com/compose/install/"
        exit 1
    fi
    echo -e "${GREEN}✓ docker-compose available${NC}"
    echo ""

    # Ask which profile to use
    echo "Select deployment profile:"
    echo "  1) Basic (SQLite, local storage)"
    echo "  2) With PostgreSQL"
    echo "  3) With PostgreSQL + Nginx"
    echo ""
    read -p "Enter choice (1-3): " choice

    case $choice in
        1)
            echo -e "${GREEN}Starting basic deployment...${NC}"
            docker-compose up -d
            ;;
        2)
            echo -e "${GREEN}Starting with PostgreSQL...${NC}"
            docker-compose --profile with-postgres up -d
            ;;
        3)
            echo -e "${GREEN}Starting with PostgreSQL + Nginx...${NC}"
            docker-compose --profile with-postgres --profile with-nginx up -d
            ;;
        *)
            echo -e "${RED}Invalid choice${NC}"
            exit 1
            ;;
    esac

    echo ""
    echo -e "${GREEN}✓ Docker containers started!${NC}"
    echo ""
    echo "Service URLs:"
    echo "  - Backend: http://localhost:3001"
    echo "  - API Docs: http://localhost:3001/api-docs"
    if [ "$choice" == "3" ]; then
        echo "  - Nginx Proxy: http://localhost"
    fi
    echo ""
    echo "View logs:"
    echo "  docker-compose logs -f modellab"
    echo ""
    echo "Stop containers:"
    echo "  docker-compose down"
    echo ""
}

# Function to deploy to Railway
deploy_railway() {
    echo -e "${BLUE}Deploying to Railway...${NC}"
    echo ""

    # Check if railway CLI is installed
    if ! command -v railway &> /dev/null; then
        echo -e "${YELLOW}Railway CLI not found. Installing...${NC}"
        npm install -g @railway/cli
    fi

    echo "Railway deployment steps:"
    echo "1. railway login"
    echo "2. railway init (if first time)"
    echo "3. railway add (add PostgreSQL database)"
    echo "4. railway up"
    echo ""
    echo "Environment variables will be set automatically from your railway.json"
    echo ""

    read -p "Continue with railway up? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        railway up
    fi
}

# Function to deploy to Render
deploy_render() {
    echo -e "${BLUE}Deploying to Render...${NC}"
    echo ""

    echo "Render deployment steps:"
    echo ""
    echo "1. Connect your GitHub repository to Render"
    echo "2. Create a new Web Service"
    echo "3. Set build command: npm install && cd frontend && npm install && npm run build"
    echo "4. Set start command: node server.js"
    echo "5. Add environment variables from .env.production.template"
    echo "6. Add PostgreSQL database from Render dashboard"
    echo ""
    echo "Your render.yaml is configured for automatic deployment."
    echo ""
}

# Function to start local production server
deploy_local() {
    echo -e "${BLUE}Starting local production server...${NC}"
    echo ""

    # Check if .env exists
    if [ ! -f ".env" ]; then
        echo -e "${YELLOW}⚠ .env file not found${NC}"
        echo "Creating .env from template..."
        cp .env.production.template .env
        echo ""
        echo "Please edit .env and set your production values."
        echo ""
        read -p "Continue with default values? (y/n) " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
    fi

    # Set NODE_ENV to production
    export NODE_ENV=production

    echo -e "${GREEN}Starting server in production mode...${NC}"
    echo ""

    npm start
}

# Function to check deployment readiness
check_deployment() {
    echo -e "${BLUE}Checking deployment readiness...${NC}"
    echo ""

    # Run verification script
    if [ -f "./scripts/verify_deployment.sh" ]; then
        ./scripts/verify_deployment.sh
    else
        echo -e "${RED}Verification script not found${NC}"
        exit 1
    fi
}

# Main script logic
case "${1:-}" in
    vercel)
        check_prerequisites
        deploy_vercel
        ;;
    docker)
        check_prerequisites
        deploy_docker
        ;;
    railway)
        check_prerequisites
        deploy_railway
        ;;
    render)
        check_prerequisites
        deploy_render
        ;;
    local)
        check_prerequisites
        deploy_local
        ;;
    check)
        check_deployment
        ;;
    "")
        show_usage
        ;;
    *)
        echo -e "${RED}Unknown platform: $1${NC}"
        echo ""
        show_usage
        exit 1
        ;;
esac
