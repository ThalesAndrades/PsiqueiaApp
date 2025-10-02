# 🔑 CONFIGURAÇÃO DA CHAVE PRIVADA DO APP STORE CONNECT

## 📋 INFORMAÇÕES DA CHAVE

- **Key ID**: 5D79LKKR26
- **Arquivo**: AuthKey_5D79LKKR26.p8
- **Localização**: private_keys/AuthKey_5D79LKKR26.p8

## 🚀 PASSO A PASSO

### 1. Verificar Chave Local
```bash
ls -la private_keys/
# Deve mostrar: AuthKey_5D79LKKR26.p8
```

### 2. Acessar App Store Connect
- URL: https://appstoreconnect.apple.com
- Login → Users and Access → Keys

### 3. Configurar Chave
- Clique em "+" para nova chave OU
- Clique na chave existente (5D79LKKR26)

### 4. Upload do Arquivo
- Faça upload de: `private_keys/AuthKey_5D79LKKR26.p8`
- Confirme o Key ID: 5D79LKKR26

### 5. Configurar Permissões
- **Access**: App Manager
- **Apps**: Selecione "PsiqueiaApp" ou "All Apps"

### 6. Copiar Informações
- **Issuer ID**: Copie da página (formato: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)
- **Key ID**: 5D79LKKR26 (já configurado)

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
