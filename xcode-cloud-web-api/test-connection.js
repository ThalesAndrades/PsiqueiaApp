/**
 * 🧪 TESTE DE CONEXÃO - DIAGNÓSTICO COMPLETO
 */

const jwt = require('jsonwebtoken');
const axios = require('axios');
require('dotenv').config({ path: '.env.xcode-cloud' });

async function testConnection() {
    console.log('🔍 Iniciando teste de conexão com App Store Connect API...\n');
    
    try {
        // 1. Verificar variáveis de ambiente
        console.log('📋 Verificando configuração...');
        const keyId = process.env.APP_STORE_CONNECT_API_KEY_ID;
        const issuerId = process.env.APP_STORE_CONNECT_ISSUER_ID;
        let privateKey = process.env.APP_STORE_CONNECT_PRIVATE_KEY;
        
        console.log(`   Key ID: ${keyId ? '✅ Configurado' : '❌ Não encontrado'}`);
        console.log(`   Issuer ID: ${issuerId ? '✅ Configurado' : '❌ Não encontrado'}`);
        console.log(`   Private Key: ${privateKey ? '✅ Configurado' : '❌ Não encontrado'}\n`);
        
        if (!keyId || !issuerId || !privateKey) {
            throw new Error('Credenciais incompletas');
        }
        
        // 2. Processar chave privada
        console.log('🔑 Processando chave privada...');
        
        // Remover aspas se existirem
        privateKey = privateKey.replace(/^"(.*)"$/, '$1');
        
        // Converter \n para quebras de linha reais
        privateKey = privateKey.replace(/\\n/g, '\n');
        
        console.log('   Formato da chave:');
        console.log(`   - Começa com BEGIN: ${privateKey.includes('-----BEGIN PRIVATE KEY-----') ? '✅' : '❌'}`);
        console.log(`   - Termina com END: ${privateKey.includes('-----END PRIVATE KEY-----') ? '✅' : '❌'}`);
        console.log(`   - Tamanho: ${privateKey.length} caracteres\n`);
        
        // 3. Gerar JWT
        console.log('🔐 Gerando JWT token...');
        
        const now = Math.round(Date.now() / 1000);
        const payload = {
            iss: issuerId,
            iat: now,
            exp: now + (20 * 60), // 20 minutos
            aud: 'appstoreconnect-v1'
        };
        
        const header = {
            alg: 'ES256',
            kid: keyId,
            typ: 'JWT'
        };
        
        const token = jwt.sign(payload, privateKey, { 
            algorithm: 'ES256',
            header: header
        });
        
        console.log('   ✅ JWT gerado com sucesso\n');
        
        // 4. Testar API
        console.log('🌐 Testando conexão com API...');
        
        const response = await axios.get('https://api.appstoreconnect.apple.com/v1/apps', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            timeout: 10000
        });
        
        if (response.status === 200 && response.data) {
            console.log('   ✅ Conexão estabelecida com sucesso!');
            console.log(`   📱 Apps encontrados: ${response.data.data.length}\n`);
            
            if (response.data.data.length > 0) {
                console.log('📱 Primeiros apps:');
                response.data.data.slice(0, 3).forEach((app, index) => {
                    console.log(`   ${index + 1}. ${app.attributes.name} (${app.attributes.bundleId})`);
                });
            }
            
            return {
                success: true,
                message: 'Conexão estabelecida com sucesso!',
                appsCount: response.data.data.length,
                apps: response.data.data.slice(0, 3).map(app => ({
                    id: app.id,
                    name: app.attributes.name,
                    bundleId: app.attributes.bundleId
                }))
            };
        }
        
    } catch (error) {
        console.log(`   ❌ Erro: ${error.message}\n`);
        
        if (error.response) {
            console.log('📋 Detalhes do erro HTTP:');
            console.log(`   Status: ${error.response.status}`);
            console.log(`   Dados: ${JSON.stringify(error.response.data, null, 2)}`);
        }
        
        return {
            success: false,
            error: error.message,
            details: error.response ? error.response.data : null
        };
    }
}

// Executar teste
testConnection().then(result => {
    console.log('\n🎯 RESULTADO FINAL:');
    console.log(JSON.stringify(result, null, 2));
}).catch(error => {
    console.log('\n💥 ERRO CRÍTICO:');
    console.log(error.message);
});