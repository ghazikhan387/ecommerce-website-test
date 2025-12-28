require('dotenv').config();
const sequelize = require('./config/database');

async function testConnection() {
  try {
    console.log('Testing database connection...');
    console.log('DATABASE_URL:', process.env.DATABASE_URL);
    
    await sequelize.authenticate();
    console.log('✅ Database connection successful!');
    
    // Try to sync models
    console.log('\nTesting model sync...');
    const { User, Branch, Warehouse } = require('./models');
    
    await sequelize.sync({ force: true });
    console.log('✅ Models synced successfully!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
}

testConnection();
