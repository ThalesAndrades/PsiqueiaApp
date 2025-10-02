#!/usr/bin/env node

/**
 * Google Play Console Listing Generator
 * Gera todas as informações necessárias para publicar no Google Play Store
 */

const fs = require('fs');
const path = require('path');

// Criar diretório se não existir
const googlePlayDir = path.join(__dirname);
if (!fs.existsSync(googlePlayDir)) {
    fs.mkdirSync(googlePlayDir, { recursive: true });
}

// Informações básicas do app
const appInfo = {
    packageName: "com.thalesandrades.psiqueiaapp",
    appName: "PsiqueiaApp",
    version: "1.0.0",
    versionCode: 1,
    minSdkVersion: 21,
    targetSdkVersion: 34,
    compileSdkVersion: 34
};

// Metadados para Google Play
const playStoreMetadata = {
    // Título (máximo 50 caracteres)
    title: "PsiqueiaApp - Saúde Mental",
    
    // Descrição curta (máximo 80 caracteres)
    shortDescription: "Monitore sua saúde mental com HealthKit. Privacidade total garantida.",
    
    // Descrição completa (máximo 4000 caracteres)
    fullDescription: {
        "pt-BR": `🧠 PsiqueiaApp - Sua Saúde Mental em Primeiro Lugar

O PsiqueiaApp é um aplicativo inovador desenvolvido para ajudar você a monitorar e cuidar da sua saúde mental de forma simples e eficaz.

✨ PRINCIPAIS RECURSOS:
• 📊 Monitoramento completo da saúde mental
• 🔒 Privacidade total - seus dados ficam apenas no seu dispositivo
• 📱 Interface intuitiva e fácil de usar
• 🏥 Integração com HealthKit para dados precisos
• 📈 Relatórios detalhados do seu progresso
• 🎯 Acompanhamento personalizado

🔐 PRIVACIDADE E SEGURANÇA:
• Nenhum dado é coletado ou compartilhado
• Informações armazenadas localmente no seu dispositivo
• Sem anúncios ou rastreamento
• Conformidade total com LGPD e GDPR

💡 COMO FUNCIONA:
1. Configure seus objetivos de saúde mental
2. Registre seu humor e atividades diárias
3. Acompanhe seu progresso com gráficos intuitivos
4. Receba insights personalizados

👨‍⚕️ DESENVOLVIDO POR ESPECIALISTAS:
Criado com base em práticas clínicas reconhecidas e feedback de profissionais de saúde mental.

🌟 BENEFÍCIOS:
• Maior autoconhecimento
• Identificação de padrões comportamentais
• Suporte na tomada de decisões sobre saúde mental
• Ferramenta complementar ao acompanhamento profissional

Baixe agora e comece sua jornada rumo ao bem-estar mental!`,
        
        "en-US": `🧠 PsiqueiaApp - Your Mental Health First

PsiqueiaApp is an innovative application developed to help you monitor and care for your mental health in a simple and effective way.

✨ KEY FEATURES:
• 📊 Complete mental health monitoring
• 🔒 Total privacy - your data stays only on your device
• 📱 Intuitive and easy-to-use interface
• 🏥 HealthKit integration for accurate data
• 📈 Detailed progress reports
• 🎯 Personalized tracking

🔐 PRIVACY & SECURITY:
• No data collected or shared
• Information stored locally on your device
• No ads or tracking
• Full LGPD and GDPR compliance

💡 HOW IT WORKS:
1. Set your mental health goals
2. Log your daily mood and activities
3. Track your progress with intuitive charts
4. Receive personalized insights

👨‍⚕️ DEVELOPED BY EXPERTS:
Created based on recognized clinical practices and feedback from mental health professionals.

🌟 BENEFITS:
• Greater self-awareness
• Identification of behavioral patterns
• Support in mental health decision-making
• Complementary tool to professional monitoring

Download now and start your journey to mental wellness!`
    },
    
    // Palavras-chave (máximo 50 caracteres cada)
    keywords: [
        "saúde mental",
        "bem-estar",
        "humor",
        "ansiedade",
        "depressão",
        "mindfulness",
        "psicologia",
        "terapia",
        "autoconhecimento",
        "HealthKit"
    ],
    
    // Categoria
    category: "MEDICAL",
    
    // Classificação de conteúdo
    contentRating: "PEGI_3",
    
    // Notas de versão
    releaseNotes: {
        "pt-BR": `🎉 Primeira versão do PsiqueiaApp!

✨ Novidades desta versão:
• Interface intuitiva para monitoramento de saúde mental
• Integração completa com HealthKit
• Sistema de privacidade total
• Relatórios detalhados de progresso
• Configurações personalizáveis

🔒 Privacidade garantida:
• Nenhum dado é coletado
• Informações ficam apenas no seu dispositivo
• Sem anúncios ou rastreamento

Comece sua jornada de bem-estar mental hoje!`,
        
        "en-US": `🎉 First version of PsiqueiaApp!

✨ What's new in this version:
• Intuitive interface for mental health monitoring
• Complete HealthKit integration
• Total privacy system
• Detailed progress reports
• Customizable settings

🔒 Privacy guaranteed:
• No data collected
• Information stays only on your device
• No ads or tracking

Start your mental wellness journey today!`
    }
};

// Configurações de privacidade para Google Play
const privacySettings = {
    dataCollection: {
        collectsPersonalData: false,
        collectsLocationData: false,
        collectsDeviceData: false,
        collectsUsageData: false,
        collectsHealthData: true, // Apenas HealthKit local
        collectsFinancialData: false,
        collectsContactsData: false,
        collectsPhotosData: false,
        collectsAudioData: false,
        collectsFilesData: false,
        collectsCalendarData: false,
        collectsMessagesData: false
    },
    
    dataSharing: {
        sharesDataWithThirdParties: false,
        sharesDataForAdvertising: false,
        sharesDataForAnalytics: false,
        sharesDataForFunctionality: false
    },
    
    dataRetention: {
        retentionPolicy: "Data is stored locally on device only",
        deletionProcess: "Data is deleted when app is uninstalled"
    },
    
    securityMeasures: {
        dataEncryption: true,
        secureTransmission: false, // Não há transmissão
        accessControls: true,
        regularSecurityUpdates: true
    }
};

// Permissões necessárias
const permissions = {
    required: [
        {
            name: "android.permission.INTERNET",
            reason: "Required for app functionality (minimal usage)"
        }
    ],
    optional: [
        {
            name: "android.permission.HEALTH_CONNECT",
            reason: "To sync health data locally (Android equivalent to HealthKit)"
        }
    ]
};

// Especificações de screenshots
const screenshotSpecs = {
    phone: {
        required: true,
        minCount: 2,
        maxCount: 8,
        dimensions: "1080x1920 ou 1080x2340",
        format: "PNG ou JPEG",
        maxSize: "8MB cada"
    },
    tablet7inch: {
        required: false,
        minCount: 1,
        maxCount: 8,
        dimensions: "1200x1920",
        format: "PNG ou JPEG",
        maxSize: "8MB cada"
    },
    tablet10inch: {
        required: false,
        minCount: 1,
        maxCount: 8,
        dimensions: "1600x2560",
        format: "PNG ou JPEG",
        maxSize: "8MB cada"
    }
};

// Informações para revisão
const reviewInfo = {
    testInstructions: {
        "pt-BR": `Instruções para Teste - PsiqueiaApp

CONFIGURAÇÃO INICIAL:
1. Instale o aplicativo
2. Aceite as permissões de HealthKit (se disponível)
3. Complete o setup inicial

FUNCIONALIDADES PRINCIPAIS:
1. Navegue pela interface principal
2. Teste o registro de humor/atividades
3. Verifique os relatórios e gráficos
4. Teste as configurações

PRIVACIDADE:
• Verifique que nenhum dado é enviado externamente
• Confirme que dados ficam apenas no dispositivo
• Teste desinstalação e reinstalação

NOTAS IMPORTANTES:
• App funciona offline
• Não requer login ou cadastro
• Foco total em privacidade do usuário`,
        
        "en-US": `Test Instructions - PsiqueiaApp

INITIAL SETUP:
1. Install the application
2. Accept HealthKit permissions (if available)
3. Complete initial setup

MAIN FEATURES:
1. Navigate through main interface
2. Test mood/activity logging
3. Check reports and charts
4. Test settings

PRIVACY:
• Verify no data is sent externally
• Confirm data stays only on device
• Test uninstall and reinstall

IMPORTANT NOTES:
• App works offline
• No login or registration required
• Total focus on user privacy`
    },
    
    contactInfo: {
        email: "thalesandrades.dev@gmail.com",
        website: "https://github.com/ThalesAndrades/PsiqueiaApp",
        supportUrl: "https://github.com/ThalesAndrades/PsiqueiaApp/issues"
    }
};

// Configurações de monetização
const monetization = {
    appType: "FREE",
    containsAds: false,
    inAppPurchases: false,
    subscriptions: false,
    paidContent: false
};

// Gerar arquivos
console.log('🚀 Gerando configurações do Google Play Console...\n');

// 1. Informações básicas
fs.writeFileSync(
    path.join(googlePlayDir, 'app-info.json'),
    JSON.stringify(appInfo, null, 2)
);
console.log('✅ app-info.json criado');

// 2. Metadados da Play Store
fs.writeFileSync(
    path.join(googlePlayDir, 'play-store-metadata.json'),
    JSON.stringify(playStoreMetadata, null, 2)
);
console.log('✅ play-store-metadata.json criado');

// 3. Configurações de privacidade
fs.writeFileSync(
    path.join(googlePlayDir, 'privacy-settings.json'),
    JSON.stringify(privacySettings, null, 2)
);
console.log('✅ privacy-settings.json criado');

// 4. Permissões
fs.writeFileSync(
    path.join(googlePlayDir, 'permissions.json'),
    JSON.stringify(permissions, null, 2)
);
console.log('✅ permissions.json criado');

// 5. Especificações de screenshots
fs.writeFileSync(
    path.join(googlePlayDir, 'screenshot-specs.json'),
    JSON.stringify(screenshotSpecs, null, 2)
);
console.log('✅ screenshot-specs.json criado');

// 6. Informações para revisão
fs.writeFileSync(
    path.join(googlePlayDir, 'review-info.json'),
    JSON.stringify(reviewInfo, null, 2)
);
console.log('✅ review-info.json criado');

// 7. Configurações de monetização
fs.writeFileSync(
    path.join(googlePlayDir, 'monetization.json'),
    JSON.stringify(monetization, null, 2)
);
console.log('✅ monetization.json criado');

// 8. Descrições em arquivos separados
const descriptionsDir = path.join(googlePlayDir, 'descriptions');
if (!fs.existsSync(descriptionsDir)) {
    fs.mkdirSync(descriptionsDir, { recursive: true });
}

fs.writeFileSync(
    path.join(descriptionsDir, 'pt-BR.txt'),
    playStoreMetadata.fullDescription['pt-BR']
);

fs.writeFileSync(
    path.join(descriptionsDir, 'en-US.txt'),
    playStoreMetadata.fullDescription['en-US']
);
console.log('✅ Descrições em pt-BR.txt e en-US.txt criadas');

// 9. Notas de versão
const releaseNotesDir = path.join(googlePlayDir, 'release-notes');
if (!fs.existsSync(releaseNotesDir)) {
    fs.mkdirSync(releaseNotesDir, { recursive: true });
}

fs.writeFileSync(
    path.join(releaseNotesDir, 'pt-BR-v1.0.0.txt'),
    playStoreMetadata.releaseNotes['pt-BR']
);

fs.writeFileSync(
    path.join(releaseNotesDir, 'en-US-v1.0.0.txt'),
    playStoreMetadata.releaseNotes['en-US']
);
console.log('✅ Notas de versão criadas');

// 10. Guia de screenshots
const screenshotGuide = `# Guia de Screenshots - Google Play Console

## Especificações Técnicas

### 📱 Smartphone (OBRIGATÓRIO)
- **Quantidade:** 2-8 screenshots
- **Dimensões:** 1080x1920 ou 1080x2340 pixels
- **Formato:** PNG ou JPEG
- **Tamanho máximo:** 8MB cada

### 📱 Tablet 7" (OPCIONAL)
- **Quantidade:** 1-8 screenshots
- **Dimensões:** 1200x1920 pixels
- **Formato:** PNG ou JPEG
- **Tamanho máximo:** 8MB cada

### 📱 Tablet 10" (OPCIONAL)
- **Quantidade:** 1-8 screenshots
- **Dimensões:** 1600x2560 pixels
- **Formato:** PNG ou JPEG
- **Tamanho máximo:** 8MB cada

## Screenshots Recomendados

1. **Tela Principal** - Interface inicial do app
2. **Monitoramento** - Tela de registro de humor/atividades
3. **Relatórios** - Gráficos e estatísticas
4. **Configurações** - Tela de configurações de privacidade
5. **HealthKit** - Integração com dados de saúde
6. **Privacidade** - Destaque das configurações de privacidade

## Dicas para Screenshots

- Use dados de exemplo realistas
- Destaque os principais recursos
- Mantenha consistência visual
- Evite informações pessoais reais
- Use modo claro para melhor visibilidade
- Inclua elementos que mostrem a privacidade

## Ferramentas Recomendadas

- **Android Studio:** Device Frame Screenshots
- **Figma:** Para criar mockups
- **Canva:** Para adicionar textos explicativos
- **Screenshot Easy:** Para capturas em dispositivos reais
`;

fs.writeFileSync(
    path.join(googlePlayDir, 'SCREENSHOT_GUIDE.md'),
    screenshotGuide
);
console.log('✅ SCREENSHOT_GUIDE.md criado');

// 11. Checklist de upload
const uploadChecklist = `# Checklist de Upload - Google Play Console

## ✅ Pré-requisitos
- [ ] Conta Google Play Developer ativa
- [ ] Taxa de desenvolvedor paga ($25 USD)
- [ ] APK/AAB do app compilado
- [ ] Ícone do app (512x512 PNG)
- [ ] Screenshots nas dimensões corretas

## 📱 Informações do App
- [ ] Nome do app: "${playStoreMetadata.title}"
- [ ] Descrição curta: "${playStoreMetadata.shortDescription}"
- [ ] Descrição completa (pt-BR e en-US)
- [ ] Categoria: ${playStoreMetadata.category}
- [ ] Classificação: ${playStoreMetadata.contentRating}

## 🔒 Privacidade e Segurança
- [ ] Política de privacidade (se necessário)
- [ ] Declaração de segurança de dados
- [ ] Permissões justificadas
- [ ] Conformidade com COPPA (se aplicável)

## 📊 Configurações de Lançamento
- [ ] Países/regiões de disponibilidade
- [ ] Preço (gratuito)
- [ ] Classificação de conteúdo
- [ ] Público-alvo

## 🧪 Testes
- [ ] Teste interno realizado
- [ ] Teste fechado (opcional)
- [ ] Teste aberto (opcional)
- [ ] Revisão de qualidade aprovada

## 📋 Metadados
- [ ] Screenshots carregados
- [ ] Ícone de alta resolução
- [ ] Banner promocional (opcional)
- [ ] Vídeo promocional (opcional)

## 🚀 Publicação
- [ ] Revisão final de todas as informações
- [ ] Envio para revisão do Google
- [ ] Aguardar aprovação (1-3 dias)
- [ ] Publicação confirmada

## 📞 Suporte
- Email: ${reviewInfo.contactInfo.email}
- Website: ${reviewInfo.contactInfo.website}
- Suporte: ${reviewInfo.contactInfo.supportUrl}
`;

fs.writeFileSync(
    path.join(googlePlayDir, 'UPLOAD_CHECKLIST.md'),
    uploadChecklist
);
console.log('✅ UPLOAD_CHECKLIST.md criado');

// Resumo final
console.log('\n🎉 CONFIGURAÇÕES DO GOOGLE PLAY CONSOLE GERADAS COM SUCESSO!\n');

console.log('📁 Arquivos criados:');
console.log('├── app-info.json');
console.log('├── play-store-metadata.json');
console.log('├── privacy-settings.json');
console.log('├── permissions.json');
console.log('├── screenshot-specs.json');
console.log('├── review-info.json');
console.log('├── monetization.json');
console.log('├── descriptions/');
console.log('│   ├── pt-BR.txt');
console.log('│   └── en-US.txt');
console.log('├── release-notes/');
console.log('│   ├── pt-BR-v1.0.0.txt');
console.log('│   └── en-US-v1.0.0.txt');
console.log('├── SCREENSHOT_GUIDE.md');
console.log('└── UPLOAD_CHECKLIST.md');

console.log('\n📋 Próximos passos:');
console.log('1. 📱 Gerar APK/AAB do Android: npx expo build:android');
console.log('2. 📸 Criar screenshots seguindo SCREENSHOT_GUIDE.md');
console.log('3. 🏪 Acessar Google Play Console');
console.log('4. ✅ Seguir UPLOAD_CHECKLIST.md');
console.log('5. 🚀 Submeter para revisão');

console.log('\n🔗 Links importantes:');
console.log('• Google Play Console: https://play.google.com/console');
console.log('• Políticas do Google Play: https://play.google.com/about/developer-policy/');
console.log('• Guia de publicação: https://developer.android.com/distribute/google-play');

console.log('\n✨ Todas as configurações estão prontas para uso!');