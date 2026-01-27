/**
 * Artifacts API Routes
 * Handles storage and retrieval of model checkpoints, plots, and reports
 */

const express = require('express');
const { formidable } = require('formidable');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const db = require(path.join(__dirname, '../../lib/database'));

// GET artifacts for a run
router.get('/:runId', (req, res) => {
  try {
    const run = db.getRunById(req.params.runId);
    if (!run) {
      return res.status(404).json({ error: 'Run not found' });
    }

    const artifactsDir = run.artifactsDir;
    if (!fs.existsSync(artifactsDir)) {
      return res.json({ artifacts: [] });
    }

    // Recursively list all files in artifacts directory
    const artifacts = [];
    const scanDirectory = (dir, baseDir) => {
      const files = fs.readdirSync(dir);
      files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        const relativePath = path.relative(baseDir, filePath);

        if (stat.isDirectory()) {
          scanDirectory(filePath, baseDir);
        } else {
          artifacts.push({
            name: file,
            path: relativePath,
            fullPath: filePath,
            size: stat.size,
            type: path.extname(file).substring(1),
            createdAt: stat.birthtime,
            modifiedAt: stat.mtime
          });
        }
      });
    };

    scanDirectory(artifactsDir, artifactsDir);

    res.json({ artifacts });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST artifact metadata (for Python SDK - JSON only)
router.post('/', (req, res) => {
  try {
    const { run_id, name, type, size, checksum, path: artifactPath, created_at } = req.body;

    if (!run_id || !name) {
      return res.status(400).json({ error: 'Missing required fields: run_id, name' });
    }

    const run = db.getRunById(run_id);
    if (!run) {
      return res.status(404).json({ error: 'Run not found' });
    }

    // Create artifact record in database
    const artifact = db.createArtifact({
      run_id,
      name,
      type: type || 'model',
      size: size || 0,
      checksum: checksum || '',
      path: artifactPath || name,
      created_at
    });

    res.status(201).json({
      artifact,
      message: 'Artifact metadata logged successfully'
    });

  } catch (error) {
    console.error('Artifact logging error:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST upload artifact (with file)
router.post('/:runId', (req, res) => {
  const run = db.getRunById(req.params.runId);
  if (!run) {
    return res.status(404).json({ error: 'Run not found' });
  }

  const artifactsDir = run.artifactsDir;
  if (!fs.existsSync(artifactsDir)) {
    fs.mkdirSync(artifactsDir, { recursive: true });
  }

  const form = formidable({
    multiples: false,
    uploadDir: artifactsDir,
    keepExtensions: true,
    maxFileSize: 500 * 1024 * 1024 // 500MB for model checkpoints
  });

  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    try {
      const file = files.file;
      if (!file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const uploadedPath = Array.isArray(file) ? file[0].filepath : file.filepath;
      const originalName = Array.isArray(file) ? file[0].originalFilename : file.originalFilename;

      // Create subdirectory based on artifact type
      const artifactType = (Array.isArray(fields.type) ? fields.type[0] : fields.type) || 'other';
      const typeDir = path.join(artifactsDir, artifactType);
      if (!fs.existsSync(typeDir)) {
        fs.mkdirSync(typeDir, { recursive: true });
      }

      // Move file to typed directory
      const newFilePath = path.join(typeDir, originalName);
      fs.renameSync(uploadedPath, newFilePath);

      const stat = fs.statSync(newFilePath);

      let metadata = {};
      if (fields.metadata) {
        const metadataStr = Array.isArray(fields.metadata) ? fields.metadata[0] : fields.metadata;
        try {
          metadata = JSON.parse(metadataStr);
        } catch (e) {
          metadata = {};
        }
      }

      const artifact = {
        name: originalName,
        path: path.join(artifactType, originalName),
        fullPath: newFilePath,
        size: stat.size,
        type: path.extname(originalName).substring(1),
        artifactType,
        createdAt: stat.birthtime,
        metadata
      };

      res.status(201).json({
        artifact,
        message: 'Artifact uploaded successfully'
      });

    } catch (error) {
      console.error('Artifact upload error:', error);
      res.status(500).json({ error: error.message });
    }
  });
});

// GET download artifact
router.get('/:runId/download/:artifactPath(*)', (req, res) => {
  try {
    const run = db.getRunById(req.params.runId);
    if (!run) {
      return res.status(404).json({ error: 'Run not found' });
    }

    const fullPath = path.join(run.artifactsDir, req.params.artifactPath);
    if (!fs.existsSync(fullPath)) {
      return res.status(404).json({ error: 'Artifact not found' });
    }

    const stat = fs.statSync(fullPath);
    const fileName = path.basename(fullPath);
    const ext = path.extname(fileName).substring(1);

    // Set content type based on file extension
    const contentTypes = {
      'json': 'application/json',
      'png': 'image/png',
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'pdf': 'application/pdf',
      'csv': 'text/csv',
      'txt': 'text/plain',
      'h5': 'application/octet-stream',
      'pt': 'application/octet-stream',
      'pth': 'application/octet-stream',
      'pkl': 'application/octet-stream'
    };

    const contentType = contentTypes[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Content-Length': stat.size,
      'Content-Disposition': `attachment; filename="${fileName}"`
    });

    const readStream = fs.createReadStream(fullPath);
    readStream.pipe(res);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE artifact
router.delete('/:runId/download/:artifactPath(*)', (req, res) => {
  try {
    const run = db.getRunById(req.params.runId);
    if (!run) {
      return res.status(404).json({ error: 'Run not found' });
    }

    const fullPath = path.join(run.artifactsDir, req.params.artifactPath);
    if (!fs.existsSync(fullPath)) {
      return res.status(404).json({ error: 'Artifact not found' });
    }

    fs.unlinkSync(fullPath);

    res.json({
      message: 'Artifact deleted successfully'
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
