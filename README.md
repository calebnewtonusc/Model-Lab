# ModelLab

**Your personal ML experiment command center**

ModelLab is a portfolio-grade ML experiment tracking platform that enforces reproducible runs, clean evaluation, and honest failure modes. It's infrastructure you'll reuse across RankForge, TransformerRank, Mini-NeRF, and other projects.

## What ModelLab Does

1. **Ingest and version datasets** - Upload CSVs with checksums and schema snapshots
2. **Run training jobs** - Baseline-first approach with reproducible configs
3. **Evaluate with EvalHarness** - Shared evaluation library for honest, comparable results
4. **Store artifacts** - Configs, metrics, models, plots in a reproducible structure
5. **Compare runs** - Diff metrics, configs, plots, and failure slices

## Core Promise

If someone clones this repo and follows the README, they can reproduce:
- One dataset inspection
- One train run
- One eval report
- At least one plot
- At least one failure slice
- A run comparison

## Tech Stack

- **Frontend:** Next.js (App Router) + Tailwind
- **Backend:** FastAPI
- **Database:** Supabase (Postgres)
- **ML:** Python + scikit-learn + XGBoost/LightGBM
- **Evaluation:** Custom EvalHarness library
- **Deployment:** Vercel (frontend) + Docker (backend)

## Project Structure

```
ModelLab/
├── frontend/          # Next.js web app
├── backend/           # FastAPI server
├── ml/
│   └── evalharness/   # Shared evaluation library
│       ├── core/      # Common interfaces
│       ├── metrics/   # Metric functions
│       ├── plots/     # Plotting utilities
│       ├── slicing/   # Slice evaluation
│       ├── failures/  # Failure analysis
│       ├── stress/    # Robustness tests
│       ├── ci/        # Bootstrap CIs
│       ├── bench/     # Latency profiling
│       └── schemas/   # Pydantic output models
├── artifacts/         # Run outputs (gitignored)
├── docs/              # Design docs and specs
└── tests/             # Integration tests
```

## Getting Started

### Prerequisites

- Node.js 18+
- Python 3.11+
- Docker (optional)

### Quick Start

```bash
# Clone the repository
git clone https://github.com/calebnewtonusc/ModelLab.git
cd ModelLab

# Set up frontend
cd frontend
npm install
npm run dev

# Set up backend (in another terminal)
cd backend
python -m venv venv
source venv/bin/activate  # or `venv\Scripts\activate` on Windows
pip install -r requirements.txt
uvicorn main:app --reload

# Visit http://localhost:3000
```

## Model Templates

### Tabular Classification
- **Baseline:** DummyClassifier (most frequent) → LogisticRegression
- **Improvement:** XGBoost or LightGBM
- **Evaluation:** Accuracy, ROC-AUC, F1, confusion matrix, calibration

### Tabular Regression
- **Baseline:** Mean predictor → LinearRegression
- **Improvement:** XGBoostRegressor
- **Evaluation:** MAE, RMSE, residual plots, slice analysis

## EvalHarness

ModelLab includes a shared evaluation library that enforces:

- **Standard metrics** per task type
- **Slice reports** for performance across data segments
- **Failure examples** with concrete error analysis
- **Confidence intervals** via bootstrap
- **Stress tests** for robustness
- **No-leakage checks** and baseline enforcement

Every evaluation produces:
- `eval_summary.json` - High-level metrics and pointers
- `metrics.json` - Task metrics with baselines
- `confidence_intervals.json` - Bootstrap CIs
- `slices.json` - Metrics per slice
- `failure_examples.json` - Curated failure cases
- `takeaway.txt` - 5-sentence summary
- `plots/` - Deterministic visualizations
- `repro.md` - Reproduce instructions

## Development Status

🚧 **Under Active Development** - Week 0-2 Project

- [ ] EvalHarness core library
- [ ] Dataset upload and versioning
- [ ] Training pipeline with baselines
- [ ] Run tracking and storage
- [ ] Run comparison view
- [ ] Reproducibility packs
- [ ] CI/CD pipeline
- [ ] Deployment to Vercel

## Contributing

This is a personal portfolio project, but feedback and suggestions are welcome! Open an issue or reach out.

## License

MIT

---

**Part of the 2026 ML/AI Engineering Portfolio**
Building internship-ready projects with reproducible runs and honest evaluation.
