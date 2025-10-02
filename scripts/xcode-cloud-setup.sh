#!/bin/bash

# Xcode Cloud Setup Script for PsiqueiaApp
# Este script automatiza a configuração inicial do Xcode Cloud

set -e

echo "🚀 Configurando Xcode Cloud para PsiqueiaApp..."

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para imprimir mensagens coloridas
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verificar se estamos em um ambiente macOS
if [[ "$OSTYPE" != "darwin"* ]]; then
    print_error "Este script deve ser executado em macOS para configurar o Xcode Cloud"
    exit 1
fi

# Verificar se o Xcode está instalado
if ! command -v xcodebuild &> /dev/null; then
    print_error "Xcode não está instalado. Instale o Xcode antes de continuar."
    exit 1
fi

print_status "Verificando versão do Xcode..."
xcodebuild -version

# Verificar se o Node.js está instalado
if ! command -v node &> /dev/null; then
    print_error "Node.js não está instalado. Instale o Node.js antes de continuar."
    exit 1
fi

print_status "Verificando versão do Node.js..."
node --version

# Verificar se o npm está instalado
if ! command -v npm &> /dev/null; then
    print_error "npm não está instalado. Instale o npm antes de continuar."
    exit 1
fi

# Instalar dependências do projeto
print_status "Instalando dependências do Node.js..."
npm ci

# Verificar se o Expo CLI está disponível
if ! command -v npx expo &> /dev/null; then
    print_warning "Expo CLI não encontrado. Instalando..."
    npm install -g @expo/cli
fi

# Gerar arquivos nativos iOS
print_status "Gerando arquivos nativos iOS com Expo..."
npx expo prebuild --platform ios --clean

# Verificar se o diretório ios foi criado
if [ ! -d "ios" ]; then
    print_error "Falha ao gerar arquivos nativos iOS"
    exit 1
fi

print_success "Arquivos nativos iOS gerados com sucesso"

# Instalar dependências CocoaPods
if [ -f "ios/Podfile" ]; then
    print_status "Instalando dependências CocoaPods..."
    cd ios
    
    # Verificar se CocoaPods está instalado
    if ! command -v pod &> /dev/null; then
        print_warning "CocoaPods não encontrado. Instalando..."
        sudo gem install cocoapods
    fi
    
    pod install --repo-update
    cd ..
    print_success "Dependências CocoaPods instaladas"
else
    print_warning "Podfile não encontrado, pulando instalação CocoaPods"
fi

# Verificar configuração do projeto Xcode
print_status "Verificando configuração do projeto Xcode..."

if [ -f "ios/PsiqueiaApp.xcworkspace" ]; then
    print_success "Workspace do Xcode encontrado: ios/PsiqueiaApp.xcworkspace"
elif [ -f "ios/PsiqueiaApp.xcodeproj" ]; then
    print_success "Projeto do Xcode encontrado: ios/PsiqueiaApp.xcodeproj"
else
    print_error "Projeto ou workspace do Xcode não encontrado"
    exit 1
fi

# Verificar se o arquivo de configuração do Xcode Cloud existe
if [ -f ".xcode-cloud.yml" ]; then
    print_success "Arquivo de configuração do Xcode Cloud encontrado"
else
    print_warning "Arquivo .xcode-cloud.yml não encontrado"
fi

# Verificar configuração do App Store Connect
print_status "Verificando configuração do App Store Connect..."

if [ -f "app-store-connect-config.json" ]; then
    print_success "Configuração do App Store Connect encontrada"
else
    print_warning "Configuração do App Store Connect não encontrada"
fi

# Verificar variáveis de ambiente necessárias
print_status "Verificando variáveis de ambiente..."

required_vars=(
    "APP_STORE_CONNECT_API_KEY_ID"
    "APP_STORE_CONNECT_ISSUER_ID"
    "DEVELOPMENT_TEAM_ID"
)

missing_vars=()

for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
        missing_vars+=("$var")
    fi
done

if [ ${#missing_vars[@]} -eq 0 ]; then
    print_success "Todas as variáveis de ambiente necessárias estão configuradas"
else
    print_warning "Variáveis de ambiente faltando:"
    for var in "${missing_vars[@]}"; do
        echo "  - $var"
    done
    echo ""
    print_warning "Configure essas variáveis antes de usar o Xcode Cloud"
fi

# Verificar se o repositório Git está configurado
print_status "Verificando configuração do Git..."

if git rev-parse --git-dir > /dev/null 2>&1; then
    print_success "Repositório Git configurado"
    
    # Verificar se há um remote origin
    if git remote get-url origin > /dev/null 2>&1; then
        origin_url=$(git remote get-url origin)
        print_success "Remote origin configurado: $origin_url"
    else
        print_warning "Remote origin não configurado"
    fi
else
    print_error "Este não é um repositório Git"
    exit 1
fi

# Resumo da configuração
echo ""
echo "📋 Resumo da Configuração:"
echo "=========================="
print_success "✅ Xcode instalado e funcionando"
print_success "✅ Node.js e npm configurados"
print_success "✅ Dependências do projeto instaladas"
print_success "✅ Arquivos nativos iOS gerados"

if [ -f "ios/Podfile" ]; then
    print_success "✅ CocoaPods configurado"
fi

if [ -f ".xcode-cloud.yml" ]; then
    print_success "✅ Configuração do Xcode Cloud presente"
fi

if [ ${#missing_vars[@]} -eq 0 ]; then
    print_success "✅ Variáveis de ambiente configuradas"
else
    print_warning "⚠️  Algumas variáveis de ambiente precisam ser configuradas"
fi

echo ""
echo "🎉 Configuração do Xcode Cloud concluída!"
echo ""
echo "Próximos passos:"
echo "1. Configure as variáveis de ambiente faltando (se houver)"
echo "2. Abra o projeto no Xcode: ios/PsiqueiaApp.xcworkspace"
echo "3. Configure certificados e perfis de provisionamento"
echo "4. Conecte o repositório ao Xcode Cloud no App Store Connect"
echo "5. Execute um build de teste"
echo ""
print_status "Para mais informações, consulte XCODE_CLOUD_SETUP.md"