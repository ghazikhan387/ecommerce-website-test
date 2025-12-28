require('dotenv').config();
console.log('1. Dotenv loaded');

const express = require('express');
console.log('2. Express loaded');

const cors = require('cors');
console.log('3. CORS loaded');

const authRoutes = require('./routes/auth');
console.log('4. Auth routes loaded');

const userRoutes = require('./routes/users');
console.log('5. User routes loaded');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'ERP API Server',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
    },
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
  });
});


app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

console.log('6. Loading branches routes...');
app.use('/api/branches', require('./routes/branches'));
console.log('7. Branches routes loaded');

console.log('8. Loading inventory routes...');
app.use('/api/inventory', require('./routes/inventory'));
console.log('9. Inventory routes loaded');

console.log('10. Loading purchases routes...');
app.use('/api/purchases', require('./routes/purchases'));
console.log('11. Purchases routes loaded');

console.log('12. Loading sales routes...');
app.use('/api/sales', require('./routes/sales'));
console.log('13. Sales routes loaded');

console.log('14. Loading reports routes...');
app.use('/api/reports', require('./routes/reports'));
console.log('15. Reports routes loaded');

console.log('16. Loading customer portal routes...');
app.use('/api/customer', require('./routes/customer-portal'));
console.log('17. Customer portal routes loaded');

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
async function startServer() {
  try {
    console.log('18. Initializing database...');
    const sequelize = require('./config/database');
    await sequelize.authenticate();
    console.log('19. Database connected successfully');
    
    // Sync models (creates tables if they don't exist)
    await sequelize.sync();
    console.log('20. Database models synced');
    
    console.log('21. Starting server...');
    app.listen(PORT, () => {
      console.log(`\n🚀 Server is running on http://localhost:${PORT}`);
      console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`\n📚 API Endpoints:`);
      console.log(`   POST   http://localhost:${PORT}/api/auth/register`);
      console.log(`   POST   http://localhost:${PORT}/api/auth/login`);
      console.log(`   GET    http://localhost:${PORT}/api/users/me`);
      console.log(`   GET    http://localhost:${PORT}/api/users\n`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

