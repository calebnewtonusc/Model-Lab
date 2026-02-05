/**
 * Swagger API Documentation Configuration
 * Provides interactive API documentation for ModelLab
 */

const swaggerUi = require('swagger-ui-express');

// Swagger document definition
const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'ModelLab API',
    version: '1.0.0',
    description: 'ML experiment tracking and management platform',
    contact: {
      name: 'Caleb Newton',
      email: 'calebnew@usc.edu',
      url: 'https://calebnewton.me'
    },
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT'
    }
  },
  servers: [
    {
      url: 'http://localhost:3001',
      description: 'Development server'
    },
    {
      url: 'https://modellab.studio',
      description: 'Production server'
    }
  ],
  tags: [
    {
      name: 'Health',
      description: 'System health and status'
    },
    {
      name: 'Projects',
      description: 'Project workspace management'
    },
    {
      name: 'Datasets',
      description: 'Dataset upload and management'
    },
    {
      name: 'Runs',
      description: 'Experiment run tracking'
    },
    {
      name: 'Artifacts',
      description: 'Model and artifact storage'
    }
  ],
  paths: {
    '/api/health': {
      get: {
        tags: ['Health'],
        summary: 'Health check endpoint',
        description: 'Returns system health status and database connectivity',
        responses: {
          200: {
            description: 'System is healthy',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'healthy' },
                    timestamp: { type: 'string', format: 'date-time' },
                    environment: { type: 'string', example: 'development' },
                    version: { type: 'string', example: '1.0.0' },
                    uptime: { type: 'number', example: 3600.5 },
                    database: {
                      type: 'object',
                      properties: {
                        status: { type: 'string', example: 'connected' },
                        runs: { type: 'number', example: 42 }
                      }
                    }
                  }
                }
              }
            }
          },
          503: {
            description: 'System is unhealthy',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'unhealthy' },
                    timestamp: { type: 'string', format: 'date-time' },
                    error: { type: 'string' },
                    message: { type: 'string' }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/api/modellab/projects': {
      get: {
        tags: ['Projects'],
        summary: 'List all projects',
        description: 'Get all projects with statistics',
        responses: {
          200: {
            description: 'List of projects',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    projects: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          id: { type: 'string' },
                          name: { type: 'string' },
                          description: { type: 'string' },
                          created_at: { type: 'string', format: 'date-time' },
                          updated_at: { type: 'string', format: 'date-time' },
                          datasetCount: { type: 'number' },
                          runCount: { type: 'number' },
                          lastActivity: { type: 'string', format: 'date-time' }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      post: {
        tags: ['Projects'],
        summary: 'Create new project',
        description: 'Create a new project workspace',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name'],
                properties: {
                  name: { type: 'string', example: 'My ML Project' },
                  description: { type: 'string', example: 'Predicting customer churn' }
                }
              }
            }
          }
        },
        responses: {
          201: {
            description: 'Project created successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    project: {
                      type: 'object',
                      properties: {
                        id: { type: 'string' },
                        name: { type: 'string' },
                        description: { type: 'string' },
                        created_at: { type: 'string', format: 'date-time' },
                        updated_at: { type: 'string', format: 'date-time' }
                      }
                    }
                  }
                }
              }
            }
          },
          400: {
            description: 'Validation error'
          }
        }
      }
    },
    '/api/modellab/projects/{id}': {
      get: {
        tags: ['Projects'],
        summary: 'Get project by ID',
        description: 'Get project with detailed statistics',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' }
          }
        ],
        responses: {
          200: {
            description: 'Project details'
          },
          404: {
            description: 'Project not found'
          }
        }
      },
      put: {
        tags: ['Projects'],
        summary: 'Update project',
        description: 'Update project metadata',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' }
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  description: { type: 'string' }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Project updated successfully'
          },
          404: {
            description: 'Project not found'
          }
        }
      },
      delete: {
        tags: ['Projects'],
        summary: 'Delete project',
        description: 'Delete a project and all associated data',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' }
          }
        ],
        responses: {
          200: {
            description: 'Project deleted successfully'
          },
          404: {
            description: 'Project not found'
          }
        }
      }
    },
    '/api/modellab/datasets': {
      get: {
        tags: ['Datasets'],
        summary: 'List all datasets',
        description: 'Get all datasets with metadata',
        responses: {
          200: {
            description: 'List of datasets'
          }
        }
      },
      post: {
        tags: ['Datasets'],
        summary: 'Upload dataset',
        description: 'Upload a new dataset file',
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                properties: {
                  file: {
                    type: 'string',
                    format: 'binary'
                  },
                  name: { type: 'string' },
                  description: { type: 'string' },
                  project_id: { type: 'string' }
                }
              }
            }
          }
        },
        responses: {
          201: {
            description: 'Dataset uploaded successfully'
          },
          413: {
            description: 'File too large'
          }
        }
      }
    },
    '/api/modellab/runs': {
      get: {
        tags: ['Runs'],
        summary: 'List all runs',
        description: 'Get all experiment runs',
        responses: {
          200: {
            description: 'List of runs'
          }
        }
      },
      post: {
        tags: ['Runs'],
        summary: 'Create new run',
        description: 'Start tracking a new experiment run',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name'],
                properties: {
                  name: { type: 'string', example: 'XGBoost Baseline' },
                  description: { type: 'string' },
                  dataset_id: { type: 'string' },
                  project_id: { type: 'string' },
                  seed: { type: 'integer', example: 42 },
                  commit_hash: { type: 'string' },
                  config: { type: 'object' },
                  metrics: { type: 'object' }
                }
              }
            }
          }
        },
        responses: {
          201: {
            description: 'Run created successfully'
          }
        }
      }
    },
    '/api/modellab/runs/{id}/evaluate': {
      post: {
        tags: ['Runs'],
        summary: 'Submit evaluation results',
        description: 'Upload evaluation metrics and analysis for a run',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' }
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  metrics: { type: 'object' },
                  slices: { type: 'array' },
                  failure_examples: { type: 'array' }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Evaluation submitted successfully'
          }
        }
      }
    }
  },
  components: {
    schemas: {
      Error: {
        type: 'object',
        properties: {
          error: { type: 'string' },
          message: { type: 'string' }
        }
      }
    }
  }
};

// Swagger UI options
const options = {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'ModelLab API Documentation',
  swaggerOptions: {
    persistAuthorization: true,
    displayRequestDuration: true,
    filter: true,
    syntaxHighlight: {
      theme: 'monokai'
    }
  }
};

module.exports = {
  swaggerUi,
  swaggerDocument,
  options
};
