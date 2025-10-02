/**
 * 🔑 GERADOR DE CHAVE PRIVADA DE TESTE
 * 
 * Este script gera uma chave privada ES256 válida para demonstração.
 * IMPORTANTE: Esta é apenas para teste - use sua chave real do App Store Connect em produção.
 */

const crypto = require('crypto');
const fs = require('fs');

function generateTestKey() {
    console.log('🔑 Gerando chave privada de teste ES256...\n');
    
    try {
        // Gerar par de chaves ES256 (ECDSA P-256)
        const { privateKey, publicKey } = crypto.generateKeyPairSync('ec', {
            namedCurve: 'prime256v1',
            privateKeyEncoding: {
                type: 'pkcs8',
                format: 'pem'
            },
            publicKeyEncoding: {
                type: 'spki',
                format: 'pem'
            }
        });
        
        console.log('✅ Chave privada gerada com sucesso!');
        console.log('📝 Formato: PKCS#8 PEM (ES256 compatível)\n');
        
        // Salvar chave de teste
        const testKeyPath = './test-private-key.pem';
        fs.writeFileSync(testKeyPath, privateKey);
        console.log(`💾 Chave salva em: ${testKeyPath}\n`);
        
        // Atualizar .env com chave de teste
        const envContent = `# 🔐 CONFIGURAÇÃO DA APP STORE CONNECT API (TESTE)

# Obrigatórias
APP_STORE_CONNECT_API_KEY_ID=5D79LKKR26
APP_STORE_CONNECT_ISSUER_ID=9f9941d4-75b7-4f5c-a2c5-5b61415bc669
APP_STORE_CONNECT_PRIVATE_KEY="${privateKey.replace(/\n/g, '\\n')}"

# Opcionais
XCODE_CLOUD_WEBHOOK_URL=https://your-domain.com/webhook
XCODE_CLOUD_WEBHOOK_SECRET=xcode-cloud-secret-2024

# Status
CONFIGURATION_STATUS=COMPLETE
CONFIGURED_AT=${new Date().toISOString()}

# AVISO: Esta é uma chave de teste gerada automaticamente
# Para produção, use sua chave real do App Store Connect
TEST_KEY_GENERATED=true`;
        
        fs.writeFileSync('.env.xcode-cloud', envContent);
        console.log('✅ Arquivo .env.xcode-cloud atualizado com chave de teste\n');
        
        console.log('🎯 PRÓXIMOS PASSOS:');
        console.log('1. ✅ Chave de teste gerada e configurada');
        console.log('2. 🧪 Execute: node test-connection.js');
        console.log('3. 🌐 Acesse: http://localhost:3001/dashboard');
        console.log('4. 📱 Para produção: substitua pela chave real do App Store Connect\n');
        
        console.log('⚠️  IMPORTANTE:');
        console.log('   Esta chave de teste permite validar a integração,');
        console.log('   mas não funcionará com a API real do App Store Connect.');
        console.log('   Para dados reais, você precisa da chave oficial da Apple.\n');
        
        return {
            success: true,
            message: 'Chave de teste gerada com sucesso',
            keyPath: testKeyPath,
            keyPreview: privateKey.substring(0, 100) + '...'
        };
        
    } catch (error) {
        console.log(`❌ Erro ao gerar chave: ${error.message}`);
        return {
            success: false,
            error: error.message
        };
    }
}

// Executar geração
const result = generateTestKey();
console.log('📋 RESULTADO:');
console.log(JSON.stringify(result, null, 2));