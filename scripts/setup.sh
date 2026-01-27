#!/bin/bash
# ModelLab Setup Script - Quick start for development

set -e

echo "======================================================================"
echo "ModelLab Setup Script"
echo "======================================================================"

# Get project root
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$( cd "$SCRIPT_DIR/.." && pwd )"

cd "$PROJECT_ROOT"

echo ""
echo "Step 1: Installing Node.js dependencies..."
echo "----------------------------------------------------------------------"
if [ ! -d "node_modules" ]; then
    npm install
else
    echo "✓ Node modules already installed"
fi

echo ""
echo "Step 2: Setting up Python virtual environment..."
echo "----------------------------------------------------------------------"
if [ ! -d "venv" ]; then
    python3 -m venv venv
    echo "✓ Virtual environment created"
else
    echo "✓ Virtual environment already exists"
fi

source venv/bin/activate

echo ""
echo "Step 3: Installing Python dependencies..."
echo "----------------------------------------------------------------------"
pip install --upgrade pip
pip install pandas numpy scikit-learn xgboost matplotlib seaborn pydantic

# Install ModelLab Python SDK
echo ""
echo "Step 4: Installing ModelLab Python SDK..."
echo "----------------------------------------------------------------------"
cd python-sdk
pip install -e .
cd ..

# Install EvalHarness
echo ""
echo "Step 5: Installing ModelLab EvalHarness..."
echo "----------------------------------------------------------------------"
cd ml/evalharness
pip install -e .
cd ../..

echo ""
echo "Step 6: Creating required directories..."
echo "----------------------------------------------------------------------"
mkdir -p artifacts
mkdir -p logs
mkdir -p examples/data
mkdir -p examples/notebooks
echo "✓ Directories created"

echo ""
echo "Step 7: Generating sample datasets..."
echo "----------------------------------------------------------------------"
cd examples/data
python generate_sample_data.py
cd ../..

echo ""
echo "Step 8: Initializing database..."
echo "----------------------------------------------------------------------"
# Start server briefly to initialize database
node server.js &
SERVER_PID=$!
sleep 3
kill $SERVER_PID 2>/dev/null || true
echo "✓ Database initialized"

echo ""
echo "======================================================================"
echo "Setup Complete!"
echo "======================================================================"
echo ""
echo "Next steps:"
echo "  1. Start the backend server:"
echo "     npm start"
echo ""
echo "  2. In a new terminal, start the frontend:"
echo "     cd frontend && npm start"
echo ""
echo "  3. Try a training template:"
echo "     source venv/bin/activate"
echo "     python ml/templates/tabular_classification.py examples/data/iris.csv --target species"
echo ""
echo "  4. Run all tests:"
echo "     ./scripts/test_templates.sh"
echo ""
echo "For more information, see README.md"
echo "======================================================================"
