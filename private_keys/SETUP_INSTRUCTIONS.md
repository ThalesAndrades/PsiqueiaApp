# 🔑 CONFIGURAÇÃO DA CHAVE PRIVADA DO APP STORE CONNECT

## ⚠️ IMPORTANTE: CHAVE NECESSÁRIA

O arquivo `AuthKey_5D79LKKR26.p8` atualmente contém apenas instruções.
**Você precisa substituí-lo pela chave real baixada do App Store Connect.**

## 📋 INFORMAÇÕES DA CHAVE

- **Key ID**: Será gerado pelo App Store Connect
- **Arquivo**: AuthKey_[KEY_ID].p8
- **Localização**: private_keys/AuthKey_[KEY_ID].p8

## 🚀 PASSO A PASSO COMPLETO

### 1. Acessar App Store Connect
- URL: https://appstoreconnect.apple.com
- Faça login com sua conta de desenvolvedor Apple

### 2. Criar Nova Chave
- Navegue: Users and Access → Keys
- Clique em "+" para criar nova chave
- **Nome**: PsiqueiaApp Key
- **Access**: App Manager
- **Apps**: Selecione "All Apps" ou específico

### 3. Download da Chave
- Clique em "Download" (⚠️ só pode baixar UMA vez!)
- Salve o arquivo .p8 em local seguro
- **IMPORTANTE**: Anote o Key ID gerado

### 4. Substituir Arquivo Local
```bash
# Renomeie o arquivo baixado para o formato correto
mv ~/Downloads/AuthKey_[NEW_KEY_ID].p8 private_keys/AuthKey_[NEW_KEY_ID].p8

# Atualize as configurações com o novo Key ID
```

### 5. Configurar Variáveis de Ambiente
- **Issuer ID**: Copie da página App Store Connect
- **Key ID**: Use o ID gerado (ex: 5D79LKKR26)
- **Team ID**: Seu Team ID de desenvolvedor

### 6. Validar Formato da Chave
O arquivo deve ter este formato:
```
-----BEGIN PRIVATE KEY-----
[conteúdo da chave privada em base64]
-----END PRIVATE KEY-----
```

## ⚠️ IMPORTANTE

- ✅ Mantenha a chave privada segura
- ✅ Não compartilhe o arquivo .p8
- ✅ Use apenas em ambientes seguros
- ✅ Configure as variáveis de ambiente no Xcode Cloud

## 🔍 VALIDAÇÃO

Execute para verificar:
```bash
node xcode-cloud-configs/scripts/validate-xcode-cloud.js
```

## 📞 SUPORTE

Se houver problemas:
1. Verifique se o arquivo existe
2. Confirme as permissões da chave
3. Valide o Issuer ID
4. Teste com uma build simples
