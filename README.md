# PsiqueiaApp

Um aplicativo iOS desenvolvido com React Native e Expo para gerenciamento de saúde mental.

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and configure the necessary values:

```bash
cp .env.example .env
```

**Required Secrets:**
- `EXPO_TOKEN`: Token do Expo para builds automatizados ([obter aqui](https://expo.dev/accounts/[username]/settings/access-tokens))
- `SENTRY_DSN`: DSN do Sentry para monitoramento de erros (opcional, mas recomendado para produção)
- `FCM_SERVER_KEY` e `FCM_SENDER_ID`: Chaves do Firebase Cloud Messaging para push notifications (necessário para notificações)

**GitHub Secrets (para CI/CD):**

Configure os seguintes secrets no repositório GitHub (Settings → Secrets and variables → Actions):
- `EXPO_TOKEN`: Para builds automatizados no GitHub Actions

### 3. Start the Project

```bash
npm run start         # Start Expo development server
npm run ios           # Launch iOS simulator
npm run web           # Start the web version
```

### 4. Build for iOS

Para gerar o projeto nativo iOS e abrir no Xcode:

```bash
npm run ios:prebuild  # Gera o projeto iOS nativo
npm run xcode         # Abre o projeto no Xcode
```

## Releases & Updates

### OTA Updates (Over-The-Air)

Este projeto está configurado para usar EAS Update para atualizações OTA:

- **Development**: Atualizações automáticas para desenvolvedores
- **Staging**: Testes pré-produção com beta testers
- **Production**: Atualizações para usuários finais

**Documentação completa:** [docs/OTA_UPDATES.md](./docs/OTA_UPDATES.md)

**Publicar update:**
```bash
npx eas update --branch production --message "Descrição da atualização"
```

### Build e Deploy

```bash
# Build de desenvolvimento
npm run ios:build -- --profile development

# Build de produção
npm run ios:build -- --profile production

# Submit para App Store
npm run ios:submit
```

## Development Tools

### Code Quality

```bash
npm run lint          # Executar linter
npm run doctor        # Verificar saúde do projeto Expo
npm run analyze:deps  # Auditar dependências não utilizadas
```

Veja [docs/DEPENDENCIES_AUDIT.md](./docs/DEPENDENCIES_AUDIT.md) para mais informações sobre auditoria de dependências.

### Monitoring

O projeto está preparado para integração com Sentry para monitoramento de erros:

1. Criar projeto no [Sentry](https://sentry.io)
2. Adicionar `SENTRY_DSN` ao `.env`
3. Descomentar plugin `sentry-expo` no `app.config.ts`

## Xcode Cloud Setup

Este projeto está **completamente configurado** para funcionar com o Xcode Cloud. 

### ✅ Status: Pronto para Build

- ✅ Projeto iOS nativo gerado
- ✅ Scheme **PsiqueIA** compartilhada e versionada
- ✅ Configurações de build adequadas
- ✅ Deployment target: iOS 15.1+

**Para detalhes completos e instruções de como habilitar o Xcode Cloud, consulte**: 
- **[XCODE_CLOUD_READY.md](./XCODE_CLOUD_READY.md)** - Documentação completa de configuração
- [XCODE_CLOUD_SETUP.md](./XCODE_CLOUD_SETUP.md) - Guia detalhado de uso

### Scheme Usada

O projeto usa a scheme **PsiqueIA** que está configurada como compartilhada (shared) e versionada no Git em:
```
ios/PsiqueIA.xcodeproj/xcshareddata/xcschemes/PsiqueIA.xcscheme
```

Esta é a única scheme do projeto e será usada automaticamente pelo Xcode Cloud para builds e arquivamento.

## Main Dependencies

- React Native: 0.79.3
- React: 19.0.0
- Expo: ~53.0.9
- Expo Router: ~5.0.7
- Supabase: ^2.50.0

For a full list of dependencies, see [package.json](./package.json).

## License

This project is private. For collaboration inquiries, please contact the author.
