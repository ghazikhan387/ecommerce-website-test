require('dotenv').config();
const sequelize = require('./config/database');

async function syncDatabase() {
  try {
    console.log('Syncing database models...');
    console.log('DATABASE_URL:', process.env.DATABASE_URL);
    
    // Import all models
    const {
      User,
      Branch,
      Warehouse,
      Customer,
      Supplier,
      BookTitle,
      Inventory,
      Purchase,
      PurchaseItem,
      SalesOrder,
      SalesOrderItem,
      Invoice,
      AuditLog
    } = require('./models');
    
    console.log('\nModels loaded successfully');
    console.log('Starting database sync...');
    
    // Sync all models (creates tables if they don't exist)
    await sequelize.sync();
    
    console.log('\n✅ All models synced successfully!');
    console.log('\nTables created:');
    console.log('- User');
    console.log('- Branch');
    console.log('- Warehouse');
    console.log('- Customer');
    console.log('- Supplier');
    console.log('- BookTitle');
    console.log('- Inventory');
    console.log('- Purchase');
    console.log('- PurchaseItem');
    console.log('- SalesOrder');
    console.log('- SalesOrderItem');
    console.log('- Invoice');
    console.log('- AuditLog');
    
    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Database sync failed:', error);
    process.exit(1);
  }
}

syncDatabase();
