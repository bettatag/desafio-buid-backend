#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Verificando se o backend está pronto para deploy...\n');

const checks = [
  {
    name: 'package.json',
    path: 'package.json',
    required: true,
    check: (content) => {
      const pkg = JSON.parse(content);
      return pkg.scripts && pkg.scripts['start:prod'] && pkg.scripts.build;
    }
  },
  {
    name: 'Dockerfile',
    path: 'Dockerfile',
    required: true,
    check: (content) => content.includes('CMD ["npm", "run", "start:prod"]')
  },
  {
    name: 'Prisma Schema',
    path: 'prisma/schema.prisma',
    required: true,
    check: (content) => content.includes('generator client')
  },
  {
    name: 'Main Application File',
    path: 'src/main.ts',
    required: true,
    check: (content) => content.includes('NestFactory.create')
  },
  {
    name: 'Railway Config (JSON)',
    path: 'railway.json',
    required: false,
    check: (content) => {
      const config = JSON.parse(content);
      return config.build && config.deploy;
    }
  },
  {
    name: 'Railway Config (TOML)',
    path: 'railway.toml',
    required: false,
    check: (content) => content.includes('[build]') && content.includes('[deploy]')
  },
  {
    name: 'Docker Ignore',
    path: '.dockerignore',
    required: false,
    check: (content) => content.includes('node_modules')
  }
];

let allGood = true;
let warnings = 0;

checks.forEach(check => {
  try {
    if (fs.existsSync(check.path)) {
      const content = fs.readFileSync(check.path, 'utf8');
      const isValid = check.check(content);
      
      if (isValid) {
        console.log(`✅ ${check.name}: OK`);
      } else {
        console.log(`⚠️  ${check.name}: Arquivo existe mas pode ter problemas`);
        warnings++;
      }
    } else {
      if (check.required) {
        console.log(`❌ ${check.name}: Arquivo obrigatório não encontrado`);
        allGood = false;
      } else {
        console.log(`⚠️  ${check.name}: Arquivo opcional não encontrado`);
        warnings++;
      }
    }
  } catch (error) {
    console.log(`❌ ${check.name}: Erro ao verificar - ${error.message}`);
    if (check.required) allGood = false;
    else warnings++;
  }
});

console.log('\n' + '='.repeat(50));

if (allGood) {
  console.log('🎉 Backend está pronto para deploy!');
  if (warnings > 0) {
    console.log(`⚠️  ${warnings} avisos encontrados (não críticos)`);
  }
} else {
  console.log('❌ Backend NÃO está pronto para deploy');
  console.log('   Corrija os erros acima antes de tentar fazer deploy');
}

console.log('\n📋 Próximos passos:');
console.log('1. Configure as variáveis de ambiente no Railway:');
console.log('   - DATABASE_URL');
console.log('   - JWT_SECRET');
console.log('   - NODE_ENV=production');
console.log('2. Certifique-se de que o root directory está definido como "backend"');
console.log('3. Faça commit das mudanças e push para o repositório');

console.log('\n🔗 Links úteis:');
console.log('- Railway Dashboard: https://railway.app/dashboard');
console.log('- Deploy Guide: ./RAILWAY_DEPLOY_GUIDE.md');

process.exit(allGood ? 0 : 1);
