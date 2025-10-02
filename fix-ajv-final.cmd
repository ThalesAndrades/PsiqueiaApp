@echo off
echo ========================================
echo    CORRECAO DEFINITIVA AJV-KEYWORDS
echo ========================================
echo.

echo [1/5] Parando processos Node...
taskkill /f /im node.exe 2>nul
taskkill /f /im npm.exe 2>nul
timeout /t 2 >nul

echo [2/5] Removendo ajv-keywords problematico...
if exist "node_modules\ajv-keywords" (
    rmdir /s /q "node_modules\ajv-keywords"
    echo ✓ ajv-keywords removido
) else (
    echo ✓ ajv-keywords ja nao existe
)

echo [3/5] Limpando cache npm...
npm cache clean --force

echo [4/5] Reinstalando dependencias sem ajv-keywords...
npm install --force --legacy-peer-deps --no-audit --no-fund

echo [5/5] Verificando instalacao...
if exist "node_modules\expo" (
    echo ✓ Expo instalado com sucesso
) else (
    echo ✗ Erro na instalacao do Expo
    pause
    exit /b 1
)

echo.
echo ========================================
echo    INICIANDO PSIQUEIA
echo ========================================
echo.
echo 📱 Para iPhone: Abra o Expo Go e escaneie o QR code
echo 💻 Para PC: Acesse http://localhost:8081
echo.

npx expo start --web --tunnel --clear

echo.
echo PsiqueIA iniciado com sucesso!
pause