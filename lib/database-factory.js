/**
 * Database Factory
 * Automatically selects between SQLite and PostgreSQL based on environment
 */

let db;

// Check if DATABASE_URL is set (PostgreSQL)
if (process.env.DATABASE_URL) {
  console.log('✓ Using PostgreSQL database');
  db = require('./database-pg');

  // Initialize asynchronously
  db.initializeDatabase().catch(err => {
    console.error('Failed to initialize PostgreSQL database:', err);
    process.exit(1);
  });
} else {
  console.log('✓ Using SQLite database');
  db = require('./database');
  // SQLite initializes synchronously
}

module.exports = db;
