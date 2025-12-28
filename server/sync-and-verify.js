require('dotenv').config();
const sequelize = require('./config/database');

async function syncAndVerify() {
  try {
    console.log('Syncing database models...');
    
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
    
    console.log('Models loaded successfully\n');
    
    // Sync all models (creates tables if they don't exist)
    await sequelize.sync();
    console.log('✅ Database sync completed\n');
    
    // Verify tables were created
    const [results] = await sequelize.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);
    
    console.log('Tables in database:');
    if (results.length > 0) {
      results.forEach(row => console.log(`  - ${row.table_name}`));
      console.log(`\n✅ Found ${results.length} tables`);
    } else {
      console.log('  ⚠️  No tables found!');
    }
    
    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

syncAndVerify();
