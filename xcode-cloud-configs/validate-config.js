#!/usr/bin/env node

/**
 * Script para validar configurações do Xcode Cloud
 */

const fs = require('fs');

console.log('🔍 VALIDANDO CONFIGURAÇÕES DO XCODE CLOUD');
console.log('=' .repeat(45));

// Verificar arquivo .xcode-cloud.yml
const xcodeCloudFile = '.xcode-cloud.yml';
if (fs.existsSync(xcodeCloudFile)) {
    console.log('✅ Arquivo .xcode-cloud.yml encontrado');
    
    const content = fs.readFileSync(xcodeCloudFile, 'utf8');
    
    // Verificações básicas
    const checks = [
        { name: 'Version definida', test: content.includes('version:') },
        { name: 'Workflow configurado', test: content.includes('workflows:') },
        { name: 'Environment definido', test: content.includes('environment:') },
        { name: 'Steps configurados', test: content.includes('steps:') },
        { name: 'Deploy configurado', test: content.includes('deploy:') }
    ];
    
    checks.forEach(check => {
        console.log(check.test ? '✅' : '❌', check.name);
    });
} else {
    console.log('❌ Arquivo .xcode-cloud.yml não encontrado');
}

// Verificar chave privada
const privateKeyPath = 'private_keys/AuthKey_5D79LKKR26.p8';
if (fs.existsSync(privateKeyPath)) {
    console.log('✅ Chave privada encontrada');
} else {
    console.log('❌ Chave privada não encontrada em:', privateKeyPath);
}

// Verificar app.json
const appJsonPath = 'app.json';
if (fs.existsSync(appJsonPath)) {
    console.log('✅ app.json encontrado');
    
    try {
        const appJson = JSON.parse(fs.readFileSync(appJsonPath, 'utf8'));
        const expo = appJson.expo;
        
        if (expo.ios && expo.ios.bundleIdentifier) {
            console.log('✅ Bundle ID configurado:', expo.ios.bundleIdentifier);
        } else {
            console.log('❌ Bundle ID não configurado');
        }
        
        if (expo.version) {
            console.log('✅ Versão configurada:', expo.version);
        } else {
            console.log('❌ Versão não configurada');
        }
    } catch (error) {
        console.log('❌ Erro ao ler app.json:', error.message);
    }
} else {
    console.log('❌ app.json não encontrado');
}

console.log('\n📋 PRÓXIMOS PASSOS:');
console.log('1. Configure as variáveis de ambiente no App Store Connect');
console.log('2. Faça upload da chave privada');
console.log('3. Execute um build de teste');
console.log('4. Monitore os logs no Xcode Cloud');

console.log('\n📖 Consulte: xcode-cloud-configs/SETUP_INSTRUCTIONS.md');
