/**
 * Initialize PostgreSQL Database Schema
 * Run this once to create all tables in your Neon database
 */

require('dotenv').config();
const { Pool } = require('pg');

const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_FYdA8p7loXcu@ep-purple-water-afphrp30-pooler.c-2.us-west-2.aws.neon.tech/neondb?sslmode=require';

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function initDatabase() {
  const client = await pool.connect();

  try {
    console.log('🚀 Initializing PostgreSQL database...\n');

    await client.query('BEGIN');

    // Create projects table
    console.log('Creating projects table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id TEXT PRIMARY KEY DEFAULT ('proj_' || substr(md5(random()::text), 1, 8)),
        name TEXT NOT NULL,
        description TEXT,
        user_id TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create datasets table
    console.log('Creating datasets table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS datasets (
        id TEXT PRIMARY KEY DEFAULT ('ds_' || substr(md5(random()::text), 1, 8)),
        name TEXT NOT NULL,
        description TEXT,
        file_path TEXT NOT NULL,
        file_size INTEGER,
        file_type TEXT,
        rows INTEGER,
        columns INTEGER,
        column_names TEXT,
        project_id TEXT REFERENCES projects(id) ON DELETE CASCADE,
        user_id TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create runs table
    console.log('Creating runs table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS runs (
        id TEXT PRIMARY KEY DEFAULT ('run_' || substr(md5(random()::text), 1, 8)),
        dataset_id TEXT NOT NULL REFERENCES datasets(id) ON DELETE CASCADE,
        model_name TEXT NOT NULL,
        model_params TEXT,
        metrics TEXT,
        status TEXT DEFAULT 'running',
        start_time TIMESTAMP,
        end_time TIMESTAMP,
        duration REAL,
        tags TEXT,
        project_id TEXT REFERENCES projects(id) ON DELETE CASCADE,
        user_id TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create artifacts table
    console.log('Creating artifacts table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS artifacts (
        id TEXT PRIMARY KEY DEFAULT ('art_' || substr(md5(random()::text), 1, 8)),
        run_id TEXT NOT NULL REFERENCES runs(id) ON DELETE CASCADE,
        artifact_type TEXT NOT NULL,
        file_path TEXT NOT NULL,
        file_size INTEGER,
        file_name TEXT,
        description TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create indexes
    console.log('Creating indexes...');
    await client.query('CREATE INDEX IF NOT EXISTS idx_datasets_project_id ON datasets(project_id)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_runs_dataset_id ON runs(dataset_id)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_runs_project_id ON runs(project_id)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_artifacts_run_id ON artifacts(run_id)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_datasets_user_id ON datasets(user_id)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_runs_user_id ON runs(user_id)');

    await client.query('COMMIT');

    console.log('\n✅ Database initialized successfully!');
    console.log('\nTables created:');
    console.log('  - projects');
    console.log('  - datasets');
    console.log('  - runs');
    console.log('  - artifacts');
    console.log('\nYour ModelLab database is ready to use! 🎉');

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error initializing database:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

initDatabase().catch(console.error);
