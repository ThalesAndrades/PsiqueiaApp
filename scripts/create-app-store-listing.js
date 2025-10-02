#!/usr/bin/env node

/**
 * Script para auxiliar na criação do listing do App Store
 * Gera todas as informações necessárias formatadas para copy/paste
 */

const fs = require('fs');
const path = require('path');

console.log('🍎 ASSISTENTE PARA CRIAÇÃO DO LISTING NO APP STORE');
console.log('=' .repeat(60));

// Função para ler arquivo se existir
function readFileIfExists(filePath) {
    try {
        if (fs.existsSync(filePath)) {
            return fs.readFileSync(filePath, 'utf8').trim();
        }
        return null;
    } catch (error) {
        return null;
    }
}

// Informações básicas do app
const appInfo = {
    name: 'PsiqueiaApp',
    bundleId: 'com.thalesdev.psiqueiaapp',
    sku: 'psiqueiaapp-v1',
    primaryLanguage: 'Portuguese (Brazil)',
    category: 'Medical',
    ageRating: '4+',
    price: 'Free'
};

console.log('\n📱 INFORMAÇÕES BÁSICAS DO APP');
console.log('-'.repeat(40));
console.log(`Nome do App: ${appInfo.name}`);
console.log(`Bundle ID: ${appInfo.bundleId}`);
console.log(`SKU: ${appInfo.sku}`);
console.log(`Idioma Principal: ${appInfo.primaryLanguage}`);
console.log(`Categoria: ${appInfo.category}`);
console.log(`Classificação Etária: ${appInfo.ageRating}`);
console.log(`Preço: ${appInfo.price}`);

// Ler descrições
console.log('\n📝 DESCRIÇÕES DO APP STORE');
console.log('-'.repeat(40));

const descriptionPT = readFileIfExists('app-store-metadata/pt-BR/description.txt');
const descriptionEN = readFileIfExists('app-store-metadata/en-US/description.txt');
const keywords = readFileIfExists('app-store-metadata/keywords.txt');
const releaseNotes = readFileIfExists('app-store-metadata/release-notes/v1.0.0.md');

if (descriptionPT) {
    console.log('\n🇧🇷 DESCRIÇÃO (PORTUGUÊS):');
    console.log('```');
    console.log(descriptionPT);
    console.log('```');
} else {
    console.log('\n❌ Descrição em português não encontrada');
}

if (descriptionEN) {
    console.log('\n🇺🇸 DESCRIÇÃO (INGLÊS):');
    console.log('```');
    console.log(descriptionEN);
    console.log('```');
} else {
    console.log('\n❌ Descrição em inglês não encontrada');
}

if (keywords) {
    console.log('\n🔍 PALAVRAS-CHAVE:');
    console.log('```');
    console.log(keywords);
    console.log('```');
} else {
    console.log('\n❌ Palavras-chave não encontradas');
}

if (releaseNotes) {
    console.log('\n📋 NOTAS DA VERSÃO:');
    console.log('```');
    console.log(releaseNotes);
    console.log('```');
} else {
    console.log('\n❌ Notas da versão não encontradas');
}

// Informações de HealthKit
console.log('\n🏥 CONFIGURAÇÕES DE HEALTHKIT');
console.log('-'.repeat(40));
console.log('Health and Fitness: SIM');
console.log('Health Records: NÃO');
console.log('\nDescrição do uso do HealthKit:');
console.log('```');
console.log('Este app integra com o Apple Health para sincronizar dados de bem-estar e humor, permitindo um acompanhamento mais completo da saúde mental do usuário. Os dados são utilizados apenas para melhorar a experiência do usuário e são armazenados localmente no dispositivo.');
console.log('```');

// Informações de revisão
console.log('\n🔍 INFORMAÇÕES PARA REVISÃO DA APPLE');
console.log('-'.repeat(40));
console.log('Demo Account: NÃO NECESSÁRIO (app não requer login)');
console.log('\nNotas para o revisor:');
console.log('```');
console.log('App de saúde mental com foco em privacidade. Todos os dados são armazenados localmente no dispositivo do usuário. O app integra com HealthKit para sincronização de dados de bem-estar, mas não coleta nem transmite informações pessoais para servidores externos. Todas as funcionalidades estão disponíveis sem necessidade de conta ou login.');
console.log('```');

// Export Compliance
console.log('\n🔒 EXPORT COMPLIANCE');
console.log('-'.repeat(40));
console.log('Pergunta: "Does your app use encryption?"');
console.log('Resposta: SIM (HTTPS padrão)');
console.log('\nPergunta: "Is your app designed to use cryptography or does it contain or incorporate cryptography?"');
console.log('Resposta: NÃO (apenas HTTPS padrão do sistema)');

// Screenshots necessários
console.log('\n📸 SCREENSHOTS NECESSÁRIOS');
console.log('-'.repeat(40));
console.log('iPhone 6.7" (OBRIGATÓRIO):');
console.log('- Screenshot 1: Dashboard principal com monitoramento de humor');
console.log('- Screenshot 2: Tela de registro de humor');
console.log('- Screenshot 3: Exercícios de mindfulness');
console.log('- Screenshot 4: Diário emocional');
console.log('- Screenshot 5: Relatórios e insights');
console.log('\niPhone 5.5" (OBRIGATÓRIO):');
console.log('- Mesmos screenshots redimensionados');
console.log('\niPad Pro 12.9" (OPCIONAL):');
console.log('- Screenshots otimizados para tablet');

// Verificar se há guia de screenshots
const screenshotGuide = readFileIfExists('app-store-metadata/screenshots/README.md');
if (screenshotGuide) {
    console.log('\n📖 Consulte o guia detalhado de screenshots em:');
    console.log('app-store-metadata/screenshots/README.md');
}

// Configurações de privacidade
console.log('\n🔐 CONFIGURAÇÕES DE PRIVACIDADE');
console.log('-'.repeat(40));
console.log('Data Collection: NÃO (todos os dados são locais)');
console.log('Third-party SDKs: Apenas Expo/React Native (padrão)');
console.log('Analytics: NÃO');
console.log('Advertising: NÃO');
console.log('Location: NÃO');
console.log('Camera/Microphone: NÃO');
console.log('Contacts: NÃO');
console.log('Health Data: SIM (HealthKit para sincronização local)');

// Links importantes
console.log('\n🔗 LINKS IMPORTANTES');
console.log('-'.repeat(40));
console.log('App Store Connect: https://appstoreconnect.apple.com');
console.log('Apple Developer Portal: https://developer.apple.com');
console.log('App Store Review Guidelines: https://developer.apple.com/app-store/review/guidelines/');
console.log('HealthKit Guidelines: https://developer.apple.com/health-fitness/');

// Próximos passos
console.log('\n🎯 PRÓXIMOS PASSOS');
console.log('-'.repeat(40));
console.log('1. Gerar projeto iOS nativo (macOS/Linux)');
console.log('2. Configurar Xcode Cloud');
console.log('3. Fazer upload da chave privada');
console.log('4. Criar provisioning profiles');
console.log('5. Executar build de teste');
console.log('6. Criar listing no App Store Connect');
console.log('7. Fazer upload dos screenshots');
console.log('8. Submeter para revisão');

console.log('\n✅ TODAS AS INFORMAÇÕES ESTÃO PRONTAS PARA USO!');
console.log('📋 Consulte FINAL_DEPLOYMENT_CHECKLIST.md para o processo completo');
console.log('=' .repeat(60));