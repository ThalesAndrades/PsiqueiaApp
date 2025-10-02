Write-Host "========================================"
Write-Host "    PSIQUEIA APP - SETUP WINDOWS"
Write-Host "========================================"
Write-Host ""

# Funcao para verificar comandos
function Test-Command($cmdname) {
    return [bool](Get-Command -Name $cmdname -ErrorAction SilentlyContinue)
}

# [1/6] Verificar Node.js
Write-Host "[1/6] Verificando Node.js..."
if (Test-Command "node") {
    $nodeVersion = node --version
    Write-Host "OK Node.js encontrado: $nodeVersion"
} else {
    Write-Host "ERRO Node.js nao encontrado. Instale o Node.js primeiro."
    Write-Host "   Download: https://nodejs.org/"
    Read-Host "Pressione Enter para sair"
    exit 1
}

Write-Host ""

# [2/6] Verificar npm
Write-Host "[2/6] Verificando npm..."
if (Test-Command "npm") {
    $npmVersion = npm --version
    Write-Host "OK npm encontrado: $npmVersion"
} else {
    Write-Host "ERRO npm nao encontrado"
    Read-Host "Pressione Enter para sair"
    exit 1
}

Write-Host ""

# [3/6] Instalar dependencias
Write-Host "[3/6] Instalando dependencias..."
try {
    npm install
    Write-Host "OK Dependencias instaladas"
} catch {
    Write-Host "ERRO ao instalar dependencias"
    Read-Host "Pressione Enter para sair"
    exit 1
}

Write-Host ""

# [4/6] Verificar configuracoes iOS
Write-Host "[4/6] Verificando configuracoes iOS..."
if (Test-Path "ios\PsiqueiaApp\Info.plist") {
    Write-Host "OK Info.plist encontrado"
} else {
    Write-Host "AVISO Info.plist nao encontrado - sera criado pelo prebuild"
}

if (Test-Path "ios\PsiqueiaApp\PsiqueiaApp.entitlements") {
    Write-Host "OK Entitlements encontrado"
} else {
    Write-Host "AVISO Entitlements nao encontrado - sera criado pelo prebuild"
}

Write-Host ""

# [5/6] Executar validacao final
Write-Host "[5/6] Executando validacao final..."
try {
    node scripts\final-validation.js
    Write-Host "OK Validacao passou"
} catch {
    Write-Host "ERRO Validacao falhou"
    Read-Host "Pressione Enter para sair"
    exit 1
}

Write-Host ""

# [6/6] Verificar arquivos criticos
Write-Host "[6/6] Verificando arquivos criticos..."

if (Test-Path "app.json") {
    Write-Host "OK app.json"
} else {
    Write-Host "ERRO app.json nao encontrado"
}

if (Test-Path ".xcode-cloud.yml") {
    Write-Host "OK .xcode-cloud.yml"
} else {
    Write-Host "ERRO .xcode-cloud.yml nao encontrado"
}

if (Test-Path "private_keys\AuthKey_5D79LKKR26.p8") {
    Write-Host "OK Chave privada da API"
} else {
    Write-Host "ERRO Chave privada da API nao encontrada"
}

if (Test-Path "DEPLOYMENT_GUIDE.md") {
    Write-Host "OK Guia de deployment"
} else {
    Write-Host "ERRO Guia de deployment nao encontrado"
}

Write-Host ""
Write-Host "========================================"
Write-Host "           SETUP CONCLUIDO"
Write-Host "========================================"
Write-Host ""
Write-Host "OK Projeto configurado com sucesso!"
Write-Host ""
Write-Host "PROXIMOS PASSOS:"
Write-Host ""
Write-Host "1. Configure as variaveis de ambiente no Xcode Cloud:"
Write-Host "   - APP_STORE_CONNECT_API_KEY_ID=5D79LKKR26"
Write-Host "   - APP_STORE_CONNECT_ISSUER_ID=seu_issuer_id"
Write-Host "   - DEVELOPMENT_TEAM=seu_team_id"
Write-Host ""
Write-Host "2. Faca upload da chave privada no App Store Connect"
Write-Host ""
Write-Host "3. Configure provisioning profiles no Apple Developer Portal"
Write-Host ""
Write-Host "4. Execute build de teste:"
Write-Host "   - Local: npm run ios (requer macOS)"
Write-Host "   - Xcode Cloud: git push origin main"
Write-Host ""
Write-Host "5. Submeta para revisao da Apple"
Write-Host ""
Write-Host "Consulte DEPLOYMENT_GUIDE.md para instrucoes detalhadas"
Write-Host ""

Read-Host "Pressione Enter para continuar"