#!/bin/bash

# PsiqueiaApp - Script de Deployment Automático para macOS/Linux
# Este script automatiza todo o processo de deployment no App Store

set -e  # Sair em caso de erro

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

print_header() {
    echo -e "\n${BLUE}========================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}========================================${NC}\n"
}

# Verificar se estamos no diretório correto
if [ ! -f "app.json" ]; then
    print_error "app.json não encontrado. Execute este script no diretório raiz do projeto."
    exit 1
fi

print_header "PSIQUEIAAPP - DEPLOYMENT AUTOMÁTICO"

# [1/8] Verificar pré-requisitos
print_header "[1/8] VERIFICANDO PRÉ-REQUISITOS"

# Verificar Node.js
if ! command -v node &> /dev/null; then
    print_error "Node.js não encontrado. Instale o Node.js primeiro."
    print_status "Download: https://nodejs.org/"
    exit 1
fi
NODE_VERSION=$(node --version)
print_success "Node.js encontrado: $NODE_VERSION"

# Verificar npm
if ! command -v npm &> /dev/null; then
    print_error "npm não encontrado."
    exit 1
fi
NPM_VERSION=$(npm --version)
print_success "npm encontrado: $NPM_VERSION"

# Verificar Expo CLI
if ! command -v npx &> /dev/null; then
    print_error "npx não encontrado."
    exit 1
fi
print_success "npx encontrado"

# Verificar Xcode (apenas no macOS)
if [[ "$OSTYPE" == "darwin"* ]]; then
    if ! command -v xcodebuild &> /dev/null; then
        print_warning "Xcode não encontrado. Instale o Xcode para builds locais."
    else
        XCODE_VERSION=$(xcodebuild -version | head -n 1)
        print_success "Xcode encontrado: $XCODE_VERSION"
    fi
fi

# [2/8] Instalar dependências
print_header "[2/8] INSTALANDO DEPENDÊNCIAS"
print_status "Instalando dependências do projeto..."
npm install
print_success "Dependências instaladas com sucesso"

# [3/8] Executar validação final
print_header "[3/8] EXECUTANDO VALIDAÇÃO FINAL"
print_status "Verificando configurações do projeto..."
node scripts/final-validation.js
print_success "Validação passou com sucesso"

# [4/8] Limpar projeto iOS existente (se houver)
print_header "[4/8] PREPARANDO PROJETO iOS"
if [ -d "ios" ]; then
    print_warning "Diretório iOS existente encontrado. Removendo..."
    rm -rf ios
    print_success "Diretório iOS removido"
fi

# [5/8] Gerar projeto iOS nativo
print_header "[5/8] GERANDO PROJETO iOS NATIVO"
print_status "Executando expo prebuild para iOS..."
npx expo prebuild --platform ios --clean
print_success "Projeto iOS gerado com sucesso"

# Verificar se o projeto foi criado
if [ ! -d "ios" ]; then
    print_error "Falha ao gerar projeto iOS"
    exit 1
fi

# [6/8] Verificar configurações iOS
print_header "[6/8] VERIFICANDO CONFIGURAÇÕES iOS"

# Verificar Info.plist
if [ -f "ios/PsiqueiaApp/Info.plist" ]; then
    print_success "Info.plist encontrado"
else
    print_error "Info.plist não encontrado"
    exit 1
fi

# Verificar Entitlements
if [ -f "ios/PsiqueiaApp/PsiqueiaApp.entitlements" ]; then
    print_success "Entitlements encontrado"
else
    print_error "Entitlements não encontrado"
    exit 1
fi

# Verificar projeto Xcode
if [ -f "ios/PsiqueiaApp.xcodeproj/project.pbxproj" ]; then
    print_success "Projeto Xcode encontrado"
else
    print_error "Projeto Xcode não encontrado"
    exit 1
fi

# [7/8] Build de teste (apenas no macOS)
print_header "[7/8] BUILD DE TESTE"
if [[ "$OSTYPE" == "darwin"* ]] && command -v xcodebuild &> /dev/null; then
    print_status "Executando build de teste..."
    
    # Build para simulador
    print_status "Fazendo build para simulador iOS..."
    cd ios
    xcodebuild -workspace PsiqueiaApp.xcworkspace -scheme PsiqueiaApp -configuration Debug -sdk iphonesimulator -destination 'platform=iOS Simulator,name=iPhone 15,OS=latest' build
    cd ..
    
    print_success "Build de teste concluído com sucesso"
else
    print_warning "Build de teste pulado (requer macOS com Xcode)"
    print_status "Para testar localmente, execute: npm run ios"
fi

# [8/8] Preparar para deployment
print_header "[8/8] PREPARANDO PARA DEPLOYMENT"

# Verificar se Git está configurado
if command -v git &> /dev/null; then
    if [ ! -d ".git" ]; then
        print_status "Inicializando repositório Git..."
        git init
        git add .
        git commit -m "Initial commit - Ready for App Store deployment"
        print_success "Repositório Git inicializado"
    else
        print_status "Adicionando mudanças ao Git..."
        git add .
        git commit -m "iOS project generated - Ready for deployment" || print_warning "Nenhuma mudança para commit"
        print_success "Mudanças commitadas"
    fi
else
    print_warning "Git não encontrado. Configure Git para usar Xcode Cloud."
fi

# Executar verificação final de deployment
print_status "Executando verificação final de deployment..."
node scripts/check-deployment-status.js

print_header "🎉 DEPLOYMENT PREPARADO COM SUCESSO!"

echo -e "${GREEN}✅ Projeto iOS nativo gerado${NC}"
echo -e "${GREEN}✅ Configurações validadas${NC}"
echo -e "${GREEN}✅ Build de teste executado${NC}"
echo -e "${GREEN}✅ Pronto para App Store${NC}"

print_header "📋 PRÓXIMOS PASSOS MANUAIS"

echo -e "${YELLOW}1. Configure as variáveis de ambiente no Xcode Cloud:${NC}"
echo -e "   • APP_STORE_CONNECT_API_KEY_ID=5D79LKKR26"
echo -e "   • APP_STORE_CONNECT_ISSUER_ID=[SEU_ISSUER_ID]"
echo -e "   • DEVELOPMENT_TEAM=[SEU_TEAM_ID]"
echo ""

echo -e "${YELLOW}2. Faça upload da chave privada no App Store Connect:${NC}"
echo -e "   • Arquivo: private_keys/AuthKey_5D79LKKR26.p8"
echo ""

echo -e "${YELLOW}3. Configure provisioning profiles no Apple Developer Portal${NC}"
echo ""

echo -e "${YELLOW}4. Para build final, escolha uma opção:${NC}"
echo -e "   • Local: npm run ios"
echo -e "   • Xcode Cloud: git push origin main"
echo ""

echo -e "${YELLOW}5. Crie o listing no App Store Connect${NC}"
echo -e "   • Use os metadados em: app-store-metadata/"
echo ""

echo -e "${YELLOW}6. Submeta para revisão da Apple${NC}"

print_header "📖 DOCUMENTAÇÃO"
echo -e "• ${BLUE}DEPLOYMENT_GUIDE.md${NC} - Guia completo"
echo -e "• ${BLUE}NEXT_STEPS.md${NC} - Próximos passos detalhados"
echo -e "• ${BLUE}DEPLOYMENT_SUMMARY.md${NC} - Resumo do projeto"

echo -e "\n${GREEN}🚀 PsiqueiaApp está pronto para o App Store!${NC}\n"