const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('🌱 Criando usuário inicial...');
    
    // Hash da senha 'admin123'
    const hashedPassword = await bcrypt.hash('admin123', 12);
    
    // Criar usuário admin
    const user = await prisma.user.upsert({
      where: { email: 'admin@teste.com' },
      update: {
        password: hashedPassword,
        name: 'Administrador',
        isActive: true,
      },
      create: {
        email: 'admin@teste.com',
        name: 'Administrador',
        password: hashedPassword,
        isActive: true,
      },
    });
    
    console.log('✅ Usuário criado com sucesso:');
    console.log(`   Email: ${user.email}`);
    console.log(`   Nome: ${user.name}`);
    console.log(`   ID: ${user.id}`);
    console.log(`   Senha: admin123`);
    
  } catch (error) {
    console.error('❌ Erro ao criar usuário:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
