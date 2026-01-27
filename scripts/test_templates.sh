#!/bin/bash
# Test ModelLab training templates end-to-end

set -e

echo "======================================================================"
echo "Testing ModelLab Training Templates"
echo "======================================================================"

# Get the directory of this script
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$( cd "$SCRIPT_DIR/.." && pwd )"

# Activate virtual environment
if [ ! -d "$PROJECT_ROOT/venv" ]; then
    echo "Error: Virtual environment not found at $PROJECT_ROOT/venv"
    echo "Run: python3 -m venv venv && source venv/bin/activate && pip install pandas numpy scikit-learn xgboost"
    exit 1
fi

source "$PROJECT_ROOT/venv/bin/activate"

# Check if sample data exists
if [ ! -f "$PROJECT_ROOT/examples/data/iris.csv" ]; then
    echo "Generating sample datasets..."
    cd "$PROJECT_ROOT/examples/data"
    python generate_sample_data.py
    cd "$PROJECT_ROOT"
fi

echo ""
echo "======================================================================"
echo "Test 1: Tabular Classification (Iris Dataset)"
echo "======================================================================"
python "$PROJECT_ROOT/ml/templates/tabular_classification.py" \
    "$PROJECT_ROOT/examples/data/iris.csv" \
    --target species \
    --seed 42

echo ""
echo "======================================================================"
echo "Test 2: Tabular Regression (House Prices Dataset)"
echo "======================================================================"
python "$PROJECT_ROOT/ml/templates/tabular_regression.py" \
    "$PROJECT_ROOT/examples/data/house_prices.csv" \
    --target price \
    --seed 42

echo ""
echo "======================================================================"
echo "Test 3: Binary Classification (Customer Churn Dataset)"
echo "======================================================================"
python "$PROJECT_ROOT/ml/templates/tabular_classification.py" \
    "$PROJECT_ROOT/examples/data/customer_churn.csv" \
    --target churn \
    --seed 42

echo ""
echo "======================================================================"
echo "Test 4: Multiclass Classification (Credit Risk Dataset)"
echo "======================================================================"
python "$PROJECT_ROOT/ml/templates/tabular_classification.py" \
    "$PROJECT_ROOT/examples/data/credit_risk.csv" \
    --target risk_level \
    --seed 42

echo ""
echo "======================================================================"
echo "All template tests completed successfully!"
echo "======================================================================"
