/**
 * Input Validation Schemas
 * Using Joi for request validation
 */

const Joi = require('joi');

// Dataset validation schemas
const datasetSchemas = {
  create: Joi.object({
    name: Joi.string().min(1).max(255).optional(),
    description: Joi.string().max(1000).allow('').optional(),
    tags: Joi.string().optional(), // JSON string
    metadata: Joi.string().optional() // JSON string
  }),

  update: Joi.object({
    name: Joi.string().min(1).max(255).optional(),
    description: Joi.string().max(1000).allow('').optional(),
    tags: Joi.array().items(Joi.string()).optional(),
    metadata: Joi.object().optional()
  })
};

// Run validation schemas
const runSchemas = {
  create: Joi.object({
    name: Joi.string().min(1).max(255).required(),
    description: Joi.string().max(1000).allow('').optional(),
    datasetId: Joi.string().optional(),
    datasetVersion: Joi.string().optional(),
    seed: Joi.number().integer().min(0).max(999999999).optional(),
    status: Joi.string().valid('pending', 'running', 'completed', 'failed').optional(),
    hyperparameters: Joi.object().optional(),
    config: Joi.object().optional(),
    tags: Joi.array().items(Joi.string()).optional(),
    metadata: Joi.object().optional(),
    metrics: Joi.object().optional()
  }),

  update: Joi.object({
    name: Joi.string().min(1).max(255).optional(),
    description: Joi.string().max(1000).allow('').optional(),
    status: Joi.string().valid('pending', 'running', 'completed', 'failed').optional(),
    metrics: Joi.object().optional(),
    config: Joi.object().optional(),
    completed_at: Joi.string().isoDate().optional(),
    completedAt: Joi.string().isoDate().optional()
  }),

  evaluate: Joi.object({
    predictions: Joi.array().required(),
    labels: Joi.array().required(),
    data: Joi.array().optional(),
    config: Joi.object().optional()
  }),

  latency: Joi.object({
    latencies: Joi.object({
      p50: Joi.number().min(0).optional(),
      p95: Joi.number().min(0).optional(),
      p99: Joi.number().min(0).optional(),
      mean: Joi.number().min(0).optional()
    }).required(),
    timestamp: Joi.string().isoDate().optional()
  })
};

// Artifact validation schemas
const artifactSchemas = {
  log: Joi.object({
    run_id: Joi.string().required(),
    name: Joi.string().min(1).max(255).required(),
    type: Joi.string().valid('model', 'plot', 'data', 'checkpoint', 'other').optional(),
    size: Joi.number().integer().min(0).optional(),
    checksum: Joi.string().optional(),
    path: Joi.string().optional(),
    created_at: Joi.string().isoDate().optional()
  })
};

// Project validation schemas
const projectSchemas = {
  create: Joi.object({
    name: Joi.string().min(1).max(255).required(),
    description: Joi.string().max(1000).allow('').optional()
  }),

  update: Joi.object({
    name: Joi.string().min(1).max(255).optional(),
    description: Joi.string().max(1000).allow('').optional()
  })
};

// Validation middleware factory
const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false, // Return all errors
      stripUnknown: true // Remove unknown fields
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(400).json({
        error: 'Validation Error',
        message: 'Invalid request data',
        details: errors
      });
    }

    // Replace req.body with validated & sanitized data
    req.body = value;
    next();
  };
};

// Param validation (for IDs in URL)
const validateId = (paramName = 'id') => {
  return (req, res, next) => {
    const id = req.params[paramName];

    // ID format validation:
    // - SQLite format: timestamp-randomstring (e.g., 1234567890123-abc123def)
    // - PostgreSQL format: prefix_hash (e.g., proj_15625e90, ds_abc12345, run_xyz67890)
    const sqliteRegex = /^\d{13}-[a-z0-9]{9}$/;
    const postgresRegex = /^(proj|ds|run|art)_[a-z0-9]{8}$/;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({
        error: 'Validation Error',
        message: `Missing ${paramName}`
      });
    }

    if (!sqliteRegex.test(id) && !postgresRegex.test(id)) {
      return res.status(400).json({
        error: 'Validation Error',
        message: `Invalid ${paramName} format`
      });
    }

    next();
  };
};

module.exports = {
  validate,
  validateId,
  schemas: {
    dataset: datasetSchemas,
    run: runSchemas,
    artifact: artifactSchemas,
    project: projectSchemas
  }
};
