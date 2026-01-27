# ModelLab 🔬

**Production-perfect ML experiment tracking platform**

A comprehensive system for managing machine learning experiments with professional-grade evaluation, reproducibility, and organization.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## What ModelLab Does

ModelLab enforces ML best practices through systematic experiment tracking:

1. **Projects Workspace** - Organize datasets and runs into logical workspaces
2. **Dataset Management** - Upload, version, and track with SHA-256 checksums
3. **Experiment Tracking** - Record seeds, commits, hyperparameters for reproducibility
4. **Professional Evaluation** - Comprehensive metrics, CIs, slicing, failure analysis
5. **Reproducibility Packs** - One-click complete experiment reconstruction
6. **Baseline-First Templates** - Enforced best practices (Dummy → Linear → Complex)

## Key Features

### 🎯 Projects Workspace (NEW)
- Organize experiments into logical projects
- Track datasets and runs per project
- Project-level statistics and activity
- Clean separation of concerns

### 🔬 Professional Evaluation

**Python EvalHarness** - Industry-grade evaluation framework
- **Comprehensive Metrics**: Accuracy, Precision, Recall, F1, ROC-AUC, PR-AUC, ECE, RMSE, R², and more
- **Statistical Rigor**: Bootstrap confidence intervals (95%)
- **Data Slicing**: Performance across confidence deciles, features, missingness
- **Failure Analysis**: High-confidence errors, edge cases, taxonomy (6 categories)
- **Stress Tests**: Robustness via data corruption, missing values, noise
- **Deterministic Plots**: Confusion matrices, ROC/PR curves, calibration
- **Standardized Output**: JSON metrics, 5-sentence takeaways, organized artifacts

**JavaScript EvalHarness** - Full-stack evaluation
- ROC-AUC, PR-AUC, Expected Calibration Error
- Bootstrap confidence intervals
- Stress testing module
- Standardized output writer

### 📦 Reproducibility Packs (NEW)
- Complete environment capture
- Dataset checksums for verification
- Exact reproduction commands
- Dependency specifications
- Downloadable ZIP with reproduce.md

### 🏗️ Training Templates (NEW)
**Baseline-First Workflows** - Enforced best practices

- **Tabular Classification**: DummyClassifier → LogisticRegression → XGBoost
- **Tabular Regression**: MeanPredictor → LinearRegression → XGBoost
- Automatic ModelLab integration
- Side-by-side performance comparison
- Reproducible with fixed seeds

---

## Quick Start

### 1. Start Backend

```bash
npm install
node server.js
```

Server at: `http://localhost:3001`

### 2. Install Python SDK

```bash
cd python-sdk
pip install -e .
```

### 3. Install Python EvalHarness

```bash
cd ml/evalharness
pip install -e .
```

### 4. Run Training Template

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

---

## Architecture

```
ModelLab/
├── server.js                    # Express backend
├── api/modellab/
│   ├── datasets.js             # Dataset API
│   ├── runs.js                 # Runs API (+ Repro Packs)
│   ├── artifacts.js            # Artifacts API
│   └── projects.js             # Projects API ✨ NEW
├── lib/
│   ├── database.js             # SQLite with auto-migrations
│   ├── evalHarness.js          # JS evaluation (ROC-AUC, PR-AUC, ECE)
│   ├── reproPack.js            # Reproducibility ✨ NEW
│   └── evalHarness/
│       ├── stressTests.js      # Robustness testing ✨ NEW
│       └── outputWriter.js     # Standard format ✨ NEW
├── ml/
│   ├── evalharness/            # Python framework ✨ NEW (2500+ lines)
│   │   ├── core/               # Base interfaces & schemas
│   │   ├── metrics/            # Classification & regression
│   │   ├── plots/              # Deterministic visualizations
│   │   ├── slicing/            # Performance analysis
│   │   ├── failures/           # Error analysis & taxonomy
│   │   ├── ci/                 # Bootstrap confidence intervals
│   │   ├── stress/             # Corruption tests
│   │   └── evaluators/         # Complete evaluators
│   └── templates/              # Training workflows ✨ NEW
│       ├── tabular_classification.py
│       └── tabular_regression.py
├── python-sdk/                 # Python client
└── frontend/                   # React UI
    └── src/pages/ModelLab/
        ├── DashboardEnhanced.js
        ├── DatasetsEnhanced.js
        ├── RunsEnhanced.js
        ├── CompareEnhanced.js
        └── ProjectsEnhanced.js  ✨ NEW
```

---

## API Endpoints

### Projects ✨ NEW
```http
GET    /api/modellab/projects              # List all with stats
POST   /api/modellab/projects              # Create project
GET    /api/modellab/projects/:id          # Get details
PUT    /api/modellab/projects/:id          # Update
DELETE /api/modellab/projects/:id          # Delete
GET    /api/modellab/projects/:id/datasets # List project datasets
GET    /api/modellab/projects/:id/runs     # List project runs
```

### Datasets
```http
GET    /api/modellab/datasets              # List all
POST   /api/modellab/datasets              # Upload (multipart)
GET    /api/modellab/datasets/:id          # Get dataset
PUT    /api/modellab/datasets/:id          # Update metadata
DELETE /api/modellab/datasets/:id          # Delete
GET    /api/modellab/datasets/:id/preview  # Preview 100 rows
```

### Runs
```http
GET    /api/modellab/runs                  # List all
POST   /api/modellab/runs                  # Create run
GET    /api/modellab/runs/:id              # Get details
PUT    /api/modellab/runs/:id              # Update
DELETE /api/modellab/runs/:id              # Delete
POST   /api/modellab/runs/:id/evaluate     # Submit evaluation
POST   /api/modellab/runs/:id/latency      # Log latency metrics
GET    /api/modellab/runs/:id/repro        # Get repro pack ✨ NEW
GET    /api/modellab/runs/:id/repro/download # Download ZIP ✨ NEW
```

---

## Python SDK Usage

```python
from modellab import configure, start_run, log_metrics, log_params

# Configure once
configure(api_url='http://localhost:3001/api/modellab')

# Track experiment
with start_run(name='my-experiment', project_id='proj_123', seed=42) as run:
    # Log parameters
    log_params({
        'learning_rate': 0.01,
        'batch_size': 32,
        'model': 'xgboost'
    })

    # Train model...

    # Log metrics
    log_metrics({
        'accuracy': 0.95,
        'f1_score': 0.93
    })

    print(f"Run ID: {run.id}")
```

---

## Python EvalHarness Usage ✨ NEW

```python
from evalharness import evaluate

# Run comprehensive evaluation
report = evaluate(
    task_type='classification',
    predictions=y_pred,
    labels=y_true,
    data=X_test,
    output_dir='./artifacts/run_123/eval',
    config={
        'run_stress_tests': True,
        'compute_cis': True,
        'n_failures_per_type': 10
    }
)

# Access results
print(f"Accuracy: {report.metrics['accuracy']:.3f}")
print(f"ROC-AUC: {report.metrics['roc_auc']:.3f}")
print(f"ECE: {report.metrics['expected_calibration_error']:.3f}")
print(f"\nTakeaway:\n{report.get_takeaway()}")

# Generates standardized output:
# artifacts/run_123/eval/
# ├── metrics.json
# ├── confidence_intervals.json
# ├── slices.json
# ├── failure_examples.json
# ├── takeaway.txt (exactly 5 sentences)
# └── plots/
#     ├── confusion_matrix.png
#     ├── roc_curve.png
#     ├── pr_curve.png
#     ├── calibration_curve.png
#     └── confidence_histogram.png
```

---

## Training Templates Usage ✨ NEW

Templates enforce baseline-first workflow:

```bash
# Tabular classification
python ml/templates/tabular_classification.py \
  data/iris.csv \
  --target species \
  --project-id proj_123 \
  --seed 42

# Output:
# ============================================================
# BASELINE 1: DummyClassifier (Most Frequent)
# Train Accuracy: 0.3333  Test Accuracy: 0.3333
#
# BASELINE 2: LogisticRegression
# Train Accuracy: 0.9667  Test Accuracy: 0.9667
#
# IMPROVED MODEL: XGBoost
# Train Accuracy: 1.0000  Test Accuracy: 1.0000
#
# Best Model: XGBoost (Test Accuracy: 1.0000)
# ============================================================
```

Templates automatically log all three runs to ModelLab if `--project-id` provided.

---

## Tech Stack

- **Frontend**: React 18 + Styled Components + Recharts
- **Backend**: Express.js + Node.js
- **Database**: SQLite (better-sqlite3 with WAL mode) + auto-migrations
- **Python**: Python 3.8+ SDK + EvalHarness
- **Security**: Helmet, CORS, rate limiting, Joi validation
- **Visualization**: matplotlib, seaborn (Python), Recharts (JS)

---

## Security Features

- Helmet security headers (CSP, HSTS, XSS)
- CORS protection with origin whitelist
- Rate limiting (100 req/15min, 20 uploads/15min)
- Input validation with Joi schemas
- SQL injection prevention (prepared statements)
- Graceful error handling (no stack traces in prod)

---

## Database

### SQLite Schema
- **projects** - Workspace organization ✨ NEW
- **datasets** - Versioned with checksums
- **runs** - Experiments with hyperparameters
- **artifacts** - Model outputs
- **evaluations** - Evaluation reports

### Auto-Migrations
Database schema updates automatically on startup. No manual intervention needed.

---

## Reproducibility Guarantee

Every experiment is fully reproducible:

1. **Dataset Checksums** - SHA-256 verification
2. **Seed Tracking** - All random seeds logged
3. **Commit Hashes** - Git commits recorded
4. **Environment Capture** - Node/Python versions
5. **Complete Config** - All hyperparameters stored
6. **Repro Packs** - One-click ZIP downloads ✨ NEW

---

## Development Status

### ✅ Implemented (v1.0)

Core Features:
- [x] Projects workspace ✨ NEW
- [x] Dataset management with versioning
- [x] Experiment tracking
- [x] Python EvalHarness (complete 2500+ lines) ✨ NEW
- [x] JavaScript EvalHarness (enhanced) ✨ NEW
- [x] Repro Packs ✨ NEW
- [x] Training Templates ✨ NEW
- [x] React frontend
- [x] SQLite with auto-migrations
- [x] Python SDK
- [x] Comprehensive API

Security & Infrastructure:
- [x] Helmet security headers
- [x] Rate limiting
- [x] Input validation
- [x] Health checks
- [x] Graceful shutdown

### 🚧 Planned (v2.0)

- [ ] Authentication (JWT + API keys)
- [ ] PostgreSQL adapter
- [ ] Cloud storage (Vercel Blob/S3)
- [ ] Real-time monitoring
- [ ] Collaborative features
- [ ] Advanced visualizations

---

## Use Cases

1. **Portfolio Projects** - Track experiments systematically
2. **Reproducible Research** - Guarantee experiment reproducibility
3. **Baseline-First Development** - Enforce best practices
4. **Failure Analysis** - Systematic error categorization
5. **Model Comparison** - Statistical comparison with CIs
6. **Performance Profiling** - Latency tracking (P50, P95)

---

## Contributing

Feedback and suggestions welcome! This is a portfolio project showcasing ML engineering best practices.

## License

MIT License - See LICENSE file for details

---

**Built by Caleb Newton** | [Website](https://calebnewton.me) | [GitHub](https://github.com/calebnewtonusc)

**ModelLab** - Professional ML experiment tracking that enforces best practices 🔬
