const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seeding...');

  // 1. Create Head Office Branch
  const headOffice = await prisma.branch.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'Head Office',
      address: '123 Main St, Tech City',
      isHeadOffice: true,
    },
  });
  console.log(`🏢 Created branch: ${headOffice.name}`);

  // 2. Create Warehouse for Head Office
  const hoWarehouse = await prisma.warehouse.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'Central Warehouse',
      branchId: headOffice.id,
    },
  });
  console.log(`🏭 Created warehouse: ${hoWarehouse.name}`);

  // 3. Create Admin User
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@erp.com' },
    update: {},
    create: {
      name: 'System Admin',
      email: 'admin@erp.com',
      password: hashedPassword,
      role: 'ADMIN',
      branchId: headOffice.id,
    },
  });
  console.log(`👤 Created admin user: ${admin.email}`);

  // 4. Create Sample Book Titles
  const books = [
    {
      isbn: '978-0134685991',
      title: 'Effective Java',
      author: 'Joshua Bloch',
      publisher: 'Addison-Wesley',
      price: 45.00,
    },
    {
      isbn: '978-0201633610',
      title: 'Design Patterns',
      author: 'Erich Gamma',
      publisher: 'Addison-Wesley',
      price: 50.00,
    },
    {
      isbn: '978-0132350884',
      title: 'Clean Code',
      author: 'Robert C. Martin',
      publisher: 'Prentice Hall',
      price: 40.00,
    },
  ];

  for (const book of books) {
    const createdBook = await prisma.bookTitle.upsert({
      where: { isbn: book.isbn },
      update: {},
      create: book,
    });
    console.log(`📚 Created book: ${createdBook.title}`);

    // Add initial inventory
    await prisma.inventory.upsert({
      where: {
        bookTitleId_warehouseId: {
          bookTitleId: createdBook.id,
          warehouseId: hoWarehouse.id,
        },
      },
      update: {},
      create: {
        bookTitleId: createdBook.id,
        warehouseId: hoWarehouse.id,
        quantity: 100,
        minStock: 10,
        maxStock: 500,
      },
    });
  }

  console.log('✅ Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
