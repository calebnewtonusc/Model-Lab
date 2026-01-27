/**
 * Swagger UI Setup for ModelLab API Documentation
 */

const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');

// Load OpenAPI specification
const swaggerDocument = YAML.load(path.join(__dirname, 'openapi.yaml'));

// Custom CSS for better styling
const customCss = `
  .swagger-ui .topbar { display: none }
  .swagger-ui .info { margin: 50px 0 }
  .swagger-ui .info .title { font-size: 36px; }
`;

// Swagger UI options
const options = {
  customCss,
  customSiteTitle: 'ModelLab API Documentation',
  customfavIcon: '/favicon.ico',
  swaggerOptions: {
    persistAuthorization: true,
    displayRequestDuration: true,
    filter: true,
    tryItOutEnabled: true,
  },
};

module.exports = {
  swaggerUi,
  swaggerDocument,
  options,
};
