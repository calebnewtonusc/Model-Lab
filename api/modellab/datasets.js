/**
 * Dataset API Routes
 * Handles dataset upload, versioning, and management
 */

const express = require('express');
const formidable = require('formidable');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// Import storage and utilities - use absolute paths
const storage = require(path.join(__dirname, '../../lib/storage'));
const schemaDetector = require(path.join(__dirname, '../../lib/schemaDetector'));

// GET all datasets
router.get('/', (req, res) => {
  try {
    const datasets = storage.getDatasets();
    res.json({ datasets });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET single dataset
router.get('/:id', (req, res) => {
  try {
    const dataset = storage.getDatasetById(req.params.id);
    if (!dataset) {
      return res.status(404).json({ error: 'Dataset not found' });
    }
    res.json({ dataset });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST upload dataset
router.post('/', (req, res) => {
  const form = formidable({
    multiples: false,
    uploadDir: path.join(storage.BASE_DIR, 'datasets'),
    keepExtensions: true,
    maxFileSize: 100 * 1024 * 1024 // 100MB
  });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    try {
      const file = files.file;
      if (!file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      // Get the uploaded file path
      const uploadedPath = Array.isArray(file) ? file[0].filepath : file.filepath;
      const originalName = Array.isArray(file) ? file[0].originalFilename : file.originalFilename;

      // Generate checksum
      const checksum = storage.generateChecksum(uploadedPath);

      // Load and detect schema
      const { data, schema, fileType } = schemaDetector.loadDatasetFile(uploadedPath);

      // Create unique filename
      const ext = path.extname(originalName);
      const baseName = path.basename(originalName, ext);
      const newFileName = `${baseName}-${Date.now()}${ext}`;
      const newFilePath = path.join(storage.BASE_DIR, 'datasets', newFileName);

      // Move file to permanent location
      fs.renameSync(uploadedPath, newFilePath);

      // Get tags and metadata
      let tags = [];
      let metadata = {};

      if (fields.tags) {
        const tagsStr = Array.isArray(fields.tags) ? fields.tags[0] : fields.tags;
        try {
          tags = JSON.parse(tagsStr);
        } catch (e) {
          tags = [];
        }
      }

      if (fields.metadata) {
        const metadataStr = Array.isArray(fields.metadata) ? fields.metadata[0] : fields.metadata;
        try {
          metadata = JSON.parse(metadataStr);
        } catch (e) {
          metadata = {};
        }
      }

      // Create dataset record
      const dataset = storage.createDataset({
        name: (Array.isArray(fields.name) ? fields.name[0] : fields.name) || baseName,
        description: (Array.isArray(fields.description) ? fields.description[0] : fields.description) || '',
        fileName: newFileName,
        filePath: newFilePath,
        fileType,
        fileSize: fs.statSync(newFilePath).size,
        checksum,
        schema,
        rowCount: data.length,
        version: 1,
        tags,
        metadata
      });

      res.status(201).json({
        dataset,
        message: 'Dataset uploaded successfully'
      });

    } catch (error) {
      console.error('Dataset upload error:', error);
      res.status(500).json({ error: error.message });
    }
  });
});

// PUT update dataset
router.put('/:id', (req, res) => {
  try {
    const dataset = storage.updateDataset(req.params.id, req.body);
    if (!dataset) {
      return res.status(404).json({ error: 'Dataset not found' });
    }
    res.json({ dataset });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET dataset preview
router.get('/:id/preview', (req, res) => {
  try {
    const dataset = storage.getDatasetById(req.params.id);
    if (!dataset) {
      return res.status(404).json({ error: 'Dataset not found' });
    }

    // Load dataset and return first 100 rows
    const { data } = schemaDetector.loadDatasetFile(dataset.filePath);
    const preview = data.slice(0, 100);

    res.json({
      preview,
      total: data.length,
      showing: preview.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE dataset
router.delete('/:id', (req, res) => {
  try {
    const dataset = storage.deleteDataset(req.params.id);
    if (!dataset) {
      return res.status(404).json({ error: 'Dataset not found' });
    }

    // Delete file
    if (dataset.filePath && fs.existsSync(dataset.filePath)) {
      fs.unlinkSync(dataset.filePath);
    }

    res.json({
      message: 'Dataset deleted successfully',
      dataset
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
