# ModelLab

ML experiment tracking platform with evaluation, reproducibility, and organization features.

**SF Symbol: globe - Live Site:** [https://modellab.studio](https://modellab.studio)
**SF Symbol: book.fill - API Docs:** [Live API Documentation](https://modellab.studio/api-docs) *(Deploy backend to access)*

SF Symbol: exclamationmark.triangle - **SECURITY WARNING:** This project currently has **NO AUTHENTICATION**. It is **NOT production-ready** without implementing an authentication system. See [SECURITY.md](SECURITY.md) for details.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
![Tests](https://img.shields.io/badge/tests-60%20passing%2C%2014%20failing-yellow)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)

## Features

**Experiment Management**
- Projects workspace for organizing experiments
- Dataset versioning with SHA-256 checksums
- Experiment tracking (seeds, commits, hyperparameters)
- Reproducibility packs with downloadable ZIP archives

**Evaluation**
- Multiple metrics (Accuracy, F1, ROC-AUC, PR-AUC, ECE, RMSE, R²)
- Bootstrap confidence intervals (95%)
- Data slicing and performance analysis
- Failure analysis with error categorization
- Stress testing with data corruption

**Development Tools**
- Baseline-first training templates
- Python SDK for experiment tracking
- Python EvalHarness for evaluation
- JavaScript EvalHarness for full-stack evaluation

## SF Symbol: rocket.fill - Quick Start

### Local Development (5 minutes)

```bash
# 1. Clone and install
git clone https://github.com/calebnewtonusc/Model-Lab.git
cd Model-Lab
npm install && cd frontend && npm install && cd ..

# 2. Start the server
npm start

# 3. Open your browser
# Frontend: http://localhost:3001
# API Docs: http://localhost:3001/api-docs
# Health: http://localhost:3001/api/health
```

### Production Deployment

SF Symbol: exclamationmark.triangle - **Important:** Before deploying to production, you must implement authentication. See [SECURITY.md](SECURITY.md) for recommendations.

**Quick Deploy (Local Development Only):**
```bash
# Deploy backend to Railway (requires authentication implementation first)
./scripts/deploy-railway.sh

# Deploy frontend to Vercel
npm run vercel:deploy
```

---

## Usage

### Python SDK

```bash
cd python-sdk
pip install -e .
```

**Note:** The package name is `modellab-client` but it is **not published to PyPI**. Installation is local only via `pip install -e .`

### Python EvalHarness

```bash
cd ml/evalharness
pip install -e .
```

### Training Templates

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
├── routes/modellab/             # API route handlers
│   ├── datasets.js             # Dataset API
│   ├── runs.js                 # Runs API
│   ├── artifacts.js            # Artifacts API
│   └── projects.js             # Projects API
├── lib/
│   ├── database.js             # Database with auto-migrations
│   ├── evalHarness.js          # JS evaluation harness
│   ├── evalHarness/            # JS evaluation modules
│   └── reproPack.js            # Reproducibility packs
├── ml/
│   ├── evalharness/            # Python evaluation framework (8 modules: metrics, failures, core, ci, evaluators, slicing, plots, stress)
│   └── templates/              # Training workflows
├── python-sdk/                 # Python client library
├── frontend/                   # React UI
│   ├── src/
│   │   ├── pages/              # Dashboard, Datasets, Runs, Projects, Compare, Landing
│   │   └── components/         # SharedComponents, Error Boundary, Toast system
├── Dockerfile                  # Multi-stage Docker build
├── vercel.json                 # Vercel deployment config
└── swagger.yaml                # API documentation (optional)
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
GET    /api/modellab/runs/:id/repro        # Get repro pack data
GET    /api/modellab/runs/:id/repro/download  # Download ZIP
POST   /api/modellab/runs/:id/profile      # Submit latency profiling
```

### Artifacts
```
GET    /api/modellab/artifacts/:runId                    # List artifacts
POST   /api/modellab/artifacts                           # Log artifact metadata only (no file upload)
POST   /api/modellab/artifacts/:runId                    # Upload artifact file
GET    /api/modellab/artifacts/:runId/download/:path     # Download artifact
DELETE /api/modellab/artifacts/:runId/download/:path     # Delete artifact
```

**Note:** POST to `/api/modellab/artifacts` only logs metadata - actual file upload requires POST to `/api/modellab/artifacts/:runId` with multipart form data.

### System
```
GET    /api/health                         # Health check with DB connectivity
GET    /api/docs                           # API documentation
GET    /api-docs                           # Swagger UI interface
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

- **Frontend**: React 18 + Material-UI 5 + Emotion + Styled Components + Recharts
- **Backend**: Express.js 4.18.2 + Node.js 18+
- **Database**: SQLite 12.6.2 (better-sqlite3 with WAL mode) + PostgreSQL adapter (pg 8.17.2)
- **API Documentation**: Swagger UI Express 5.0.1 (available at `/api-docs`)
- **Python**: Python 3.8+ SDK + EvalHarness
- **Security**: Helmet 7.1.0, CORS 2.8.5, express-rate-limit 7.1.5, Joi 17.11.0 input validation
- **Visualization**: matplotlib, seaborn, Recharts
- **Deployment**: Docker multi-stage build + Vercel support

## Database

### Supported Databases
ModelLab supports both SQLite and PostgreSQL:

- **SQLite** (Default) - Ideal for local development with WAL mode enabled
- **PostgreSQL** - Production-ready with automatic adapter selection

Database selection is automatic based on environment variables:
- Set `DATABASE_URL` for PostgreSQL
- Otherwise, defaults to SQLite at `./data/modellab.db`

### Schema
- **projects** - Workspace organization
- **datasets** - Versioned with checksums
- **runs** - Experiments with hyperparameters
- **artifacts** - Model outputs
- **evaluations** - Evaluation reports

Auto-migrations run on startup for both database types.

## Reproducibility

Experiment reproducibility features:

1. **Dataset Checksums** - SHA-256 verification
2. **Seed Tracking** - All random seeds logged
3. **Commit Hashes** - Git commits recorded
4. **Environment Capture** - Node/Python versions
5. **Complete Config** - All hyperparameters stored
6. **Repro Packs** - ZIP downloads with all experiment data

## Deployment

### Docker
```bash
docker build -t modellab .
docker run -p 3001:3001 modellab
```

### Vercel
Configured with `vercel.json` for serverless deployment. Set environment variables:
```bash
DATABASE_URL=postgresql://...  # Optional: For PostgreSQL
NODE_ENV=production
```

### Local Development
```bash
npm install
npm start
```
Backend runs on `http://localhost:3001`

## Frontend Pages

- **Dashboard** - Project overview with statistics
- **Datasets** - Upload, preview, version datasets
- **Runs** - Track experiments with metrics visualization
- **Projects** - Workspace management
- **Compare** - Side-by-side run comparison
- **Landing** - Marketing page

Built with Material-UI theming and responsive design.

## API Documentation

Interactive API documentation available at:
- **Swagger UI**: `http://localhost:3001/api-docs`
- **JSON spec**: `http://localhost:3001/api/docs`

## Use Cases

- Portfolio projects with systematic experiment tracking
- Reproducible research with experiment reconstruction tools
- Baseline-first development workflow
- Failure analysis with error categorization
- Model comparison with statistical significance
- Performance profiling with latency tracking

## Known Limitations

### Security
- **No Authentication System**: The application has no user authentication or authorization. All endpoints are publicly accessible.
- **No API Keys**: No authentication tokens or API key management.
- **No Access Control**: Any user can read, modify, or delete any project, dataset, run, or artifact.
- See [SECURITY.md](SECURITY.md) for detailed security limitations and recommendations.

### Feature Completeness
- **Artifact Upload via SDK**: The Python SDK can only log artifact metadata (via POST `/api/modellab/artifacts`). Actual file uploads require using the web UI or direct API calls with multipart form data to POST `/api/modellab/artifacts/:runId`.
- **Test Coverage**: Only 60 tests passing with 14 failures. Coverage is below 50% threshold (23.92% statements, 19.08% branches).
- **Production Readiness**: While functional for local development and portfolio projects, additional work is needed for production deployment:
  - Authentication implementation required
  - Test coverage improvements needed
  - Enhanced error handling recommended

### Database
- **SQLite Default**: Uses SQLite by default, which is suitable for single-user local development but may not scale for multi-user production environments.
- **PostgreSQL Support**: PostgreSQL adapter is available but requires manual configuration via `DATABASE_URL` environment variable.

## License

MIT License

---

**Built by Caleb Newton** | [Website](https://calebnewton.me) | [GitHub](https://github.com/calebnewtonusc)
