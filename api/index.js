/**
 * Vercel Serverless Function - Main API Handler
 * Routes all API requests to the appropriate handlers
 */

const express = require('express');
const cors = require('cors');

// Import route handlers
const datasetsRouter = require('./modellab/datasets');
const runsRouter = require('./modellab/runs');
const artifactsRouter = require('./modellab/artifacts');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/modellab/datasets', datasetsRouter);
app.use('/api/modellab/runs', runsRouter);
app.use('/api/modellab/artifacts', artifactsRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Export for Vercel serverless
module.exports = app;
