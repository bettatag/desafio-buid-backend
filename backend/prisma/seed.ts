import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@evolution-api.com' },
    update: {},
    create: {
      email: 'admin@evolution-api.com',
      name: 'Administrator',
      password: hashedPassword,
      isActive: true,
    },
  });

  console.log('✅ Admin user created:', { id: adminUser.id, email: adminUser.email });

  // Create demo user
  const demoHashedPassword = await bcrypt.hash('demo123', 10);
  
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@evolution-api.com' },
    update: {},
    create: {
      email: 'demo@evolution-api.com',
      name: 'Demo User',
      password: demoHashedPassword,
      isActive: true,
    },
  });

  console.log('✅ Demo user created:', { id: demoUser.id, email: demoUser.email });

  console.log('🎉 Database seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
