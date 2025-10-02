@echo off
echo ========================================
echo    PSIQUEIA APP - SETUP WINDOWS
echo ========================================
echo.

echo [1/6] Verificando Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js não encontrado. Instale o Node.js primeiro.
    echo    Download: https://nodejs.org/
    pause
    exit /b 1
) else (
    echo ✅ Node.js encontrado
)

echo.
echo [2/6] Verificando npm...
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm não encontrado
    pause
    exit /b 1
) else (
    echo ✅ npm encontrado
)

echo.
echo [3/6] Instalando dependências...
npm install
if %errorlevel% neq 0 (
    echo ❌ Erro ao instalar dependências
    pause
    exit /b 1
) else (
    echo ✅ Dependências instaladas
)

echo.
echo [4/6] Verificando configurações iOS...
if exist "ios\PsiqueiaApp\Info.plist" (
    echo ✅ Info.plist encontrado
) else (
    echo ⚠️  Info.plist não encontrado - será criado pelo prebuild
)

if exist "ios\PsiqueiaApp\PsiqueiaApp.entitlements" (
    echo ✅ Entitlements encontrado
) else (
    echo ⚠️  Entitlements não encontrado - será criado pelo prebuild
)

echo.
echo [5/6] Executando validação final...
node scripts\final-validation.js
if %errorlevel% neq 0 (
    echo ❌ Validação falhou
    pause
    exit /b 1
) else (
    echo ✅ Validação passou
)

echo.
echo [6/6] Verificando arquivos críticos...
if exist "app.json" (
    echo ✅ app.json
) else (
    echo ❌ app.json não encontrado
)

if exist ".xcode-cloud.yml" (
    echo ✅ .xcode-cloud.yml
) else (
    echo ❌ .xcode-cloud.yml não encontrado
)

if exist "private_keys\AuthKey_5D79LKKR26.p8" (
    echo ✅ Chave privada da API
) else (
    echo ❌ Chave privada da API não encontrada
)

echo.
echo ========================================
echo           SETUP CONCLUÍDO
echo ========================================
echo.
echo ✅ Projeto configurado com sucesso!
echo.
echo 📋 PRÓXIMOS PASSOS:
echo.
echo 1. Configure as variáveis de ambiente no Xcode Cloud:
echo    - APP_STORE_CONNECT_API_KEY_ID=5D79LKKR26
echo    - APP_STORE_CONNECT_ISSUER_ID=seu_issuer_id
echo    - DEVELOPMENT_TEAM=seu_team_id
echo.
echo 2. Faça upload da chave privada no App Store Connect
echo.
echo 3. Configure provisioning profiles no Apple Developer Portal
echo.
echo 4. Execute build de teste:
echo    - Local: npm run ios (requer macOS)
echo    - Xcode Cloud: git push origin main
echo.
echo 5. Submeta para revisão da Apple
echo.
echo 📖 Consulte DEPLOYMENT_GUIDE.md para instruções detalhadas
echo.
pause