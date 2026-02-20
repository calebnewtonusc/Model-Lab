/**
 * Dataset API Routes
 * Handles dataset upload, versioning, and management
 */

const express = require('express');
const { formidable } = require('formidable');
const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');
const router = express.Router();

// Import storage and utilities - use absolute paths
const db = require(path.join(__dirname, '../../lib/database'));
const schemaDetector = require(path.join(__dirname, '../../lib/schemaDetector'));
const { validate, validateId, schemas } = require(path.join(__dirname, '../../lib/validation'));

// GET all datasets
router.get('/', async (req, res) => {
  try {
    let datasets = await db.getDatasets();
    // Ensure datasets is always an array
    let datasetsArray = Array.isArray(datasets) ? datasets : [];

    // Apply query parameter filters
    const { project_id } = req.query;
    if (project_id) {
      datasetsArray = datasetsArray.filter(d => d.project_id === project_id);
    }

    res.json({ datasets: datasetsArray });
  } catch (error) {
    console.error('Error fetching datasets:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET single dataset
router.get('/:id', validateId('id'), async (req, res) => {
  try {
    const dataset = await db.getDatasetById(req.params.id);
    if (!dataset) {
      return res.status(404).json({ error: 'Dataset not found' });
    }

    // Enrich with columns from schema
    let columns = [];
    if (dataset.schema && dataset.schema.columns) {
      columns = dataset.schema.columns.map(c => c.name);
    }

    res.json({ dataset: { ...dataset, columns } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Upload handler (shared between POST / and POST /upload)
const handleDatasetUpload = (req, res) => {
  const form = formidable({
    multiples: false,
    uploadDir: path.join(db.BASE_DIR, 'datasets'),
    keepExtensions: true,
    maxFileSize: 100 * 1024 * 1024 // 100MB
  });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    try {
      // Validate file presence
      const file = files.file;
      if (!file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      // Validate name is present
      const nameValue = Array.isArray(fields.name) ? fields.name[0] : fields.name;
      if (!nameValue || nameValue.trim() === '') {
        return res.status(400).json({ error: 'Validation Error', message: 'Dataset name is required' });
      }

      // Validate fields using Joi schema
      const fieldsToValidate = {
        name: nameValue,
        description: Array.isArray(fields.description) ? fields.description[0] : fields.description,
        tags: Array.isArray(fields.tags) ? fields.tags[0] : fields.tags,
        metadata: Array.isArray(fields.metadata) ? fields.metadata[0] : fields.metadata
      };

      const { error: validationError } = schemas.dataset.create.validate(fieldsToValidate, {
        abortEarly: false,
        stripUnknown: true
      });

      if (validationError) {
        const errors = validationError.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message
        }));
        return res.status(400).json({
          error: 'Validation Error',
          message: 'Invalid field data',
          details: errors
        });
      }

      // Get the uploaded file path
      const uploadedPath = Array.isArray(file) ? file[0].filepath : file.filepath;
      const originalName = Array.isArray(file) ? file[0].originalFilename : file.originalFilename;

      // Generate checksum
      const checksum = db.generateChecksum(uploadedPath);

      // Load and detect schema
      const { data, schema, fileType } = schemaDetector.loadDatasetFile(uploadedPath);

      // Create unique filename
      const ext = path.extname(originalName);
      const baseName = path.basename(originalName, ext);
      const newFileName = `${baseName}-${Date.now()}${ext}`;
      const newFilePath = path.join(db.BASE_DIR, 'datasets', newFileName);

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

      // Get project_id
      const project_id = Array.isArray(fields.project_id) ? fields.project_id[0] : fields.project_id;

      // Extract columns from schema
      const columns = schema && schema.columns ? schema.columns.map(c => c.name) : [];

      // Create dataset record
      const dataset = await db.createDataset({
        name: nameValue || baseName,
        description: (Array.isArray(fields.description) ? fields.description[0] : fields.description) || '',
        fileName: newFileName,
        filePath: newFilePath,
        fileType,
        fileSize: fs.statSync(newFilePath).size,
        total_size: fs.statSync(newFilePath).size,
        file_count: data.length,
        checksum,
        schema,
        rowCount: data.length,
        version: 1,
        tags,
        metadata,
        project_id: project_id || null,
        projectId: project_id || null
      });

      // Add columns to the response dataset object
      const responseDataset = {
        ...dataset,
        columns,
        rowCount: data.length
      };

      res.status(201).json({
        dataset: responseDataset,
        message: 'Dataset uploaded successfully'
      });

    } catch (error) {
      console.error('Dataset upload error:', error);
      res.status(500).json({ error: error.message });
    }
  });
};

// POST upload dataset (both routes)
router.post('/', handleDatasetUpload);
router.post('/upload', handleDatasetUpload);

// PUT update dataset
router.put('/:id', validateId('id'), validate(schemas.dataset.update), async (req, res) => {
  try {
    const dataset = await db.updateDataset(req.params.id, req.body);
    if (!dataset) {
      return res.status(404).json({ error: 'Dataset not found' });
    }
    res.json({ dataset });
  } catch (error) {
    console.error('Update dataset error:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET dataset preview
router.get('/:id/preview', validateId('id'), async (req, res) => {
  try {
    const dataset = await db.getDatasetById(req.params.id);
    if (!dataset) {
      return res.status(404).json({ error: 'Dataset not found' });
    }

    // Load dataset and return rows (default limit 10, max 100)
    const { data } = schemaDetector.loadDatasetFile(dataset.filePath);
    const limit = Math.min(parseInt(req.query.limit, 10) || 10, 100);
    const rows = data.slice(0, limit);

    res.json({
      rows,
      total: data.length,
      showing: rows.length
    });
  } catch (error) {
    console.error('Dataset preview error:', error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE dataset
router.delete('/:id', validateId('id'), async (req, res) => {
  try {
    const dataset = await db.getDatasetById(req.params.id);
    if (!dataset) {
      return res.status(404).json({ error: 'Dataset not found' });
    }

    // Delete file
    if (dataset.filePath && fs.existsSync(dataset.filePath)) {
      await fsPromises.unlink(dataset.filePath);
    }

    await db.deleteDataset(req.params.id);

    res.status(204).send();
  } catch (error) {
    console.error('Delete dataset error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
