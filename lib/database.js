/**
 * Database Module for ModelLab
 * Automatically switches between PostgreSQL and SQLite
 */

// If PostgreSQL is configured, use it
if (process.env.DATABASE_URL) {
  console.log('[Database] Using PostgreSQL');
  module.exports = require('./database-pg');
} else {
  // SQLite implementation
  console.log('[Database] Using SQLite');

const sqlite3 = require('better-sqlite3');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

// Database file location
const DB_DIR = path.join(__dirname, '..', 'data');
const DB_PATH = path.join(DB_DIR, 'modellab.db');
const BASE_DIR = path.join(process.cwd(), 'modellab-data');

// Ensure data directory exists
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

// Ensure base directory exists
if (!fs.existsSync(BASE_DIR)) {
  fs.mkdirSync(BASE_DIR, { recursive: true });
  fs.mkdirSync(path.join(BASE_DIR, 'datasets'), { recursive: true });
  fs.mkdirSync(path.join(BASE_DIR, 'runs'), { recursive: true });
  fs.mkdirSync(path.join(BASE_DIR, 'artifacts'), { recursive: true });
}

// Initialize database
const db = sqlite3(DB_PATH);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS projects (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS datasets (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    file_path TEXT,
    file_type TEXT,
    file_count INTEGER DEFAULT 0,
    total_size INTEGER DEFAULT 0,
    schema TEXT,
    checksum TEXT,
    version INTEGER DEFAULT 1,
    tags TEXT,
    metadata TEXT,
    project_id TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (project_id) REFERENCES projects(id)
  );

  CREATE TABLE IF NOT EXISTS runs (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    dataset_id TEXT,
    status TEXT NOT NULL,
    config TEXT,
    metrics TEXT,
    seed INTEGER,
    commit_hash TEXT,
    project_id TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    completed_at TEXT,
    FOREIGN KEY (dataset_id) REFERENCES datasets(id),
    FOREIGN KEY (project_id) REFERENCES projects(id)
  );

  CREATE TABLE IF NOT EXISTS artifacts (
    id TEXT PRIMARY KEY,
    run_id TEXT NOT NULL,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    size INTEGER NOT NULL,
    checksum TEXT NOT NULL,
    path TEXT NOT NULL,
    created_at TEXT NOT NULL,
    FOREIGN KEY (run_id) REFERENCES runs(id)
  );

  CREATE TABLE IF NOT EXISTS evaluations (
    id TEXT PRIMARY KEY,
    run_id TEXT NOT NULL,
    metrics TEXT,
    slices TEXT,
    failure_examples TEXT,
    files TEXT,
    created_at TEXT NOT NULL,
    FOREIGN KEY (run_id) REFERENCES runs(id)
  );

  CREATE INDEX IF NOT EXISTS idx_runs_dataset_id ON runs(dataset_id);
  CREATE INDEX IF NOT EXISTS idx_runs_status ON runs(status);
  CREATE INDEX IF NOT EXISTS idx_runs_created_at ON runs(created_at);
  CREATE INDEX IF NOT EXISTS idx_artifacts_run_id ON artifacts(run_id);
  CREATE INDEX IF NOT EXISTS idx_evaluations_run_id ON evaluations(run_id);
`);

// Run migrations to add project_id columns to existing tables
try {
  // Check if datasets table has project_id column
  const datasetsInfo = db.prepare("PRAGMA table_info(datasets)").all();
  const datasetsHasProjectId = datasetsInfo.some(col => col.name === 'project_id');

  if (!datasetsHasProjectId) {
    db.exec('ALTER TABLE datasets ADD COLUMN project_id TEXT REFERENCES projects(id)');
    console.log('✓ Added project_id column to datasets table');
  }

  // Check if runs table has project_id column
  const runsInfo = db.prepare("PRAGMA table_info(runs)").all();
  const runsHasProjectId = runsInfo.some(col => col.name === 'project_id');

  if (!runsHasProjectId) {
    db.exec('ALTER TABLE runs ADD COLUMN project_id TEXT REFERENCES projects(id)');
    console.log('✓ Added project_id column to runs table');
  }

  // Create indexes on project_id columns after migration
  db.exec('CREATE INDEX IF NOT EXISTS idx_runs_project_id ON runs(project_id)');
  db.exec('CREATE INDEX IF NOT EXISTS idx_datasets_project_id ON datasets(project_id)');
} catch (error) {
  console.error('Migration error:', error.message);
}

// Dataset operations
const createDataset = db.prepare(`
  INSERT INTO datasets (id, name, description, file_path, file_type, file_count, total_size, schema, checksum, version, tags, metadata, project_id, created_at, updated_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const getDataset = db.prepare('SELECT * FROM datasets WHERE id = ?');
const getAllDatasets = db.prepare('SELECT * FROM datasets ORDER BY created_at DESC');
const updateDataset = db.prepare(`
  UPDATE datasets
  SET name = ?, description = ?, file_path = ?, file_type = ?, file_count = ?, total_size = ?, schema = ?, checksum = ?, tags = ?, metadata = ?, updated_at = ?
  WHERE id = ?
`);
const deleteDataset = db.prepare('DELETE FROM datasets WHERE id = ?');

// Run operations
const createRun = db.prepare(`
  INSERT INTO runs (id, name, description, dataset_id, status, config, metrics, seed, commit_hash, project_id, created_at, updated_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const getRun = db.prepare('SELECT * FROM runs WHERE id = ?');
const getAllRuns = db.prepare('SELECT * FROM runs ORDER BY created_at DESC');
const updateRun = db.prepare(`
  UPDATE runs
  SET name = COALESCE(?, name),
      description = COALESCE(?, description),
      status = COALESCE(?, status),
      config = COALESCE(?, config),
      metrics = COALESCE(?, metrics),
      completed_at = COALESCE(?, completed_at),
      updated_at = ?
  WHERE id = ?
`);
const deleteRun = db.prepare('DELETE FROM runs WHERE id = ?');

// Artifact operations
const createArtifact = db.prepare(`
  INSERT INTO artifacts (id, run_id, name, type, size, checksum, path, created_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);

const getArtifact = db.prepare('SELECT * FROM artifacts WHERE id = ?');
const getArtifactsByRunId = db.prepare('SELECT * FROM artifacts WHERE run_id = ? ORDER BY created_at DESC');
const getAllArtifacts = db.prepare('SELECT * FROM artifacts ORDER BY created_at DESC');
const deleteArtifact = db.prepare('DELETE FROM artifacts WHERE id = ?');

// Evaluation operations
const createEvaluation = db.prepare(`
  INSERT INTO evaluations (id, run_id, metrics, slices, failure_examples, files, created_at)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`);

const getEvaluation = db.prepare('SELECT * FROM evaluations WHERE id = ?');
const getEvaluationsByRunId = db.prepare('SELECT * FROM evaluations WHERE run_id = ? ORDER BY created_at DESC');
const getAllEvaluations = db.prepare('SELECT * FROM evaluations ORDER BY created_at DESC');
const deleteEvaluation = db.prepare('DELETE FROM evaluations WHERE id = ?');

// Project operations
const createProject = db.prepare(`
  INSERT INTO projects (id, name, description, created_at, updated_at)
  VALUES (?, ?, ?, ?, ?)
`);

const getProject = db.prepare('SELECT * FROM projects WHERE id = ?');
const getAllProjects = db.prepare('SELECT * FROM projects ORDER BY created_at DESC');
const updateProject = db.prepare(`
  UPDATE projects
  SET name = ?, description = ?, updated_at = ?
  WHERE id = ?
`);
const deleteProject = db.prepare('DELETE FROM projects WHERE id = ?');
const getDatasetsByProjectId = db.prepare('SELECT * FROM datasets WHERE project_id = ? ORDER BY created_at DESC');
const getRunsByProjectId = db.prepare('SELECT * FROM runs WHERE project_id = ? ORDER BY created_at DESC');

// Helper functions
function parseJSON(str) {
  try {
    return str ? JSON.parse(str) : null;
  } catch {
    return null;
  }
}

function serializeRow(row) {
  if (!row) return null;
  const config = parseJSON(row.config);
  const result = {
    ...row,
    config,
    metrics: parseJSON(row.metrics),
    schema: parseJSON(row.schema),
  };

  // Add computed fields for runs
  if (row.seed !== undefined) { // This is a run (runs have seed field)
    result.artifactsDir = path.join(BASE_DIR, 'artifacts', row.id);

    // Extract fields from config
    if (config) {
      result.hyperparameters = config.hyperparameters || {};
      result.tags = config.tags || [];
      result.metadata = config.metadata || {};
      result.datasetVersion = config.datasetVersion || null;
    }
  }

  // Add computed fields for datasets
  if (row.file_count !== undefined && row.seed === undefined) { // This is a dataset
    result.rowCount = row.file_count;
    result.fileSize = row.total_size;
    result.fileName = path.basename(row.file_path || '');
    result.filePath = row.file_path;
    result.fileType = row.file_type;
    result.tags = parseJSON(row.tags) || [];
    result.metadata = parseJSON(row.metadata) || {};
  }

  return result;
}

function serializeEvaluation(row) {
  if (!row) return null;
  return {
    ...row,
    metrics: parseJSON(row.metrics),
    slices: parseJSON(row.slices),
    failure_examples: parseJSON(row.failure_examples),
    files: parseJSON(row.files),
  };
}

// Generate SHA-256 checksum for file
function generateChecksum(filePath) {
  const fileBuffer = fs.readFileSync(filePath);
  const hashSum = crypto.createHash('sha256');
  hashSum.update(fileBuffer);
  return hashSum.digest('hex');
}

// Generate unique ID
function generateId() {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Export database operations
module.exports = {
  db,
  BASE_DIR,
  generateChecksum,
  generateId,

  // Datasets
  createDataset: (dataset) => {
    const now = new Date().toISOString();
    const id = dataset.id || generateId();
    createDataset.run(
      id,
      dataset.name,
      dataset.description || '',
      dataset.filePath || dataset.file_path || '',
      dataset.fileType || dataset.file_type || '',
      dataset.file_count || dataset.rowCount || 0,
      dataset.total_size || dataset.fileSize || 0,
      dataset.schema ? JSON.stringify(dataset.schema) : null,
      dataset.checksum || '',
      dataset.version || 1,
      dataset.tags ? JSON.stringify(dataset.tags) : null,
      dataset.metadata ? JSON.stringify(dataset.metadata) : null,
      dataset.project_id || dataset.projectId || null,
      dataset.created_at || dataset.createdAt || now,
      now
    );
    return serializeRow(getDataset.get(id));
  },

  getDataset: (id) => serializeRow(getDataset.get(id)),
  getDatasetById: (id) => serializeRow(getDataset.get(id)), // Alias for compatibility

  getAllDatasets: () => getAllDatasets.all().map(serializeRow),
  getDatasets: () => getAllDatasets.all().map(serializeRow), // Alias for compatibility

  updateDataset: (id, updates) => {
    const now = new Date().toISOString();
    const dataset = getDataset.get(id);
    if (!dataset) return null;

    updateDataset.run(
      updates.name || dataset.name,
      updates.description !== undefined ? updates.description : dataset.description,
      updates.filePath || updates.file_path || dataset.file_path,
      updates.fileType || updates.file_type || dataset.file_type,
      updates.file_count !== undefined ? updates.file_count : (updates.rowCount !== undefined ? updates.rowCount : dataset.file_count),
      updates.total_size !== undefined ? updates.total_size : (updates.fileSize !== undefined ? updates.fileSize : dataset.total_size),
      updates.schema ? JSON.stringify(updates.schema) : dataset.schema,
      updates.checksum || dataset.checksum,
      updates.tags ? JSON.stringify(updates.tags) : dataset.tags,
      updates.metadata ? JSON.stringify(updates.metadata) : dataset.metadata,
      now,
      id
    );
    return serializeRow(getDataset.get(id));
  },

  deleteDataset: (id) => deleteDataset.run(id),

  // Runs
  createRun: (run) => {
    const now = new Date().toISOString();
    const id = run.id || generateId();

    // Merge config with extra fields
    const config = {
      ...(run.config || {}),
      hyperparameters: run.hyperparameters,
      tags: run.tags,
      metadata: run.metadata,
      datasetVersion: run.datasetVersion,
    };

    createRun.run(
      id,
      run.name,
      run.description || '',
      run.dataset_id || run.datasetId || null,
      run.status || 'running',
      JSON.stringify(config),
      run.metrics ? JSON.stringify(run.metrics) : '{}',
      run.seed || null,
      run.commit_hash || run.commitHash || null,
      run.project_id || run.projectId || null,
      run.created_at || run.createdAt || now,
      now
    );
    return serializeRow(getRun.get(id));
  },

  getRun: (id) => serializeRow(getRun.get(id)),
  getRunById: (id) => serializeRow(getRun.get(id)), // Alias for compatibility

  getAllRuns: () => getAllRuns.all().map(serializeRow),
  getRuns: () => getAllRuns.all().map(serializeRow), // Alias for compatibility

  updateRun: (id, updates) => {
    const now = new Date().toISOString();
    const run = getRun.get(id);
    if (!run) return null;

    updateRun.run(
      updates.name || null,
      updates.description !== undefined ? updates.description : null,
      updates.status || null,
      updates.config ? JSON.stringify(updates.config) : null,
      updates.metrics ? JSON.stringify(updates.metrics) : null,
      updates.completed_at || updates.completedAt || null,
      now,
      id
    );
    return serializeRow(getRun.get(id));
  },

  deleteRun: (id) => deleteRun.run(id),

  // Artifacts
  createArtifact: (artifact) => {
    const now = new Date().toISOString();
    const id = artifact.id || generateId();
    createArtifact.run(
      id,
      artifact.run_id || artifact.runId,
      artifact.name,
      artifact.type || 'model',
      artifact.size || 0,
      artifact.checksum || '',
      artifact.path || '',
      artifact.created_at || artifact.createdAt || now
    );
    return getArtifact.get(id);
  },

  getArtifact: (id) => getArtifact.get(id),

  getArtifactsByRunId: (runId) => getArtifactsByRunId.all(runId),

  getAllArtifacts: () => getAllArtifacts.all(),

  deleteArtifact: (id) => deleteArtifact.run(id),

  // Evaluations
  createEvaluation: (evaluation) => {
    const now = new Date().toISOString();
    const id = evaluation.id || generateId();
    createEvaluation.run(
      id,
      evaluation.run_id || evaluation.runId,
      evaluation.metrics ? JSON.stringify(evaluation.metrics) : null,
      evaluation.slices ? JSON.stringify(evaluation.slices) : null,
      evaluation.failure_examples || evaluation.failureExamples ? JSON.stringify(evaluation.failure_examples || evaluation.failureExamples) : null,
      evaluation.files ? JSON.stringify(evaluation.files) : null,
      evaluation.created_at || evaluation.createdAt || now
    );
    return serializeEvaluation(getEvaluation.get(id));
  },

  getEvaluation: (id) => serializeEvaluation(getEvaluation.get(id)),

  getEvaluationsByRunId: (runId) => getEvaluationsByRunId.all(runId).map(serializeEvaluation),
  getEvaluations: () => getAllEvaluations.all().map(serializeEvaluation), // For compatibility

  deleteEvaluation: (id) => deleteEvaluation.run(id),

  // Projects
  createProject: (project) => {
    const now = new Date().toISOString();
    const id = project.id || generateId();
    createProject.run(
      id,
      project.name,
      project.description || '',
      project.created_at || project.createdAt || now,
      now
    );
    return getProject.get(id);
  },

  getProject: (id) => getProject.get(id),
  getProjectById: (id) => getProject.get(id), // Alias for compatibility

  getAllProjects: () => getAllProjects.all(),
  getProjects: () => getAllProjects.all(), // Alias for compatibility

  updateProject: (id, updates) => {
    const now = new Date().toISOString();
    const project = getProject.get(id);
    if (!project) return null;

    updateProject.run(
      updates.name || project.name,
      updates.description !== undefined ? updates.description : project.description,
      now,
      id
    );
    return getProject.get(id);
  },

  deleteProject: (id) => deleteProject.run(id),

  getDatasetsByProjectId: (projectId) => getDatasetsByProjectId.all(projectId).map(serializeRow),
  getRunsByProjectId: (projectId) => getRunsByProjectId.all(projectId).map(serializeRow),

  // Utility
  close: () => db.close(),
};

} // End of SQLite implementation
