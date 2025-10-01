#!/bin/bash

# CI Build Script for PsiqueiaApp
# Este script é executado pelo Xcode Cloud durante o processo de build

set -e

echo "🔨 Iniciando build CI para PsiqueiaApp..."

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para imprimir mensagens coloridas
print_status() {
    echo -e "${BLUE}[CI-BUILD]${NC} $1"
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

# Verificar variáveis de ambiente necessárias
print_status "Verificando variáveis de ambiente..."

required_vars=(
    "CI_WORKSPACE"
    "CI_PRODUCT_BUNDLE_IDENTIFIER"
)

for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
        print_error "Variável de ambiente $var não está definida"
        exit 1
    fi
done

print_success "Variáveis de ambiente verificadas"

# Definir variáveis do build
BUILD_TYPE=${CI_BUILD_TYPE:-"development"}
SCHEME_NAME=${CI_SCHEME:-"PsiqueiaApp"}
WORKSPACE_PATH=${CI_WORKSPACE}

print_status "Configuração do build:"
echo "  - Tipo: $BUILD_TYPE"
echo "  - Scheme: $SCHEME_NAME"
echo "  - Workspace: $WORKSPACE_PATH"

# Navegar para o diretório do projeto
cd "$CI_WORKSPACE"

# Verificar se o Node.js está disponível
if ! command -v node &> /dev/null; then
    print_error "Node.js não está disponível no ambiente CI"
    exit 1
fi

print_status "Node.js versão: $(node --version)"
print_status "npm versão: $(npm --version)"

# Instalar dependências Node.js
print_status "Instalando dependências Node.js..."
npm ci --production=false

# Verificar se o Expo CLI está disponível
if ! command -v npx expo &> /dev/null; then
    print_status "Instalando Expo CLI..."
    npm install -g @expo/cli
fi

# Gerar arquivos nativos se necessário
if [ ! -d "ios" ] || [ "$BUILD_TYPE" = "clean" ]; then
    print_status "Gerando arquivos nativos iOS..."
    npx expo prebuild --platform ios --clean
else
    print_status "Arquivos nativos iOS já existem, pulando geração"
fi

# Navegar para o diretório iOS
cd ios

# Verificar se CocoaPods está disponível
if ! command -v pod &> /dev/null; then
    print_error "CocoaPods não está disponível no ambiente CI"
    exit 1
fi

print_status "CocoaPods versão: $(pod --version)"

# Instalar dependências CocoaPods
print_status "Instalando dependências CocoaPods..."
pod install --repo-update --verbose

# Verificar se o workspace foi criado
if [ ! -f "$SCHEME_NAME.xcworkspace" ]; then
    print_error "Workspace $SCHEME_NAME.xcworkspace não foi encontrado"
    exit 1
fi

print_success "Workspace encontrado: $SCHEME_NAME.xcworkspace"

# Limpar build anterior se necessário
if [ "$BUILD_TYPE" = "clean" ] || [ "$BUILD_TYPE" = "production" ]; then
    print_status "Limpando builds anteriores..."
    xcodebuild clean -workspace "$SCHEME_NAME.xcworkspace" -scheme "$SCHEME_NAME"
fi

# Configurar destino do build baseado no tipo
case $BUILD_TYPE in
    "development")
        DESTINATION="generic/platform=iOS Simulator"
        CONFIGURATION="Debug"
        ;;
    "production")
        DESTINATION="generic/platform=iOS"
        CONFIGURATION="Release"
        ;;
    "test")
        DESTINATION="platform=iOS Simulator,name=iPhone 15"
        CONFIGURATION="Debug"
        ;;
    *)
        DESTINATION="generic/platform=iOS Simulator"
        CONFIGURATION="Debug"
        ;;
esac

print_status "Configuração do build:"
echo "  - Destino: $DESTINATION"
echo "  - Configuração: $CONFIGURATION"

# Executar build
print_status "Executando build..."

if [ "$BUILD_TYPE" = "test" ]; then
    # Executar testes
    print_status "Executando testes..."
    xcodebuild test \
        -workspace "$SCHEME_NAME.xcworkspace" \
        -scheme "$SCHEME_NAME" \
        -destination "$DESTINATION" \
        -configuration "$CONFIGURATION" \
        CODE_SIGN_IDENTITY="" \
        CODE_SIGNING_REQUIRED=NO \
        ONLY_ACTIVE_ARCH=NO
else
    # Executar build normal
    xcodebuild build \
        -workspace "$SCHEME_NAME.xcworkspace" \
        -scheme "$SCHEME_NAME" \
        -destination "$DESTINATION" \
        -configuration "$CONFIGURATION" \
        ONLY_ACTIVE_ARCH=NO
fi

BUILD_EXIT_CODE=$?

if [ $BUILD_EXIT_CODE -eq 0 ]; then
    print_success "Build concluído com sucesso!"
else
    print_error "Build falhou com código de saída: $BUILD_EXIT_CODE"
    exit $BUILD_EXIT_CODE
fi

# Executar archive para builds de produção
if [ "$BUILD_TYPE" = "production" ]; then
    print_status "Criando archive para distribuição..."
    
    ARCHIVE_PATH="$CI_WORKSPACE/build/PsiqueiaApp.xcarchive"
    
    xcodebuild archive \
        -workspace "$SCHEME_NAME.xcworkspace" \
        -scheme "$SCHEME_NAME" \
        -configuration "$CONFIGURATION" \
        -archivePath "$ARCHIVE_PATH" \
        ONLY_ACTIVE_ARCH=NO
    
    ARCHIVE_EXIT_CODE=$?
    
    if [ $ARCHIVE_EXIT_CODE -eq 0 ]; then
        print_success "Archive criado com sucesso: $ARCHIVE_PATH"
    else
        print_error "Falha ao criar archive com código de saída: $ARCHIVE_EXIT_CODE"
        exit $ARCHIVE_EXIT_CODE
    fi
fi

# Coletar informações do build
print_status "Coletando informações do build..."

BUILD_INFO_FILE="$CI_WORKSPACE/build-info.json"

cat > "$BUILD_INFO_FILE" << EOF
{
  "build_type": "$BUILD_TYPE",
  "scheme": "$SCHEME_NAME",
  "configuration": "$CONFIGURATION",
  "destination": "$DESTINATION",
  "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "git_commit": "$(git rev-parse HEAD)",
  "git_branch": "$(git rev-parse --abbrev-ref HEAD)",
  "node_version": "$(node --version)",
  "npm_version": "$(npm --version)",
  "cocoapods_version": "$(pod --version)",
  "xcode_version": "$(xcodebuild -version | head -n 1)"
}
EOF

print_success "Informações do build salvas em: $BUILD_INFO_FILE"

# Executar testes de qualidade de código se disponível
if [ -f "../package.json" ] && grep -q "lint" "../package.json"; then
    print_status "Executando verificações de qualidade de código..."
    cd ..
    npm run lint || print_warning "Verificações de lint falharam"
    cd ios
fi

print_success "🎉 Build CI concluído com sucesso!"

# Exibir resumo
echo ""
echo "📋 Resumo do Build:"
echo "==================="
echo "Tipo: $BUILD_TYPE"
echo "Scheme: $SCHEME_NAME"
echo "Configuração: $CONFIGURATION"
echo "Status: ✅ Sucesso"
echo "Timestamp: $(date)"

if [ "$BUILD_TYPE" = "production" ] && [ -f "$ARCHIVE_PATH" ]; then
    echo "Archive: $ARCHIVE_PATH"
fi

echo ""
print_status "Build CI finalizado."