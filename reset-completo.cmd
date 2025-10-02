@echo off
cls
echo.
echo ========================================
echo    🔄 PsiqueIA - RESET COMPLETO
echo ========================================
echo.

echo [1/5] Parando processos Node...
taskkill /f /im node.exe >nul 2>&1
taskkill /f /im npm.exe >nul 2>&1
timeout /t 2 >nul

echo [2/5] Limpando arquivos temporários...
if exist package-lock.json del package-lock.json
if exist pnpm-lock.yaml del pnpm-lock.yaml
if exist .expo rmdir /s /q .expo >nul 2>&1

echo [3/5] Removendo node_modules (pode demorar)...
if exist node_modules (
    echo    ⏳ Aguarde... removendo dependências antigas
    rmdir /s /q node_modules >nul 2>&1
    timeout /t 3 >nul
)

echo [4/5] Instalando dependências limpas...
echo    ⏳ Instalando com --legacy-peer-deps...
npm install --legacy-peer-deps --no-audit --no-fund

echo.
echo [5/5] Iniciando Expo...
echo.
echo 📱 AGORA VAI FUNCIONAR!
echo    1. Mantenha o Expo Go aberto
echo    2. Escaneie o QR code
echo    3. Teste o PsiqueIA!
echo.

npx expo start --tunnel --clear

pause