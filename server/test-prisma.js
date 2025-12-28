require('dotenv').config();
console.log('DATABASE_URL:', process.env.DATABASE_URL);
console.log('Attempting Prisma connection...');

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
  try {
    await prisma.$connect();
    console.log('Connected successfully!');
    await prisma.$disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Connection failed:', error);
    process.exit(1);
  }
}

test();
