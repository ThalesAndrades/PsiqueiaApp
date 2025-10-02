#!/usr/bin/env node

/**
 * Script para gerar configurações do Xcode Cloud
 * Cria arquivos de configuração e instruções detalhadas
 */

const fs = require('fs');
const path = require('path');

console.log('☁️ GERADOR DE CONFIGURAÇÕES DO XCODE CLOUD');
console.log('=' .repeat(50));

// Criar diretório para configurações do Xcode Cloud se não existir
const xcodeCloudDir = 'xcode-cloud-configs';
if (!fs.existsSync(xcodeCloudDir)) {
    fs.mkdirSync(xcodeCloudDir, { recursive: true });
    console.log(`✅ Diretório ${xcodeCloudDir} criado`);
}

// Configurações das variáveis de ambiente
const environmentVariables = {
    'APP_STORE_CONNECT_API_KEY_ID': {
        value: '5D79LKKR26',
        description: 'ID da chave API do App Store Connect',
        required: true,
        secret: false
    },
    'APP_STORE_CONNECT_ISSUER_ID': {
        value: '[SUBSTITUIR_PELO_SEU_ISSUER_ID]',
        description: 'Issuer ID da sua conta do App Store Connect',
        required: true,
        secret: false,
        instructions: 'Encontre em App Store Connect > Users and Access > Keys'
    },
    'DEVELOPMENT_TEAM': {
        value: '[SUBSTITUIR_PELO_SEU_TEAM_ID]',
        description: 'Team ID do Apple Developer Program',
        required: true,
        secret: false,
        instructions: 'Encontre em Apple Developer Portal > Membership'
    },
    'EXPO_TOKEN': {
        value: '[OPCIONAL_EXPO_TOKEN]',
        description: 'Token do Expo para builds automatizados',
        required: false,
        secret: true,
        instructions: 'Gere em https://expo.dev/accounts/[username]/settings/access-tokens'
    }
};

// Gerar arquivo de configuração das variáveis
const envConfigPath = path.join(xcodeCloudDir, 'environment-variables.json');
fs.writeFileSync(envConfigPath, JSON.stringify(environmentVariables, null, 2));
console.log(`✅ Configurações salvas em: ${envConfigPath}`);

// Gerar instruções detalhadas
const instructionsPath = path.join(xcodeCloudDir, 'SETUP_INSTRUCTIONS.md');
const instructions = `# 🛠️ INSTRUÇÕES DE CONFIGURAÇÃO DO XCODE CLOUD

## 📋 VARIÁVEIS DE AMBIENTE NECESSÁRIAS

### 🔧 Como Configurar no App Store Connect

1. **Acesse o App Store Connect**
   - URL: https://appstoreconnect.apple.com
   - Faça login com sua conta de desenvolvedor

2. **Navegue para Xcode Cloud**
   - Vá para "Apps" → Selecione seu app → "Xcode Cloud"
   - Ou acesse diretamente: "Xcode Cloud" no menu lateral

3. **Configure Environment Variables**
   - Clique em "Settings" → "Environment Variables"
   - Adicione as seguintes variáveis:

### 📝 VARIÁVEIS OBRIGATÓRIAS

#### \`APP_STORE_CONNECT_API_KEY_ID\`
- **Valor**: \`5D79LKKR26\`
- **Tipo**: Text
- **Descrição**: ID da chave API do App Store Connect
- **Secret**: Não

#### \`APP_STORE_CONNECT_ISSUER_ID\`
- **Valor**: \`[SEU_ISSUER_ID]\`
- **Tipo**: Text
- **Descrição**: Issuer ID da sua conta do App Store Connect
- **Secret**: Não
- **Como encontrar**:
  1. Vá para App Store Connect
  2. Users and Access → Keys
  3. Copie o "Issuer ID" no topo da página

#### \`DEVELOPMENT_TEAM\`
- **Valor**: \`[SEU_TEAM_ID]\`
- **Tipo**: Text
- **Descrição**: Team ID do Apple Developer Program
- **Secret**: Não
- **Como encontrar**:
  1. Vá para Apple Developer Portal
  2. Account → Membership
  3. Copie o "Team ID"

### 📝 VARIÁVEIS OPCIONAIS

#### \`EXPO_TOKEN\` (Opcional)
- **Valor**: \`[SEU_EXPO_TOKEN]\`
- **Tipo**: Secret Text
- **Descrição**: Token do Expo para builds automatizados
- **Secret**: Sim
- **Como gerar**:
  1. Vá para https://expo.dev
  2. Account Settings → Access Tokens
  3. Generate New Token

## 🔑 UPLOAD DA CHAVE PRIVADA

### Passo a Passo:

1. **Acesse App Store Connect**
   - Users and Access → Keys

2. **Faça Upload da Chave**
   - Clique em "+" para adicionar nova chave
   - OU se já existe, clique na chave existente
   - Faça upload do arquivo: \`private_keys/AuthKey_5D79LKKR26.p8\`

3. **Configurar Permissões**
   - Access: App Manager
   - Apps: Selecione seu app ou "All Apps"

## 🔄 CONFIGURAÇÃO DO WORKFLOW

### Arquivo \`.xcode-cloud.yml\` (Já Configurado)
O arquivo já está configurado em: \`.xcode-cloud.yml\`

Conteúdo atual:
\`\`\`yaml
version: 1
workflows:
  PsiqueiaApp-iOS:
    name: PsiqueiaApp iOS Build
    description: Build and deploy PsiqueiaApp for iOS
    environment:
      xcode: 15.0
      node: 18.x
    steps:
      - name: Install Dependencies
        script: |
          npm ci
          npx expo install --fix
      - name: Prebuild iOS
        script: |
          npx expo prebuild --platform ios --clean
      - name: Build iOS
        script: |
          xcodebuild -workspace ios/PsiqueiaApp.xcworkspace -scheme PsiqueiaApp -configuration Release -destination generic/platform=iOS -archivePath PsiqueiaApp.xcarchive archive
    archive:
      include:
        - PsiqueiaApp.xcarchive
    deploy:
      - destination: app-store-connect
        distribute: true
\`\`\`

## 🚀 EXECUTAR BUILD

### Opção 1: Via Git Push
\`\`\`bash
git add .
git commit -m "Configure Xcode Cloud build"
git push origin main
\`\`\`

### Opção 2: Via App Store Connect
1. Vá para Xcode Cloud → Builds
2. Clique em "Start Build"
3. Selecione branch e workflow
4. Clique em "Start Build"

## 📊 MONITORAR BUILD

1. **App Store Connect**
   - Xcode Cloud → Builds
   - Acompanhe o progresso em tempo real

2. **Logs Detalhados**
   - Clique no build em andamento
   - Veja logs de cada step

3. **Notificações**
   - Configure notificações por email
   - Receba alertas de sucesso/falha

## ⚠️ TROUBLESHOOTING

### Problemas Comuns:

1. **"Invalid API Key"**
   - Verifique se o arquivo \`AuthKey_5D79LKKR26.p8\` foi carregado
   - Confirme se as variáveis de ambiente estão corretas

2. **"Team ID not found"**
   - Verifique o DEVELOPMENT_TEAM
   - Confirme se você tem acesso ao team

3. **"Build failed during prebuild"**
   - Verifique se todas as dependências estão no package.json
   - Confirme se o app.json está configurado corretamente

4. **"Provisioning profile issues"**
   - Crie provisioning profiles no Apple Developer Portal
   - Certifique-se de que o Bundle ID está correto

## 🔗 LINKS ÚTEIS

- [Xcode Cloud Documentation](https://developer.apple.com/xcode-cloud/)
- [App Store Connect API](https://developer.apple.com/documentation/appstoreconnectapi)
- [Expo and Xcode Cloud](https://docs.expo.dev/build-reference/xcode-cloud/)
- [Apple Developer Portal](https://developer.apple.com)

## 📞 SUPORTE

Se encontrar problemas:
1. Consulte os logs detalhados no Xcode Cloud
2. Verifique a documentação oficial da Apple
3. Consulte a comunidade Expo/React Native
4. Entre em contato com o suporte da Apple Developer

---

**✅ Status**: Configuração pronta para uso
**📅 Próximo Passo**: Configurar variáveis no App Store Connect
`;

fs.writeFileSync(instructionsPath, instructions);
console.log(`✅ Instruções salvas em: ${instructionsPath}`);

// Gerar script de validação das configurações
const validationScriptPath = path.join(xcodeCloudDir, 'validate-config.js');
const validationScript = `#!/usr/bin/env node

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

console.log('\\n📋 PRÓXIMOS PASSOS:');
console.log('1. Configure as variáveis de ambiente no App Store Connect');
console.log('2. Faça upload da chave privada');
console.log('3. Execute um build de teste');
console.log('4. Monitore os logs no Xcode Cloud');

console.log('\\n📖 Consulte: xcode-cloud-configs/SETUP_INSTRUCTIONS.md');
`;

fs.writeFileSync(validationScriptPath, validationScript);
console.log(`✅ Script de validação salvo em: ${validationScriptPath}`);

// Resumo final
console.log('\n📋 ARQUIVOS GERADOS:');
console.log(`- ${envConfigPath}`);
console.log(`- ${instructionsPath}`);
console.log(`- ${validationScriptPath}`);

console.log('\n🎯 PRÓXIMOS PASSOS:');
console.log('1. Leia as instruções em: xcode-cloud-configs/SETUP_INSTRUCTIONS.md');
console.log('2. Configure as variáveis no App Store Connect');
console.log('3. Execute: node xcode-cloud-configs/validate-config.js');
console.log('4. Faça upload da chave privada');
console.log('5. Execute um build de teste');

console.log('\n✅ CONFIGURAÇÕES DO XCODE CLOUD PRONTAS!');
console.log('=' .repeat(50));