# Auditoria de Dependências

Este documento explica como auditar e gerenciar dependências não utilizadas no projeto.

## Ferramentas

### Depcheck

O [depcheck](https://github.com/depcheck/depcheck) é uma ferramenta que analisa o projeto e identifica:
- Dependências não utilizadas
- Dependências faltantes (usadas mas não declaradas)
- Dependências que deveriam estar em `devDependencies`

## Uso

### Executar análise completa
```bash
npm run analyze:deps
```

### Executar com opções específicas
```bash
# Ignorar diretórios específicos
npx depcheck --ignores="babel-*,eslint-*,@types/*"

# Verificar apenas um diretório
npx depcheck --json > deps-report.json
```

## Interpretando Resultados

### Dependências Não Utilizadas
```json
{
  "dependencies": [
    "unused-package",
    "another-unused-package"
  ]
}
```

**Ação:** Considere remover se realmente não estiver em uso.

### Dependências Faltantes
```json
{
  "missing": {
    "missing-package": ["./src/file.ts"]
  }
}
```

**Ação:** Adicione ao `package.json`:
```bash
npm install missing-package
```

### DevDependencies vs Dependencies

Algumas dependências podem estar na seção errada:
- **dependencies:** Necessárias em runtime (app em produção)
- **devDependencies:** Necessárias apenas para desenvolvimento (testes, build tools, etc.)

## Processo de Remoção Segura

### 1. Identificar Dependência
```bash
npm run analyze:deps
```

### 2. Verificar Uso Real
Busque no código para confirmar que não está sendo usada:
```bash
grep -r "import.*from.*package-name" ./src
grep -r "require.*package-name" ./src
```

### 3. Verificar Dependências Transitivas
Algumas dependências são usadas por outras:
```bash
npm ls package-name
```

### 4. Remover com Segurança
```bash
npm uninstall package-name
```

### 5. Testar
```bash
# Limpar e reinstalar
npm ci

# Testar build
npm run build

# Executar testes (se houver)
npm test

# Testar app
npm run start
```

## Falsos Positivos Comuns

Algumas dependências podem ser reportadas como não utilizadas mas são necessárias:

### Expo Modules
```javascript
"expo-*" // Muitos são auto-linked e não aparecem em imports
```

### Plugins e Configuração
```javascript
"@babel/preset-*"
"eslint-config-*"
"prettier-plugin-*"
```

### Peer Dependencies
Dependências requeridas por outras packages mas não importadas diretamente.

### Polyfills
```javascript
"react-native-url-polyfill" // Não importado mas necessário
"crypto" // Built-in polyfill
```

## Lista de Exclusões Recomendadas

Adicione ao `.depcheckrc` (se criar):
```json
{
  "ignores": [
    "expo-*",
    "@expo/*",
    "@babel/*",
    "eslint-*",
    "@types/*",
    "typescript",
    "react-native",
    "react",
    "react-dom"
  ],
  "ignore-patterns": [
    "node_modules",
    "dist",
    ".expo",
    "ios/build",
    "android/build"
  ]
}
```

## Automatização

### Pre-commit Hook
Adicione ao `.husky/pre-commit` (se usar husky):
```bash
npm run analyze:deps
```

### CI Integration
Adicione ao workflow de CI:
```yaml
- name: Check dependencies
  run: |
    npm run analyze:deps
    # Falhar se houver dependências faltantes
```

## Manutenção Regular

### Mensal
- Execute `npm run analyze:deps`
- Revise dependências não utilizadas
- Atualize dependências obsoletas: `npm outdated`

### A cada Release
- Auditoria completa de segurança: `npm audit`
- Verificar licenças: `npx license-checker`
- Análise de tamanho: `npx cost-of-modules`

## Boas Práticas

### 1. Antes de Adicionar Nova Dependência
- Verifique se já existe solução nativa
- Avalie qualidade e manutenção do package
- Considere o tamanho (bundle size)
- Verifique compatibilidade com React Native/Expo

### 2. Documentar Dependências Especiais
Mantenha comentários no `package.json` para dependências não óbvias:
```json
{
  "dependencies": {
    "special-package": "^1.0.0" // Necessário para feature X devido a bug Y
  }
}
```

### 3. Versionamento Cuidadoso
- Use versões exatas (`1.2.3`) para produção crítica
- Use ranges (`^1.2.3`) para desenvolvimento
- Lock com `package-lock.json`

### 4. Monitorar Segurança
```bash
# Verificar vulnerabilidades
npm audit

# Corrigir automaticamente (com cuidado!)
npm audit fix
```

## Ferramentas Adicionais

### npm-check
```bash
npx npm-check -u
```
Interface interativa para atualizar dependências.

### bundle-phobia
Verifique tamanho antes de instalar:
```bash
npx bundle-phobia <package-name>
```

### license-checker
Verifique licenças:
```bash
npx license-checker --summary
```

## Referências

- [Depcheck GitHub](https://github.com/depcheck/depcheck)
- [npm-check](https://www.npmjs.com/package/npm-check)
- [Bundle Phobia](https://bundlephobia.com/)
