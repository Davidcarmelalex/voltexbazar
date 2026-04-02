const { PrismaClient } = require('@prisma/client');

async function main() {
  const prisma = new PrismaClient();
  try {
    await prisma.$connect();
    console.log('✓ Database connected successfully');
    
    // Test a simple query
    const userCount = await prisma.user.count();
    console.log(`✓ User count: ${userCount}`);
    
    await prisma.$disconnect();
    console.log('✓ Database disconnected');
  } catch (error) {
    console.error('✗ Database connection failed:', error.message);
    process.exit(1);
  }
}

main().catch(console.error);
