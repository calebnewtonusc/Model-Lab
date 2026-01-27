#!/bin/bash

# ModelLab Installation Test Script
# Validates that all components are properly installed and configured

set -e  # Exit on error

echo "╔════════════════════════════════════════════════════════════╗"
echo "║         ModelLab Installation Validation Test             ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counter
PASSED=0
FAILED=0

# Test function
test_check() {
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓${NC} $1"
        ((PASSED++))
    else
        echo -e "${RED}✗${NC} $1"
        ((FAILED++))
    fi
}

# 1. Check Node.js version
echo "Checking Node.js version..."
NODE_VERSION=$(node --version 2>/dev/null | grep -oE '[0-9]+' | head -1)
if [ "$NODE_VERSION" -ge 18 ]; then
    test_check "Node.js >= 18 installed (v$(node --version))"
else
    test_check "Node.js >= 18 required (found v$(node --version))" && false
fi

# 2. Check npm
echo "Checking npm..."
npm --version > /dev/null 2>&1
test_check "npm installed (v$(npm --version))"

# 3. Check backend dependencies
echo "Checking backend dependencies..."
if [ -d "node_modules" ]; then
    test_check "Backend dependencies installed"
else
    echo -e "${YELLOW}!${NC} Running npm install..."
    npm install > /dev/null 2>&1
    test_check "Backend dependencies installed"
fi

# 4. Check frontend dependencies
echo "Checking frontend dependencies..."
if [ -d "frontend/node_modules" ]; then
    test_check "Frontend dependencies installed"
else
    echo -e "${YELLOW}!${NC} Running frontend npm install..."
    cd frontend && npm install > /dev/null 2>&1 && cd ..
    test_check "Frontend dependencies installed"
fi

# 5. Check required files
echo "Checking required files..."
[ -f "server.js" ]
test_check "server.js exists"

[ -f ".env.example" ]
test_check ".env.example exists"

[ -f "package.json" ]
test_check "package.json exists"

[ -f "lib/database.js" ]
test_check "lib/database.js exists"

[ -f "lib/validation.js" ]
test_check "lib/validation.js exists"

[ -f "frontend/package.json" ]
test_check "frontend/package.json exists"

# 6. Check directory structure
echo "Checking directory structure..."
[ -d "api/modellab" ]
test_check "api/modellab/ directory exists"

[ -d "lib" ]
test_check "lib/ directory exists"

[ -d "frontend/src" ]
test_check "frontend/src/ directory exists"

[ -d "python-sdk/modellab" ]
test_check "python-sdk/modellab/ directory exists"

# 7. Check data directories
echo "Checking data directories..."
[ -d "data" ] || mkdir -p data
test_check "data/ directory exists"

[ -d "modellab-data" ] || mkdir -p modellab-data
test_check "modellab-data/ directory exists"

# 8. Check Python (optional, for SDK)
echo "Checking Python (optional)..."
if command -v python3 &> /dev/null; then
    PYTHON_VERSION=$(python3 --version 2>&1 | grep -oE '[0-9]+\.[0-9]+' | head -1)
    test_check "Python 3 installed (v$PYTHON_VERSION)"
else
    echo -e "${YELLOW}!${NC} Python 3 not found (optional for SDK)"
fi

# 9. Test server startup (quick check)
echo "Testing server startup..."
timeout 5 node server.js > /dev/null 2>&1 &
SERVER_PID=$!
sleep 2

if kill -0 $SERVER_PID 2>/dev/null; then
    test_check "Server starts successfully"
    kill $SERVER_PID 2>/dev/null
else
    test_check "Server starts successfully" && false
fi

# 10. Check database initialization
echo "Checking database..."
if [ -f "data/modellab.db" ]; then
    test_check "Database file created"
else
    echo -e "${YELLOW}!${NC} Database will be created on first run"
fi

# 11. Verify documentation
echo "Checking documentation..."
[ -f "README.md" ]
test_check "README.md exists"

[ -f "DEPLOYMENT.md" ]
test_check "DEPLOYMENT.md exists"

[ -f "CONTRIBUTING.md" ]
test_check "CONTRIBUTING.md exists"

[ -f "SECURITY.md" ]
test_check "SECURITY.md exists"

[ -f "AUDIT.md" ]
test_check "AUDIT.md exists"

# Summary
echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                     Test Summary                           ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo -e "Tests passed: ${GREEN}$PASSED${NC}"
echo -e "Tests failed: ${RED}$FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✓ All tests passed!${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Configure environment: cp .env.example .env && nano .env"
    echo "2. Start backend: npm run dev"
    echo "3. Start frontend: cd frontend && npm start"
    echo "4. Visit: http://localhost:3000"
    echo ""
    exit 0
else
    echo -e "${RED}✗ Some tests failed. Please fix the issues above.${NC}"
    echo ""
    exit 1
fi
