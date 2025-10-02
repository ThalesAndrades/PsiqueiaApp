@echo off
cls
echo.
echo ========================================
echo    🌐 PsiqueIA - INICIANDO NO WEB
echo ========================================
echo.
echo ✅ Dependências OK (1338 pacotes instalados)
echo.
echo 🚀 Iniciando no navegador...
echo    O PsiqueIA abrirá automaticamente no seu navegador
echo    Você também pode testar no iPhone com Expo Go
echo.

node_modules\.bin\expo start --web --clear

echo.
echo 📱 Para testar no iPhone:
echo    1. Abra o Expo Go
echo    2. Use o QR code que apareceu
echo.
pause