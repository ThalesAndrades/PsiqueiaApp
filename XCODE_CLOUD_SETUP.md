# Configuração do Xcode Cloud - PsiqueiaApp

Este documento fornece instruções completas para configurar e usar o Xcode Cloud com o projeto PsiqueiaApp.

## 📋 Índice

1. [Pré-requisitos](#pré-requisitos)
2. [Configuração Inicial](#configuração-inicial)
3. [App Store Connect API](#app-store-connect-api)
4. [Workflows do Xcode Cloud](#workflows-do-xcode-cloud)
5. [Scripts de CI/CD](#scripts-de-cicd)
6. [Configuração do Projeto](#configuração-do-projeto)
7. [Uso e Monitoramento](#uso-e-monitoramento)
8. [Troubleshooting](#troubleshooting)

## 🔧 Pré-requisitos

### Requisitos Obrigatórios

- **macOS**: Xcode Cloud requer macOS para desenvolvimento iOS
- **Xcode 15.2+**: Versão mais recente do Xcode
- **Apple Developer Account**: Conta de desenvolvedor Apple ativa
- **App Store Connect**: Acesso ao App Store Connect
- **Node.js 18+**: Para executar scripts Expo
- **CocoaPods**: Para gerenciamento de dependências iOS

### Verificação dos Pré-requisitos

Execute o script de verificação:

```bash
bash scripts/xcode-cloud-setup.sh
```

## ⚙️ Configuração Inicial

### 1. Clonar e Configurar o Projeto

```bash
# Clonar o repositório
git clone https://github.com/seu-usuario/PsiqueiaApp.git
cd PsiqueiaApp

# Instalar dependências
npm install

# Configurar ambiente
cp .env.example .env
```

### 2. Configurar Variáveis de Ambiente

Edite o arquivo `.env` com suas configurações:

```bash
# Configuração do Expo
EXPO_TOKEN=your_expo_token_here

# Configuração do App Store Connect API
APP_STORE_CONNECT_API_KEY_ID=your_api_key_id
APP_STORE_CONNECT_ISSUER_ID=your_issuer_id
APP_STORE_CONNECT_PRIVATE_KEY_PATH=./private_keys/AuthKey_XXXXXXXXXX.p8

# Configuração do iOS
IOS_BUNDLE_IDENTIFIER=com.psiqueia.app
IOS_DEVELOPMENT_TEAM=YOUR_TEAM_ID
IOS_CODE_SIGNING_STYLE=Automatic
```

## 🔑 App Store Connect API

### 1. Gerar Chave API

1. Acesse [App Store Connect](https://appstoreconnect.apple.com)
2. Vá para **Users and Access** > **Keys**
3. Clique em **Generate API Key**
4. Configure as permissões necessárias:
   - **Access**: Developer
   - **Roles**: App Manager ou Admin

### 2. Configurar Chave Privada

```bash
# Criar diretório para chaves privadas
mkdir -p private_keys

# Copiar a chave baixada
cp ~/Downloads/AuthKey_XXXXXXXXXX.p8 private_keys/

# Configurar permissões
chmod 600 private_keys/AuthKey_XXXXXXXXXX.p8
```

### 3. Configurar app-store-connect-config.json

O arquivo `app-store-connect-config.json` já está configurado. Atualize com suas informações:

```json
{
  "apiKey": {
    "keyId": "SEU_KEY_ID",
    "issuerId": "SEU_ISSUER_ID",
    "privateKeyPath": "./private_keys/AuthKey_XXXXXXXXXX.p8"
  },
  "appInfo": {
    "bundleId": "com.psiqueia.app",
    "appName": "PsiqueiaApp",
    "teamId": "SEU_TEAM_ID"
  }
}
```

## 🔄 Workflows do Xcode Cloud

### Workflows Configurados

O arquivo `.xcode-cloud.yml` define três workflows principais:

#### 1. Development Build
- **Trigger**: Pull requests e pushes para `develop`
- **Ações**: Build e teste em simulador
- **Ambiente**: Debug

#### 2. Production Build
- **Trigger**: Tags `v*` e pushes para `main`
- **Ações**: Build, teste, archive e upload para App Store
- **Ambiente**: Release

#### 3. Test
- **Trigger**: Pull requests para `main` e `develop`
- **Ações**: Testes unitários e de integração
- **Ambiente**: Test

### Personalizar Workflows

Para modificar os workflows, edite `.xcode-cloud.yml`:

```yaml
workflows:
  development:
    name: "Development Build"
    trigger:
      pull_request:
        target_branches:
          - main
          - develop
      push:
        branches:
          - develop
    # ... resto da configuração
```

## 🚀 Scripts de CI/CD

### Scripts Disponíveis

| Script | Descrição | Uso |
|--------|-----------|-----|
| `xcode-cloud-setup.sh` | Configuração inicial | `bash scripts/xcode-cloud-setup.sh` |
| `ci-build.sh` | Build de CI | `bash scripts/ci-build.sh` |
| `ci-post-build.sh` | Ações pós-build | `bash scripts/ci-post-build.sh` |

### Comandos npm

```bash
# Configuração inicial
npm run xcode-cloud:setup

# Builds de CI
npm run ci:build
npm run ci:test
npm run ci:production
```

### Fluxo de Build

1. **Pré-build**: Verificação de ambiente e dependências
2. **Build**: Compilação do projeto iOS
3. **Teste**: Execução de testes automatizados
4. **Pós-build**: Coleta de artefatos e notificações

## 📱 Configuração do Projeto

### app.json

Configurações específicas para iOS:

```json
{
  "ios": {
    "bundleIdentifier": "com.psiqueia.app",
    "buildNumber": "1",
    "config": {
      "usesNonExemptEncryption": false
    }
  }
}
```

### eas.json

Configurações de build e submissão:

```json
{
  "build": {
    "production": {
      "distribution": "store",
      "resourceClass": "large"
    }
  },
  "submit": {
    "production": {
      "ios": {
        "appleId": "your-apple-id@example.com",
        "ascAppId": "your-app-store-connect-app-id"
      }
    }
  }
}
```

## 📊 Uso e Monitoramento

### Iniciar Build Manual

```bash
# Build de desenvolvimento
npm run ci:build

# Build de produção
npm run ci:production

# Apenas testes
npm run ci:test
```

### Monitorar Builds

1. **Xcode Cloud Console**: Acesse via Xcode ou App Store Connect
2. **Logs**: Verifique `build-artifacts/` para logs detalhados
3. **Notificações**: Configure Slack/Email para alertas

### Artefatos de Build

Os builds geram os seguintes artefatos:

- `build-artifacts/build-report.md`: Relatório completo
- `build-artifacts/ios-build-logs/`: Logs de build iOS
- `build-artifacts/swiftlint-report.json`: Análise de código
- `build-artifacts/security-report.json`: Análise de segurança

## 🔧 Troubleshooting

### Problemas Comuns

#### 1. Erro de Autenticação App Store Connect

```bash
Error: Invalid API key or insufficient permissions
```

**Solução**:
- Verifique se a chave API está correta
- Confirme as permissões da chave
- Verifique se o arquivo `.p8` está no local correto

#### 2. Falha no Build iOS

```bash
Error: Build failed with exit code 65
```

**Solução**:
- Execute `npx expo prebuild --clean`
- Verifique se todas as dependências estão instaladas
- Confirme a configuração do bundle identifier

#### 3. Problemas de Code Signing

```bash
Error: Code signing failed
```

**Solução**:
- Verifique o Team ID no `.env`
- Confirme os certificados no Apple Developer Portal
- Use `Automatic` code signing quando possível

#### 4. Dependências Não Encontradas

```bash
Error: Module not found
```

**Solução**:
- Execute `npm install`
- Para iOS: `cd ios && pod install`
- Limpe o cache: `npm cache clean --force`

### Logs de Debug

Para habilitar logs detalhados:

```bash
# No .env
ENABLE_DEBUG_LOGS=true
LOG_LEVEL=debug
```

### Suporte

Para problemas não resolvidos:

1. Verifique os logs em `build-artifacts/`
2. Consulte a [documentação oficial do Xcode Cloud](https://developer.apple.com/xcode-cloud/)
3. Entre em contato com o suporte Apple Developer

## 📚 Recursos Adicionais

### Documentação Oficial

- [Xcode Cloud Documentation](https://developer.apple.com/xcode-cloud/)
- [App Store Connect API](https://developer.apple.com/documentation/appstoreconnectapi)
- [Expo Development Build](https://docs.expo.dev/development/build/)

### Ferramentas Úteis

- [Xcode Cloud Status](https://developer.apple.com/system-status/)
- [App Store Connect](https://appstoreconnect.apple.com)
- [Apple Developer Portal](https://developer.apple.com)

### Scripts de Manutenção

```bash
# Limpar builds antigos
npm run clean:builds

# Atualizar dependências
npm run update:deps

# Verificar configuração
npm run check:config
```

---

## 📝 Notas Importantes

- **Segurança**: Nunca commite chaves privadas no repositório
- **Ambiente**: Xcode Cloud funciona apenas em ambiente macOS
- **Custos**: Monitore o uso de recursos no App Store Connect
- **Backup**: Mantenha backup das chaves API e certificados

Para mais informações, consulte a documentação oficial da Apple ou entre em contato com a equipe de desenvolvimento.