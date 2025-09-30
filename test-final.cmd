@echo off
echo.
echo ========================================
echo    PsiqueIA - Teste Final Completo
echo ========================================
echo.

echo [1/4] Limpando cache...
if exist node_modules (
    rmdir /s /q node_modules
    echo ✓ node_modules removido
)

if exist package-lock.json (
    del package-lock.json
    echo ✓ package-lock.json removido
)

echo.
echo [2/4] Instalando dependencias com --legacy-peer-deps...
call npm install --legacy-peer-deps
if %errorlevel% neq 0 (
    echo ❌ ERRO: Falha ao instalar dependencias!
    pause
    exit /b 1
)
echo ✓ Dependencias instaladas com sucesso

echo.
echo [3/4] Executando verificacoes do projeto...
call node ios-build-check.js
if %errorlevel% neq 0 (
    echo ⚠️ Algumas verificacoes falharam, mas continuando...
)

echo.
echo [4/4] Iniciando servidor Expo...
echo.
echo 📱 INSTRUÇÕES:
echo 1. Instale "Expo Go" no seu iPhone
echo 2. Escaneie o QR code que aparecera
echo 3. O app abrira automaticamente
echo.
echo ⏳ Iniciando servidor...
call npx expo start --tunnel

echo.
echo ✅ Teste concluido!
pause