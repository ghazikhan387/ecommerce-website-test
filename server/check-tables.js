const { execSync } = require('child_process');

console.log('Checking database tables...\n');

try {
  const output = execSync(
    'docker exec erp_postgres psql -U postgres -d erp_db -c "SELECT table_name FROM information_schema.tables WHERE table_schema = \'public\' ORDER BY table_name;"',
    { encoding: 'utf-8' }
  );
  
  console.log('Database Tables:');
  console.log(output);
  
  // Count tables
  const lines = output.trim().split('\n');
  const tableCount = lines.length - 3; // Subtract header and footer lines
  
  if (tableCount > 0) {
    console.log(`\n✅ Found ${tableCount} tables in the database`);
  } else {
    console.log('\n⚠️  No tables found in the database');
  }
} catch (error) {
  console.error('Error checking database:', error.message);
}
