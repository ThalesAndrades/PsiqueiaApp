@echo off
echo.
echo ========================================
echo    PsiqueIA - Quick Start (Expo Go)
echo ========================================
echo.

echo [1/3] Verificando projeto...
if not exist "package.json" (
    echo ERRO: package.json nao encontrado!
    pause
    exit /b 1
)

echo ✅ Projeto encontrado
echo.

echo [2/3] Instalando dependencias (se necessario)...
call npm install
if %errorlevel% neq 0 (
    echo ERRO: Falha ao instalar dependencias!
    pause
    exit /b 1
)
echo ✅ Dependencias OK
echo.

echo [3/3] Iniciando servidor de desenvolvimento...
echo.
echo ========================================
echo        SERVIDOR INICIANDO...
echo ========================================
echo.
echo 📱 Para testar no iPhone:
echo 1. Instale o app "Expo Go" na App Store
echo 2. Escaneie o QR code que aparecera
echo 3. O app abrira automaticamente
echo.
echo 💻 Para testar no simulador:
echo 1. Pressione 'i' para iOS simulator
echo 2. Pressione 'a' para Android emulator
echo.
echo ⚠️  Para parar o servidor: Ctrl+C
echo.

call npx expo start
if %errorlevel% neq 0 (
    echo.
    echo ERRO: Falha ao iniciar servidor!
    echo.
    echo Possiveis solucoes:
    echo - Instale o Expo CLI: npm install -g @expo/cli
    echo - Limpe o cache: npx expo start --clear
    echo - Verifique se a porta 8081 esta livre
    pause
    exit /b 1
)

echo.
echo Servidor encerrado.
pause