# ModelLab Deployment Guide

## Overview

ModelLab is now deployed as a standalone application at **modellab.studio**.

This is a React + Express application with JSON-based storage for ML experiment tracking.

## Architecture

```
ModelLab/
├── frontend/          # React app (Create React App)
│   ├── src/
│   │   ├── pages/ModelLab/  # Main pages (Dashboard, Datasets, Runs, Compare)
│   │   └── utils/modellab/  # Client utilities
│   ├── public/
│   └── package.json
├── api/modellab/      # Express API routes
│   ├── datasets.js    # Dataset CRUD + uploads
│   ├── runs.js        # Run tracking
│   └── artifacts.js   # Artifact storage
├── lib/               # Shared utilities
│   ├── storage.js     # JSON database operations
│   ├── schemaDetector.js
│   ├── evalHarness.js
│   └── latencyProfiler.js
├── modellab-data/     # Data storage (gitignored)
│   ├── db.json        # Main database
│   ├── datasets/      # Uploaded datasets
│   ├── runs/          # Run metadata
│   └── artifacts/     # Model artifacts
├── server.js          # Express server
├── package.json       # Root dependencies
└── vercel.json        # Vercel configuration
```

## Local Development

### Prerequisites

- Node.js 18+
- npm

### Setup

1. Install root dependencies:
```bash
npm install
```

2. Install frontend dependencies:
```bash
cd frontend
npm install
cd ..
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

The frontend will run on http://localhost:3000 and the backend on http://localhost:3001.

### Environment Variables

Copy `.env.example` to `.env` and configure:
```
PORT=3001
NODE_ENV=development
```

## Vercel Deployment

### First Time Setup

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Link to your project (or create new):
```bash
vercel link
```

4. Deploy:
```bash
vercel --prod
```

### Configure Domain

1. In Vercel dashboard, go to your project settings
2. Navigate to "Domains"
3. Add `modellab.studio` as a domain
4. Update your GoDaddy DNS settings:
   - Type: `CNAME`
   - Name: `@` (or `www`)
   - Value: `cname.vercel-dns.com`
   - TTL: 600

5. Wait for DNS propagation (can take up to 48 hours, usually much faster)

### Environment Variables on Vercel

Set these in your Vercel project settings under "Environment Variables":
```
NODE_ENV=production
```

### Build Configuration

Vercel uses the `vercel.json` configuration file:
- Frontend is built using `@vercel/static-build`
- Backend API runs on `@vercel/node`
- Routes are configured to serve API from `/api/*` and frontend from all other paths

## Data Persistence

**Important**: Vercel deployments are ephemeral. The `modellab-data/` directory will not persist between deployments.

For production use, you should:
1. Migrate to a database (PostgreSQL, MongoDB, etc.)
2. Use Vercel KV/Postgres for persistent storage
3. Or use external storage (S3, etc.) for datasets and artifacts

Current JSON file storage is suitable for:
- Development
- Demos
- Low-volume personal use

## Features

- **Dataset Management**: Upload CSVs with automatic schema detection and checksums
- **Run Tracking**: Track experiments with seeds, commit hashes, and hyperparameters
- **EvalHarness**: Standardized evaluation library with metrics and confidence intervals
- **Artifact Storage**: Store model checkpoints, plots, and reports
- **Compare Mode**: Side-by-side run comparison with statistical analysis

## API Endpoints

### Datasets
- `GET /api/modellab/datasets` - List all datasets
- `POST /api/modellab/datasets` - Upload new dataset
- `GET /api/modellab/datasets/:id` - Get dataset details
- `GET /api/modellab/datasets/:id/preview` - Preview dataset
- `PUT /api/modellab/datasets/:id` - Update dataset
- `DELETE /api/modellab/datasets/:id` - Delete dataset

### Runs
- `GET /api/modellab/runs` - List all runs
- `POST /api/modellab/runs` - Create new run
- `GET /api/modellab/runs/:id` - Get run details
- `PUT /api/modellab/runs/:id` - Update run
- `DELETE /api/modellab/runs/:id` - Delete run
- `POST /api/modellab/runs/:id/evaluate` - Submit evaluation

### Artifacts
- `GET /api/modellab/artifacts/:runId` - List run artifacts
- `POST /api/modellab/artifacts/:runId` - Upload artifact
- `GET /api/modellab/artifacts/:runId/download/:path` - Download artifact
- `DELETE /api/modellab/artifacts/:runId/:path` - Delete artifact

## Troubleshooting

### Build Fails on Vercel
- Check that all dependencies are in `package.json`
- Ensure `homepage: "."` is set in `frontend/package.json`
- Verify build command: `cd frontend && npm run build`

### API Routes Not Working
- Check `vercel.json` routes configuration
- Verify API routes are under `/api/*`
- Check server.js is exporting the Express app

### Data Loss After Deployment
- Remember: JSON file storage is ephemeral on Vercel
- Consider implementing database persistence for production

## Future Enhancements

- [ ] Migrate to PostgreSQL/Supabase
- [ ] Add user authentication
- [ ] Implement real-time updates (WebSockets)
- [ ] Add S3 integration for artifact storage
- [ ] Build comparison visualizations
- [ ] Add experiment scheduling
- [ ] Implement team collaboration features

## Support

For issues or questions, contact the development team or create an issue in the repository.

---

**Live URL**: https://modellab.studio
