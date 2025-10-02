# 🔄 DOCUMENTAÇÃO DOS WORKFLOWS DO XCODE CLOUD

## 📋 VISÃO GERAL

Este documento descreve todos os workflows configurados para o PsiqueiaApp no Xcode Cloud.

## 🔧 WORKFLOW: DEVELOPMENT

**Objetivo**: Builds rápidos para desenvolvimento e testes básicos

### 🎯 Triggers
- Push para branches: `develop`, `feature/*`, `bugfix/*`
- Pull requests para: `develop`

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
- Push para branches: `staging`, `release/*`

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
- Push para branches: `main`, `master`
- Tags no formato: `v*.*.*` (ex: v1.0.0)

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
- Push para branches: `hotfix/*`

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
- Push para branches: `release/*`

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

```
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
```

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

```
APP_STORE_CONNECT_API_KEY_ID=5D79LKKR26
APP_STORE_CONNECT_ISSUER_ID=[SEU_ISSUER_ID]
DEVELOPMENT_TEAM=[SEU_TEAM_ID]
IOS_BUNDLE_IDENTIFIER=com.psiqueia.app
CODE_SIGNING_STYLE=Automatic
CI=true
```

### 🔧 Variáveis Opcionais

```
EXPO_TOKEN=[SEU_EXPO_TOKEN]
NODE_ENV=production
EXPO_PUBLIC_ENV=production
```

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
```bash
# Solução
npm ci --force
npx expo install --fix
```

**Build Failed: CocoaPods**
```bash
# Solução
cd ios
rm -rf Pods Podfile.lock
pod install --repo-update
```

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

```bash
# Validar configuração
node xcode-cloud-configs/scripts/validate-xcode-cloud.js

# Verificar status
node scripts/check-deployment-status.js

# Build local
npx expo prebuild --platform ios --clean
cd ios && xcodebuild -workspace ios/PsiqueiaApp.xcworkspace -scheme PsiqueiaApp build
```

---

## 🎉 CONCLUSÃO

Com estes workflows configurados, você tem:

- ✅ **CI/CD Completo** - Automação total do pipeline
- ✅ **Builds Otimizados** - Diferentes estratégias por ambiente
- ✅ **Qualidade Garantida** - Testes e validações automáticas
- ✅ **Deploy Automático** - TestFlight e App Store automáticos
- ✅ **Monitoramento** - Visibilidade completa do processo

**Seu pipeline está pronto para produção! 🚀**
