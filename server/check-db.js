require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  try {
    console.log('Using DATABASE_URL:', process.env.DATABASE_URL);
    console.log('Attempting to connect to database...');
    await prisma.$connect();
    console.log('Successfully connected to database!');
    await prisma.$disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Connection failed!');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    if (error.code) console.error('Error code:', error.code);
    process.exit(1);
  }
}

check();
