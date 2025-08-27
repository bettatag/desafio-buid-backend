const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('📊 Verificando usuários no banco de dados...\n');
    
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    
    console.log(`✅ Total de usuários encontrados: ${users.length}\n`);
    
    users.forEach((user, index) => {
      console.log(`👤 Usuário ${index + 1}:`);
      console.log(`   ID: ${user.id}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Nome: ${user.name}`);
      console.log(`   Ativo: ${user.isActive ? 'Sim' : 'Não'}`);
      console.log(`   Criado em: ${user.createdAt.toLocaleString('pt-BR')}`);
      console.log(`   Atualizado em: ${user.updatedAt.toLocaleString('pt-BR')}`);
      console.log('');
    });
    
  } catch (error) {
    console.error('❌ Erro ao verificar usuários:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
