#!/usr/bin/env node

/**
 * 🔐 CONFIGURADOR AUTOMÁTICO DE CREDENCIAIS
 * App Store Connect API - PsiqueiaApp
 */

const fs = require('fs');
const path = require('path');

// Configurações
const CONFIG = {
    keyId: '5D79LKKR26',
    issuerId: '9f9941d4-75b7-4f5c-a2c5-5b61415bc669',
    privateKeyPath: path.join(__dirname, '..', 'private_keys', 'AuthKey_5D79LKKR26.p8'),
    envPath: path.join(__dirname, '.env.xcode-cloud')
};

console.log('🚀 Configurando credenciais da App Store Connect API...\n');

async function configureCredentials() {
    try {
        // 1. Verificar se a chave privada existe
        console.log('📋 Verificando arquivos...');
        
        if (!fs.existsSync(CONFIG.privateKeyPath)) {
            console.log('❌ Arquivo de chave privada não encontrado!');
            console.log(`   Esperado em: ${CONFIG.privateKeyPath}`);
            console.log('\n📥 Para obter a chave privada:');
            console.log('   1. Acesse: https://appstoreconnect.apple.com');
            console.log('   2. Vá em Users and Access → Keys');
            console.log('   3. Baixe AuthKey_5D79LKKR26.p8');
            console.log('   4. Coloque na pasta private_keys/');
            return false;
        }

        // 2. Ler a chave privada
        console.log('🔑 Lendo chave privada...');
        let privateKeyContent;
        
        try {
            const rawContent = fs.readFileSync(CONFIG.privateKeyPath, 'utf8');
            
            // Verificar se é um arquivo .p8 válido
            if (rawContent.includes('-----BEGIN PRIVATE KEY-----')) {
                privateKeyContent = rawContent.trim();
                console.log('✅ Chave privada válida encontrada');
            } else {
                // Pode ser que o arquivo contenha JSON ou outro formato
                console.log('⚠️  Formato de arquivo não reconhecido');
                console.log('   Conteúdo encontrado:', rawContent.substring(0, 100) + '...');
                
                // Tentar extrair o Issuer ID se estiver no arquivo
                if (rawContent.includes(CONFIG.issuerId)) {
                    console.log('✅ Issuer ID confirmado no arquivo');
                }
                
                console.log('\n📝 Você precisa do arquivo .p8 real da Apple.');
                console.log('   O arquivo atual não contém a chave privada no formato correto.');
                return false;
            }
        } catch (error) {
            console.log('❌ Erro ao ler arquivo:', error.message);
            return false;
        }

        // 3. Configurar arquivo .env
        console.log('⚙️  Configurando variáveis de ambiente...');
        
        const envContent = `# 🔐 CONFIGURAÇÃO DA APP STORE CONNECT API

# Obrigatórias
APP_STORE_CONNECT_API_KEY_ID=${CONFIG.keyId}
APP_STORE_CONNECT_ISSUER_ID=${CONFIG.issuerId}
APP_STORE_CONNECT_PRIVATE_KEY="${privateKeyContent.replace(/\n/g, '\\n')}"

# Opcionais
XCODE_CLOUD_WEBHOOK_URL=https://your-domain.com/webhook
XCODE_CLOUD_WEBHOOK_SECRET=xcode-cloud-secret-2024

# Status
CONFIGURATION_STATUS=COMPLETE
CONFIGURED_AT=${new Date().toISOString()}
`;

        fs.writeFileSync(CONFIG.envPath, envContent);
        console.log('✅ Arquivo .env.xcode-cloud configurado');

        // 4. Testar configuração
        console.log('🧪 Testando configuração...');
        
        // Importar e testar o módulo de integração
        const integration = require('./app-store-connect-integration.js');
        
        try {
            const testResult = await integration.testConnection();
            if (testResult.success) {
                console.log('✅ Conexão com App Store Connect: SUCESSO');
                console.log(`   Apps encontrados: ${testResult.appsCount || 0}`);
            } else {
                console.log('⚠️  Conexão com App Store Connect: FALHOU');
                console.log(`   Erro: ${testResult.error}`);
            }
        } catch (error) {
            console.log('⚠️  Erro no teste de conexão:', error.message);
        }

        // 5. Resumo final
        console.log('\n🎉 CONFIGURAÇÃO COMPLETA!');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('✅ Key ID:', CONFIG.keyId);
        console.log('✅ Issuer ID:', CONFIG.issuerId);
        console.log('✅ Chave Privada: Configurada');
        console.log('✅ Arquivo .env: Atualizado');
        console.log('\n🌐 URLs Disponíveis:');
        console.log('   Dashboard: http://localhost:3001/dashboard');
        console.log('   API: http://localhost:3001/api');
        console.log('   Webhook: http://localhost:3001/webhook');
        console.log('\n🚀 Próximos passos:');
        console.log('   1. Reiniciar o servidor webhook');
        console.log('   2. Acessar o dashboard');
        console.log('   3. Configurar webhooks no App Store Connect');

        return true;

    } catch (error) {
        console.log('❌ Erro na configuração:', error.message);
        return false;
    }
}

// Executar se chamado diretamente
if (require.main === module) {
    configureCredentials().then(success => {
        process.exit(success ? 0 : 1);
    });
}

module.exports = { configureCredentials, CONFIG };