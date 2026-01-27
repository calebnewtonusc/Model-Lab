/**
 * Vercel Serverless Function Wrapper for ModelLab
 * This wraps the main server.js Express app for Vercel deployment
 */

// Ensure DATABASE_URL is set for PostgreSQL
if (!process.env.DATABASE_URL) {
  console.warn('[Warning] DATABASE_URL not set, using SQLite (not recommended for Vercel)');
}

// Import the main Express app
const app = require('../server.js');

// For PostgreSQL, ensure database is initialized
if (process.env.DATABASE_URL) {
  const dbPg = require('../lib/database-pg');
  // Initialize database tables if not already done
  dbPg.initializeDatabase().catch(err => {
    console.log('[Info] Database already initialized or error:', err.message);
  });
}

// Export for Vercel serverless functions
module.exports = app;
