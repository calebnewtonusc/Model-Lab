/**
 * ModelLab Storage System
 * JSON-based database for datasets, runs, and artifacts
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const BASE_DIR = path.join(process.cwd(), 'modellab-data');
const DB_FILE = path.join(BASE_DIR, 'db.json');

// Initialize database structure
const initDB = () => {
  if (!fs.existsSync(BASE_DIR)) {
    fs.mkdirSync(BASE_DIR, { recursive: true });
    fs.mkdirSync(path.join(BASE_DIR, 'datasets'), { recursive: true });
    fs.mkdirSync(path.join(BASE_DIR, 'runs'), { recursive: true });
    fs.mkdirSync(path.join(BASE_DIR, 'artifacts'), { recursive: true });
  }

  if (!fs.existsSync(DB_FILE)) {
    const initialDB = {
      datasets: [],
      runs: [],
      evaluations: [],
      version: '1.0.0',
      lastUpdated: new Date().toISOString()
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialDB, null, 2));
  }
};

// Read database
const readDB = () => {
  initDB();
  const data = fs.readFileSync(DB_FILE, 'utf8');
  return JSON.parse(data);
};

// Write database
const writeDB = (data) => {
  data.lastUpdated = new Date().toISOString();
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
};

// Generate SHA-256 checksum for file
const generateChecksum = (filePath) => {
  const fileBuffer = fs.readFileSync(filePath);
  const hashSum = crypto.createHash('sha256');
  hashSum.update(fileBuffer);
  return hashSum.digest('hex');
};

// Generate unique ID
const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Dataset operations
const createDataset = (dataset) => {
  const db = readDB();
  const newDataset = {
    id: generateId(),
    ...dataset,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  db.datasets.push(newDataset);
  writeDB(db);
  return newDataset;
};

const getDatasets = () => {
  const db = readDB();
  return db.datasets;
};

const getDatasetById = (id) => {
  const db = readDB();
  return db.datasets.find(d => d.id === id);
};

const updateDataset = (id, updates) => {
  const db = readDB();
  const index = db.datasets.findIndex(d => d.id === id);
  if (index !== -1) {
    db.datasets[index] = {
      ...db.datasets[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    writeDB(db);
    return db.datasets[index];
  }
  return null;
};

const deleteDataset = (id) => {
  const db = readDB();
  const index = db.datasets.findIndex(d => d.id === id);
  if (index !== -1) {
    const deleted = db.datasets.splice(index, 1)[0];
    writeDB(db);
    return deleted;
  }
  return null;
};

// Run operations
const createRun = (run) => {
  const db = readDB();
  const newRun = {
    id: generateId(),
    ...run,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  db.runs.push(newRun);
  writeDB(db);
  return newRun;
};

const getRuns = () => {
  const db = readDB();
  return db.runs;
};

const getRunById = (id) => {
  const db = readDB();
  return db.runs.find(r => r.id === id);
};

const updateRun = (id, updates) => {
  const db = readDB();
  const index = db.runs.findIndex(r => r.id === id);
  if (index !== -1) {
    db.runs[index] = {
      ...db.runs[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    writeDB(db);
    return db.runs[index];
  }
  return null;
};

const deleteRun = (id) => {
  const db = readDB();
  const index = db.runs.findIndex(r => r.id === id);
  if (index !== -1) {
    const deleted = db.runs.splice(index, 1)[0];
    writeDB(db);
    return deleted;
  }
  return null;
};

// Evaluation operations
const createEvaluation = (evaluation) => {
  const db = readDB();
  const newEval = {
    id: generateId(),
    ...evaluation,
    createdAt: new Date().toISOString()
  };
  db.evaluations.push(newEval);
  writeDB(db);
  return newEval;
};

const getEvaluations = () => {
  const db = readDB();
  return db.evaluations;
};

const getEvaluationsByRunId = (runId) => {
  const db = readDB();
  return db.evaluations.filter(e => e.runId === runId);
};

module.exports = {
  initDB,
  readDB,
  writeDB,
  generateChecksum,
  generateId,
  // Dataset operations
  createDataset,
  getDatasets,
  getDatasetById,
  updateDataset,
  deleteDataset,
  // Run operations
  createRun,
  getRuns,
  getRunById,
  updateRun,
  deleteRun,
  // Evaluation operations
  createEvaluation,
  getEvaluations,
  getEvaluationsByRunId,
  // Constants
  BASE_DIR
};
