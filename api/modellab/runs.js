/**
 * Runs API Routes
 * Handles ML experiment run tracking and management
 */

const express = require('express');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const util = require('util');
const router = express.Router();

const execAsync = util.promisify(exec);

const db = require(path.join(__dirname, '../../lib/database'));
const evalHarness = require(path.join(__dirname, '../../lib/evalHarness'));

// Get git commit hash
const getGitCommitHash = async () => {
  try {
    const { stdout } = await execAsync('git rev-parse HEAD');
    return stdout.trim();
  } catch (error) {
    return 'unknown';
  }
};

// GET all runs
router.get('/', (req, res) => {
  try {
    const runs = db.getRuns();
    res.json({ runs });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET single run
router.get('/:id', (req, res) => {
  try {
    const run = db.getRunById(req.params.id);
    if (!run) {
      return res.status(404).json({ error: 'Run not found' });
    }

    // Load evaluation data if exists
    const evaluations = db.getEvaluationsByRunId(req.params.id);

    res.json({ run, evaluations });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create run
router.post('/', async (req, res) => {
  try {
    const data = req.body;

    // Get git commit hash
    const commitHash = await getGitCommitHash();

    // Validate dataset exists
    if (data.datasetId) {
      const dataset = db.getDatasetById(data.datasetId);
      if (!dataset) {
        return res.status(400).json({ error: 'Dataset not found' });
      }
    }

    // Create artifacts directory for this run
    const runId = db.generateId();
    const artifactsDir = path.join(db.BASE_DIR, 'artifacts', runId);
    fs.mkdirSync(artifactsDir, { recursive: true });

    // Create run record
    const run = db.createRun({
      id: runId,
      name: data.name || `Run ${new Date().toLocaleString()}`,
      description: data.description || '',
      status: data.status || 'pending',
      seed: data.seed || Math.floor(Math.random() * 1000000),
      commitHash,
      datasetId: data.datasetId || null,
      datasetVersion: data.datasetVersion || null,
      hyperparameters: data.hyperparameters || {},
      config: data.config || {},
      tags: data.tags || [],
      artifactsDir,
      metrics: data.metrics || {},
      metadata: data.metadata || {}
    });

    res.status(201).json({
      run,
      message: 'Run created successfully'
    });

  } catch (error) {
    console.error('Run creation error:', error);
    res.status(500).json({ error: error.message });
  }
});

// PUT update run
router.put('/:id', (req, res) => {
  try {
    const run = db.updateRun(req.params.id, req.body);
    if (!run) {
      return res.status(404).json({ error: 'Run not found' });
    }
    res.json({ run });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE run
router.delete('/:id', (req, res) => {
  try {
    const run = db.getRunById(req.params.id);
    if (!run) {
      return res.status(404).json({ error: 'Run not found' });
    }

    // Delete artifacts directory
    if (run.artifactsDir && fs.existsSync(run.artifactsDir)) {
      fs.rmSync(run.artifactsDir, { recursive: true, force: true });
    }

    db.deleteRun(req.params.id);

    res.json({
      message: 'Run deleted successfully',
      run
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST evaluate run
router.post('/:id/evaluate', (req, res) => {
  try {
    const { predictions, labels, data, config } = req.body;
    const run = db.getRunById(req.params.id);

    if (!run) {
      return res.status(404).json({ error: 'Run not found' });
    }

    // Generate evaluation report
    const report = evalHarness.generateEvaluationReport(req.params.id, data, predictions, labels, config);

    // Save evaluation files
    const evalDir = path.join(run.artifactsDir, 'evaluations');
    const savedPaths = evalHarness.saveEvaluationReport(report, evalDir);

    // Store evaluation in database
    const evaluation = db.createEvaluation({
      runId: req.params.id,
      ...report,
      files: savedPaths
    });

    // Update run with latest metrics
    db.updateRun(req.params.id, {
      metrics: report.metrics,
      status: 'completed'
    });

    res.json({
      evaluation,
      message: 'Evaluation completed successfully'
    });

  } catch (error) {
    console.error('Evaluation error:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST latency profile for run
router.post('/:id/latency', (req, res) => {
  try {
    const { latencies } = req.body;
    const run = db.getRunById(req.params.id);

    if (!run) {
      return res.status(404).json({ error: 'Run not found' });
    }

    // Validate latency data
    if (!latencies || typeof latencies !== 'object') {
      return res.status(400).json({ error: 'Invalid latency data' });
    }

    // Save latency profile to artifact directory
    const latencyPath = path.join(run.artifactsDir, 'latency_profile.json');
    fs.writeFileSync(latencyPath, JSON.stringify(latencies, null, 2));

    // Update run with latency metrics
    const updatedRun = db.updateRun(req.params.id, {
      latencyMetrics: {
        p50: latencies.latencies?.p50 || 0,
        p95: latencies.latencies?.p95 || 0,
        p99: latencies.latencies?.p99 || 0,
        mean: latencies.latencies?.mean || 0,
        timestamp: latencies.timestamp || new Date().toISOString()
      }
    });

    res.json({
      run: updatedRun,
      message: 'Latency profile saved successfully',
      latencyPath
    });

  } catch (error) {
    console.error('Latency profile error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
