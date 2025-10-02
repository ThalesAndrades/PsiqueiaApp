const fs = require('fs');
const path = require('path');

console.log('🔍 Verificando estrutura do projeto PsiqueIA...\n');

// Verificar arquivos essenciais
const essentialFiles = [
  'package.json',
  'app.json',
  'tsconfig.json',
  'babel.config.js',
  'metro.config.js',
  'tailwind.config.js',
  'global.css',
  'eas.json'
];

console.log('📁 Arquivos de configuração:');
essentialFiles.forEach(file => {
  const exists = fs.existsSync(file);
  console.log(`  ${exists ? '✅' : '❌'} ${file}`);
});

// Verificar estrutura de diretórios
const directories = [
  'app',
  'components',
  'contexts',
  'hooks',
  'services',
  'utils',
  'constants'
];

console.log('\n📂 Estrutura de diretórios:');
directories.forEach(dir => {
  const exists = fs.existsSync(dir);
  console.log(`  ${exists ? '✅' : '❌'} ${dir}/`);
});

// Verificar package.json
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  console.log('\n📦 Informações do projeto:');
  console.log(`  Nome: ${packageJson.name}`);
  console.log(`  Versão: ${packageJson.version}`);
  console.log(`  Expo SDK: ${packageJson.dependencies?.expo || 'Não encontrado'}`);
  console.log(`  React Native: ${packageJson.dependencies?.['react-native'] || 'Não encontrado'}`);
  
  // Verificar dependências críticas
  const criticalDeps = [
    'expo',
    'react',
    'react-native',
    'expo-router',
    '@supabase/supabase-js',
    'nativewind',
    'react-native-reanimated'
  ];
  
  console.log('\n🔧 Dependências críticas:');
  criticalDeps.forEach(dep => {
    const version = packageJson.dependencies?.[dep] || packageJson.devDependencies?.[dep];
    console.log(`  ${version ? '✅' : '❌'} ${dep}: ${version || 'Não encontrado'}`);
  });
  
} catch (error) {
  console.log('❌ Erro ao ler package.json:', error.message);
}

// Verificar app.json
try {
  const appJson = JSON.parse(fs.readFileSync('app.json', 'utf8'));
  console.log('\n📱 Configuração do app:');
  console.log(`  Nome: ${appJson.expo?.name || 'Não definido'}`);
  console.log(`  Bundle ID: ${appJson.expo?.ios?.bundleIdentifier || 'Não definido'}`);
  console.log(`  Plugins: ${appJson.expo?.plugins?.length || 0} configurados`);
} catch (error) {
  console.log('❌ Erro ao ler app.json:', error.message);
}

console.log('\n✨ Verificação concluída!');
console.log('\n💡 Para compilar no Xcode:');
console.log('  1. Execute: npx expo prebuild --platform ios');
console.log('  2. Abra o arquivo .xcworkspace no Xcode');
console.log('  3. Configure o Team de desenvolvimento');
console.log('  4. Execute o build');