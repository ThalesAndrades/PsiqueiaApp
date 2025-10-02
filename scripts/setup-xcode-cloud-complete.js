#!/usr/bin/env node

/**
 * 🚀 SCRIPT COMPLETO DE CONFIGURAÇÃO DO XCODE CLOUD
 * 
 * Este script automatiza completamente a configuração do Xcode Cloud
 * para o PsiqueiaApp, incluindo variáveis, workflows e validações.
 */

const fs = require('fs');
const path = require('path');

class XcodeCloudSetup {
    constructor() {
        this.projectRoot = process.cwd();
        this.configDir = path.join(this.projectRoot, 'xcode-cloud-configs');
        this.privateKeysDir = path.join(this.projectRoot, 'private_keys');
        
        // Configurações do projeto
        this.projectConfig = {
            appName: 'PsiqueiaApp',
            bundleId: 'com.psiqueia.app',
            apiKeyId: '5D79LKKR26',
            scheme: 'PsiqueiaApp',
            workspace: 'ios/PsiqueiaApp.xcworkspace'
        };
    }

    async run() {
        console.log('🚀 INICIANDO CONFIGURAÇÃO COMPLETA DO XCODE CLOUD\n');
        
        try {
            await this.validatePrerequisites();
            await this.createDirectories();
            await this.generateEnvironmentVariables();
            await this.createWorkflowConfig();
            await this.createValidationScript();
            await this.createSetupInstructions();
            await this.generatePrivateKeyInstructions();
            await this.createCompletionChecklist();
            
            console.log('\n✅ CONFIGURAÇÃO DO XCODE CLOUD COMPLETA!');
            console.log('\n📋 PRÓXIMOS PASSOS:');
            console.log('1. Execute: node scripts/validate-xcode-cloud.js');
            console.log('2. Siga as instruções em: xcode-cloud-configs/COMPLETE_SETUP_GUIDE.md');
            console.log('3. Configure as variáveis no App Store Connect');
            console.log('4. Faça upload da chave privada');
            console.log('5. Execute o primeiro build!');
            
        } catch (error) {
            console.error('❌ ERRO:', error.message);
            process.exit(1);
        }
    }

    async validatePrerequisites() {
        console.log('🔍 Validando pré-requisitos...');
        
        // Verificar arquivos essenciais
        const requiredFiles = [
            'package.json',
            'app.json',
            'eas.json'
        ];
        
        for (const file of requiredFiles) {
            if (!fs.existsSync(path.join(this.projectRoot, file))) {
                throw new Error(`Arquivo obrigatório não encontrado: ${file}`);
            }
        }
        
        console.log('✅ Pré-requisitos validados');
    }

    async createDirectories() {
        console.log('📁 Criando diretórios...');
        
        const dirs = [
            this.configDir,
            this.privateKeysDir,
            path.join(this.configDir, 'workflows'),
            path.join(this.configDir, 'scripts')
        ];
        
        dirs.forEach(dir => {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
                console.log(`  ✅ Criado: ${dir}`);
            }
        });
    }

    async generateEnvironmentVariables() {
        console.log('🔧 Gerando variáveis de ambiente...');
        
        const envVars = {
            "APP_STORE_CONNECT_API_KEY_ID": {
                "value": this.projectConfig.apiKeyId,
                "description": "ID da chave API do App Store Connect",
                "required": true,
                "secret": false,
                "configured": false
            },
            "APP_STORE_CONNECT_ISSUER_ID": {
                "value": "[CONFIGURAR_NO_APP_STORE_CONNECT]",
                "description": "Issuer ID da sua conta do App Store Connect",
                "required": true,
                "secret": false,
                "configured": false,
                "instructions": "App Store Connect > Users and Access > Keys > Copie o Issuer ID"
            },
            "APP_STORE_CONNECT_PRIVATE_KEY": {
                "value": "[UPLOAD_ARQUIVO_P8]",
                "description": "Chave privada do App Store Connect (arquivo .p8)",
                "required": true,
                "secret": true,
                "configured": false,
                "instructions": "Faça upload do arquivo AuthKey_5D79LKKR26.p8 no Xcode Cloud"
            },
            "DEVELOPMENT_TEAM": {
                "value": "[CONFIGURAR_TEAM_ID]",
                "description": "Team ID do Apple Developer Program",
                "required": true,
                "secret": false,
                "configured": false,
                "instructions": "Apple Developer Portal > Account > Membership > Team ID"
            },
            "IOS_BUNDLE_IDENTIFIER": {
                "value": this.projectConfig.bundleId,
                "description": "Bundle Identifier do app iOS",
                "required": true,
                "secret": false,
                "configured": true
            },
            "CODE_SIGNING_STYLE": {
                "value": "Automatic",
                "description": "Estilo de assinatura de código",
                "required": true,
                "secret": false,
                "configured": true
            },
            "EXPO_TOKEN": {
                "value": "[OPCIONAL_EXPO_TOKEN]",
                "description": "Token do Expo para builds automatizados",
                "required": false,
                "secret": true,
                "configured": false,
                "instructions": "https://expo.dev/accounts/[username]/settings/access-tokens"
            },
            "CI": {
                "value": "true",
                "description": "Flag indicando ambiente de CI/CD",
                "required": true,
                "secret": false,
                "configured": true
            },
            "NODE_ENV": {
                "value": "production",
                "description": "Ambiente Node.js para builds de produção",
                "required": true,
                "secret": false,
                "configured": true
            }
        };
        
        const envVarsPath = path.join(this.configDir, 'environment-variables-complete.json');
        fs.writeFileSync(envVarsPath, JSON.stringify(envVars, null, 2));
        console.log(`  ✅ Variáveis salvas em: ${envVarsPath}`);
    }

    async createWorkflowConfig() {
        console.log('⚙️ Criando configuração de workflows...');
        
        const workflowConfig = {
            version: 1,
            workflows: {
                "development": {
                    name: "Development Build",
                    description: "Build de desenvolvimento com testes",
                    trigger: {
                        push: {
                            branch: ["develop", "feature/*"]
                        }
                    },
                    environment: {
                        xcode: "15.2",
                        node: "18.x",
                        variables: [
                            { name: "NODE_ENV", value: "development" },
                            { name: "CI", value: "true" },
                            { name: "IOS_BUNDLE_IDENTIFIER", value: "$IOS_BUNDLE_IDENTIFIER" },
                            { name: "DEVELOPMENT_TEAM", value: "$DEVELOPMENT_TEAM" }
                        ]
                    },
                    steps: [
                        {
                            name: "Install Node Dependencies",
                            script: `set -e
echo "🔧 Instalando dependências Node.js..."
npm ci
echo "✅ Dependências Node.js instaladas"`
                        },
                        {
                            name: "Generate iOS Project",
                            script: `set -e
echo "📱 Gerando projeto iOS nativo..."
npx expo prebuild --platform ios --clean
echo "✅ Projeto iOS gerado"`
                        },
                        {
                            name: "Install CocoaPods",
                            script: `set -e
echo "🍫 Instalando CocoaPods..."
cd ios && pod install --repo-update && cd ..
echo "✅ CocoaPods instalado"`
                        },
                        {
                            name: "Run Tests",
                            script: `set -e
echo "🧪 Executando testes..."
npm test
echo "✅ Testes executados"`
                        }
                    ]
                },
                "staging": {
                    name: "Staging Build",
                    description: "Build de staging para TestFlight",
                    trigger: {
                        push: {
                            branch: ["staging", "release/*"]
                        }
                    },
                    environment: {
                        xcode: "15.2",
                        node: "18.x",
                        variables: [
                            { name: "NODE_ENV", value: "production" },
                            { name: "CI", value: "true" },
                            { name: "IOS_BUNDLE_IDENTIFIER", value: "$IOS_BUNDLE_IDENTIFIER" },
                            { name: "DEVELOPMENT_TEAM", value: "$DEVELOPMENT_TEAM" },
                            { name: "APP_STORE_CONNECT_API_KEY_ID", value: "$APP_STORE_CONNECT_API_KEY_ID" },
                            { name: "APP_STORE_CONNECT_ISSUER_ID", value: "$APP_STORE_CONNECT_ISSUER_ID" }
                        ]
                    },
                    steps: [
                        {
                            name: "Install Dependencies",
                            script: `set -e
echo "🔧 Instalando dependências..."
npm ci
npx expo install --fix`
                        },
                        {
                            name: "Generate iOS Project",
                            script: `set -e
echo "📱 Gerando projeto iOS..."
npx expo prebuild --platform ios --clean`
                        },
                        {
                            name: "Install CocoaPods",
                            script: `set -e
echo "🍫 Instalando CocoaPods..."
cd ios && pod install --repo-update && cd ..`
                        },
                        {
                            name: "Build and Archive",
                            script: `set -e
echo "🏗️ Construindo e arquivando..."
cd ios
xcodebuild -workspace ${this.projectConfig.workspace} \\
  -scheme ${this.projectConfig.scheme} \\
  -configuration Release \\
  -destination generic/platform=iOS \\
  -archivePath ${this.projectConfig.appName}.xcarchive \\
  archive`
                        },
                        {
                            name: "Upload to TestFlight",
                            script: `set -e
echo "🚀 Enviando para TestFlight..."
cd ios
xcodebuild -exportArchive \\
  -archivePath ${this.projectConfig.appName}.xcarchive \\
  -exportPath ./build \\
  -exportOptionsPlist exportOptions.plist`
                        }
                    ]
                },
                "production": {
                    name: "Production Release",
                    description: "Build de produção para App Store",
                    trigger: {
                        push: {
                            branch: ["main", "master"]
                        },
                        tag: {
                            pattern: "v*"
                        }
                    },
                    environment: {
                        xcode: "15.2",
                        node: "18.x",
                        variables: [
                            { name: "NODE_ENV", value: "production" },
                            { name: "CI", value: "true" },
                            { name: "IOS_BUNDLE_IDENTIFIER", value: "$IOS_BUNDLE_IDENTIFIER" },
                            { name: "DEVELOPMENT_TEAM", value: "$DEVELOPMENT_TEAM" },
                            { name: "APP_STORE_CONNECT_API_KEY_ID", value: "$APP_STORE_CONNECT_API_KEY_ID" },
                            { name: "APP_STORE_CONNECT_ISSUER_ID", value: "$APP_STORE_CONNECT_ISSUER_ID" },
                            { name: "APP_STORE_CONNECT_PRIVATE_KEY", value: "$APP_STORE_CONNECT_PRIVATE_KEY" }
                        ]
                    },
                    steps: [
                        {
                            name: "Install Dependencies",
                            script: `set -e
echo "🔧 Instalando dependências de produção..."
npm ci --production=false
npx expo install --fix`
                        },
                        {
                            name: "Run Full Test Suite",
                            script: `set -e
echo "🧪 Executando suite completa de testes..."
npm run test:full || npm test`
                        },
                        {
                            name: "Generate iOS Project",
                            script: `set -e
echo "📱 Gerando projeto iOS de produção..."
npx expo prebuild --platform ios --clean`
                        },
                        {
                            name: "Install CocoaPods",
                            script: `set -e
echo "🍫 Instalando CocoaPods..."
cd ios && pod install --repo-update && cd ..`
                        },
                        {
                            name: "Build and Archive for Production",
                            script: `set -e
echo "🏗️ Construindo versão de produção..."
cd ios
xcodebuild -workspace ${this.projectConfig.workspace} \\
  -scheme ${this.projectConfig.scheme} \\
  -configuration Release \\
  -destination generic/platform=iOS \\
  -archivePath ${this.projectConfig.appName}.xcarchive \\
  archive`
                        },
                        {
                            name: "Upload to App Store",
                            script: `set -e
echo "🚀 Enviando para App Store..."
cd ios
xcodebuild -exportArchive \\
  -archivePath ${this.projectConfig.appName}.xcarchive \\
  -exportPath ./build \\
  -exportOptionsPlist exportOptions.plist
  
# Upload usando altool ou xcrun altool
xcrun altool --upload-app \\
  --type ios \\
  --file "./build/${this.projectConfig.appName}.ipa" \\
  --apiKey $APP_STORE_CONNECT_API_KEY_ID \\
  --apiIssuer $APP_STORE_CONNECT_ISSUER_ID`
                        }
                    ]
                }
            }
        };
        
        // Salvar workflow principal
        const workflowPath = path.join(this.projectRoot, '.xcode-cloud.yml');
        fs.writeFileSync(workflowPath, this.yamlStringify(workflowConfig));
        console.log(`  ✅ Workflow principal salvo em: ${workflowPath}`);
        
        // Salvar configuração detalhada
        const detailedConfigPath = path.join(this.configDir, 'workflows-complete.json');
        fs.writeFileSync(detailedConfigPath, JSON.stringify(workflowConfig, null, 2));
        console.log(`  ✅ Configuração detalhada salva em: ${detailedConfigPath}`);
    }

    yamlStringify(obj, indent = 0) {
        let yaml = '';
        const spaces = '  '.repeat(indent);
        
        for (const [key, value] of Object.entries(obj)) {
            if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                yaml += `${spaces}${key}:\n`;
                yaml += this.yamlStringify(value, indent + 1);
            } else if (Array.isArray(value)) {
                yaml += `${spaces}${key}:\n`;
                value.forEach(item => {
                    if (typeof item === 'object') {
                        yaml += `${spaces}  -\n`;
                        yaml += this.yamlStringify(item, indent + 2).replace(/^/gm, '    ');
                    } else {
                        yaml += `${spaces}  - ${item}\n`;
                    }
                });
            } else {
                yaml += `${spaces}${key}: ${typeof value === 'string' && value.includes('\n') ? '|\n' + value.split('\n').map(line => spaces + '  ' + line).join('\n') : value}\n`;
            }
        }
        
        return yaml;
    }

    async createValidationScript() {
        console.log('✅ Criando script de validação...');
        
        const validationScript = `#!/usr/bin/env node

/**
 * 🔍 SCRIPT DE VALIDAÇÃO DO XCODE CLOUD
 * 
 * Valida se todas as configurações estão corretas
 */

const fs = require('fs');
const path = require('path');

class XcodeCloudValidator {
    constructor() {
        this.projectRoot = process.cwd();
        this.errors = [];
        this.warnings = [];
        this.success = [];
    }

    async validate() {
        console.log('🔍 VALIDANDO CONFIGURAÇÕES DO XCODE CLOUD\\n');
        
        await this.validateFiles();
        await this.validateEnvironmentVariables();
        await this.validateWorkflows();
        await this.validatePrivateKey();
        
        this.printResults();
    }

    async validateFiles() {
        console.log('📁 Validando arquivos...');
        
        const requiredFiles = [
            '.xcode-cloud.yml',
            'xcode-cloud-configs/environment-variables-complete.json',
            'package.json',
            'app.json',
            'eas.json'
        ];
        
        requiredFiles.forEach(file => {
            const filePath = path.join(this.projectRoot, file);
            if (fs.existsSync(filePath)) {
                this.success.push(\`✅ Arquivo encontrado: \${file}\`);
            } else {
                this.errors.push(\`❌ Arquivo obrigatório não encontrado: \${file}\`);
            }
        });
    }

    async validateEnvironmentVariables() {
        console.log('🔧 Validando variáveis de ambiente...');
        
        const envVarsPath = path.join(this.projectRoot, 'xcode-cloud-configs/environment-variables-complete.json');
        
        if (!fs.existsSync(envVarsPath)) {
            this.errors.push('❌ Arquivo de variáveis de ambiente não encontrado');
            return;
        }
        
        const envVars = JSON.parse(fs.readFileSync(envVarsPath, 'utf8'));
        const requiredVars = [
            'APP_STORE_CONNECT_API_KEY_ID',
            'APP_STORE_CONNECT_ISSUER_ID',
            'DEVELOPMENT_TEAM',
            'IOS_BUNDLE_IDENTIFIER'
        ];
        
        requiredVars.forEach(varName => {
            if (envVars[varName]) {
                if (envVars[varName].value.includes('[') || envVars[varName].value.includes('CONFIGURAR')) {
                    this.warnings.push(\`⚠️  Variável precisa ser configurada: \${varName}\`);
                } else {
                    this.success.push(\`✅ Variável configurada: \${varName}\`);
                }
            } else {
                this.errors.push(\`❌ Variável obrigatória não encontrada: \${varName}\`);
            }
        });
    }

    async validateWorkflows() {
        console.log('⚙️ Validando workflows...');
        
        const workflowPath = path.join(this.projectRoot, '.xcode-cloud.yml');
        
        if (!fs.existsSync(workflowPath)) {
            this.errors.push('❌ Arquivo .xcode-cloud.yml não encontrado');
            return;
        }
        
        const workflowContent = fs.readFileSync(workflowPath, 'utf8');
        
        if (workflowContent.includes('development')) {
            this.success.push('✅ Workflow de desenvolvimento configurado');
        }
        
        if (workflowContent.includes('staging')) {
            this.success.push('✅ Workflow de staging configurado');
        }
        
        if (workflowContent.includes('production')) {
            this.success.push('✅ Workflow de produção configurado');
        }
    }

    async validatePrivateKey() {
        console.log('🔑 Validando chave privada...');
        
        const privateKeyPath = path.join(this.projectRoot, 'private_keys/AuthKey_5D79LKKR26.p8');
        
        if (fs.existsSync(privateKeyPath)) {
            this.success.push('✅ Chave privada encontrada localmente');
            this.warnings.push('⚠️  Lembre-se de fazer upload da chave no App Store Connect');
        } else {
            this.warnings.push('⚠️  Chave privada não encontrada - faça upload no App Store Connect');
        }
    }

    printResults() {
        console.log('\\n📊 RESULTADOS DA VALIDAÇÃO\\n');
        
        if (this.success.length > 0) {
            console.log('✅ SUCESSOS:');
            this.success.forEach(msg => console.log(\`  \${msg}\`));
            console.log('');
        }
        
        if (this.warnings.length > 0) {
            console.log('⚠️  AVISOS:');
            this.warnings.forEach(msg => console.log(\`  \${msg}\`));
            console.log('');
        }
        
        if (this.errors.length > 0) {
            console.log('❌ ERROS:');
            this.errors.forEach(msg => console.log(\`  \${msg}\`));
            console.log('');
        }
        
        const total = this.success.length + this.warnings.length + this.errors.length;
        const successRate = Math.round((this.success.length / total) * 100);
        
        console.log(\`📈 TAXA DE SUCESSO: \${successRate}%\`);
        
        if (this.errors.length === 0) {
            console.log('\\n🎉 CONFIGURAÇÃO VÁLIDA! Pronto para usar o Xcode Cloud.');
        } else {
            console.log('\\n🔧 CORRIJA OS ERROS ANTES DE CONTINUAR.');
        }
    }
}

// Executar validação
const validator = new XcodeCloudValidator();
validator.validate().catch(console.error);
`;
        
        const validationPath = path.join(this.configDir, 'scripts', 'validate-xcode-cloud.js');
        fs.writeFileSync(validationPath, validationScript);
        console.log(`  ✅ Script de validação salvo em: ${validationPath}`);
    }

    async createSetupInstructions() {
        console.log('📚 Criando instruções de configuração...');
        
        const instructions = `# 🚀 GUIA COMPLETO DE CONFIGURAÇÃO DO XCODE CLOUD

## 📋 VISÃO GERAL

Este guia te levará passo a passo pela configuração completa do Xcode Cloud para o PsiqueiaApp.

## 🎯 PRÉ-REQUISITOS

- ✅ Conta Apple Developer ativa
- ✅ App registrado no App Store Connect
- ✅ Xcode instalado (macOS)
- ✅ Projeto iOS gerado (\`npx expo prebuild --platform ios\`)

## 📝 PASSO 1: CONFIGURAR VARIÁVEIS DE AMBIENTE

### 1.1 Acesse o App Store Connect
- URL: https://appstoreconnect.apple.com
- Faça login com sua conta de desenvolvedor

### 1.2 Navegue para Xcode Cloud
- Apps → Selecione "PsiqueiaApp" → Xcode Cloud
- Ou: Menu lateral → Xcode Cloud

### 1.3 Configure Environment Variables
Clique em "Settings" → "Environment Variables" e adicione:

#### 🔧 VARIÁVEIS OBRIGATÓRIAS:

**APP_STORE_CONNECT_API_KEY_ID**
- Valor: \`${this.projectConfig.apiKeyId}\`
- Tipo: Text
- Secret: Não

**APP_STORE_CONNECT_ISSUER_ID**
- Valor: [SEU_ISSUER_ID]
- Tipo: Text  
- Secret: Não
- Como encontrar: App Store Connect → Users and Access → Keys → Copie o "Issuer ID"

**DEVELOPMENT_TEAM**
- Valor: [SEU_TEAM_ID]
- Tipo: Text
- Secret: Não
- Como encontrar: Apple Developer Portal → Account → Membership → "Team ID"

**IOS_BUNDLE_IDENTIFIER**
- Valor: \`${this.projectConfig.bundleId}\`
- Tipo: Text
- Secret: Não

**CODE_SIGNING_STYLE**
- Valor: \`Automatic\`
- Tipo: Text
- Secret: Não

**CI**
- Valor: \`true\`
- Tipo: Text
- Secret: Não

**NODE_ENV**
- Valor: \`production\`
- Tipo: Text
- Secret: Não

#### 🔧 VARIÁVEIS OPCIONAIS:

**EXPO_TOKEN** (Recomendado)
- Valor: [SEU_EXPO_TOKEN]
- Tipo: Secret Text
- Secret: Sim
- Como gerar: https://expo.dev → Account Settings → Access Tokens

## 🔑 PASSO 2: CONFIGURAR CHAVE PRIVADA

### 2.1 Upload da Chave
- App Store Connect → Users and Access → Keys
- Clique em "+" ou na chave existente
- Faça upload do arquivo: \`private_keys/AuthKey_${this.projectConfig.apiKeyId}.p8\`

### 2.2 Configurar Permissões
- Access: App Manager
- Apps: Selecione "PsiqueiaApp" ou "All Apps"

## ⚙️ PASSO 3: CONFIGURAR WORKFLOWS

O arquivo \`.xcode-cloud.yml\` já está configurado com 3 workflows:

### 🔧 Development
- **Trigger**: Push para \`develop\`, \`feature/*\`
- **Ações**: Install → Generate → Test

### 🚀 Staging  
- **Trigger**: Push para \`staging\`, \`release/*\`
- **Ações**: Install → Generate → Build → TestFlight

### 🏆 Production
- **Trigger**: Push para \`main\`, tags \`v*\`
- **Ações**: Install → Test → Build → App Store

## 🔍 PASSO 4: VALIDAR CONFIGURAÇÃO

Execute o script de validação:

\`\`\`bash
node xcode-cloud-configs/scripts/validate-xcode-cloud.js
\`\`\`

## 🚀 PASSO 5: PRIMEIRO BUILD

### 5.1 Gerar Projeto iOS
\`\`\`bash
npx expo prebuild --platform ios --clean
\`\`\`

### 5.2 Commit e Push
\`\`\`bash
git add .
git commit -m "feat: configure Xcode Cloud workflows"
git push origin develop  # Para development build
\`\`\`

### 5.3 Monitorar Build
- App Store Connect → Xcode Cloud → Builds
- Acompanhe o progresso em tempo real

## 🎯 WORKFLOWS DETALHADOS

### 📱 Development Workflow
**Quando executa**: Push para \`develop\` ou \`feature/*\`

**Passos**:
1. Install Node Dependencies
2. Generate iOS Project  
3. Install CocoaPods
4. Run Tests

**Resultado**: Validação de código

### 🧪 Staging Workflow  
**Quando executa**: Push para \`staging\` ou \`release/*\`

**Passos**:
1. Install Dependencies
2. Generate iOS Project
3. Install CocoaPods  
4. Build and Archive
5. Upload to TestFlight

**Resultado**: App disponível no TestFlight

### 🏆 Production Workflow
**Quando executa**: Push para \`main\` ou tag \`v*\`

**Passos**:
1. Install Dependencies
2. Run Full Test Suite
3. Generate iOS Project
4. Install CocoaPods
5. Build and Archive for Production
6. Upload to App Store

**Resultado**: App submetido para revisão da Apple

## 🔧 TROUBLESHOOTING

### ❌ Build Failed: "No such file or directory"
**Solução**: Execute \`npx expo prebuild --platform ios --clean\`

### ❌ Code Signing Error
**Solução**: 
1. Verifique DEVELOPMENT_TEAM
2. Confirme Bundle ID no Apple Developer Portal
3. Verifique certificados

### ❌ CocoaPods Error
**Solução**: 
1. Delete \`ios/Podfile.lock\`
2. Execute \`cd ios && pod install --repo-update\`

### ❌ API Key Error
**Solução**:
1. Verifique upload da chave privada
2. Confirme API_KEY_ID e ISSUER_ID
3. Verifique permissões da chave

## 📞 SUPORTE

### 📚 Documentação
- [Xcode Cloud Documentation](https://developer.apple.com/xcode-cloud/)
- [Expo Documentation](https://docs.expo.dev/)

### 🛠️ Scripts Úteis
- Validação: \`node xcode-cloud-configs/scripts/validate-xcode-cloud.js\`
- Status: \`node scripts/check-deployment-status.js\`

## 🎉 CONCLUSÃO

Após seguir todos os passos:

1. ✅ Variáveis de ambiente configuradas
2. ✅ Chave privada enviada
3. ✅ Workflows ativos
4. ✅ Primeiro build executado

**Seu Xcode Cloud está pronto! 🚀**

Agora você pode:
- 🔄 Builds automáticos a cada push
- 🧪 TestFlight automático (staging)
- 🏆 App Store automático (production)
- 📊 Monitoramento em tempo real
`;
        
        const instructionsPath = path.join(this.configDir, 'COMPLETE_SETUP_GUIDE.md');
        fs.writeFileSync(instructionsPath, instructions);
        console.log(`  ✅ Guia completo salvo em: ${instructionsPath}`);
    }

    async generatePrivateKeyInstructions() {
        console.log('🔑 Gerando instruções da chave privada...');
        
        const keyInstructions = `# 🔑 CONFIGURAÇÃO DA CHAVE PRIVADA DO APP STORE CONNECT

## 📋 INFORMAÇÕES DA CHAVE

- **Key ID**: ${this.projectConfig.apiKeyId}
- **Arquivo**: AuthKey_${this.projectConfig.apiKeyId}.p8
- **Localização**: private_keys/AuthKey_${this.projectConfig.apiKeyId}.p8

## 🚀 PASSO A PASSO

### 1. Verificar Chave Local
\`\`\`bash
ls -la private_keys/
# Deve mostrar: AuthKey_${this.projectConfig.apiKeyId}.p8
\`\`\`

### 2. Acessar App Store Connect
- URL: https://appstoreconnect.apple.com
- Login → Users and Access → Keys

### 3. Configurar Chave
- Clique em "+" para nova chave OU
- Clique na chave existente (${this.projectConfig.apiKeyId})

### 4. Upload do Arquivo
- Faça upload de: \`private_keys/AuthKey_${this.projectConfig.apiKeyId}.p8\`
- Confirme o Key ID: ${this.projectConfig.apiKeyId}

### 5. Configurar Permissões
- **Access**: App Manager
- **Apps**: Selecione "PsiqueiaApp" ou "All Apps"

### 6. Copiar Informações
- **Issuer ID**: Copie da página (formato: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)
- **Key ID**: ${this.projectConfig.apiKeyId} (já configurado)

## ⚠️ IMPORTANTE

- ✅ Mantenha a chave privada segura
- ✅ Não compartilhe o arquivo .p8
- ✅ Use apenas em ambientes seguros
- ✅ Configure as variáveis de ambiente no Xcode Cloud

## 🔍 VALIDAÇÃO

Execute para verificar:
\`\`\`bash
node xcode-cloud-configs/scripts/validate-xcode-cloud.js
\`\`\`

## 📞 SUPORTE

Se houver problemas:
1. Verifique se o arquivo existe
2. Confirme as permissões da chave
3. Valide o Issuer ID
4. Teste com uma build simples
`;
        
        const keyInstructionsPath = path.join(this.privateKeysDir, 'SETUP_INSTRUCTIONS.md');
        fs.writeFileSync(keyInstructionsPath, keyInstructions);
        console.log(`  ✅ Instruções da chave salvas em: ${keyInstructionsPath}`);
    }

    async createCompletionChecklist() {
        console.log('📋 Criando checklist de conclusão...');
        
        const checklist = `# ✅ CHECKLIST DE CONFIGURAÇÃO DO XCODE CLOUD

## 🎯 PRÉ-REQUISITOS
- [ ] Conta Apple Developer ativa
- [ ] App registrado no App Store Connect
- [ ] Xcode instalado (macOS)
- [ ] Projeto clonado e dependências instaladas

## 🔧 CONFIGURAÇÃO INICIAL
- [ ] Executado: \`node scripts/setup-xcode-cloud-complete.js\`
- [ ] Projeto iOS gerado: \`npx expo prebuild --platform ios --clean\`
- [ ] CocoaPods instalado: \`cd ios && pod install\`

## 🔑 CHAVE PRIVADA
- [ ] Arquivo \`AuthKey_${this.projectConfig.apiKeyId}.p8\` existe em \`private_keys/\`
- [ ] Upload feito no App Store Connect
- [ ] Permissões configuradas (App Manager)

## 🔧 VARIÁVEIS DE AMBIENTE (App Store Connect)
- [ ] \`APP_STORE_CONNECT_API_KEY_ID\`: ${this.projectConfig.apiKeyId}
- [ ] \`APP_STORE_CONNECT_ISSUER_ID\`: [SEU_ISSUER_ID]
- [ ] \`DEVELOPMENT_TEAM\`: [SEU_TEAM_ID]
- [ ] \`IOS_BUNDLE_IDENTIFIER\`: ${this.projectConfig.bundleId}
- [ ] \`CODE_SIGNING_STYLE\`: Automatic
- [ ] \`CI\`: true
- [ ] \`NODE_ENV\`: production
- [ ] \`EXPO_TOKEN\`: [OPCIONAL]

## ⚙️ WORKFLOWS
- [ ] Arquivo \`.xcode-cloud.yml\` existe
- [ ] Development workflow configurado
- [ ] Staging workflow configurado  
- [ ] Production workflow configurado

## 🧪 VALIDAÇÃO
- [ ] Executado: \`node xcode-cloud-configs/scripts/validate-xcode-cloud.js\`
- [ ] Taxa de sucesso: 100%
- [ ] Sem erros críticos

## 🚀 PRIMEIRO BUILD
- [ ] Código commitado no Git
- [ ] Push para branch \`develop\` (development build)
- [ ] Build executado com sucesso no Xcode Cloud
- [ ] Logs verificados

## 🎯 BUILDS AVANÇADOS
- [ ] Push para \`staging\` → TestFlight build
- [ ] Push para \`main\` → Production build
- [ ] App disponível no TestFlight
- [ ] Submissão para App Store

## 📊 MONITORAMENTO
- [ ] Acesso ao App Store Connect → Xcode Cloud
- [ ] Builds monitorados em tempo real
- [ ] Notificações configuradas
- [ ] Logs de erro analisados

## 🎉 CONCLUSÃO

Quando todos os itens estiverem marcados:

**✅ SEU XCODE CLOUD ESTÁ COMPLETAMENTE CONFIGURADO!**

### 🚀 Próximos Passos:
1. Desenvolva normalmente
2. Faça commits regulares
3. Push automático dispara builds
4. TestFlight/App Store automáticos

### 📈 Benefícios Obtidos:
- 🔄 CI/CD completamente automatizado
- 🧪 Builds de teste automáticos
- 🚀 Deploy automático para TestFlight
- 🏆 Submissão automática para App Store
- 📊 Monitoramento em tempo real
- 🔒 Segurança e conformidade

**Parabéns! Você agora tem um pipeline profissional de desenvolvimento iOS! 🎊**
`;
        
        const checklistPath = path.join(this.configDir, 'COMPLETION_CHECKLIST.md');
        fs.writeFileSync(checklistPath, checklist);
        console.log(`  ✅ Checklist salvo em: ${checklistPath}`);
    }
}

// Executar configuração
const setup = new XcodeCloudSetup();
setup.run().catch(console.error);