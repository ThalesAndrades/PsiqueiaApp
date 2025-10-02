#!/bin/bash

# Script de configuração para iOS - PsiqueiaApp
# Este script configura o ambiente iOS para conformidade com Apple

set -e

echo "🚀 Iniciando configuração iOS para PsiqueiaApp..."

# Verificar se estamos no diretório correto
if [ ! -f "package.json" ]; then
    echo "❌ Erro: Execute este script no diretório raiz do projeto"
    exit 1
fi

# Instalar dependências do Node.js
echo "📦 Instalando dependências do Node.js..."
npm install

# Verificar se o CocoaPods está instalado
if ! command -v pod &> /dev/null; then
    echo "❌ CocoaPods não encontrado. Instalando..."
    sudo gem install cocoapods
fi

# Navegar para o diretório iOS
cd ios

# Instalar pods
echo "🍎 Instalando CocoaPods..."
pod install --repo-update

# Voltar ao diretório raiz
cd ..

# Gerar código nativo do Expo
echo "⚡ Gerando código nativo do Expo..."
npx expo prebuild --platform ios --clean

# Verificar configurações
echo "✅ Verificando configurações..."

# Verificar se os arquivos necessários existem
required_files=(
    "ios/PsiqueiaApp/Info.plist"
    "ios/PsiqueiaApp/PsiqueiaApp.entitlements"
    "ios/PsiqueiaApp/PrivacyInfo.xcprivacy"
    "ios/ExportOptions.plist"
    ".xcode-cloud.yml"
    "app.json"
)

for file in "${required_files[@]}"; do
    if [ ! -f "$file" ]; then
        echo "❌ Arquivo necessário não encontrado: $file"
        exit 1
    else
        echo "✅ $file encontrado"
    fi
done

# Verificar variáveis de ambiente necessárias
echo "🔐 Verificando variáveis de ambiente..."
if [ -z "$APP_STORE_CONNECT_API_KEY_ID" ]; then
    echo "⚠️  Aviso: APP_STORE_CONNECT_API_KEY_ID não definida"
fi

if [ -z "$APP_STORE_CONNECT_ISSUER_ID" ]; then
    echo "⚠️  Aviso: APP_STORE_CONNECT_ISSUER_ID não definida"
fi

if [ -z "$DEVELOPMENT_TEAM" ]; then
    echo "⚠️  Aviso: DEVELOPMENT_TEAM não definida"
fi

echo "🎉 Configuração iOS concluída com sucesso!"
echo ""
echo "📋 Próximos passos:"
echo "1. Configure as variáveis de ambiente no Xcode Cloud:"
echo "   - APP_STORE_CONNECT_ISSUER_ID"
echo "   - DEVELOPMENT_TEAM"
echo "   - MATCH_PASSWORD (para produção)"
echo ""
echo "2. Faça upload da chave privada para o Xcode Cloud"
echo ""
echo "3. Configure os provisioning profiles no Apple Developer Portal"
echo ""
echo "4. Execute 'npm run ios' para testar localmente"