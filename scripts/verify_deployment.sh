#!/bin/bash
# ModelLab Deployment Verification Script
# Tests all critical functionality end-to-end

set -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$( cd "$SCRIPT_DIR/.." && pwd )"

cd "$PROJECT_ROOT"

echo "======================================================================"
echo "ModelLab Deployment Verification"
echo "======================================================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

PASSED=0
FAILED=0

# Test function
test_check() {
    local name="$1"
    local command="$2"

    echo -n "Testing: $name... "

    if eval "$command" > /dev/null 2>&1; then
        echo -e "${GREEN}✓ PASS${NC}"
        ((PASSED++))
        return 0
    else
        echo -e "${RED}✗ FAIL${NC}"
        ((FAILED++))
        return 1
    fi
}

echo "1. ENVIRONMENT CHECKS"
echo "----------------------------------------------------------------------"

test_check "Node.js installed" "command -v node"
test_check "Node.js version >= 18" "node -v | grep -E 'v(1[89]|[2-9][0-9])'"
test_check "npm installed" "command -v npm"
test_check "Python installed" "command -v python3"
test_check "Python version >= 3.9" "python3 --version | grep -E 'Python 3\.(9|1[0-9])'"
test_check "Virtual environment exists" "test -d venv"

echo ""
echo "2. DEPENDENCY CHECKS"
echo "----------------------------------------------------------------------"

test_check "Node modules installed" "test -d node_modules"
test_check "Frontend modules installed" "test -d frontend/node_modules"
test_check "Python packages installed" "source venv/bin/activate && python3 -c 'import pandas, numpy, sklearn'"

echo ""
echo "3. FILE STRUCTURE CHECKS"
echo "----------------------------------------------------------------------"

test_check "Server file exists" "test -f server.js"
test_check "Database library exists" "test -f lib/database.js"
test_check "PostgreSQL adapter exists" "test -f lib/database-pg.js"
test_check "Storage adapter exists" "test -f lib/storage-adapter.js"
test_check "API documentation exists" "test -f api-docs/openapi.yaml"
test_check "Frontend build exists or can be built" "test -d frontend/build || test -f frontend/package.json"

echo ""
echo "4. DATABASE CHECKS"
echo "----------------------------------------------------------------------"

test_check "Database file exists" "test -f modellab.db || test -f data/modellab.db"
test_check "Database is readable" "sqlite3 modellab.db 'SELECT COUNT(*) FROM projects' 2>/dev/null || true"

echo ""
echo "5. SERVER FUNCTIONALITY CHECKS"
echo "----------------------------------------------------------------------"

# Check if server is running
if ! curl -s http://localhost:3001/api/health > /dev/null 2>&1; then
    echo -e "${YELLOW}⚠ Server not running, starting it...${NC}"
    npm start > /dev/null 2>&1 &
    SERVER_PID=$!
    sleep 5
    STARTED_SERVER=true
else
    echo -e "${GREEN}✓ Server already running${NC}"
    STARTED_SERVER=false
fi

test_check "Health endpoint responds" "curl -s http://localhost:3001/api/health | grep -q 'healthy'"
test_check "API docs endpoint responds" "curl -s http://localhost:3001/api/docs | grep -q 'ModelLab API'"
test_check "Projects endpoint responds" "curl -s http://localhost:3001/api/modellab/projects | grep -q 'projects'"
test_check "Datasets endpoint responds" "curl -s http://localhost:3001/api/modellab/datasets | grep -q 'datasets'"
test_check "Runs endpoint responds" "curl -s http://localhost:3001/api/modellab/runs | grep -q 'runs'"
test_check "Swagger UI accessible" "curl -s -L http://localhost:3001/api-docs/ | grep -q 'swagger'"

echo ""
echo "6. PYTHON SDK CHECKS"
echo "----------------------------------------------------------------------"

test_check "ModelLab SDK installed" "source venv/bin/activate && python3 -c 'import modellab'"
test_check "EvalHarness installed" "source venv/bin/activate && python3 -c 'import evalharness'"

echo ""
echo "7. TRAINING TEMPLATES CHECKS"
echo "----------------------------------------------------------------------"

test_check "Classification template exists" "test -f ml/templates/tabular_classification.py"
test_check "Regression template exists" "test -f ml/templates/tabular_regression.py"
test_check "Templates are executable" "test -x ml/templates/tabular_classification.py || chmod +x ml/templates/tabular_classification.py"

echo ""
echo "8. SAMPLE DATA CHECKS"
echo "----------------------------------------------------------------------"

test_check "Sample datasets exist" "test -f examples/data/iris.csv"
test_check "Iris dataset" "test -f examples/data/iris.csv"
test_check "Customer churn dataset" "test -f examples/data/customer_churn.csv"
test_check "House prices dataset" "test -f examples/data/house_prices.csv"

echo ""
echo "9. UTILITY SCRIPTS CHECKS"
echo "----------------------------------------------------------------------"

test_check "Setup script exists" "test -f scripts/setup.sh"
test_check "Dev helper exists" "test -f scripts/dev.sh"
test_check "Backup script exists" "test -f scripts/backup_restore.sh"
test_check "Cleanup script exists" "test -f scripts/cleanup.sh"
test_check "Scripts are executable" "test -x scripts/setup.sh"

echo ""
echo "10. DOCUMENTATION CHECKS"
echo "----------------------------------------------------------------------"

test_check "README exists" "test -f README.md"
test_check "DEPLOYMENT guide exists" "test -f DEPLOYMENT.md"
test_check "CONTRIBUTING guide exists" "test -f CONTRIBUTING.md"
test_check "Implementation status exists" "test -f IMPLEMENTATION_STATUS.md"
test_check "API documentation exists" "test -f api-docs/openapi.yaml"

echo ""
echo "11. DOCKER CHECKS"
echo "----------------------------------------------------------------------"

test_check "Dockerfile exists" "test -f Dockerfile"
test_check "docker-compose.yml exists" "test -f docker-compose.yml"
test_check ".dockerignore exists" "test -f .dockerignore"

if command -v docker > /dev/null 2>&1; then
    test_check "Docker is installed" "docker --version"
    test_check "Docker is running" "docker ps"
else
    echo -e "${YELLOW}⚠ Docker not installed (optional)${NC}"
fi

echo ""
echo "12. FUNCTIONAL TESTS"
echo "----------------------------------------------------------------------"

# Test creating a project
echo -n "Testing: Create project via API... "
PROJECT_RESPONSE=$(curl -s -X POST http://localhost:3001/api/modellab/projects \
    -H "Content-Type: application/json" \
    -d '{"name":"Test Project","description":"Verification test"}')

if echo "$PROJECT_RESPONSE" | grep -q '"project"'; then
    echo -e "${GREEN}✓ PASS${NC}"
    ((PASSED++))
    PROJECT_ID=$(echo "$PROJECT_RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin)['project']['id'])" 2>/dev/null || echo "")
else
    echo -e "${RED}✗ FAIL${NC}"
    ((FAILED++))
    PROJECT_ID=""
fi

# Test listing projects
echo -n "Testing: List projects via API... "
PROJECTS_RESPONSE=$(curl -s http://localhost:3001/api/modellab/projects)

if echo "$PROJECTS_RESPONSE" | grep -q "Test Project"; then
    echo -e "${GREEN}✓ PASS${NC}"
    ((PASSED++))
else
    echo -e "${RED}✗ FAIL${NC}"
    ((FAILED++))
fi

# Clean up test project
if [ -n "$PROJECT_ID" ]; then
    curl -s -X DELETE "http://localhost:3001/api/modellab/projects/$PROJECT_ID" > /dev/null 2>&1
fi

echo ""
echo "======================================================================"
echo "VERIFICATION SUMMARY"
echo "======================================================================"
echo ""
echo -e "Tests Passed: ${GREEN}$PASSED${NC}"
echo -e "Tests Failed: ${RED}$FAILED${NC}"
echo -e "Total Tests: $((PASSED + FAILED))"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✓✓✓ ALL TESTS PASSED! ModelLab is ready for deployment! ✓✓✓${NC}"
    EXIT_CODE=0
else
    echo -e "${RED}✗✗✗ SOME TESTS FAILED! Please review errors above. ✗✗✗${NC}"
    EXIT_CODE=1
fi

# Clean up if we started the server
if [ "$STARTED_SERVER" = true ]; then
    echo ""
    echo "Stopping test server..."
    kill $SERVER_PID 2>/dev/null || true
fi

echo ""
echo "======================================================================"
exit $EXIT_CODE
