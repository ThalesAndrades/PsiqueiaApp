# Configuração do GitHub - Autenticação SSH

## Problema Identificado
O repositório está configurado para usar SSH (`git@github.com:ThalesAndrades/PsiqueiaApp.git`), mas não há chave SSH configurada.

## Soluções Disponíveis

### Opção 1: Configurar Chave SSH (Recomendado)

1. **Gerar nova chave SSH:**
```bash
ssh-keygen -t ed25519 -C "seu-email@exemplo.com"
```

2. **Adicionar chave ao ssh-agent:**
```bash
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519
```

3. **Copiar chave pública:**
```bash
cat ~/.ssh/id_ed25519.pub
```

4. **Adicionar no GitHub:**
   - Vá para GitHub.com → Settings → SSH and GPG keys
   - Clique em "New SSH key"
   - Cole a chave pública
   - Salve

### Opção 2: Usar HTTPS com Token

1. **Alterar remote para HTTPS:**
```bash
git remote set-url origin https://github.com/ThalesAndrades/PsiqueiaApp.git
```

2. **Fazer push com token:**
```bash
git push origin master
```
   - Usuário: seu-username-github
   - Senha: seu-personal-access-token

### Opção 3: Usar GitHub CLI (Mais Simples)

1. **Instalar GitHub CLI:**
```bash
# Windows (com Chocolatey)
choco install gh

# Ou baixar de: https://cli.github.com/
```

2. **Autenticar:**
```bash
gh auth login
```

3. **Fazer push:**
```bash
git push origin master
```

## Status Atual
✅ Commit realizado com sucesso (39 arquivos, 8345 inserções)
❌ Push pendente devido à autenticação SSH

## Próximos Passos
1. Escolher uma das opções acima
2. Configurar autenticação
3. Executar: `git push origin master`

## Arquivos Commitados
- Configurações completas de deployment
- Scripts de automação para App Store
- Documentação detalhada
- Configurações do Xcode Cloud
- Metadados da App Store
- Checklists de deployment