# OTA Updates - Guia de Configuração e Uso

Este documento explica como configurar e usar o sistema de OTA (Over-The-Air) Updates do Expo para o PsiqueiaApp.

## O que são OTA Updates?

OTA Updates permitem enviar atualizações JavaScript/TypeScript e assets do aplicativo diretamente para os usuários sem passar pela App Store ou Play Store. Isso é útil para:

- Correções de bugs urgentes
- Pequenas melhorias de UI/UX
- Atualizações de conteúdo
- A/B testing

**Nota:** Mudanças em código nativo (Objective-C, Swift, Java, Kotlin) ainda requerem uma nova build.

## Canais de Distribuição

O sistema utiliza três canais principais para gerenciar diferentes ambientes:

### 1. Development (dev)
- **Uso:** Desenvolvimento ativo
- **Branch:** `develop`, `feature/*`
- **Público:** Desenvolvedores e testadores internos
- **Frequência:** A cada push/merge

### 2. Staging
- **Uso:** Testes pré-produção
- **Branch:** `staging`, `release/*`
- **Público:** QA team e beta testers
- **Frequência:** Após validação no dev

### 3. Production
- **Uso:** Usuários finais
- **Branch:** `main`, tags `v*`
- **Público:** Todos os usuários
- **Frequência:** Releases planejados

## Configuração Inicial

### 1. Configurar EAS Update URL

Após criar o projeto no EAS, você precisa adicionar a URL de updates no `app.json`:

```json
{
  "expo": {
    "updates": {
      "url": "https://u.expo.dev/[YOUR_PROJECT_ID]"
    },
    "runtimeVersion": {
      "policy": "appVersion"
    }
  }
}
```

**TODO:** Executar `npx eas update:configure` para obter a URL correta e inserir acima.

### 2. Runtime Version Policy

Atualmente usando `policy: "appVersion"` que vincula updates à versão do app no `app.json`.

**Alternativa futura:** Considerar usar `policy: "sdkVersion"` ou `policy: "nativeVersion"` para maior controle.

## Publicando Updates

### Publicar para Development
```bash
npx eas update --branch development --message "Fix: correção de bug X"
```

### Publicar para Staging
```bash
npx eas update --branch staging --message "Release: v1.2.0 beta"
```

### Publicar para Production
```bash
npx eas update --branch production --message "Release: v1.2.0"
```

### Publicar para múltiplos canais
```bash
npx eas update --branch staging,production --message "Hotfix: correção crítica"
```

## Verificando Updates

### Ver updates publicados
```bash
npx eas update:list --branch production
```

### Ver detalhes de um update
```bash
npx eas update:view [UPDATE_ID]
```

### Rollback de um update
```bash
npx eas update:rollback --branch production
```

## Boas Práticas

### 1. Mensagens de Commit
Use mensagens descritivas que expliquem o que mudou:
- ✅ "Fix: corrige crash ao salvar configurações"
- ✅ "Feature: adiciona modo escuro"
- ❌ "update"
- ❌ "mudanças"

### 2. Testes Antes de Produção
1. Publique para `development`
2. Teste internamente
3. Promova para `staging`
4. QA completo
5. Publique para `production`

### 3. Compatibilidade
- Updates só funcionam com a mesma `runtimeVersion`
- Mudanças nativas requerem nova build
- Teste em dispositivos reais

### 4. Monitoramento
- Configure Sentry para monitorar erros após updates
- Acompanhe métricas de adoção
- Esteja pronto para rollback

## Integração com CI/CD

O workflow de CI pode automatizar publicação de updates:

```yaml
- name: Publish EAS Update
  if: github.ref == 'refs/heads/main'
  run: npx eas update --branch production --non-interactive
  env:
    EXPO_TOKEN: ${{ secrets.EXPO_TOKEN }}
```

## Troubleshooting

### Update não aparece no app
1. Verifique se `runtimeVersion` é compatível
2. Confirme que o app está usando o canal correto
3. Force reload: Cmd+D (iOS) / Cmd+M (Android) → Reload

### Erro ao publicar
1. Verifique se `EXPO_TOKEN` está configurado
2. Confirme que o projeto existe no EAS
3. Verifique conexão com internet

### Updates muito grandes
1. Otimize assets (comprima imagens)
2. Use lazy loading quando possível
3. Considere code splitting

## Segurança

- **Nunca** publique secrets em updates
- Use variáveis de ambiente para dados sensíveis
- Revise código antes de publicar para production
- Mantenha `EXPO_TOKEN` seguro

## Referências

- [Expo EAS Update Documentation](https://docs.expo.dev/eas-update/introduction/)
- [Runtime Versions](https://docs.expo.dev/eas-update/runtime-versions/)
- [Deployment Patterns](https://docs.expo.dev/eas-update/deployment-patterns/)
