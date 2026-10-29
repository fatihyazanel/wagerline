require('dotenv').config();
const db = require('./database/db');
const { syncSports, syncCompetitions, syncSeasons } = require('./jobs/sync-sports');

async function initApp() {
  console.log('🚀 WAGERline MVP - Initializing...\n');

  try {
    // Initialize database
    await db.init();
    console.log('✓ Database connected');

    // Run schema
    await db.runSchema();
    console.log('✓ Schema initialized');

    // Seed initial data
    console.log('\n📦 Starting data ingestion...\n');
    await syncSports();
    await syncCompetitions();
    await syncSeasons();

    console.log('\n✓ Database initialization complete!');
    console.log('\nNext: Start backend API server');
    console.log('Run: npm run dev');

    await db.close();
  } catch (error) {
    console.error('❌ Initialization failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  initApp();
}

module.exports = initApp;
