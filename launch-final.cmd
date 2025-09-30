@echo off
echo ========================================
echo      PSIQUEIA - LANÇAMENTO FINAL
echo ========================================
echo.

echo [1/3] Verificando instalação...
if not exist node_modules (
    echo ✗ node_modules não encontrado!
    echo Execute: clean-install.cmd primeiro
    pause
    exit /b 1
)

if not exist node_modules\expo (
    echo ✗ Expo não encontrado!
    echo Execute: clean-install.cmd primeiro
    pause
    exit /b 1
)

echo ✓ Instalação verificada!
echo.

echo [2/3] Instalando getenv se necessário...
if not exist node_modules\getenv (
    echo Instalando getenv...
    call npm install getenv --legacy-peer-deps --no-audit --no-fund
)

echo ✓ Dependências completas!
echo.

echo [3/3] Iniciando PsiqueIA...
echo.
echo 🚀 PSIQUEIA ESTÁ INICIANDO!
echo.
echo 📱 Para iPhone:
echo    1. Abra o Expo Go
echo    2. Escaneie o QR code que aparecerá
echo.
echo 💻 Para PC:
echo    1. Será aberto automaticamente no navegador
echo    2. Acesse: http://localhost:8081
echo.

call npx expo start --web --tunnel --clear

echo.
echo ✓ PsiqueIA finalizado!
pause