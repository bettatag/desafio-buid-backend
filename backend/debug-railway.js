#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔍 Debug Railway Deploy Issues\n');

// Verificar estrutura de arquivos
console.log('📁 Estrutura de arquivos:');
const files = [
  'package.json',
  'Dockerfile',
  'Dockerfile.simple',
  'Dockerfile.minimal',
  'railway.json',
  'nixpacks.toml',
  'prisma/schema.prisma',
  'src/main.ts'
];

files.forEach(file => {
  const exists = fs.existsSync(file);
  console.log(`${exists ? '✅' : '❌'} ${file}`);
});

console.log('\n🔧 Verificando comandos npm:');
try {
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const scripts = ['build', 'start', 'start:prod'];
  
  scripts.forEach(script => {
    if (pkg.scripts[script]) {
      console.log(`✅ npm run ${script}: ${pkg.scripts[script]}`);
    } else {
      console.log(`❌ npm run ${script}: NOT FOUND`);
    }
  });
} catch (error) {
  console.log('❌ Erro ao ler package.json:', error.message);
}

console.log('\n🏗️ Testando comandos de build:');
try {
  console.log('Testing npm run build...');
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Build successful');
} catch (error) {
  console.log('❌ Build failed:', error.message);
}

console.log('\n📦 Verificando dist folder:');
if (fs.existsSync('dist')) {
  console.log('✅ dist folder exists');
  if (fs.existsSync('dist/src/main.js')) {
    console.log('✅ dist/src/main.js exists');
  } else {
    console.log('❌ dist/src/main.js NOT found');
  }
} else {
  console.log('❌ dist folder NOT found');
}

console.log('\n🔍 Verificando Prisma:');
try {
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('✅ Prisma generate successful');
} catch (error) {
  console.log('❌ Prisma generate failed:', error.message);
}

console.log('\n📋 Recomendações para Railway:');
console.log('1. Use Dockerfile.minimal se o atual não funcionar');
console.log('2. Configure Root Directory como "backend" se necessário');
console.log('3. Certifique-se das variáveis de ambiente:');
console.log('   - DATABASE_URL');
console.log('   - JWT_SECRET');
console.log('   - NODE_ENV=production');
console.log('   - PORT=3000');

console.log('\n🚀 Comandos para testar diferentes Dockerfiles:');
console.log('mv Dockerfile Dockerfile.original');
console.log('mv Dockerfile.minimal Dockerfile');
console.log('# Então faça commit e push');

console.log('\n✅ Debug concluído!');
