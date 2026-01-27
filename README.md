# ModelLab

**Your personal ML experiment command center** - Now live at [modellab.studio](https://modellab.studio)

ModelLab is a production-ready ML experiment tracking platform that enforces reproducible runs, clean evaluation, and honest failure modes. Built with React and Express, it provides a complete solution for managing datasets, tracking experiments, and comparing results.

## What ModelLab Does

1. **Ingest and version datasets** - Upload CSVs with SHA-256 checksums and automatic schema detection
2. **Track experiment runs** - Record seeds, commit hashes, hyperparameters, and configs for full reproducibility
3. **Evaluate with EvalHarness** - Shared evaluation library for honest, comparable results
4. **Store artifacts** - Organize checkpoints, plots, and reports in a reproducible structure
5. **Compare runs** - Diff metrics, configs, and analyze performance side-by-side

## Live Demo

Visit **[modellab.studio](https://modellab.studio)** to see ModelLab in action.

## Features

### Dataset Management
- Drag-and-drop CSV upload
- Automatic schema detection (CSV & JSON)
- SHA-256 checksum for data integrity
- Column type inference
- Version tracking with provenance

### Run Tracking
- Reproducible seed generation
- Git commit hash capture
- Hyperparameter storage
- Status tracking (pending/running/completed/failed)
- Comprehensive metrics recording

### EvalHarness Library
- Classification & regression metrics
- Confusion matrices
- Bootstrap confidence intervals (95%)
- Slice-based performance analysis
- Failure example analysis
- Deterministic plots

### Dashboard
- Real-time statistics
- Runs over time visualization
- Status distribution
- Recent runs table
- Responsive design

### Comparison View
- Side-by-side run metrics
- Configuration diff viewer
- Statistical significance highlighting
- Radar charts for metric comparison

## Tech Stack

- **Frontend:** React 18 (Create React App) + Styled Components + Material-UI
- **Backend:** Express.js + Node.js
- **Database:** JSON file-based (with plans to migrate to PostgreSQL)
- **Visualization:** Recharts
- **Deployment:** Vercel
- **Domain:** modellab.studio (GoDaddy)

## Quick Start

### Prerequisites

- Node.js 18+
- npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/calebnewtonusc/ModelLab.git
cd ModelLab
```

2. Install dependencies:
```bash
npm run install-all
```

3. Run in development mode:

Terminal 1 (Frontend):
```bash
cd frontend
npm start
```

Terminal 2 (Backend):
```bash
npm run dev
```

Visit http://localhost:3000 to access ModelLab.

## Project Structure

```
ModelLab/
├── frontend/              # React application
│   ├── src/
│   │   ├── pages/ModelLab/    # Main pages
│   │   │   ├── DashboardEnhanced.js
│   │   │   ├── DatasetsEnhanced.js
│   │   │   ├── RunsEnhanced.js
│   │   │   └── CompareEnhanced.js
│   │   └── utils/             # Client utilities
│   └── package.json
├── api/modellab/          # Express API routes
│   ├── datasets.js
│   ├── runs.js
│   └── artifacts.js
├── lib/                   # Shared libraries
│   ├── storage.js         # JSON database
│   ├── schemaDetector.js  # Schema inference
│   ├── evalHarness.js     # Evaluation library
│   └── latencyProfiler.js # Performance profiling
├── modellab-data/         # Data storage (gitignored)
├── server.js              # Express server
└── vercel.json            # Vercel config
```

## API Documentation

### Datasets

- `GET /api/modellab/datasets` - List all datasets
- `POST /api/modellab/datasets` - Upload new dataset (multipart/form-data)
- `GET /api/modellab/datasets/:id` - Get dataset by ID
- `GET /api/modellab/datasets/:id/preview` - Preview first 100 rows
- `PUT /api/modellab/datasets/:id` - Update dataset metadata
- `DELETE /api/modellab/datasets/:id` - Delete dataset

### Runs

- `GET /api/modellab/runs` - List all runs
- `POST /api/modellab/runs` - Create new run
- `GET /api/modellab/runs/:id` - Get run details
- `PUT /api/modellab/runs/:id` - Update run
- `DELETE /api/modellab/runs/:id` - Delete run
- `POST /api/modellab/runs/:id/evaluate` - Submit evaluation results

### Artifacts

- `GET /api/modellab/artifacts/:runId` - List artifacts for run
- `POST /api/modellab/artifacts/:runId` - Upload artifact
- `GET /api/modellab/artifacts/:runId/download/:path` - Download artifact
- `DELETE /api/modellab/artifacts/:runId/:path` - Delete artifact

## Deployment

ModelLab is deployed on Vercel at [modellab.studio](https://modellab.studio).

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md).

### Quick Deploy

```bash
vercel --prod
```

## Development Status

**Production Ready** - Deployed at modellab.studio

Core features:
- [x] Dataset upload and versioning
- [x] Run tracking with reproducibility
- [x] EvalHarness evaluation library
- [x] Artifact storage
- [x] Dashboard with visualizations
- [x] Run comparison view
- [x] Vercel deployment
- [x] Custom domain (modellab.studio)

Planned enhancements:
- [ ] PostgreSQL/Supabase migration
- [ ] User authentication
- [ ] Real-time updates
- [ ] S3 artifact storage
- [ ] Advanced visualizations
- [ ] Team collaboration

## Use Cases

1. **Portfolio Projects** - Track experiments for RankForge, TransformerRank, Mini-NeRF
2. **Reproducible Research** - Ensure experiments can be replicated with seed + commit hash
3. **Model Comparison** - Compare baselines vs improvements with statistical rigor
4. **Failure Analysis** - Identify and analyze failure modes systematically
5. **Performance Profiling** - Track latency metrics (P50, P95) across experiments

## Contributing

This is a personal portfolio project, but feedback and suggestions are welcome!

## License

MIT License - See LICENSE file for details

---

**Built by Caleb Newton** | [Website](https://calebnewton.tech) | [GitHub](https://github.com/calebnewtonusc)

Part of the 2026 ML/AI Engineering Portfolio
