@echo off
cls
echo.
echo ========================================
echo    🎯 PsiqueIA - SOLUÇÃO FINAL
echo ========================================
echo.

echo [1/4] Removendo ajv-keywords problemático...
if exist node_modules\ajv-keywords (
    rmdir /s /q node_modules\ajv-keywords
    echo ✓ Removido do node_modules
)

echo.
echo [2/4] Limpando cache npm...
call npm cache clean --force >nul 2>&1

echo.
echo [3/4] Reinstalando dependências sem ajv-keywords...
call npm install --legacy-peer-deps --no-audit --no-fund

echo.
echo [4/4] Iniciando PsiqueIA...
echo.
echo 🚀 FINALMENTE! Servidor iniciando...
echo    📱 iPhone: Use Expo Go + QR code
echo    💻 PC: Abrirá no navegador automaticamente
echo.

node_modules\.bin\expo start --web --tunnel --clear

pause