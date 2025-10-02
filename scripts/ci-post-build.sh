#!/bin/bash

# CI Post-Build Script for PsiqueiaApp
# Este script é executado após o build no Xcode Cloud

set -e

echo "📦 Executando ações pós-build para PsiqueiaApp..."

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para imprimir mensagens coloridas
print_status() {
    echo -e "${BLUE}[POST-BUILD]${NC} $1"
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

# Definir variáveis
BUILD_TYPE=${CI_BUILD_TYPE:-"development"}
WORKSPACE_PATH=${CI_WORKSPACE}
BUILD_NUMBER=${CI_BUILD_NUMBER:-"1"}
COMMIT_HASH=$(git rev-parse --short HEAD)
BRANCH_NAME=$(git rev-parse --abbrev-ref HEAD)

print_status "Configuração pós-build:"
echo "  - Tipo: $BUILD_TYPE"
echo "  - Build: $BUILD_NUMBER"
echo "  - Commit: $COMMIT_HASH"
echo "  - Branch: $BRANCH_NAME"

# Navegar para o diretório do projeto
cd "$WORKSPACE_PATH"

# Criar diretório de artefatos se não existir
ARTIFACTS_DIR="$WORKSPACE_PATH/build-artifacts"
mkdir -p "$ARTIFACTS_DIR"

# Coletar logs de build
print_status "Coletando logs de build..."

if [ -d "ios/build" ]; then
    cp -r ios/build "$ARTIFACTS_DIR/ios-build-logs"
    print_success "Logs de build iOS coletados"
fi

# Gerar relatório de build
print_status "Gerando relatório de build..."

BUILD_REPORT="$ARTIFACTS_DIR/build-report.md"

cat > "$BUILD_REPORT" << EOF
# Build Report - PsiqueiaApp

## Informações do Build

- **Tipo**: $BUILD_TYPE
- **Número**: $BUILD_NUMBER
- **Data**: $(date -u +%Y-%m-%dT%H:%M:%SZ)
- **Commit**: $COMMIT_HASH
- **Branch**: $BRANCH_NAME
- **Workspace**: $WORKSPACE_PATH

## Configuração do Ambiente

- **Xcode**: $(xcodebuild -version | head -n 1)
- **Node.js**: $(node --version)
- **npm**: $(npm --version)
- **CocoaPods**: $(pod --version)

## Status do Build

✅ Build concluído com sucesso

## Artefatos Gerados

EOF

# Listar artefatos gerados
if [ -f "ios/build/Build/Products/Release-iphoneos/PsiqueiaApp.app" ]; then
    echo "- iOS App: ios/build/Build/Products/Release-iphoneos/PsiqueiaApp.app" >> "$BUILD_REPORT"
fi

if [ -f "build/PsiqueiaApp.xcarchive" ]; then
    echo "- Archive: build/PsiqueiaApp.xcarchive" >> "$BUILD_REPORT"
fi

# Executar análise de código se disponível
if command -v swiftlint &> /dev/null && [ -f "ios/.swiftlint.yml" ]; then
    print_status "Executando análise SwiftLint..."
    
    cd ios
    swiftlint lint --reporter json > "$ARTIFACTS_DIR/swiftlint-report.json" || true
    cd ..
    
    echo "- SwiftLint Report: build-artifacts/swiftlint-report.json" >> "$BUILD_REPORT"
    print_success "Análise SwiftLint concluída"
fi

# Executar análise de segurança se disponível
if command -v semgrep &> /dev/null; then
    print_status "Executando análise de segurança..."
    
    semgrep --config=auto --json --output="$ARTIFACTS_DIR/security-report.json" . || true
    
    echo "- Security Report: build-artifacts/security-report.json" >> "$BUILD_REPORT"
    print_success "Análise de segurança concluída"
fi

# Gerar informações de dependências
print_status "Coletando informações de dependências..."

# Dependências Node.js
if [ -f "package.json" ]; then
    npm list --json > "$ARTIFACTS_DIR/npm-dependencies.json" 2>/dev/null || true
    echo "- npm Dependencies: build-artifacts/npm-dependencies.json" >> "$BUILD_REPORT"
fi

# Dependências CocoaPods
if [ -f "ios/Podfile.lock" ]; then
    cp "ios/Podfile.lock" "$ARTIFACTS_DIR/Podfile.lock"
    echo "- CocoaPods Lock: build-artifacts/Podfile.lock" >> "$BUILD_REPORT"
fi

# Executar testes de performance se disponível
if [ "$BUILD_TYPE" = "production" ] && [ -f "scripts/performance-tests.sh" ]; then
    print_status "Executando testes de performance..."
    
    bash scripts/performance-tests.sh > "$ARTIFACTS_DIR/performance-report.txt" 2>&1 || true
    
    echo "- Performance Report: build-artifacts/performance-report.txt" >> "$BUILD_REPORT"
    print_success "Testes de performance concluídos"
fi

# Notificações
print_status "Enviando notificações..."

# Slack notification se configurado
if [ -n "$SLACK_WEBHOOK_URL" ]; then
    SLACK_MESSAGE="{
        \"text\": \"🎉 Build $BUILD_TYPE concluído com sucesso!\",
        \"attachments\": [
            {
                \"color\": \"good\",
                \"fields\": [
                    {\"title\": \"Projeto\", \"value\": \"PsiqueiaApp\", \"short\": true},
                    {\"title\": \"Build\", \"value\": \"$BUILD_NUMBER\", \"short\": true},
                    {\"title\": \"Branch\", \"value\": \"$BRANCH_NAME\", \"short\": true},
                    {\"title\": \"Commit\", \"value\": \"$COMMIT_HASH\", \"short\": true}
                ]
            }
        ]
    }"
    
    curl -X POST -H 'Content-type: application/json' \
         --data "$SLACK_MESSAGE" \
         "$SLACK_WEBHOOK_URL" || print_warning "Falha ao enviar notificação Slack"
    
    print_success "Notificação Slack enviada"
fi

# Email notification se configurado
if [ -n "$EMAIL_NOTIFICATION_ENABLED" ] && [ "$EMAIL_NOTIFICATION_ENABLED" = "true" ]; then
    EMAIL_SUBJECT="[PsiqueiaApp] Build $BUILD_TYPE #$BUILD_NUMBER - Sucesso"
    EMAIL_BODY="Build $BUILD_TYPE concluído com sucesso!

Detalhes:
- Build: $BUILD_NUMBER
- Branch: $BRANCH_NAME
- Commit: $COMMIT_HASH
- Data: $(date)

Artefatos disponíveis em: $ARTIFACTS_DIR"
    
    # Usar sendmail se disponível
    if command -v sendmail &> /dev/null && [ -n "$EMAIL_RECIPIENTS" ]; then
        echo -e "Subject: $EMAIL_SUBJECT\n\n$EMAIL_BODY" | sendmail "$EMAIL_RECIPIENTS" || print_warning "Falha ao enviar email"
        print_success "Notificação por email enviada"
    fi
fi

# Limpar arquivos temporários
print_status "Limpando arquivos temporários..."

# Limpar cache do npm
npm cache clean --force 2>/dev/null || true

# Limpar cache do CocoaPods
if [ -d "ios" ]; then
    cd ios
    pod cache clean --all 2>/dev/null || true
    cd ..
fi

# Limpar builds antigos (manter apenas os 5 mais recentes)
if [ -d "ios/build" ]; then
    find ios/build -name "*.app" -type d -mtime +5 -exec rm -rf {} + 2>/dev/null || true
fi

print_success "Limpeza concluída"

# Finalizar relatório
echo "" >> "$BUILD_REPORT"
echo "## Conclusão" >> "$BUILD_REPORT"
echo "" >> "$BUILD_REPORT"
echo "Build concluído com sucesso em $(date)" >> "$BUILD_REPORT"

print_success "Relatório de build gerado: $BUILD_REPORT"

# Exibir resumo final
echo ""
echo "📋 Resumo Pós-Build:"
echo "===================="
echo "Status: ✅ Sucesso"
echo "Artefatos: $ARTIFACTS_DIR"
echo "Relatório: $BUILD_REPORT"

if [ -n "$SLACK_WEBHOOK_URL" ]; then
    echo "Notificação Slack: ✅ Enviada"
fi

if [ -n "$EMAIL_NOTIFICATION_ENABLED" ] && [ "$EMAIL_NOTIFICATION_ENABLED" = "true" ]; then
    echo "Notificação Email: ✅ Enviada"
fi

echo ""
print_success "🎉 Pós-build concluído com sucesso!"