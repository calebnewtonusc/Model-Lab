# ModelLab Training Templates

Baseline-first workflow templates for common ML tasks. These templates enforce best practices by running multiple models in sequence, from simple baselines to complex models.

## Philosophy

**Always start with baselines!** Complex models without baselines are uninterpretable. These templates ensure you:

1. **Understand the problem**: Dummy/naive baselines show if there's signal
2. **Establish a floor**: Simple models set minimum acceptable performance
3. **Justify complexity**: Complex models must beat simples to be worthwhile

## Available Templates

### 1. Tabular Classification
`tabular_classification.py`

**Workflow:**
1. **DummyClassifier** (most frequent) - Sanity check
2. **LogisticRegression** - Linear baseline
3. **XGBoost** - Nonlinear improved model

**Usage:**
```bash
python tabular_classification.py data.csv --target label --project-id proj_123 --seed 42
```

### 2. Tabular Regression
`tabular_regression.py`

**Workflow:**
1. **MeanPredictor** - Naive baseline
2. **LinearRegression** - Linear baseline
3. **XGBoost** - Nonlinear improved model

**Usage:**
```bash
python tabular_regression.py data.csv --target price --project-id proj_123 --seed 42
```

## Requirements

```bash
pip install pandas numpy scikit-learn
pip install xgboost  # Optional but recommended

# For experiment tracking (install from source)
cd ../../python-sdk
pip install -e .
```

## Features

- **Automatic baseline comparison**: See all models side-by-side
- **ModelLab integration**: Automatically logs all runs if project-id provided
- **Reproducible**: Fixed seeds ensure consistent results
- **Fallback support**: Works without XGBoost (uses RandomForest)
- **Clear output**: Formatted tables show performance comparison

## Example Output

```
================================================================================
MODELLAB BASELINE-FIRST WORKFLOW
Tabular Classification
================================================================================

Loading data from: iris.csv
Dataset shape: (150, 5)
Target column: species
Classes: ['setosa' 'versicolor' 'virginica']

Train set: 120 samples
Test set:  30 samples

============================================================
BASELINE 1: DummyClassifier (Most Frequent)
============================================================
Train Accuracy: 0.3333
Test Accuracy:  0.3333

============================================================
BASELINE 2: LogisticRegression
============================================================
Train Accuracy: 0.9667
Test Accuracy:  0.9667

============================================================
IMPROVED MODEL: XGBoost
============================================================
Train Accuracy: 1.0000
Test Accuracy:  1.0000

================================================================================
RESULTS COMPARISON
================================================================================
Model                     Train Accuracy       Test Accuracy
--------------------------------------------------------------------------------
DummyClassifier           0.3333               0.3333
LogisticRegression        0.9667               0.9667
XGBoost                   1.0000               1.0000

Best Model: XGBoost (Test Accuracy: 1.0000)
```

## Tips

1. **Always review all three results** - Don't just look at the best model
2. **Check for overfitting** - Large train/test gap indicates problems
3. **Dummy baseline is crucial** - If it's close to other models, you have a problem
4. **Linear models are interpretable** - If LogReg is close to XGBoost, prefer it
5. **Use project IDs** - Organize experiments in ModelLab projects

## Extending

To create your own template:

1. Copy an existing template
2. Modify the `run_baseline_*` and `run_improved_model` functions
3. Update the evaluation metrics
4. Add to this README

## License

MIT - Use freely for your ML projects!
