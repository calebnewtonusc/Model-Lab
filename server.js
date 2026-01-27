/**
 * ModelLab Express Server
 * Production-ready ML experiment tracking platform
 */

const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
require('dotenv').config();

const app = express();

// Environment configuration
const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || 'development';
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:3000', 'http://localhost:3001', 'https://modellab.studio'];

// Security headers with helmet
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, Postman)
    if (!origin) return callback(null, true);

    if (ALLOWED_ORIGINS.indexOf(origin) !== -1 || NODE_ENV === 'development') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Request logging
if (NODE_ENV === 'production') {
  // Combined format in production: standard Apache combined log output
  app.use(morgan('combined'));
} else {
  // Dev format in development: concise colored output
  app.use(morgan('dev'));
}

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting to prevent abuse
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: NODE_ENV === 'production' ? 100 : 1000, // 100 requests per 15 min in prod, 1000 in dev
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Upload rate limiting (more restrictive)
const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: NODE_ENV === 'production' ? 20 : 100,
  message: {
    error: 'Too many uploads from this IP, please try again later.',
    retryAfter: '15 minutes'
  }
});

// Apply rate limiting to API routes
app.use('/api/', apiLimiter);

// API Routes
const datasetsRouter = require('./api/modellab/datasets');
const runsRouter = require('./api/modellab/runs');
const artifactsRouter = require('./api/modellab/artifacts');

// Apply upload limiter to dataset uploads
app.use('/api/modellab/datasets', uploadLimiter);
app.use('/api/modellab/datasets', datasetsRouter);
app.use('/api/modellab/runs', runsRouter);
app.use('/api/modellab/artifacts', artifactsRouter);

// Health check endpoint with detailed info
app.get('/api/health', (req, res) => {
  const db = require('./lib/database');

  try {
    // Test database connectivity
    const runs = db.getRuns();

    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: NODE_ENV,
      version: require('./package.json').version,
      uptime: process.uptime(),
      database: {
        status: 'connected',
        runs: runs.length
      }
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Database connection failed',
      message: error.message
    });
  }
});

// API documentation endpoint
app.get('/api/docs', (req, res) => {
  res.json({
    name: 'ModelLab API',
    version: '1.0.0',
    description: 'ML experiment tracking and management platform',
    baseUrl: `${req.protocol}://${req.get('host')}`,
    endpoints: {
      health: {
        path: '/api/health',
        method: 'GET',
        description: 'Health check endpoint with system status'
      },
      datasets: {
        list: { path: '/api/modellab/datasets', method: 'GET', description: 'List all datasets' },
        get: { path: '/api/modellab/datasets/:id', method: 'GET', description: 'Get dataset by ID' },
        create: { path: '/api/modellab/datasets', method: 'POST', description: 'Upload new dataset (multipart/form-data)' },
        update: { path: '/api/modellab/datasets/:id', method: 'PUT', description: 'Update dataset metadata' },
        delete: { path: '/api/modellab/datasets/:id', method: 'DELETE', description: 'Delete dataset' },
        preview: { path: '/api/modellab/datasets/:id/preview', method: 'GET', description: 'Preview first 100 rows' }
      },
      runs: {
        list: { path: '/api/modellab/runs', method: 'GET', description: 'List all runs' },
        get: { path: '/api/modellab/runs/:id', method: 'GET', description: 'Get run by ID with evaluations' },
        create: { path: '/api/modellab/runs', method: 'POST', description: 'Create new run' },
        update: { path: '/api/modellab/runs/:id', method: 'PUT/PATCH', description: 'Update run' },
        delete: { path: '/api/modellab/runs/:id', method: 'DELETE', description: 'Delete run' },
        evaluate: { path: '/api/modellab/runs/:id/evaluate', method: 'POST', description: 'Submit evaluation results' },
        latency: { path: '/api/modellab/runs/:id/latency', method: 'POST', description: 'Log latency metrics' }
      },
      artifacts: {
        list: { path: '/api/modellab/artifacts/:runId', method: 'GET', description: 'List artifacts for run' },
        upload: { path: '/api/modellab/artifacts/:runId', method: 'POST', description: 'Upload artifact file' },
        log: { path: '/api/modellab/artifacts', method: 'POST', description: 'Log artifact metadata' },
        download: { path: '/api/modellab/artifacts/:runId/download/:path', method: 'GET', description: 'Download artifact' },
        delete: { path: '/api/modellab/artifacts/:runId/:path', method: 'DELETE', description: 'Delete artifact' }
      }
    },
    rateLimit: {
      general: '100 requests per 15 minutes (production)',
      uploads: '20 uploads per 15 minutes (production)'
    },
    pythonSDK: {
      installation: 'pip install modellab-client',
      repository: 'https://github.com/calebnewtonusc/ModelLab/tree/main/python-sdk'
    }
  });
});

// Serve static files from the React build in production
if (NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'frontend/build')));

  // Handle React routing, return all requests to React app
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/build', 'index.html'));
  });
}

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `API endpoint ${req.method} ${req.originalUrl} not found`,
    documentation: '/api/docs'
  });
});

// Global error handling middleware
app.use((err, req, res, next) => {
  // Log error details
  console.error('Error occurred:', {
    timestamp: new Date().toISOString(),
    method: req.method,
    path: req.path,
    error: err.message,
    stack: NODE_ENV === 'development' ? err.stack : undefined
  });

  // CORS error
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({
      error: 'CORS Error',
      message: 'Origin not allowed. Please contact the administrator.'
    });
  }

  // Validation error (from Joi or similar)
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation Error',
      message: err.message,
      details: err.details
    });
  }

  // Database error
  if (err.message.includes('SQLITE') || err.message.includes('database')) {
    return res.status(500).json({
      error: 'Database Error',
      message: 'A database error occurred. Please try again later.'
    });
  }

  // File upload error
  if (err.message.includes('File too large') || err.message.includes('maxFileSize')) {
    return res.status(413).json({
      error: 'File Too Large',
      message: 'The uploaded file exceeds the maximum allowed size (100MB).'
    });
  }

  // Default error response
  res.status(err.status || 500).json({
    error: err.name || 'Internal Server Error',
    message: NODE_ENV === 'production'
      ? 'An unexpected error occurred. Please try again later.'
      : err.message,
    ...(NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║                     ModelLab Server                        ║
╚════════════════════════════════════════════════════════════╝

  Status: Running
  Port: ${PORT}
  Environment: ${NODE_ENV}
  API: http://localhost:${PORT}/api
  Docs: http://localhost:${PORT}/api/docs
  Health: http://localhost:${PORT}/api/health

  Features:
  ✓ Security Headers (Helmet)
  ✓ Rate Limiting
  ✓ Request Logging
  ✓ CORS Protection
  ✓ Error Handling

  Database: SQLite (better-sqlite3)
  Python SDK: pip install modellab-client

╚════════════════════════════════════════════════════════════╝
  `);
});

// Graceful shutdown handler
const gracefulShutdown = (signal) => {
  console.log(`\n${signal} received. Shutting down gracefully...`);

  server.close(() => {
    console.log('HTTP server closed');

    // Close database connection
    const db = require('./lib/database');
    try {
      db.close();
      console.log('Database connection closed');
    } catch (error) {
      console.error('Error closing database:', error);
    }

    console.log('Shutdown complete');
    process.exit(0);
  });

  // Force shutdown after 10 seconds
  setTimeout(() => {
    console.error('Forced shutdown after timeout');
    process.exit(1);
  }, 10000);
};

// Listen for termination signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  gracefulShutdown('UNCAUGHT_EXCEPTION');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

module.exports = app;
