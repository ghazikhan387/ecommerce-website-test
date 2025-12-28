const { PrismaClient } = require('@prisma/client');

// Create a singleton instance but don't connect yet
// Prisma will auto-connect on first query
const prisma = new PrismaClient({
  log: ['error', 'warn'],
});

// Graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

module.exports = prisma;
