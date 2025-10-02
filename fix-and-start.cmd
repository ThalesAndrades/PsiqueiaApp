@echo off
echo.
echo ========================================
echo    PsiqueIA - Correção e Início
echo ========================================
echo.

echo [1/3] Corrigindo dependências problemáticas...
if exist node_modules\ajv-keywords (
    echo ✓ Removendo ajv-keywords problemático...
    rmdir /s /q node_modules\ajv-keywords
)

echo.
echo [2/3] Reinstalando dependência específica...
call npm install ajv-keywords@5.1.0 --legacy-peer-deps

echo.
echo [3/3] Iniciando Expo...
echo.
echo 📱 AGORA SIM! Instruções:
echo 1. Mantenha o Expo Go aberto no iPhone
echo 2. Aguarde o QR code aparecer
echo 3. Escaneie com o Expo Go
echo 4. O PsiqueIA abrirá!
echo.

call npx expo start --tunnel

pause