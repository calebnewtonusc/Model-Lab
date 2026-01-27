/**
 * PostgreSQL Database Adapter for ModelLab
 * Production-ready database layer with connection pooling
 * Compatible interface with database.js (SQLite)
 */

const { Pool } = require('pg');

// Create connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 20, // Maximum pool size
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Handle pool errors
pool.on('error', (err) => {
  console.error('Unexpected error on idle PostgreSQL client', err);
  process.exit(-1);
});

/**
 * Initialize database schema
 */
const initializeDatabase = async () => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Enable UUID extension
    await client.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

    // Projects table
    await client.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id TEXT PRIMARY KEY DEFAULT ('proj_' || substr(md5(random()::text), 1, 8)),
        name TEXT NOT NULL,
        description TEXT,
        user_id TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Datasets table
    await client.query(`
      CREATE TABLE IF NOT EXISTS datasets (
        id TEXT PRIMARY KEY DEFAULT ('ds_' || substr(md5(random()::text), 1, 8)),
        name TEXT NOT NULL,
        description TEXT,
        project_id TEXT REFERENCES projects(id) ON DELETE CASCADE,
        file_path TEXT NOT NULL,
        file_size INTEGER,
        row_count INTEGER,
        columns TEXT, -- JSON array
        user_id TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Runs table
    await client.query(`
      CREATE TABLE IF NOT EXISTS runs (
        id TEXT PRIMARY KEY DEFAULT ('run_' || substr(md5(random()::text), 1, 8)),
        name TEXT NOT NULL,
        project_id TEXT REFERENCES projects(id) ON DELETE CASCADE,
        dataset_id TEXT REFERENCES datasets(id) ON DELETE SET NULL,
        model_type TEXT,
        hyperparameters TEXT, -- JSON
        metrics TEXT, -- JSON
        status TEXT DEFAULT 'created',
        seed INTEGER,
        tags TEXT, -- JSON array
        notes TEXT,
        user_id TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        completed_at TIMESTAMP
      )
    `);

    // Artifacts table
    await client.query(`
      CREATE TABLE IF NOT EXISTS artifacts (
        id TEXT PRIMARY KEY DEFAULT ('art_' || substr(md5(random()::text), 1, 8)),
        run_id TEXT NOT NULL REFERENCES runs(id) ON DELETE CASCADE,
        name TEXT NOT NULL,
        file_path TEXT NOT NULL,
        file_size INTEGER,
        artifact_type TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create indexes
    await client.query('CREATE INDEX IF NOT EXISTS idx_datasets_project_id ON datasets(project_id)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_runs_project_id ON runs(project_id)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_runs_dataset_id ON runs(dataset_id)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_runs_status ON runs(status)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_artifacts_run_id ON artifacts(run_id)');

    await client.query('COMMIT');

    console.log('✓ PostgreSQL database initialized');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error initializing PostgreSQL database:', error);
    throw error;
  } finally {
    client.release();
  }
};

// Helper to parse JSON fields
const parseJSON = (value) => {
  if (!value) return null;
  try {
    return JSON.parse(value);
  } catch (e) {
    return value;
  }
};

// Helper to serialize JSON fields
const serializeJSON = (value) => {
  if (!value) return null;
  return JSON.stringify(value);
};

// ==================== Projects ====================

const createProject = async (project) => {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `INSERT INTO projects (name, description, user_id)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [project.name, project.description || null, project.user_id || null]
    );
    return result.rows[0];
  } finally {
    client.release();
  }
};

const getProject = async (id) => {
  const client = await pool.connect();
  try {
    const result = await client.query(
      'SELECT * FROM projects WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  } finally {
    client.release();
  }
};

const getAllProjects = async () => {
  const client = await pool.connect();
  try {
    const result = await client.query(
      'SELECT * FROM projects ORDER BY created_at DESC'
    );
    return result.rows;
  } finally {
    client.release();
  }
};

const updateProject = async (id, updates) => {
  const client = await pool.connect();
  try {
    const fields = [];
    const values = [];
    let paramCount = 1;

    if (updates.name !== undefined) {
      fields.push(`name = $${paramCount++}`);
      values.push(updates.name);
    }
    if (updates.description !== undefined) {
      fields.push(`description = $${paramCount++}`);
      values.push(updates.description);
    }
    fields.push(`updated_at = CURRENT_TIMESTAMP`);

    values.push(id);

    const result = await client.query(
      `UPDATE projects SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );
    return result.rows[0] || null;
  } finally {
    client.release();
  }
};

const deleteProject = async (id) => {
  const client = await pool.connect();
  try {
    await client.query('DELETE FROM projects WHERE id = $1', [id]);
  } finally {
    client.release();
  }
};

// ==================== Datasets ====================

const createDataset = async (dataset) => {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `INSERT INTO datasets (name, description, project_id, file_path, file_size, row_count, columns, user_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        dataset.name,
        dataset.description || null,
        dataset.project_id || null,
        dataset.file_path,
        dataset.file_size || null,
        dataset.row_count || null,
        serializeJSON(dataset.columns),
        dataset.user_id || null
      ]
    );
    const row = result.rows[0];
    row.columns = parseJSON(row.columns);
    return row;
  } finally {
    client.release();
  }
};

const getDataset = async (id) => {
  const client = await pool.connect();
  try {
    const result = await client.query(
      'SELECT * FROM datasets WHERE id = $1',
      [id]
    );
    if (result.rows.length === 0) return null;
    const row = result.rows[0];
    row.columns = parseJSON(row.columns);
    return row;
  } finally {
    client.release();
  }
};

const getDatasets = async () => {
  const client = await pool.connect();
  try {
    const result = await client.query(
      'SELECT * FROM datasets ORDER BY created_at DESC'
    );
    return result.rows.map(row => ({
      ...row,
      columns: parseJSON(row.columns)
    }));
  } finally {
    client.release();
  }
};

const getDatasetsByProjectId = async (projectId) => {
  const client = await pool.connect();
  try {
    const result = await client.query(
      'SELECT * FROM datasets WHERE project_id = $1 ORDER BY created_at DESC',
      [projectId]
    );
    return result.rows.map(row => ({
      ...row,
      columns: parseJSON(row.columns)
    }));
  } finally {
    client.release();
  }
};

const updateDataset = async (id, updates) => {
  const client = await pool.connect();
  try {
    const fields = [];
    const values = [];
    let paramCount = 1;

    if (updates.name !== undefined) {
      fields.push(`name = $${paramCount++}`);
      values.push(updates.name);
    }
    if (updates.description !== undefined) {
      fields.push(`description = $${paramCount++}`);
      values.push(updates.description);
    }
    fields.push(`updated_at = CURRENT_TIMESTAMP`);

    values.push(id);

    const result = await client.query(
      `UPDATE datasets SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );
    if (result.rows.length === 0) return null;
    const row = result.rows[0];
    row.columns = parseJSON(row.columns);
    return row;
  } finally {
    client.release();
  }
};

const deleteDataset = async (id) => {
  const client = await pool.connect();
  try {
    await client.query('DELETE FROM datasets WHERE id = $1', [id]);
  } finally {
    client.release();
  }
};

// ==================== Runs ====================

const createRun = async (run) => {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `INSERT INTO runs (name, project_id, dataset_id, model_type, hyperparameters, metrics, status, seed, tags, notes, user_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING *`,
      [
        run.name,
        run.project_id || null,
        run.dataset_id || null,
        run.model_type || null,
        serializeJSON(run.hyperparameters),
        serializeJSON(run.metrics),
        run.status || 'created',
        run.seed || null,
        serializeJSON(run.tags),
        run.notes || null,
        run.user_id || null
      ]
    );
    const row = result.rows[0];
    row.hyperparameters = parseJSON(row.hyperparameters);
    row.metrics = parseJSON(row.metrics);
    row.tags = parseJSON(row.tags);
    return row;
  } finally {
    client.release();
  }
};

const getRun = async (id) => {
  const client = await pool.connect();
  try {
    const result = await client.query(
      'SELECT * FROM runs WHERE id = $1',
      [id]
    );
    if (result.rows.length === 0) return null;
    const row = result.rows[0];
    row.hyperparameters = parseJSON(row.hyperparameters);
    row.metrics = parseJSON(row.metrics);
    row.tags = parseJSON(row.tags);
    return row;
  } finally {
    client.release();
  }
};

const getRuns = async () => {
  const client = await pool.connect();
  try {
    const result = await client.query(
      'SELECT * FROM runs ORDER BY created_at DESC'
    );
    return result.rows.map(row => ({
      ...row,
      hyperparameters: parseJSON(row.hyperparameters),
      metrics: parseJSON(row.metrics),
      tags: parseJSON(row.tags)
    }));
  } finally {
    client.release();
  }
};

const getRunsByProjectId = async (projectId) => {
  const client = await pool.connect();
  try {
    const result = await client.query(
      'SELECT * FROM runs WHERE project_id = $1 ORDER BY created_at DESC',
      [projectId]
    );
    return result.rows.map(row => ({
      ...row,
      hyperparameters: parseJSON(row.hyperparameters),
      metrics: parseJSON(row.metrics),
      tags: parseJSON(row.tags)
    }));
  } finally {
    client.release();
  }
};

const updateRun = async (id, updates) => {
  const client = await pool.connect();
  try {
    const fields = [];
    const values = [];
    let paramCount = 1;

    if (updates.name !== undefined) {
      fields.push(`name = $${paramCount++}`);
      values.push(updates.name);
    }
    if (updates.status !== undefined) {
      fields.push(`status = $${paramCount++}`);
      values.push(updates.status);
    }
    if (updates.metrics !== undefined) {
      fields.push(`metrics = $${paramCount++}`);
      values.push(serializeJSON(updates.metrics));
    }
    if (updates.notes !== undefined) {
      fields.push(`notes = $${paramCount++}`);
      values.push(updates.notes);
    }
    if (updates.status === 'completed') {
      fields.push(`completed_at = CURRENT_TIMESTAMP`);
    }
    fields.push(`updated_at = CURRENT_TIMESTAMP`);

    values.push(id);

    const result = await client.query(
      `UPDATE runs SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );
    if (result.rows.length === 0) return null;
    const row = result.rows[0];
    row.hyperparameters = parseJSON(row.hyperparameters);
    row.metrics = parseJSON(row.metrics);
    row.tags = parseJSON(row.tags);
    return row;
  } finally {
    client.release();
  }
};

const deleteRun = async (id) => {
  const client = await pool.connect();
  try {
    await client.query('DELETE FROM runs WHERE id = $1', [id]);
  } finally {
    client.release();
  }
};

// ==================== Artifacts ====================

const createArtifact = async (artifact) => {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `INSERT INTO artifacts (run_id, name, file_path, file_size, artifact_type)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [
        artifact.run_id,
        artifact.name,
        artifact.file_path,
        artifact.file_size || null,
        artifact.artifact_type || null
      ]
    );
    return result.rows[0];
  } finally {
    client.release();
  }
};

const getArtifactsByRunId = async (runId) => {
  const client = await pool.connect();
  try {
    const result = await client.query(
      'SELECT * FROM artifacts WHERE run_id = $1 ORDER BY created_at DESC',
      [runId]
    );
    return result.rows;
  } finally {
    client.release();
  }
};

const deleteArtifact = async (id) => {
  const client = await pool.connect();
  try {
    await client.query('DELETE FROM artifacts WHERE id = $1', [id]);
  } finally {
    client.release();
  }
};

// Close pool
const close = async () => {
  await pool.end();
};

module.exports = {
  // Initialization
  initializeDatabase,
  close,

  // Projects
  createProject,
  getProject,
  getAllProjects,
  updateProject,
  deleteProject,

  // Datasets
  createDataset,
  getDataset,
  getDatasets,
  getDatasetsByProjectId,
  updateDataset,
  deleteDataset,

  // Runs
  createRun,
  getRun,
  getRuns,
  getRunsByProjectId,
  updateRun,
  deleteRun,

  // Artifacts
  createArtifact,
  getArtifactsByRunId,
  deleteArtifact,
};
