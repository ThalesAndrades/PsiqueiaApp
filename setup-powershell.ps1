Write-Host "========================================" -ForegroundColor Cyan
Write-Host "    PSIQUEIA APP - SETUP WINDOWS" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Função para verificar comandos
function Test-Command($cmdname) {
    return [bool](Get-Command -Name $cmdname -ErrorAction SilentlyContinue)
}

# [1/6] Verificar Node.js
Write-Host "[1/6] Verificando Node.js..." -ForegroundColor Yellow
if (Test-Command "node") {
    $nodeVersion = node --version
    Write-Host "✅ Node.js encontrado: $nodeVersion" -ForegroundColor Green
} else {
    Write-Host "❌ Node.js não encontrado. Instale o Node.js primeiro." -ForegroundColor Red
    Write-Host "   Download: https://nodejs.org/" -ForegroundColor Yellow
    Read-Host "Pressione Enter para sair"
    exit 1
}

Write-Host ""

# [2/6] Verificar npm
Write-Host "[2/6] Verificando npm..." -ForegroundColor Yellow
if (Test-Command "npm") {
    $npmVersion = npm --version
    Write-Host "✅ npm encontrado: $npmVersion" -ForegroundColor Green
} else {
    Write-Host "❌ npm não encontrado" -ForegroundColor Red
    Read-Host "Pressione Enter para sair"
    exit 1
}

Write-Host ""

# [3/6] Instalar dependências
Write-Host "[3/6] Instalando dependências..." -ForegroundColor Yellow
try {
    npm install
    Write-Host "✅ Dependências instaladas" -ForegroundColor Green
} catch {
    Write-Host "❌ Erro ao instalar dependências" -ForegroundColor Red
    Read-Host "Pressione Enter para sair"
    exit 1
}

Write-Host ""

# [4/6] Verificar configurações iOS
Write-Host "[4/6] Verificando configurações iOS..." -ForegroundColor Yellow
if (Test-Path "ios\PsiqueiaApp\Info.plist") {
    Write-Host "✅ Info.plist encontrado" -ForegroundColor Green
} else {
    Write-Host "⚠️  Info.plist não encontrado - será criado pelo prebuild" -ForegroundColor Yellow
}

if (Test-Path "ios\PsiqueiaApp\PsiqueiaApp.entitlements") {
    Write-Host "✅ Entitlements encontrado" -ForegroundColor Green
} else {
    Write-Host "⚠️  Entitlements não encontrado - será criado pelo prebuild" -ForegroundColor Yellow
}

Write-Host ""

# [5/6] Executar validação final
Write-Host "[5/6] Executando validação final..." -ForegroundColor Yellow
try {
    node scripts\final-validation.js
    Write-Host "✅ Validação passou" -ForegroundColor Green
} catch {
    Write-Host "❌ Validação falhou" -ForegroundColor Red
    Read-Host "Pressione Enter para sair"
    exit 1
}

Write-Host ""

# [6/6] Verificar arquivos críticos
Write-Host "[6/6] Verificando arquivos críticos..." -ForegroundColor Yellow

$criticalFiles = @(
    @{Path = "app.json"; Name = "app.json"},
    @{Path = ".xcode-cloud.yml"; Name = ".xcode-cloud.yml"},
    @{Path = "private_keys\AuthKey_5D79LKKR26.p8"; Name = "Chave privada da API"},
    @{Path = "DEPLOYMENT_GUIDE.md"; Name = "Guia de deployment"},
    @{Path = "app-store-metadata\app-store-info.json"; Name = "Metadados da App Store"}
)

foreach ($file in $criticalFiles) {
    if (Test-Path $file.Path) {
        Write-Host "✅ $($file.Name)" -ForegroundColor Green
    } else {
        Write-Host "❌ $($file.Name) não encontrado" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "           SETUP CONCLUÍDO" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "✅ Projeto configurado com sucesso!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 PRÓXIMOS PASSOS:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Configure as variáveis de ambiente no Xcode Cloud:" -ForegroundColor White
Write-Host "   - APP_STORE_CONNECT_API_KEY_ID=5D79LKKR26" -ForegroundColor Gray
Write-Host "   - APP_STORE_CONNECT_ISSUER_ID=seu_issuer_id" -ForegroundColor Gray
Write-Host "   - DEVELOPMENT_TEAM=seu_team_id" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Faça upload da chave privada no App Store Connect" -ForegroundColor White
Write-Host ""
Write-Host "3. Configure provisioning profiles no Apple Developer Portal" -ForegroundColor White
Write-Host ""
Write-Host "4. Execute build de teste:" -ForegroundColor White
Write-Host "   - Local: npm run ios (requer macOS)" -ForegroundColor Gray
Write-Host "   - Xcode Cloud: git push origin main" -ForegroundColor Gray
Write-Host ""
Write-Host "5. Submeta para revisão da Apple" -ForegroundColor White
Write-Host ""
Write-Host "📖 Consulte DEPLOYMENT_GUIDE.md para instruções detalhadas" -ForegroundColor Cyan
Write-Host ""

Read-Host "Pressione Enter para continuar"