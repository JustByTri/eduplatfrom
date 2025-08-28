const { createTables, seedAdminUser } = require('./config/init-db');
const { pool } = require('./config/database');
const fs = require('fs');
const path = require('path');

const setupDatabase = async () => {
  try {
    console.log('🔄 Setting up database...');
    
    // Create tables
    await createTables();
    
    // Create admin user
    await seedAdminUser();
    
    // Seed sample data
    const sampleDataPath = path.join(__dirname, 'seed-sample-data.sql');
    if (fs.existsSync(sampleDataPath)) {
      const sampleData = fs.readFileSync(sampleDataPath, 'utf8');
      const queries = sampleData.split(';').filter(query => query.trim());
      
      for (const query of queries) {
        if (query.trim()) {
          await pool.execute(query);
        }
      }
      console.log('✅ Sample data seeded');
    }
    
    console.log('🎉 Database setup complete!');
    console.log('📊 You can now test with real data');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Database setup error:', error);
    process.exit(1);
  }
};

setupDatabase();
