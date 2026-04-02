const { PrismaClient } = require('@prisma/client');

async function main() {
  let prisma;
  try {
    prisma = new PrismaClient();
    console.log('PrismaClient instantiated');
    await prisma.$connect();
    console.log('Database connected successfully');
    
    // Test a simple query
    const userCount = await prisma.user.count();
    console.log(`User count: ${userCount}`);
    
    await prisma.$disconnect();
  } catch (error) {
    console.error('Error:', error.message);
    if (prisma) {
      await prisma.$disconnect().catch(() => {});
    }
    process.exit(1);
  }
}

main();
