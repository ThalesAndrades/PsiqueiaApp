const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🍎 Verificação de Compatibilidade iOS - PsiqueIA\n');

// Função para obter configuração do Expo
function getExpoConfig() {
  try {
    const output = execSync('npx expo config --type public --json', { encoding: 'utf8' });
    return JSON.parse(output);
  } catch (error) {
    return null;
  }
}

// Verificar configurações iOS específicas
function checkiOSConfig() {
  console.log('📱 Configurações iOS:');
  
  const appConfig = getExpoConfig();
  if (!appConfig || !appConfig.ios) {
    console.log('  ❌ Configurações iOS não encontradas');
    return false;
  }

  const ios = appConfig.ios;
  
  console.log(`  ✅ Bundle ID: ${ios.bundleIdentifier || 'Não definido'}`);
  console.log(`  ✅ Suporte a Tablet: ${ios.supportsTablet ? 'Sim' : 'Não'}`);
  console.log(`  ✅ Build Number: ${ios.buildNumber || 'Não definido'}`);
  
  // Verificar permissões
  const permissions = ios.infoPlist || {};
  const requiredPermissions = [
    'NSCameraUsageDescription',
    'NSMicrophoneUsageDescription',
    'NSPhotoLibraryUsageDescription',
    'NSFaceIDUsageDescription'
  ];
  
  console.log('\n  🔐 Permissões iOS:');
  requiredPermissions.forEach(perm => {
    const exists = permissions[perm];
    console.log(`    ${exists ? '✅' : '❌'} ${perm}`);
  });
  
  return true;
}

// Verificar dependências críticas para iOS
function checkiOSDependencies() {
  console.log('\n🔧 Dependências iOS:');
  
  try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
    
    const iosCriticalDeps = [
      { name: 'expo', required: true },
      { name: 'react-native', required: true },
      { name: 'expo-router', required: true },
      { name: 'react-native-reanimated', required: true },
      { name: 'expo-local-authentication', required: false },
      { name: 'expo-camera', required: false },
      { name: 'expo-image-picker', required: false },
      { name: 'expo-location', required: false }
    ];
    
    iosCriticalDeps.forEach(dep => {
      const version = deps[dep.name];
      const status = version ? '✅' : (dep.required ? '❌' : '⚠️');
      console.log(`  ${status} ${dep.name}: ${version || 'Não instalado'}`);
    });
    
    return true;
  } catch (error) {
    console.log('  ❌ Erro ao verificar dependências:', error.message);
    return false;
  }
}

// Verificar arquivos de configuração para iOS
function checkConfigFiles() {
  console.log('\n⚙️ Arquivos de Configuração:');
  
  const configFiles = [
    { name: 'babel.config.js', required: true },
    { name: 'metro.config.js', required: true },
    { name: 'eas.json', required: false },
    { name: 'expo-env.d.ts', required: false }
  ];
  
  configFiles.forEach(file => {
    const exists = fs.existsSync(file.name);
    const status = exists ? '✅' : (file.required ? '❌' : '⚠️');
    console.log(`  ${status} ${file.name}`);
  });
}

// Verificar estrutura de componentes
function checkComponentStructure() {
  console.log('\n🧩 Estrutura de Componentes:');
  
  const criticalPaths = [
    'app/_layout.tsx',
    'app/(tabs)/_layout.tsx',
    'contexts/AuthContext.tsx',
    'components/ErrorBoundary.tsx'
  ];
  
  criticalPaths.forEach(filePath => {
    const exists = fs.existsSync(filePath);
    console.log(`  ${exists ? '✅' : '❌'} ${filePath}`);
  });
}

// Verificar compatibilidade com React Native 0.79
function checkRNCompatibility() {
  console.log('\n⚛️ Compatibilidade React Native:');
  
  try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const rnVersion = packageJson.dependencies?.['react-native'];
    
    if (rnVersion) {
      console.log(`  ✅ React Native: ${rnVersion}`);
      
      // Verificar se é versão 0.79+
      const versionMatch = rnVersion.match(/(\d+)\.(\d+)/);
      if (versionMatch) {
        const major = parseInt(versionMatch[1]);
        const minor = parseInt(versionMatch[2]);
        
        if (major === 0 && minor >= 79) {
          console.log('  ✅ Versão compatível com New Architecture');
        } else {
          console.log('  ⚠️ Versão pode não suportar New Architecture');
        }
      }
    } else {
      console.log('  ❌ React Native não encontrado');
    }
    
    // Verificar React
    const reactVersion = packageJson.dependencies?.react;
    console.log(`  ✅ React: ${reactVersion || 'Não encontrado'}`);
    
  } catch (error) {
    console.log('  ❌ Erro ao verificar compatibilidade:', error.message);
  }
}

// Executar todas as verificações
console.log('Iniciando verificação completa...\n');

const checks = [
  checkiOSConfig(),
  checkiOSDependencies(),
  checkConfigFiles(),
  checkComponentStructure(),
  checkRNCompatibility()
];

console.log('\n' + '='.repeat(50));
console.log('📋 RESUMO DA VERIFICAÇÃO');
console.log('='.repeat(50));

const passedChecks = checks.filter(Boolean).length;
console.log(`✅ Verificações aprovadas: ${passedChecks}/${checks.length}`);

if (passedChecks === checks.length) {
  console.log('\n🎉 PROJETO PRONTO PARA COMPILAÇÃO iOS!');
  console.log('\n📝 Próximos passos:');
  console.log('  1. npx expo prebuild --platform ios --clean');
  console.log('  2. cd ios && pod install');
  console.log('  3. Abrir .xcworkspace no Xcode');
  console.log('  4. Configurar Team de desenvolvimento');
  console.log('  5. Build e teste no simulador/device');
} else {
  console.log('\n⚠️ ALGUMAS VERIFICAÇÕES FALHARAM');
  console.log('Revise os itens marcados com ❌ antes de compilar.');
}

console.log('\n💡 Dica: Execute "npx expo doctor" para diagnósticos adicionais.');