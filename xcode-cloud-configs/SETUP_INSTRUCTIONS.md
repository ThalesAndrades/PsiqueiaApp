# 🛠️ INSTRUÇÕES DE CONFIGURAÇÃO DO XCODE CLOUD

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

#### `APP_STORE_CONNECT_API_KEY_ID`
- **Valor**: `5D79LKKR26`
- **Tipo**: Text
- **Descrição**: ID da chave API do App Store Connect
- **Secret**: Não

#### `APP_STORE_CONNECT_ISSUER_ID`
- **Valor**: `[SEU_ISSUER_ID]`
- **Tipo**: Text
- **Descrição**: Issuer ID da sua conta do App Store Connect
- **Secret**: Não
- **Como encontrar**:
  1. Vá para App Store Connect
  2. Users and Access → Keys
  3. Copie o "Issuer ID" no topo da página

#### `DEVELOPMENT_TEAM`
- **Valor**: `[SEU_TEAM_ID]`
- **Tipo**: Text
- **Descrição**: Team ID do Apple Developer Program
- **Secret**: Não
- **Como encontrar**:
  1. Vá para Apple Developer Portal
  2. Account → Membership
  3. Copie o "Team ID"

### 📝 VARIÁVEIS OPCIONAIS

#### `EXPO_TOKEN` (Opcional)
- **Valor**: `[SEU_EXPO_TOKEN]`
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
   - Faça upload do arquivo: `private_keys/AuthKey_5D79LKKR26.p8`

3. **Configurar Permissões**
   - Access: App Manager
   - Apps: Selecione seu app ou "All Apps"

## 🔄 CONFIGURAÇÃO DO WORKFLOW

### Arquivo `.xcode-cloud.yml` (Já Configurado)
O arquivo já está configurado em: `.xcode-cloud.yml`

Conteúdo atual:
```yaml
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
```

## 🚀 EXECUTAR BUILD

### Opção 1: Via Git Push
```bash
git add .
git commit -m "Configure Xcode Cloud build"
git push origin main
```

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
   - Verifique se o arquivo `AuthKey_5D79LKKR26.p8` foi carregado
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
