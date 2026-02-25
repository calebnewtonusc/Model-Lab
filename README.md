# ModelLab

![React](https://img.shields.io/badge/React-18-61dafb?logo=react&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?logo=nodedotjs&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-WAL%20mode-003B57?logo=sqlite&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-supported-4169E1?logo=postgresql&logoColor=white)
![Python](https://img.shields.io/badge/Python-3.8%2B-3776AB?logo=python&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-multi--stage-2496ED?logo=docker&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-yellow)

ML experiment tracking platform for organizing projects, versioning datasets, logging runs, and evaluating models, with a Python SDK, eval harness, and reproducibility packs built in.

**Live site:** [modellab.studio](https://modellab.studio) &nbsp;|&nbsp; **API docs:** [modellab.studio/api-docs](https://modellab.studio/api-docs)

> Screenshot

## Features

- **Experiment tracking**: log hyperparameters, seeds, Git commit hashes, and environment details per run
- **Dataset versioning**: upload datasets with SHA-256 checksums for integrity verification and reproducibility
- **Evaluation harness**: compute Accuracy, F1, ROC-AUC, PR-AUC, ECE, RMSE, and R² with 95% bootstrap confidence intervals
- **Failure & stress analysis**: categorize error types and run data-corruption stress tests against trained models
- **Reproducibility packs**: download a ZIP archive containing the full experiment config, metrics, and artifacts for any run
- **Python SDK**: instrument training scripts with `start_run`, `log_params`, and `log_metrics` in a few lines of code

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Material-UI 5, Recharts, Emotion |
| Backend | Express.js 4, Node.js 18+ |
| Database | SQLite (WAL mode, default) / PostgreSQL (via `DATABASE_URL`) |
| Python | Python 3.8+ SDK, EvalHarness (metrics, calibration, slicing, stress) |
| API Docs | Swagger UI at `/api-docs` |
| Deployment | Docker multi-stage build, Vercel, Railway |

## Getting Started

```bash
# Clone and install
git clone https://github.com/calebnewtonusc/Model-Lab.git
cd Model-Lab
npm install && cd frontend && npm install && cd ..

# Start the server (backend + serves frontend)
npm start

# Open in browser
# App:      http://localhost:3001
# API docs: http://localhost:3001/api-docs
```

### Python SDK

```bash
cd python-sdk && pip install -e .
```

```python
from modellab import configure, start_run, log_metrics, log_params

configure(api_url='http://localhost:3001/api/modellab')

with start_run(name='xgboost-v1', project_id='proj_123', seed=42) as run:
    log_params({'learning_rate': 0.01, 'batch_size': 32})
    # ... train model ...
    log_metrics({'accuracy': 0.95, 'f1_score': 0.93})
```

### Python EvalHarness

```bash
cd ml/evalharness && pip install -e .
```

```python
from evalharness import evaluate

report = evaluate(
    task_type='classification',
    predictions=y_pred,
    labels=y_true,
    data=X_test,
    config={'run_stress_tests': True, 'compute_cis': True}
)
print(f"Accuracy: {report.metrics['accuracy']:.3f}")
print(f"ECE:      {report.metrics['expected_calibration_error']:.3f}")
```

### Docker

```bash
docker build -t modellab .
docker run -p 3001:3001 modellab
```

## Project Structure

```
ModelLab/
├── server.js                  # Express backend entry point
├── routes/modellab/           # REST API route handlers
├── lib/                       # Database, eval harness, repro pack logic
├── ml/
│   ├── evalharness/           # Python evaluation framework
│   └── templates/             # Baseline-first training templates
├── python-sdk/                # Python client library
└── frontend/src/
    └── pages/                 # Dashboard, Datasets, Runs, Projects, Compare
```

## Author

**Caleb Newton** | [calebnewton.me](https://calebnewton.me) | [GitHub](https://github.com/calebnewtonusc)
