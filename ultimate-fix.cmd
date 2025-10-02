@echo off
cls
echo.
echo ========================================
echo    🎯 PsiqueIA - CORREÇÃO DEFINITIVA
echo ========================================
echo.

echo [1/3] Instalação limpa das dependências...
echo    ⏳ Isso pode demorar alguns minutos...
call npm install --legacy-peer-deps --no-audit --no-fund --silent

if %errorlevel% neq 0 (
    echo ❌ Erro na instalação
    pause
    exit /b 1
)

echo ✅ Dependências instaladas com sucesso!
echo.

echo [2/3] Verificando instalação...
if not exist node_modules\expo (
    echo ❌ Expo não encontrado
    pause
    exit /b 1
)

echo ✅ Expo encontrado!
echo.

echo [3/3] Iniciando servidor...
echo.
echo 🚀 PsiqueIA INICIANDO!
echo.
echo 📱 Para iPhone:
echo    1. Abra o Expo Go
echo    2. Escaneie o QR code
echo.
echo 💻 Para PC:
echo    O navegador abrirá automaticamente
echo.

node_modules\.bin\expo start --web --tunnel --clear

pause