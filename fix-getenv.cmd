@echo off
echo ========================================
echo    PSIQUEIA - CORRIGINDO GETENV
echo ========================================
echo.

echo [1/2] Instalando módulo getenv faltante...
call npm install getenv --legacy-peer-deps --no-audit --no-fund

echo.
echo [2/2] Iniciando PsiqueIA...
echo ✓ Abrindo no navegador: http://localhost:8081
echo ✓ Para iPhone: Use o Expo Go e escaneie o QR code
echo.

call npx expo start --web --tunnel --clear

echo.
echo ✓ PsiqueIA iniciado com sucesso!
pause