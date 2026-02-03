# ModelLab

ML experiment tracking platform with professional-grade evaluation, reproducibility, and organization.

**🌐 Live Site:** [https://modellab.studio](https://modellab.studio)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

**Experiment Management**
- Projects workspace for organizing experiments
- Dataset versioning with SHA-256 checksums
- Experiment tracking (seeds, commits, hyperparameters)
- Reproducibility packs with one-click reconstruction

**Professional Evaluation**
- Comprehensive metrics (Accuracy, F1, ROC-AUC, PR-AUC, ECE, RMSE, R²)
- Bootstrap confidence intervals (95%)
- Data slicing and performance analysis
- Failure analysis with error categorization
- Stress testing for robustness

**Development Tools**
- Baseline-first training templates
- Python SDK for experiment tracking
- Python EvalHarness for evaluation
- JavaScript EvalHarness for full-stack evaluation

## Quick Start

### Backend Setup
```bash
npm install
node server.js  # Server at http://localhost:3001
```

### Python SDK
```bash
cd python-sdk
pip install -e .
```

### Python EvalHarness
```bash
cd ml/evalharness
pip install -e .
```

### Run Training Template
```bash
# Classification example
python ml/templates/tabular_classification.py \
  data/iris.csv \
  --target species \
  --project-id proj_123 \
  --seed 42

# Regression example
python ml/templates/tabular_regression.py \
  data/housing.csv \
  --target price \
  --project-id proj_123
```

## Project Structure

```
ModelLab/
├── server.js                    # Express backend
├── api/modellab/
│   ├── datasets.js             # Dataset API
│   ├── runs.js                 # Runs API
│   ├── artifacts.js            # Artifacts API
│   └── projects.js             # Projects API
├── lib/
│   ├── database.js             # SQLite with auto-migrations
│   ├── evalHarness.js          # JS evaluation
│   └── reproPack.js            # Reproducibility
├── ml/
│   ├── evalharness/            # Python evaluation framework
│   └── templates/              # Training workflows
├── python-sdk/                 # Python client
└── frontend/                   # React UI
```

## API Endpoints

### Projects
```
GET    /api/modellab/projects              # List all
POST   /api/modellab/projects              # Create
GET    /api/modellab/projects/:id          # Get details
PUT    /api/modellab/projects/:id          # Update
DELETE /api/modellab/projects/:id          # Delete
```

### Datasets
```
GET    /api/modellab/datasets              # List all
POST   /api/modellab/datasets              # Upload
GET    /api/modellab/datasets/:id          # Get dataset
PUT    /api/modellab/datasets/:id          # Update
DELETE /api/modellab/datasets/:id          # Delete
GET    /api/modellab/datasets/:id/preview  # Preview data
```

### Runs
```
GET    /api/modellab/runs                  # List all
POST   /api/modellab/runs                  # Create
GET    /api/modellab/runs/:id              # Get details
PUT    /api/modellab/runs/:id              # Update
DELETE /api/modellab/runs/:id              # Delete
POST   /api/modellab/runs/:id/evaluate     # Submit evaluation
GET    /api/modellab/runs/:id/repro        # Get repro pack
```

## Python SDK Usage

```python
from modellab import configure, start_run, log_metrics, log_params

# Configure
configure(api_url='http://localhost:3001/api/modellab')

# Track experiment
with start_run(name='my-experiment', project_id='proj_123', seed=42) as run:
    log_params({
        'learning_rate': 0.01,
        'batch_size': 32,
        'model': 'xgboost'
    })

    # Train model...

    log_metrics({
        'accuracy': 0.95,
        'f1_score': 0.93
    })

    print(f"Run ID: {run.id}")
```

## Python EvalHarness Usage

```python
from evalharness import evaluate

# Run evaluation
report = evaluate(
    task_type='classification',
    predictions=y_pred,
    labels=y_true,
    data=X_test,
    output_dir='./artifacts/run_123/eval',
    config={
        'run_stress_tests': True,
        'compute_cis': True
    }
)

# Access results
print(f"Accuracy: {report.metrics['accuracy']:.3f}")
print(f"ROC-AUC: {report.metrics['roc_auc']:.3f}")
print(f"ECE: {report.metrics['expected_calibration_error']:.3f}")
```

## Training Templates

Templates enforce baseline-first workflow:

```bash
python ml/templates/tabular_classification.py \
  data/iris.csv \
  --target species \
  --project-id proj_123 \
  --seed 42
```

Output:
```
BASELINE 1: DummyClassifier (Most Frequent)
Train Accuracy: 0.3333  Test Accuracy: 0.3333

BASELINE 2: LogisticRegression
Train Accuracy: 0.9667  Test Accuracy: 0.9667

IMPROVED MODEL: XGBoost
Train Accuracy: 1.0000  Test Accuracy: 1.0000

Best Model: XGBoost (Test Accuracy: 1.0000)
```

## Tech Stack

- **Frontend**: React 18 + Styled Components + Recharts
- **Backend**: Express.js + Node.js
- **Database**: SQLite (better-sqlite3 with WAL mode)
- **Python**: Python 3.8+ SDK + EvalHarness
- **Security**: Helmet, CORS, rate limiting, input validation
- **Visualization**: matplotlib, seaborn, Recharts

## Database Schema

- **projects** - Workspace organization
- **datasets** - Versioned with checksums
- **runs** - Experiments with hyperparameters
- **artifacts** - Model outputs
- **evaluations** - Evaluation reports

Auto-migrations run on startup.

## Reproducibility

Every experiment is fully reproducible:

1. **Dataset Checksums** - SHA-256 verification
2. **Seed Tracking** - All random seeds logged
3. **Commit Hashes** - Git commits recorded
4. **Environment Capture** - Node/Python versions
5. **Complete Config** - All hyperparameters stored
6. **Repro Packs** - One-click ZIP downloads

## Use Cases

- Portfolio projects with systematic experiment tracking
- Reproducible research with guaranteed experiment reconstruction
- Baseline-first development enforcing best practices
- Failure analysis with systematic error categorization
- Model comparison with statistical significance
- Performance profiling with latency tracking

## License

MIT License

---

**Built by Caleb Newton** | [Website](https://calebnewton.me) | [GitHub](https://github.com/calebnewtonusc)
