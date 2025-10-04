#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔍 VERIFICANDO STATUS DO DEPLOYMENT...\n');

// Função para verificar se arquivo existe
function checkFile(filePath, description) {
    const exists = fs.existsSync(filePath);
    const status = exists ? '✅' : '❌';
    console.log(`${status} ${description}: ${exists ? 'OK' : 'NÃO ENCONTRADO'}`);
    return exists;
}

// Função para verificar diretório
function checkDirectory(dirPath, description) {
    const exists = fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory();
    const status = exists ? '✅' : '❌';
    console.log(`${status} ${description}: ${exists ? 'OK' : 'NÃO ENCONTRADO'}`);
    return exists;
}

// Função para obter configuração do Expo
function getExpoConfig() {
    try {
        const output = execSync('npx expo config --type public --json', { encoding: 'utf8' });
        return JSON.parse(output);
    } catch (error) {
        return null;
    }
}

let totalChecks = 0;
let passedChecks = 0;

console.log('📋 ARQUIVOS ESSENCIAIS:');
console.log('========================');

// Verificar arquivos essenciais
const essentialFiles = [
    ['app.config.ts', 'Configuração principal do Expo'],
    ['.xcode-cloud.yml', 'Configuração do Xcode Cloud'],
    ['private_keys/AuthKey_5D79LKKR26.p8', 'Chave privada da API'],
    ['DEPLOYMENT_GUIDE.md', 'Guia de deployment'],
    ['NEXT_STEPS.md', 'Próximos passos'],
    ['package.json', 'Dependências do projeto']
];

essentialFiles.forEach(([file, desc]) => {
    totalChecks++;
    if (checkFile(file, desc)) passedChecks++;
});

console.log('\n📊 METADADOS DO APP STORE:');
console.log('===========================');

// Verificar metadados
const metadataFiles = [
    ['app-store-metadata/app-store-info.json', 'Informações do App Store'],
    ['app-store-metadata/screenshots/README.md', 'Guia de screenshots'],
    ['app-store-metadata/release-notes/v1.0.0.md', 'Notas da versão']
];

metadataFiles.forEach(([file, desc]) => {
    totalChecks++;
    if (checkFile(file, desc)) passedChecks++;
});

console.log('\n🔧 SCRIPTS E FERRAMENTAS:');
console.log('==========================');

// Verificar scripts
const scriptFiles = [
    ['scripts/final-validation.js', 'Script de validação final'],
    ['scripts/validate-ios.js', 'Script de validação iOS'],
    ['setup-simple.ps1', 'Script de setup para Windows']
];

scriptFiles.forEach(([file, desc]) => {
    totalChecks++;
    if (checkFile(file, desc)) passedChecks++;
});

console.log('\n📱 PROJETO iOS:');
console.log('================');

// Verificar projeto iOS (pode não existir no Windows)
const iosExists = checkDirectory('ios', 'Diretório iOS');
if (iosExists) {
    totalChecks += 3;
    if (checkFile('ios/PsiqueiaApp/Info.plist', 'Info.plist')) passedChecks++;
    if (checkFile('ios/PsiqueiaApp/PsiqueiaApp.entitlements', 'Entitlements')) passedChecks++;
    if (checkFile('ios/ExportOptions.plist', 'Export Options')) passedChecks++;
} else {
    console.log('⚠️  Projeto iOS não encontrado (normal no Windows)');
    console.log('   Execute "npx expo prebuild --platform ios" em macOS/Linux');
}

console.log('\n🔍 VERIFICAÇÃO DE CONFIGURAÇÕES:');
console.log('=================================');

// Verificar app.config.ts usando expo config
const appConfig = getExpoConfig();
if (appConfig) {
    totalChecks += 5;
    
    if (appConfig.ios?.bundleIdentifier) {
        console.log(`✅ Bundle ID configurado: ${appConfig.ios.bundleIdentifier}`);
        passedChecks++;
    } else {
        console.log('❌ Bundle ID não configurado');
    }
    
    if (appConfig.ios?.buildNumber) {
        console.log('✅ Build number configurado');
        passedChecks++;
    } else {
        console.log('❌ Build number não configurado');
    }
    
    // HealthKit removed for store readiness - no longer checking
    if (appConfig.ios?.infoPlist?.NSCameraUsageDescription) {
        console.log('✅ Permissões de privacidade configuradas');
        passedChecks++;
    } else {
        console.log('❌ Permissões de privacidade não configuradas');
    }
    
    if (appConfig.platforms?.includes('ios')) {
        console.log('✅ Plataforma iOS habilitada');
        passedChecks++;
    } else {
        console.log('❌ Plataforma iOS não habilitada');
    }
    
} else {
    console.log('❌ Erro ao ler configuração do Expo');
}

console.log('\n📈 RESUMO FINAL:');
console.log('=================');

const percentage = Math.round((passedChecks / totalChecks) * 100);
const status = percentage >= 90 ? '🟢 EXCELENTE' : 
               percentage >= 70 ? '🟡 BOM' : 
               percentage >= 50 ? '🟠 REGULAR' : '🔴 CRÍTICO';

console.log(`Status: ${status}`);
console.log(`Verificações: ${passedChecks}/${totalChecks} (${percentage}%)`);

console.log('\n🎯 PRÓXIMAS AÇÕES RECOMENDADAS:');
console.log('================================');

if (!iosExists) {
    console.log('1. 🖥️  Gerar projeto iOS em macOS/Linux:');
    console.log('   npx expo prebuild --platform ios --clean');
}

console.log('2. ☁️  Configurar variáveis no Xcode Cloud');
console.log('3. 🔑 Fazer upload da chave privada no App Store Connect');
console.log('4. 📱 Configurar provisioning profiles');
console.log('5. 🔨 Executar build de teste');
console.log('6. 📝 Criar listing no App Store Connect');
console.log('7. 🚀 Submeter para revisão da Apple');

console.log('\n📖 Consulte NEXT_STEPS.md para instruções detalhadas');

process.exit(percentage >= 70 ? 0 : 1);