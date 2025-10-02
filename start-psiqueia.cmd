@echo off
echo ========================================
echo         PSIQUEIA - INICIANDO
echo ========================================
echo.

echo ✓ Verificando instalação...
if not exist node_modules\expo (
    echo ✗ Expo não encontrado! Execute clean-install.cmd primeiro
    pause
    exit /b 1
)

echo ✓ Expo encontrado!
echo ✓ Iniciando servidor...
echo.
echo 📱 Para iPhone: Abra o Expo Go e escaneie o QR code
echo 💻 Para PC: Será aberto automaticamente no navegador
echo.

call npx expo start --web --tunnel --clear

pause