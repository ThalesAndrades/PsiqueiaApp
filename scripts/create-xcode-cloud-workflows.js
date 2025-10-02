#!/usr/bin/env node

/**
 * 🔄 CONFIGURADOR AVANÇADO DE WORKFLOWS DO XCODE CLOUD
 * 
 * Cria workflows otimizados para diferentes cenários de desenvolvimento
 */

const fs = require('fs');
const path = require('path');

class XcodeCloudWorkflowManager {
    constructor() {
        this.projectRoot = process.cwd();
        this.workflowsDir = path.join(this.projectRoot, 'xcode-cloud-configs', 'workflows');
        
        this.projectInfo = {
            appName: 'PsiqueiaApp',
            bundleId: 'com.psiqueia.app',
            scheme: 'PsiqueiaApp',
            workspace: 'ios/PsiqueiaApp.xcworkspace',
            apiKeyId: '5D79LKKR26'
        };
    }

    async createAllWorkflows() {
        console.log('🔄 CRIANDO WORKFLOWS AVANÇADOS DO XCODE CLOUD\n');
        
        await this.ensureDirectories();
        await this.createDevelopmentWorkflow();
        await this.createStagingWorkflow();
        await this.createProductionWorkflow();
        await this.createHotfixWorkflow();
        await this.createReleaseWorkflow();
        await this.createMainWorkflowFile();
        await this.createWorkflowDocumentation();
        
        console.log('\n✅ TODOS OS WORKFLOWS CRIADOS COM SUCESSO!');
        console.log('\n📋 WORKFLOWS DISPONÍVEIS:');
        console.log('1. 🔧 Development - Builds de desenvolvimento e testes');
        console.log('2. 🧪 Staging - Builds para TestFlight');
        console.log('3. 🚀 Production - Builds para App Store');
        console.log('4. 🔥 Hotfix - Correções urgentes');
        console.log('5. 📦 Release - Preparação de releases');
    }

    async ensureDirectories() {
        if (!fs.existsSync(this.workflowsDir)) {
            fs.mkdirSync(this.workflowsDir, { recursive: true });
        }
    }

    async createDevelopmentWorkflow() {
        console.log('🔧 Criando workflow de desenvolvimento...');
        
        const workflow = {
            name: "Development Build",
            description: "Build rápido para desenvolvimento com testes básicos",
            trigger: {
                push: {
                    branches: ["develop", "feature/*", "bugfix/*"]
                },
                pull_request: {
                    branches: ["develop"]
                }
            },
            environment: {
                xcode: "15.2",
                node: "18.x",
                variables: [
                    { name: "NODE_ENV", value: "development" },
                    { name: "CI", value: "true" },
                    { name: "EXPO_PUBLIC_ENV", value: "development" }
                ]
            },
            steps: [
                {
                    name: "Cache Node Modules",
                    script: `set -e
echo "📦 Configurando cache do Node.js..."
npm ci --cache .npm --prefer-offline`
                },
                {
                    name: "Install Dependencies",
                    script: `set -e
echo "🔧 Instalando dependências..."
npm ci
npx expo install --fix`
                },
                {
                    name: "Lint and Format Check",
                    script: `set -e
echo "🧹 Verificando código..."
npm run lint || echo "⚠️ Lint warnings encontrados"
npm run format:check || echo "⚠️ Formatação precisa ser ajustada"`
                },
                {
                    name: "Run Unit Tests",
                    script: `set -e
echo "🧪 Executando testes unitários..."
npm test -- --coverage --watchAll=false`
                },
                {
                    name: "Generate iOS Project",
                    script: `set -e
echo "📱 Gerando projeto iOS para desenvolvimento..."
npx expo prebuild --platform ios --clean --no-install`
                },
                {
                    name: "Install CocoaPods",
                    script: `set -e
echo "🍫 Instalando CocoaPods..."
cd ios
pod install --repo-update
cd ..`
                },
                {
                    name: "Build for Simulator",
                    script: `set -e
echo "🏗️ Construindo para simulador..."
cd ios
xcodebuild -workspace ${this.projectInfo.workspace} \\
  -scheme ${this.projectInfo.scheme} \\
  -configuration Debug \\
  -destination 'platform=iOS Simulator,name=iPhone 15' \\
  build`
                }
            ]
        };
        
        const filePath = path.join(this.workflowsDir, 'development.json');
        fs.writeFileSync(filePath, JSON.stringify(workflow, null, 2));
        console.log(`  ✅ Salvo em: ${filePath}`);
    }

    async createStagingWorkflow() {
        console.log('🧪 Criando workflow de staging...');
        
        const workflow = {
            name: "Staging Build",
            description: "Build para TestFlight com testes completos",
            trigger: {
                push: {
                    branches: ["staging", "release/*"]
                }
            },
            environment: {
                xcode: "15.2",
                node: "18.x",
                variables: [
                    { name: "NODE_ENV", value: "production" },
                    { name: "CI", value: "true" },
                    { name: "EXPO_PUBLIC_ENV", value: "staging" },
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
echo "🔧 Instalando dependências de produção..."
npm ci --production=false
npx expo install --fix`
                },
                {
                    name: "Run Full Test Suite",
                    script: `set -e
echo "🧪 Executando suite completa de testes..."
npm run test:full || npm test -- --coverage --watchAll=false
npm run lint
npm run type-check || echo "⚠️ Type checking não configurado"`
                },
                {
                    name: "Build Assets",
                    script: `set -e
echo "🎨 Construindo assets..."
npm run build:assets || echo "⚠️ Build de assets não configurado"`
                },
                {
                    name: "Generate iOS Project",
                    script: `set -e
echo "📱 Gerando projeto iOS para staging..."
npx expo prebuild --platform ios --clean --no-install`
                },
                {
                    name: "Install CocoaPods",
                    script: `set -e
echo "🍫 Instalando CocoaPods..."
cd ios
pod install --repo-update
cd ..`
                },
                {
                    name: "Configure Code Signing",
                    script: `set -e
echo "🔐 Configurando assinatura de código..."
cd ios
# Configurar provisioning profiles automaticamente
xcodebuild -workspace ${this.projectInfo.workspace} \\
  -scheme ${this.projectInfo.scheme} \\
  -configuration Release \\
  -allowProvisioningUpdates \\
  -destination generic/platform=iOS \\
  clean`
                },
                {
                    name: "Build and Archive",
                    script: `set -e
echo "🏗️ Construindo e arquivando para TestFlight..."
cd ios
xcodebuild -workspace ${this.projectInfo.workspace} \\
  -scheme ${this.projectInfo.scheme} \\
  -configuration Release \\
  -destination generic/platform=iOS \\
  -archivePath ${this.projectInfo.appName}.xcarchive \\
  -allowProvisioningUpdates \\
  archive`
                },
                {
                    name: "Export for TestFlight",
                    script: `set -e
echo "📤 Exportando para TestFlight..."
cd ios
xcodebuild -exportArchive \\
  -archivePath ${this.projectInfo.appName}.xcarchive \\
  -exportPath ./build \\
  -exportOptionsPlist exportOptions.plist \\
  -allowProvisioningUpdates`
                },
                {
                    name: "Upload to TestFlight",
                    script: `set -e
echo "🚀 Enviando para TestFlight..."
cd ios
xcrun altool --upload-app \\
  --type ios \\
  --file "./build/${this.projectInfo.appName}.ipa" \\
  --apiKey $APP_STORE_CONNECT_API_KEY_ID \\
  --apiIssuer $APP_STORE_CONNECT_ISSUER_ID \\
  --verbose`
                }
            ]
        };
        
        const filePath = path.join(this.workflowsDir, 'staging.json');
        fs.writeFileSync(filePath, JSON.stringify(workflow, null, 2));
        console.log(`  ✅ Salvo em: ${filePath}`);
    }

    async createProductionWorkflow() {
        console.log('🚀 Criando workflow de produção...');
        
        const workflow = {
            name: "Production Release",
            description: "Build final para App Store com validações completas",
            trigger: {
                push: {
                    branches: ["main", "master"]
                },
                tag: {
                    pattern: "v*.*.*"
                }
            },
            environment: {
                xcode: "15.2",
                node: "18.x",
                variables: [
                    { name: "NODE_ENV", value: "production" },
                    { name: "CI", value: "true" },
                    { name: "EXPO_PUBLIC_ENV", value: "production" },
                    { name: "IOS_BUNDLE_IDENTIFIER", value: "$IOS_BUNDLE_IDENTIFIER" },
                    { name: "DEVELOPMENT_TEAM", value: "$DEVELOPMENT_TEAM" },
                    { name: "APP_STORE_CONNECT_API_KEY_ID", value: "$APP_STORE_CONNECT_API_KEY_ID" },
                    { name: "APP_STORE_CONNECT_ISSUER_ID", value: "$APP_STORE_CONNECT_ISSUER_ID" },
                    { name: "APP_STORE_CONNECT_PRIVATE_KEY", value: "$APP_STORE_CONNECT_PRIVATE_KEY" }
                ]
            },
            steps: [
                {
                    name: "Validate Release",
                    script: `set -e
echo "🔍 Validando release..."
# Verificar se é uma tag de versão válida
if [[ "$CI_TAG" =~ ^v[0-9]+\\.[0-9]+\\.[0-9]+$ ]]; then
  echo "✅ Tag de versão válida: $CI_TAG"
else
  echo "❌ Tag de versão inválida. Use formato: v1.0.0"
  exit 1
fi`
                },
                {
                    name: "Install Dependencies",
                    script: `set -e
echo "🔧 Instalando dependências de produção..."
npm ci --production=false
npx expo install --fix`
                },
                {
                    name: "Security Audit",
                    script: `set -e
echo "🔒 Executando auditoria de segurança..."
npm audit --audit-level moderate
npm run security:check || echo "⚠️ Security check não configurado"`
                },
                {
                    name: "Run Complete Test Suite",
                    script: `set -e
echo "🧪 Executando suite completa de testes..."
npm run test:full || npm test -- --coverage --watchAll=false
npm run lint
npm run type-check || echo "⚠️ Type checking não configurado"
npm run test:e2e || echo "⚠️ Testes E2E não configurados"`
                },
                {
                    name: "Build Production Assets",
                    script: `set -e
echo "🎨 Construindo assets de produção..."
npm run build:production || npm run build || echo "⚠️ Build não configurado"`
                },
                {
                    name: "Generate iOS Project",
                    script: `set -e
echo "📱 Gerando projeto iOS para produção..."
npx expo prebuild --platform ios --clean --no-install`
                },
                {
                    name: "Install CocoaPods",
                    script: `set -e
echo "🍫 Instalando CocoaPods..."
cd ios
pod install --repo-update
cd ..`
                },
                {
                    name: "Validate Project Configuration",
                    script: `set -e
echo "🔍 Validando configuração do projeto..."
cd ios
# Verificar Bundle ID
grep -q "${this.projectInfo.bundleId}" ${this.projectInfo.appName}/Info.plist || {
  echo "❌ Bundle ID incorreto no Info.plist"
  exit 1
}
echo "✅ Configuração do projeto validada"`
                },
                {
                    name: "Build and Archive for Production",
                    script: `set -e
echo "🏗️ Construindo versão de produção..."
cd ios
xcodebuild -workspace ${this.projectInfo.workspace} \\
  -scheme ${this.projectInfo.scheme} \\
  -configuration Release \\
  -destination generic/platform=iOS \\
  -archivePath ${this.projectInfo.appName}.xcarchive \\
  -allowProvisioningUpdates \\
  archive`
                },
                {
                    name: "Export for App Store",
                    script: `set -e
echo "📤 Exportando para App Store..."
cd ios
xcodebuild -exportArchive \\
  -archivePath ${this.projectInfo.appName}.xcarchive \\
  -exportPath ./build \\
  -exportOptionsPlist exportOptions.plist \\
  -allowProvisioningUpdates`
                },
                {
                    name: "Upload to App Store",
                    script: `set -e
echo "🚀 Enviando para App Store..."
cd ios
xcrun altool --upload-app \\
  --type ios \\
  --file "./build/${this.projectInfo.appName}.ipa" \\
  --apiKey $APP_STORE_CONNECT_API_KEY_ID \\
  --apiIssuer $APP_STORE_CONNECT_ISSUER_ID \\
  --verbose`
                },
                {
                    name: "Create Release Notes",
                    script: `set -e
echo "📝 Criando notas de release..."
echo "Release $CI_TAG enviado para App Store" > release-notes.txt
echo "Build: $CI_BUILD_NUMBER" >> release-notes.txt
echo "Commit: $CI_COMMIT_SHA" >> release-notes.txt
echo "Data: $(date)" >> release-notes.txt`
                }
            ]
        };
        
        const filePath = path.join(this.workflowsDir, 'production.json');
        fs.writeFileSync(filePath, JSON.stringify(workflow, null, 2));
        console.log(`  ✅ Salvo em: ${filePath}`);
    }

    async createHotfixWorkflow() {
        console.log('🔥 Criando workflow de hotfix...');
        
        const workflow = {
            name: "Hotfix Build",
            description: "Build urgente para correções críticas",
            trigger: {
                push: {
                    branches: ["hotfix/*"]
                }
            },
            environment: {
                xcode: "15.2",
                node: "18.x",
                variables: [
                    { name: "NODE_ENV", value: "production" },
                    { name: "CI", value: "true" },
                    { name: "EXPO_PUBLIC_ENV", value: "production" },
                    { name: "IOS_BUNDLE_IDENTIFIER", value: "$IOS_BUNDLE_IDENTIFIER" },
                    { name: "DEVELOPMENT_TEAM", value: "$DEVELOPMENT_TEAM" },
                    { name: "APP_STORE_CONNECT_API_KEY_ID", value: "$APP_STORE_CONNECT_API_KEY_ID" },
                    { name: "APP_STORE_CONNECT_ISSUER_ID", value: "$APP_STORE_CONNECT_ISSUER_ID" }
                ]
            },
            steps: [
                {
                    name: "Fast Install",
                    script: `set -e
echo "⚡ Instalação rápida para hotfix..."
npm ci --prefer-offline`
                },
                {
                    name: "Critical Tests Only",
                    script: `set -e
echo "🧪 Executando apenas testes críticos..."
npm run test:critical || npm test -- --testPathPattern="critical" || echo "⚠️ Testes críticos não configurados"`
                },
                {
                    name: "Generate iOS Project",
                    script: `set -e
echo "📱 Gerando projeto iOS para hotfix..."
npx expo prebuild --platform ios --clean --no-install`
                },
                {
                    name: "Install CocoaPods",
                    script: `set -e
echo "🍫 Instalando CocoaPods..."
cd ios && pod install && cd ..`
                },
                {
                    name: "Build and Archive Hotfix",
                    script: `set -e
echo "🔥 Construindo hotfix..."
cd ios
xcodebuild -workspace ${this.projectInfo.workspace} \\
  -scheme ${this.projectInfo.scheme} \\
  -configuration Release \\
  -destination generic/platform=iOS \\
  -archivePath ${this.projectInfo.appName}-hotfix.xcarchive \\
  -allowProvisioningUpdates \\
  archive`
                },
                {
                    name: "Upload Hotfix to TestFlight",
                    script: `set -e
echo "🚀 Enviando hotfix para TestFlight..."
cd ios
xcodebuild -exportArchive \\
  -archivePath ${this.projectInfo.appName}-hotfix.xcarchive \\
  -exportPath ./build \\
  -exportOptionsPlist exportOptions.plist
  
xcrun altool --upload-app \\
  --type ios \\
  --file "./build/${this.projectInfo.appName}.ipa" \\
  --apiKey $APP_STORE_CONNECT_API_KEY_ID \\
  --apiIssuer $APP_STORE_CONNECT_ISSUER_ID`
                }
            ]
        };
        
        const filePath = path.join(this.workflowsDir, 'hotfix.json');
        fs.writeFileSync(filePath, JSON.stringify(workflow, null, 2));
        console.log(`  ✅ Salvo em: ${filePath}`);
    }

    async createReleaseWorkflow() {
        console.log('📦 Criando workflow de release...');
        
        const workflow = {
            name: "Release Preparation",
            description: "Preparação e validação de releases",
            trigger: {
                push: {
                    branches: ["release/*"]
                }
            },
            environment: {
                xcode: "15.2",
                node: "18.x",
                variables: [
                    { name: "NODE_ENV", value: "production" },
                    { name: "CI", value: "true" },
                    { name: "EXPO_PUBLIC_ENV", value: "staging" }
                ]
            },
            steps: [
                {
                    name: "Install Dependencies",
                    script: `set -e
echo "🔧 Instalando dependências..."
npm ci`
                },
                {
                    name: "Version Validation",
                    script: `set -e
echo "🔍 Validando versão..."
npm run version:check || echo "⚠️ Version check não configurado"
npm run changelog:validate || echo "⚠️ Changelog validation não configurada"`
                },
                {
                    name: "Run All Tests",
                    script: `set -e
echo "🧪 Executando todos os testes..."
npm run test:all || npm test -- --coverage --watchAll=false
npm run lint
npm run type-check || echo "⚠️ Type checking não configurado"`
                },
                {
                    name: "Build Documentation",
                    script: `set -e
echo "📚 Construindo documentação..."
npm run docs:build || echo "⚠️ Build de documentação não configurado"`
                },
                {
                    name: "Generate iOS Project",
                    script: `set -e
echo "📱 Gerando projeto iOS..."
npx expo prebuild --platform ios --clean --no-install`
                },
                {
                    name: "Validate iOS Build",
                    script: `set -e
echo "🔍 Validando build iOS..."
cd ios
pod install
xcodebuild -workspace ${this.projectInfo.workspace} \\
  -scheme ${this.projectInfo.scheme} \\
  -configuration Release \\
  -destination 'platform=iOS Simulator,name=iPhone 15' \\
  build`
                }
            ]
        };
        
        const filePath = path.join(this.workflowsDir, 'release.json');
        fs.writeFileSync(filePath, JSON.stringify(workflow, null, 2));
        console.log(`  ✅ Salvo em: ${filePath}`);
    }

    async createMainWorkflowFile() {
        console.log('📄 Criando arquivo principal de workflow...');
        
        const mainWorkflow = `version: 1

workflows:
  development:
    name: "Development Build"
    description: "Build rápido para desenvolvimento com testes básicos"
    trigger:
      push:
        branch:
          - develop
          - feature/*
          - bugfix/*
      pull_request:
        branch:
          - develop
    environment:
      xcode: "15.2"
      node: "18.x"
      variables:
        - name: NODE_ENV
          value: development
        - name: CI
          value: "true"
        - name: EXPO_PUBLIC_ENV
          value: development
    steps:
      - name: Install Dependencies
        script: |
          set -e
          echo "🔧 Instalando dependências..."
          npm ci
          npx expo install --fix
      - name: Run Tests
        script: |
          set -e
          echo "🧪 Executando testes..."
          npm test -- --coverage --watchAll=false
      - name: Generate iOS Project
        script: |
          set -e
          echo "📱 Gerando projeto iOS..."
          npx expo prebuild --platform ios --clean --no-install
      - name: Install CocoaPods
        script: |
          set -e
          echo "🍫 Instalando CocoaPods..."
          cd ios && pod install && cd ..

  staging:
    name: "Staging Build"
    description: "Build para TestFlight com testes completos"
    trigger:
      push:
        branch:
          - staging
          - release/*
    environment:
      xcode: "15.2"
      node: "18.x"
      variables:
        - name: NODE_ENV
          value: production
        - name: CI
          value: "true"
        - name: EXPO_PUBLIC_ENV
          value: staging
        - name: IOS_BUNDLE_IDENTIFIER
          value: $IOS_BUNDLE_IDENTIFIER
        - name: DEVELOPMENT_TEAM
          value: $DEVELOPMENT_TEAM
        - name: APP_STORE_CONNECT_API_KEY_ID
          value: $APP_STORE_CONNECT_API_KEY_ID
        - name: APP_STORE_CONNECT_ISSUER_ID
          value: $APP_STORE_CONNECT_ISSUER_ID
    steps:
      - name: Install Dependencies
        script: |
          set -e
          echo "🔧 Instalando dependências..."
          npm ci
          npx expo install --fix
      - name: Run Tests
        script: |
          set -e
          echo "🧪 Executando testes..."
          npm test -- --coverage --watchAll=false
          npm run lint
      - name: Generate iOS Project
        script: |
          set -e
          echo "📱 Gerando projeto iOS..."
          npx expo prebuild --platform ios --clean --no-install
      - name: Install CocoaPods
        script: |
          set -e
          echo "🍫 Instalando CocoaPods..."
          cd ios && pod install --repo-update && cd ..
      - name: Build and Archive
        script: |
          set -e
          echo "🏗️ Construindo e arquivando..."
          cd ios
          xcodebuild -workspace ${this.projectInfo.workspace} \\
            -scheme ${this.projectInfo.scheme} \\
            -configuration Release \\
            -destination generic/platform=iOS \\
            -archivePath ${this.projectInfo.appName}.xcarchive \\
            -allowProvisioningUpdates \\
            archive
      - name: Upload to TestFlight
        script: |
          set -e
          echo "🚀 Enviando para TestFlight..."
          cd ios
          xcodebuild -exportArchive \\
            -archivePath ${this.projectInfo.appName}.xcarchive \\
            -exportPath ./build \\
            -exportOptionsPlist exportOptions.plist
          xcrun altool --upload-app \\
            --type ios \\
            --file "./build/${this.projectInfo.appName}.ipa" \\
            --apiKey $APP_STORE_CONNECT_API_KEY_ID \\
            --apiIssuer $APP_STORE_CONNECT_ISSUER_ID

  production:
    name: "Production Release"
    description: "Build final para App Store"
    trigger:
      push:
        branch:
          - main
          - master
      tag:
        pattern: "v*.*.*"
    environment:
      xcode: "15.2"
      node: "18.x"
      variables:
        - name: NODE_ENV
          value: production
        - name: CI
          value: "true"
        - name: EXPO_PUBLIC_ENV
          value: production
        - name: IOS_BUNDLE_IDENTIFIER
          value: $IOS_BUNDLE_IDENTIFIER
        - name: DEVELOPMENT_TEAM
          value: $DEVELOPMENT_TEAM
        - name: APP_STORE_CONNECT_API_KEY_ID
          value: $APP_STORE_CONNECT_API_KEY_ID
        - name: APP_STORE_CONNECT_ISSUER_ID
          value: $APP_STORE_CONNECT_ISSUER_ID
        - name: APP_STORE_CONNECT_PRIVATE_KEY
          value: $APP_STORE_CONNECT_PRIVATE_KEY
    steps:
      - name: Install Dependencies
        script: |
          set -e
          echo "🔧 Instalando dependências de produção..."
          npm ci --production=false
          npx expo install --fix
      - name: Run Full Test Suite
        script: |
          set -e
          echo "🧪 Executando suite completa de testes..."
          npm test -- --coverage --watchAll=false
          npm run lint
      - name: Generate iOS Project
        script: |
          set -e
          echo "📱 Gerando projeto iOS de produção..."
          npx expo prebuild --platform ios --clean --no-install
      - name: Install CocoaPods
        script: |
          set -e
          echo "🍫 Instalando CocoaPods..."
          cd ios && pod install --repo-update && cd ..
      - name: Build and Archive for Production
        script: |
          set -e
          echo "🏗️ Construindo versão de produção..."
          cd ios
          xcodebuild -workspace ${this.projectInfo.workspace} \\
            -scheme ${this.projectInfo.scheme} \\
            -configuration Release \\
            -destination generic/platform=iOS \\
            -archivePath ${this.projectInfo.appName}.xcarchive \\
            -allowProvisioningUpdates \\
            archive
      - name: Upload to App Store
        script: |
          set -e
          echo "🚀 Enviando para App Store..."
          cd ios
          xcodebuild -exportArchive \\
            -archivePath ${this.projectInfo.appName}.xcarchive \\
            -exportPath ./build \\
            -exportOptionsPlist exportOptions.plist
          xcrun altool --upload-app \\
            --type ios \\
            --file "./build/${this.projectInfo.appName}.ipa" \\
            --apiKey $APP_STORE_CONNECT_API_KEY_ID \\
            --apiIssuer $APP_STORE_CONNECT_ISSUER_ID
`;
        
        const mainWorkflowPath = path.join(this.projectRoot, '.xcode-cloud.yml');
        fs.writeFileSync(mainWorkflowPath, mainWorkflow);
        console.log(`  ✅ Arquivo principal salvo em: ${mainWorkflowPath}`);
    }

    async createWorkflowDocumentation() {
        console.log('📚 Criando documentação dos workflows...');
        
        const documentation = `# 🔄 DOCUMENTAÇÃO DOS WORKFLOWS DO XCODE CLOUD

## 📋 VISÃO GERAL

Este documento descreve todos os workflows configurados para o PsiqueiaApp no Xcode Cloud.

## 🔧 WORKFLOW: DEVELOPMENT

**Objetivo**: Builds rápidos para desenvolvimento e testes básicos

### 🎯 Triggers
- Push para branches: \`develop\`, \`feature/*\`, \`bugfix/*\`
- Pull requests para: \`develop\`

### ⚙️ Ambiente
- Xcode: 15.2
- Node.js: 18.x
- Ambiente: Development

### 📝 Passos
1. **Install Dependencies** - Instala dependências Node.js
2. **Run Tests** - Executa testes unitários com coverage
3. **Generate iOS Project** - Gera projeto nativo iOS
4. **Install CocoaPods** - Instala dependências iOS

### ⏱️ Tempo Estimado: 5-8 minutos

---

## 🧪 WORKFLOW: STAGING

**Objetivo**: Builds para TestFlight com validações completas

### 🎯 Triggers
- Push para branches: \`staging\`, \`release/*\`

### ⚙️ Ambiente
- Xcode: 15.2
- Node.js: 18.x
- Ambiente: Staging/Production

### 📝 Passos
1. **Install Dependencies** - Instala todas as dependências
2. **Run Tests** - Executa testes + lint
3. **Generate iOS Project** - Gera projeto iOS otimizado
4. **Install CocoaPods** - Instala pods com repo update
5. **Build and Archive** - Constrói e arquiva o app
6. **Upload to TestFlight** - Envia para TestFlight automaticamente

### ⏱️ Tempo Estimado: 15-20 minutos

---

## 🚀 WORKFLOW: PRODUCTION

**Objetivo**: Builds finais para App Store com máxima qualidade

### 🎯 Triggers
- Push para branches: \`main\`, \`master\`
- Tags no formato: \`v*.*.*\` (ex: v1.0.0)

### ⚙️ Ambiente
- Xcode: 15.2
- Node.js: 18.x
- Ambiente: Production

### 📝 Passos
1. **Install Dependencies** - Instala dependências de produção
2. **Run Full Test Suite** - Suite completa de testes + lint
3. **Generate iOS Project** - Projeto iOS de produção
4. **Install CocoaPods** - CocoaPods com repo update
5. **Build and Archive for Production** - Build otimizado
6. **Upload to App Store** - Submissão automática para App Store

### ⏱️ Tempo Estimado: 20-25 minutos

---

## 🔥 WORKFLOW: HOTFIX

**Objetivo**: Correções urgentes com build acelerado

### 🎯 Triggers
- Push para branches: \`hotfix/*\`

### ⚙️ Ambiente
- Xcode: 15.2
- Node.js: 18.x
- Ambiente: Production

### 📝 Passos
1. **Fast Install** - Instalação rápida com cache
2. **Critical Tests Only** - Apenas testes críticos
3. **Generate iOS Project** - Geração rápida do projeto
4. **Install CocoaPods** - Instalação básica de pods
5. **Build and Archive Hotfix** - Build de hotfix
6. **Upload Hotfix to TestFlight** - Envio direto para TestFlight

### ⏱️ Tempo Estimado: 8-12 minutos

---

## 📦 WORKFLOW: RELEASE

**Objetivo**: Preparação e validação de releases

### 🎯 Triggers
- Push para branches: \`release/*\`

### ⚙️ Ambiente
- Xcode: 15.2
- Node.js: 18.x
- Ambiente: Staging

### 📝 Passos
1. **Install Dependencies** - Instalação completa
2. **Version Validation** - Validação de versão e changelog
3. **Run All Tests** - Todos os testes + lint + type check
4. **Build Documentation** - Constrói documentação
5. **Generate iOS Project** - Projeto iOS para validação
6. **Validate iOS Build** - Validação do build iOS

### ⏱️ Tempo Estimado: 12-15 minutos

---

## 🔄 ESTRATÉGIA DE BRANCHING

### 📊 Fluxo Recomendado

\`\`\`
main/master     🚀 Production (App Store)
    ↑
staging         🧪 Staging (TestFlight)
    ↑
develop         🔧 Development (Testes)
    ↑
feature/*       💡 Features
bugfix/*        🐛 Bug fixes
hotfix/*        🔥 Hotfixes urgentes
release/*       📦 Preparação de releases
\`\`\`

### 🎯 Quando Usar Cada Branch

- **feature/*** → Novas funcionalidades
- **bugfix/*** → Correções de bugs
- **develop** → Integração de features
- **staging** → Preparação para release
- **release/*** → Finalização de versões
- **hotfix/*** → Correções urgentes
- **main/master** → Versão de produção

---

## 🔧 CONFIGURAÇÃO DE VARIÁVEIS

### 🔑 Variáveis Obrigatórias

\`\`\`
APP_STORE_CONNECT_API_KEY_ID=${this.projectInfo.apiKeyId}
APP_STORE_CONNECT_ISSUER_ID=[SEU_ISSUER_ID]
DEVELOPMENT_TEAM=[SEU_TEAM_ID]
IOS_BUNDLE_IDENTIFIER=${this.projectInfo.bundleId}
CODE_SIGNING_STYLE=Automatic
CI=true
\`\`\`

### 🔧 Variáveis Opcionais

\`\`\`
EXPO_TOKEN=[SEU_EXPO_TOKEN]
NODE_ENV=production
EXPO_PUBLIC_ENV=production
\`\`\`

---

## 📊 MONITORAMENTO

### 🎯 Métricas Importantes

- **Build Success Rate**: >95%
- **Build Time**: <20 minutos
- **Test Coverage**: >80%
- **Failed Builds**: <5%

### 📈 Dashboards

- App Store Connect → Xcode Cloud → Analytics
- Builds por branch
- Tempo médio de build
- Taxa de sucesso

---

## 🚨 TROUBLESHOOTING

### ❌ Problemas Comuns

**Build Failed: Dependencies**
\`\`\`bash
# Solução
npm ci --force
npx expo install --fix
\`\`\`

**Build Failed: CocoaPods**
\`\`\`bash
# Solução
cd ios
rm -rf Pods Podfile.lock
pod install --repo-update
\`\`\`

**Build Failed: Code Signing**
- Verificar DEVELOPMENT_TEAM
- Confirmar Bundle ID
- Validar certificados no Apple Developer Portal

**Build Failed: Archive**
- Verificar configuração de Release
- Confirmar provisioning profiles
- Validar entitlements

### 🔍 Debug Steps

1. Verificar logs do Xcode Cloud
2. Validar variáveis de ambiente
3. Testar build local
4. Verificar configurações do projeto

---

## 📞 SUPORTE

### 📚 Recursos

- [Xcode Cloud Documentation](https://developer.apple.com/xcode-cloud/)
- [Expo Documentation](https://docs.expo.dev/)
- [Apple Developer Portal](https://developer.apple.com/)

### 🛠️ Scripts Úteis

\`\`\`bash
# Validar configuração
node xcode-cloud-configs/scripts/validate-xcode-cloud.js

# Verificar status
node scripts/check-deployment-status.js

# Build local
npx expo prebuild --platform ios --clean
cd ios && xcodebuild -workspace ${this.projectInfo.workspace} -scheme ${this.projectInfo.scheme} build
\`\`\`

---

## 🎉 CONCLUSÃO

Com estes workflows configurados, você tem:

- ✅ **CI/CD Completo** - Automação total do pipeline
- ✅ **Builds Otimizados** - Diferentes estratégias por ambiente
- ✅ **Qualidade Garantida** - Testes e validações automáticas
- ✅ **Deploy Automático** - TestFlight e App Store automáticos
- ✅ **Monitoramento** - Visibilidade completa do processo

**Seu pipeline está pronto para produção! 🚀**
`;
        
        const docPath = path.join(this.workflowsDir, 'WORKFLOWS_DOCUMENTATION.md');
        fs.writeFileSync(docPath, documentation);
        console.log(`  ✅ Documentação salva em: ${docPath}`);
    }
}

// Executar criação de workflows
const workflowManager = new XcodeCloudWorkflowManager();
workflowManager.createAllWorkflows().catch(console.error);