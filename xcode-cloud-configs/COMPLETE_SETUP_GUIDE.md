# 🚀 GUIA COMPLETO DE CONFIGURAÇÃO DO XCODE CLOUD

## 📋 VISÃO GERAL

Este guia te levará passo a passo pela configuração completa do Xcode Cloud para o PsiqueiaApp.

## 🎯 PRÉ-REQUISITOS

- ✅ Conta Apple Developer ativa
- ✅ App registrado no App Store Connect
- ✅ Xcode instalado (macOS)
- ✅ Projeto iOS gerado (`npx expo prebuild --platform ios`)

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
- Valor: `5D79LKKR26`
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
- Valor: `com.psiqueia.app`
- Tipo: Text
- Secret: Não

**CODE_SIGNING_STYLE**
- Valor: `Automatic`
- Tipo: Text
- Secret: Não

**CI**
- Valor: `true`
- Tipo: Text
- Secret: Não

**NODE_ENV**
- Valor: `production`
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
- Faça upload do arquivo: `private_keys/AuthKey_5D79LKKR26.p8`

### 2.2 Configurar Permissões
- Access: App Manager
- Apps: Selecione "PsiqueiaApp" ou "All Apps"

## ⚙️ PASSO 3: CONFIGURAR WORKFLOWS

O arquivo `.xcode-cloud.yml` já está configurado com 3 workflows:

### 🔧 Development
- **Trigger**: Push para `develop`, `feature/*`
- **Ações**: Install → Generate → Test

### 🚀 Staging  
- **Trigger**: Push para `staging`, `release/*`
- **Ações**: Install → Generate → Build → TestFlight

### 🏆 Production
- **Trigger**: Push para `main`, tags `v*`
- **Ações**: Install → Test → Build → App Store

## 🔍 PASSO 4: VALIDAR CONFIGURAÇÃO

Execute o script de validação:

```bash
node xcode-cloud-configs/scripts/validate-xcode-cloud.js
```

## 🚀 PASSO 5: PRIMEIRO BUILD

### 5.1 Gerar Projeto iOS
```bash
npx expo prebuild --platform ios --clean
```

### 5.2 Commit e Push
```bash
git add .
git commit -m "feat: configure Xcode Cloud workflows"
git push origin develop  # Para development build
```

### 5.3 Monitorar Build
- App Store Connect → Xcode Cloud → Builds
- Acompanhe o progresso em tempo real

## 🎯 WORKFLOWS DETALHADOS

### 📱 Development Workflow
**Quando executa**: Push para `develop` ou `feature/*`

**Passos**:
1. Install Node Dependencies
2. Generate iOS Project  
3. Install CocoaPods
4. Run Tests

**Resultado**: Validação de código

### 🧪 Staging Workflow  
**Quando executa**: Push para `staging` ou `release/*`

**Passos**:
1. Install Dependencies
2. Generate iOS Project
3. Install CocoaPods  
4. Build and Archive
5. Upload to TestFlight

**Resultado**: App disponível no TestFlight

### 🏆 Production Workflow
**Quando executa**: Push para `main` ou tag `v*`

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
**Solução**: Execute `npx expo prebuild --platform ios --clean`

### ❌ Code Signing Error
**Solução**: 
1. Verifique DEVELOPMENT_TEAM
2. Confirme Bundle ID no Apple Developer Portal
3. Verifique certificados

### ❌ CocoaPods Error
**Solução**: 
1. Delete `ios/Podfile.lock`
2. Execute `cd ios && pod install --repo-update`

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
- Validação: `node xcode-cloud-configs/scripts/validate-xcode-cloud.js`
- Status: `node scripts/check-deployment-status.js`

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
