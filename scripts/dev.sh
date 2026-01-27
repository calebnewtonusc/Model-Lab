#!/bin/bash
# ModelLab Development Helper Script

set -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$( cd "$SCRIPT_DIR/.." && pwd )"

cd "$PROJECT_ROOT"

# Show usage
show_usage() {
    echo ""
    echo "ModelLab Development Helper"
    echo ""
    echo "Usage: ./scripts/dev.sh [command]"
    echo ""
    echo "Commands:"
    echo "  start           Start backend and frontend servers"
    echo "  backend         Start backend server only"
    echo "  frontend        Start frontend server only"
    echo "  test-api        Test all API endpoints"
    echo "  test-templates  Run training template tests"
    echo "  lint            Run linter on all code"
    echo "  format          Format all code"
    echo "  logs            View server logs"
    echo "  status          Show system status"
    echo ""
}

# Start both servers
start_all() {
    echo "======================================================================"
    echo "Starting ModelLab Development Servers"
    echo "======================================================================"
    echo ""
    echo "Backend:  http://localhost:3001"
    echo "Frontend: http://localhost:3000"
    echo ""
    echo "Press Ctrl+C to stop both servers"
    echo ""

    # Start backend in background
    echo "Starting backend..."
    npm start &
    BACKEND_PID=$!

    # Wait for backend to be ready
    sleep 3

    # Start frontend
    echo "Starting frontend..."
    cd frontend
    npm start &
    FRONTEND_PID=$!
    cd ..

    # Wait for both processes
    wait $BACKEND_PID $FRONTEND_PID
}

# Start backend only
start_backend() {
    echo "======================================================================"
    echo "Starting ModelLab Backend"
    echo "======================================================================"
    echo ""
    echo "Server: http://localhost:3001"
    echo "API:    http://localhost:3001/api/modellab"
    echo ""
    npm start
}

# Start frontend only
start_frontend() {
    echo "======================================================================"
    echo "Starting ModelLab Frontend"
    echo "======================================================================"
    echo ""
    echo "Frontend: http://localhost:3000"
    echo ""
    cd frontend
    npm start
}

# Test API endpoints
test_api() {
    echo "======================================================================"
    echo "Testing ModelLab API Endpoints"
    echo "======================================================================"

    # Check if server is running
    if ! curl -s http://localhost:3001/health > /dev/null 2>&1; then
        echo ""
        echo "Error: Backend server is not running"
        echo "Start it with: ./scripts/dev.sh backend"
        exit 1
    fi

    echo ""
    echo "✓ Server is running"

    echo ""
    echo "Testing Projects API..."
    curl -s http://localhost:3001/api/modellab/projects | jq '.' > /dev/null && echo "✓ GET /api/modellab/projects"

    echo ""
    echo "Testing Datasets API..."
    curl -s http://localhost:3001/api/modellab/datasets | jq '.' > /dev/null && echo "✓ GET /api/modellab/datasets"

    echo ""
    echo "Testing Runs API..."
    curl -s http://localhost:3001/api/modellab/runs | jq '.' > /dev/null && echo "✓ GET /api/modellab/runs"

    echo ""
    echo "======================================================================"
    echo "API Tests Complete!"
    echo "======================================================================"
}

# Run template tests
test_templates() {
    echo "======================================================================"
    echo "Running Training Template Tests"
    echo "======================================================================"
    ./scripts/test_templates.sh
}

# Run linter
lint() {
    echo "======================================================================"
    echo "Running Linter"
    echo "======================================================================"

    echo ""
    echo "Linting JavaScript..."
    npx eslint . --ext .js,.jsx --fix || true

    echo ""
    echo "Linting Python..."
    if [ -d "venv" ]; then
        source venv/bin/activate
        pip install -q flake8 black || true
        flake8 ml/ python-sdk/ --max-line-length=100 --extend-ignore=E203,W503 || true
        echo "✓ Python lint complete"
    else
        echo "⚠️  Virtual environment not found, skipping Python lint"
    fi

    echo ""
    echo "======================================================================"
    echo "Linting Complete!"
    echo "======================================================================"
}

# Format code
format() {
    echo "======================================================================"
    echo "Formatting Code"
    echo "======================================================================"

    echo ""
    echo "Formatting JavaScript..."
    npx prettier --write "**/*.{js,jsx,json,css,md}" --ignore-path .gitignore || true

    echo ""
    echo "Formatting Python..."
    if [ -d "venv" ]; then
        source venv/bin/activate
        pip install -q black || true
        black ml/ python-sdk/ || true
        echo "✓ Python formatting complete"
    else
        echo "⚠️  Virtual environment not found, skipping Python formatting"
    fi

    echo ""
    echo "======================================================================"
    echo "Formatting Complete!"
    echo "======================================================================"
}

# View logs
view_logs() {
    echo "======================================================================"
    echo "ModelLab Server Logs"
    echo "======================================================================"
    echo ""

    if [ -d "logs" ] && [ "$(ls -A logs)" ]; then
        # Show most recent log file
        LATEST_LOG=$(ls -t logs/*.log 2>/dev/null | head -1)
        if [ -n "$LATEST_LOG" ]; then
            echo "Viewing: $LATEST_LOG"
            echo ""
            tail -f "$LATEST_LOG"
        else
            echo "No log files found"
        fi
    else
        echo "No logs directory or log files found"
    fi
}

# Show system status
show_status() {
    echo "======================================================================"
    echo "ModelLab System Status"
    echo "======================================================================"

    echo ""
    echo "Backend Server:"
    if curl -s http://localhost:3001/health > /dev/null 2>&1; then
        echo "  ✓ Running at http://localhost:3001"
    else
        echo "  ✗ Not running"
    fi

    echo ""
    echo "Frontend Server:"
    if curl -s http://localhost:3000 > /dev/null 2>&1; then
        echo "  ✓ Running at http://localhost:3000"
    else
        echo "  ✗ Not running"
    fi

    echo ""
    echo "Database:"
    if [ -f "modellab.db" ]; then
        DB_SIZE=$(du -sh modellab.db | cut -f1)
        echo "  ✓ Found (Size: $DB_SIZE)"

        # Count records
        if command -v sqlite3 &> /dev/null; then
            PROJECTS=$(sqlite3 modellab.db "SELECT COUNT(*) FROM projects" 2>/dev/null || echo "N/A")
            DATASETS=$(sqlite3 modellab.db "SELECT COUNT(*) FROM datasets" 2>/dev/null || echo "N/A")
            RUNS=$(sqlite3 modellab.db "SELECT COUNT(*) FROM runs" 2>/dev/null || echo "N/A")
            echo "    Projects: $PROJECTS"
            echo "    Datasets: $DATASETS"
            echo "    Runs: $RUNS"
        fi
    else
        echo "  ✗ Not found"
    fi

    echo ""
    echo "Artifacts:"
    if [ -d "artifacts" ]; then
        ARTIFACT_COUNT=$(find artifacts -type f 2>/dev/null | wc -l | tr -d ' ')
        ARTIFACT_SIZE=$(du -sh artifacts 2>/dev/null | cut -f1)
        echo "  ✓ $ARTIFACT_COUNT files ($ARTIFACT_SIZE)"
    else
        echo "  ✗ Directory not found"
    fi

    echo ""
    echo "Virtual Environment:"
    if [ -d "venv" ]; then
        echo "  ✓ Found"
        if [ -f "venv/bin/activate" ]; then
            PYTHON_VERSION=$(venv/bin/python --version 2>&1)
            echo "    $PYTHON_VERSION"
        fi
    else
        echo "  ✗ Not found"
    fi

    echo ""
    echo "Sample Datasets:"
    if [ -d "examples/data" ]; then
        DATASET_COUNT=$(ls examples/data/*.csv 2>/dev/null | wc -l | tr -d ' ')
        echo "  ✓ $DATASET_COUNT datasets available"
    else
        echo "  ✗ Not generated"
    fi

    echo ""
    echo "======================================================================"
}

# Main command dispatcher
case "$1" in
    start)
        start_all
        ;;
    backend)
        start_backend
        ;;
    frontend)
        start_frontend
        ;;
    test-api)
        test_api
        ;;
    test-templates)
        test_templates
        ;;
    lint)
        lint
        ;;
    format)
        format
        ;;
    logs)
        view_logs
        ;;
    status)
        show_status
        ;;
    *)
        show_usage
        exit 1
        ;;
esac
