@echo off
cls
echo.
echo ========================================
echo    🔧 PsiqueIA - CORRIGINDO AJV
echo ========================================
echo.

echo [1/3] Removendo ajv-keywords problemático...
if exist node_modules\ajv-keywords (
    rmdir /s /q node_modules\ajv-keywords
    echo ✓ Removido
) else (
    echo ✓ Já removido
)

echo.
echo [2/3] Reinstalando ajv-keywords...
call npm install ajv-keywords@5.1.0 --legacy-peer-deps --no-audit --no-fund

echo.
echo [3/3] Iniciando Expo...
echo.
echo 📱 AGORA SIM! Servidor iniciando...
echo    1. Escaneie o QR code com Expo Go (iPhone)
echo    2. OU abra no Expo do PC
echo.

npx expo start --tunnel --clear

pause