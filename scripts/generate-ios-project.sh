#!/bin/bash

# =============================================================================
# Script para Gerar Projeto iOS e Tornar Executável no Xcode
# PsiqueiaApp - iOS Project Generator
# =============================================================================

set -e  # Exit on any error

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para logging
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Função para verificar se comando existe
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Banner
echo "🚀 PsiqueiaApp - iOS Project Generator"
echo "======================================"
echo ""

# Verificar se estamos no macOS
if [[ "$OSTYPE" != "darwin"* ]]; then
    log_error "Este script deve ser executado no macOS para gerar projeto iOS"
    log_info "Sistema detectado: $OSTYPE"
    exit 1
fi

log_success "Sistema macOS detectado"

# Verificar pré-requisitos
log_info "Verificando pré-requisitos..."

# Node.js
if ! command_exists node; then
    log_error "Node.js não encontrado. Instale com: brew install node"
    exit 1
fi
NODE_VERSION=$(node --version)
log_success "Node.js encontrado: $NODE_VERSION"

# npm
if ! command_exists npm; then
    log_error "npm não encontrado"
    exit 1
fi
NPM_VERSION=$(npm --version)
log_success "npm encontrado: $NPM_VERSION"

# Expo CLI
if ! command_exists expo; then
    log_warning "Expo CLI não encontrado. Instalando..."
    npm install -g @expo/cli
    log_success "Expo CLI instalado"
else
    EXPO_VERSION=$(expo --version)
    log_success "Expo CLI encontrado: $EXPO_VERSION"
fi

# Xcode Command Line Tools
if ! command_exists xcode-select; then
    log_error "Xcode Command Line Tools não encontrados. Instale com: xcode-select --install"
    exit 1
fi
log_success "Xcode Command Line Tools encontrados"

# Verificar se Xcode está instalado
if ! command_exists xcodebuild; then
    log_error "Xcode não encontrado. Instale via App Store"
    exit 1
fi
XCODE_VERSION=$(xcodebuild -version | head -n 1)
log_success "Xcode encontrado: $XCODE_VERSION"

# Verificar se estamos no diretório correto
if [[ ! -f "package.json" ]] || [[ ! -f "app.json" ]]; then
    log_error "Execute este script no diretório raiz do projeto PsiqueiaApp"
    exit 1
fi

log_success "Diretório do projeto verificado"

# Instalar dependências
log_info "Instalando dependências do projeto..."
npm install
log_success "Dependências instaladas"

# Limpar cache (opcional mas recomendado)
log_info "Limpando cache do Expo..."
expo r -c || true  # Não falhar se não conseguir limpar cache
log_success "Cache limpo"

# Remover projeto iOS existente (se houver)
if [[ -d "ios" ]]; then
    log_warning "Projeto iOS existente encontrado. Removendo..."
    rm -rf ios/
    log_success "Projeto iOS anterior removido"
fi

# Gerar projeto iOS nativo
log_info "Gerando projeto iOS nativo com Expo prebuild..."
npx expo prebuild --platform ios --clean

# Verificar se foi gerado com sucesso
if [[ ! -d "ios" ]]; then
    log_error "Falha ao gerar projeto iOS"
    exit 1
fi

log_success "Projeto iOS gerado com sucesso"

# Verificar arquivos essenciais
log_info "Verificando arquivos essenciais..."

ESSENTIAL_FILES=(
    "ios/PsiqueiaApp.xcworkspace"
    "ios/PsiqueiaApp.xcodeproj"
    "ios/Podfile"
    "ios/PsiqueiaApp/Info.plist"
)

for file in "${ESSENTIAL_FILES[@]}"; do
    if [[ -f "$file" ]]; then
        log_success "Encontrado: $file"
    else
        log_error "Arquivo essencial não encontrado: $file"
        exit 1
    fi
done

# Instalar CocoaPods dependencies
log_info "Instalando dependências do CocoaPods..."
cd ios
pod install --repo-update
cd ..
log_success "CocoaPods instalado"

# Executar validação
if [[ -f "scripts/validate-ios.js" ]]; then
    log_info "Executando validação do projeto iOS..."
    node scripts/validate-ios.js
    log_success "Validação concluída"
fi

# Verificar configurações específicas
log_info "Verificando configurações específicas..."

# Verificar Info.plist
INFO_PLIST="ios/PsiqueiaApp/Info.plist"
if grep -q "NSHealthShareUsageDescription" "$INFO_PLIST"; then
    log_success "HealthKit permissions encontradas no Info.plist"
else
    log_warning "HealthKit permissions não encontradas no Info.plist"
fi

# Verificar Bundle ID
if grep -q "com.thalesandrades.psiqueiaapp" "$INFO_PLIST"; then
    log_success "Bundle ID correto encontrado"
else
    log_warning "Bundle ID pode estar incorreto"
fi

# Tentar abrir no Xcode (se disponível)
if command_exists open; then
    log_info "Tentando abrir projeto no Xcode..."
    open ios/PsiqueiaApp.xcworkspace
    log_success "Projeto aberto no Xcode"
else
    log_warning "Comando 'open' não disponível. Abra manualmente: ios/PsiqueiaApp.xcworkspace"
fi

# Instruções finais
echo ""
echo "🎉 PROJETO iOS GERADO COM SUCESSO!"
echo "=================================="
echo ""
echo "📁 Arquivos gerados:"
echo "   ├── ios/PsiqueiaApp.xcworkspace (ABRA ESTE NO XCODE)"
echo "   ├── ios/PsiqueiaApp.xcodeproj"
echo "   ├── ios/Podfile"
echo "   ├── ios/Pods/"
echo "   └── ios/PsiqueiaApp/"
echo ""
echo "🔧 Próximos passos no Xcode:"
echo "   1. Abrir: ios/PsiqueiaApp.xcworkspace"
echo "   2. Selecionar Team de Desenvolvimento"
echo "   3. Verificar Bundle ID: com.thalesandrades.psiqueiaapp"
echo "   4. Confirmar HealthKit capability"
echo "   5. Build and Run (⌘+R)"
echo ""
echo "📱 Para executar:"
echo "   • Simulador: npx expo run:ios --simulator"
echo "   • Device: npx expo run:ios --device"
echo "   • Xcode: Product → Run (⌘+R)"
echo ""
echo "📋 Comandos úteis:"
echo "   • Validar: node scripts/validate-ios.js"
echo "   • Status: node scripts/check-deployment-status.js"
echo "   • Limpar: rm -rf ios/ && npx expo prebuild --platform ios --clean"
echo ""
echo "🔗 Documentação:"
echo "   • Guia completo: XCODE_EXECUTABLE_GUIDE.md"
echo "   • Deployment: FINAL_DEPLOYMENT_CHECKLIST.md"
echo ""

# Verificar se há simuladores disponíveis
log_info "Verificando simuladores disponíveis..."
if command_exists xcrun; then
    SIMULATORS=$(xcrun simctl list devices | grep "iPhone" | grep "Booted\|Shutdown" | head -3)
    if [[ -n "$SIMULATORS" ]]; then
        echo "📱 Simuladores disponíveis:"
        echo "$SIMULATORS"
    fi
fi

echo ""
log_success "Script concluído com sucesso!"
log_info "O projeto está pronto para desenvolvimento no Xcode"

# Opcional: Executar no simulador automaticamente
read -p "🚀 Deseja executar o app no simulador agora? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    log_info "Executando no simulador..."
    npx expo run:ios --simulator
fi

exit 0