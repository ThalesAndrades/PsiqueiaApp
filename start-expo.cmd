@echo off
echo.
echo ========================================
echo    PsiqueIA - Iniciando Expo Go
echo ========================================
echo.

echo 📱 INSTRUÇÕES:
echo 1. Mantenha o Expo Go aberto no seu iPhone
echo 2. Aguarde o QR code aparecer abaixo
echo 3. Escaneie o QR code com o Expo Go
echo 4. O app PsiqueIA abrirá automaticamente!
echo.

echo ⏳ Iniciando servidor Expo...
echo.

call npx expo start --tunnel

echo.
echo ✅ Servidor iniciado!
pause