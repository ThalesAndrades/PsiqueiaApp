# Guia Completo: Tornar PsiqueiaApp Executável no Xcode

## 🎯 Objetivo
Este guia fornece instruções detalhadas para gerar o projeto iOS nativo e torná-lo executável no Xcode.

## ⚠️ Pré-requisitos

### Sistema Operacional
- **macOS** (obrigatório para Xcode)
- **Xcode 15.0+** instalado
- **Command Line Tools** instalados

### Ferramentas Necessárias
```bash
# Verificar se estão instalados
node --version          # v18.0.0+
npm --version           # v9.0.0+
expo --version          # v49.0.0+
xcode-select --version  # Xcode Command Line Tools
```

### Instalação das Ferramentas (se necessário)
```bash
# Node.js (via Homebrew)
brew install node

# Expo CLI
npm install -g @expo/cli

# Xcode Command Line Tools
xcode-select --install
```

## 🚀 Processo de Geração do Projeto iOS

### Passo 1: Preparar o Ambiente
```bash
# Clonar o repositório (se necessário)
git clone https://github.com/ThalesAndrades/PsiqueiaApp.git
cd PsiqueiaApp

# Instalar dependências
npm install
```

### Passo 2: Executar Script Automatizado
```bash
# Usar o script de deploy que já criamos
chmod +x scripts/deploy-macos.sh
bash scripts/deploy-macos.sh
```

**OU executar manualmente:**

### Passo 3: Geração Manual do Projeto iOS

#### 3.1 Limpar Cache (Recomendado)
```bash
# Limpar cache do Expo
expo r -c

# Limpar node_modules
rm -rf node_modules
npm install
```

#### 3.2 Gerar Projeto iOS Nativo
```bash
# Gerar projeto iOS com Expo prebuild
npx expo prebuild --platform ios --clean

# Verificar se foi gerado
ls -la ios/
```

#### 3.3 Verificar Configurações
```bash
# Executar validação
node scripts/validate-ios.js
```

### Passo 4: Abrir no Xcode

#### 4.1 Abrir Workspace
```bash
# Abrir o workspace (NÃO o .xcodeproj)
open ios/PsiqueiaApp.xcworkspace
```

#### 4.2 Configurações Iniciais no Xcode

1. **Selecionar Team de Desenvolvimento:**
   - Project Navigator → PsiqueiaApp
   - Signing & Capabilities
   - Team: Selecionar seu Apple Developer Team

2. **Verificar Bundle Identifier:**
   - Confirmar: `com.thalesandrades.psiqueiaapp`

3. **Verificar Capabilities:**
   - HealthKit deve estar habilitado
   - Background Modes (se necessário)

4. **Verificar Deployment Target:**
   - iOS 13.0 ou superior

### Passo 5: Configurar Simulador/Device

#### 5.1 Para Simulador
```bash
# Listar simuladores disponíveis
xcrun simctl list devices

# Executar no simulador
npx expo run:ios --simulator
```

#### 5.2 Para Device Físico
1. Conectar iPhone via USB
2. Confiar no computador
3. Selecionar device no Xcode
4. Build and Run (⌘+R)

## 🔧 Configurações Específicas do Xcode

### Info.plist Configurações
Verificar se estão presentes:
```xml
<key>NSHealthShareUsageDescription</key>
<string>Este app precisa acessar dados de saúde para monitoramento de bem-estar mental.</string>

<key>NSHealthUpdateUsageDescription</key>
<string>Este app precisa atualizar dados de saúde para registrar informações de bem-estar mental.</string>

<key>CFBundleDisplayName</key>
<string>PsiqueiaApp</string>

<key>CFBundleIdentifier</key>
<string>com.thalesandrades.psiqueiaapp</string>
```

### Entitlements
Verificar arquivo `PsiqueiaApp.entitlements`:
```xml
<key>com.apple.developer.healthkit</key>
<true/>
<key>com.apple.developer.healthkit.access</key>
<array>
    <string>health-records</string>
</array>
```

### Build Settings
- **iOS Deployment Target:** 13.0
- **Swift Language Version:** Swift 5
- **Build Active Architecture Only:** No (para Release)

## 🧪 Testes e Validação

### Teste no Simulador
```bash
# Build para simulador
xcodebuild -workspace ios/PsiqueiaApp.xcworkspace \
           -scheme PsiqueiaApp \
           -configuration Debug \
           -sdk iphonesimulator \
           -destination 'platform=iOS Simulator,name=iPhone 15,OS=17.0'
```

### Teste em Device
```bash
# Build para device
xcodebuild -workspace ios/PsiqueiaApp.xcworkspace \
           -scheme PsiqueiaApp \
           -configuration Debug \
           -sdk iphoneos \
           -destination 'platform=iOS,id=DEVICE_UDID'
```

## 🚨 Solução de Problemas Comuns

### Erro: "No such module 'ExpoModulesCore'"
```bash
cd ios
pod install --repo-update
```

### Erro: "Command PhaseScriptExecution failed"
```bash
# Limpar build folder
rm -rf ios/build
# Rebuild
```

### Erro: "Signing for requires a development team"
1. Xcode → Preferences → Accounts
2. Adicionar Apple ID
3. Selecionar team no projeto

### Erro: "HealthKit not available"
- Verificar se está testando em device real (HealthKit não funciona no simulador)
- Confirmar capabilities habilitadas

## 📱 Executar no Device

### Preparação do Device
1. **Habilitar Developer Mode:**
   - Settings → Privacy & Security → Developer Mode → ON

2. **Confiar no Desenvolvedor:**
   - Settings → General → VPN & Device Management
   - Confiar no perfil de desenvolvedor

### Build e Install
```bash
# Via Expo
npx expo run:ios --device

# Via Xcode
# Product → Run (⌘+R)
```

## 🔄 Workflow Completo

### Desenvolvimento Diário
```bash
# 1. Iniciar Metro bundler
npx expo start

# 2. Em outro terminal, executar iOS
npx expo run:ios
```

### Build para Testes
```bash
# Build de desenvolvimento
npx expo build:ios --type simulator

# Build para device
npx expo build:ios --type archive
```

### Build para Produção
```bash
# Via EAS Build (recomendado)
npx eas build --platform ios --profile production

# Via Xcode Archive
# Product → Archive
```

## 📋 Checklist de Verificação

### ✅ Pré-build
- [ ] Node.js e npm instalados
- [ ] Expo CLI instalado
- [ ] Xcode instalado
- [ ] Command Line Tools instalados
- [ ] Dependências instaladas (`npm install`)

### ✅ Pós-build
- [ ] Pasta `ios/` gerada
- [ ] Arquivo `ios/PsiqueiaApp.xcworkspace` existe
- [ ] Pods instalados (`ios/Pods/` existe)
- [ ] Configurações validadas (`node scripts/validate-ios.js`)

### ✅ Xcode
- [ ] Workspace abre sem erros
- [ ] Team de desenvolvimento selecionado
- [ ] Bundle ID correto
- [ ] HealthKit capability habilitada
- [ ] Build bem-sucedido
- [ ] App executa no simulador/device

## 🔗 Scripts Úteis

### Geração Rápida
```bash
# Script completo de geração
bash scripts/deploy-macos.sh
```

### Validação
```bash
# Validar configurações iOS
node scripts/validate-ios.js

# Verificar status geral
node scripts/check-deployment-status.js
```

### Limpeza
```bash
# Limpar tudo e regenerar
rm -rf ios/ node_modules/
npm install
npx expo prebuild --platform ios --clean
```

## 📞 Suporte

### Documentação Oficial
- [Expo Prebuild](https://docs.expo.dev/workflow/prebuild/)
- [Xcode Documentation](https://developer.apple.com/xcode/)
- [iOS Development](https://developer.apple.com/ios/)

### Troubleshooting
- [Expo Troubleshooting](https://docs.expo.dev/troubleshooting/overview/)
- [React Native iOS Setup](https://reactnative.dev/docs/environment-setup)

### Contato
- **Email:** thalesandrades.dev@gmail.com
- **GitHub:** https://github.com/ThalesAndrades/PsiqueiaApp

---

## 🎉 Resultado Final

Após seguir este guia, você terá:
- ✅ Projeto iOS nativo gerado
- ✅ Xcode workspace funcional
- ✅ App executável no simulador e device
- ✅ Configurações de HealthKit funcionais
- ✅ Pronto para desenvolvimento e testes

**Tempo estimado:** 30-60 minutos (primeira vez)
**Tempo estimado:** 5-10 minutos (execuções subsequentes)