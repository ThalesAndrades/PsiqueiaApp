@echo off
cls
echo.
echo ========================================
echo    🚀 PsiqueIA - INICIANDO SERVIDOR
echo ========================================
echo.
echo ✅ Dependências instaladas com sucesso!
echo.
echo 📱 INSTRUÇÕES:
echo    1. Mantenha o Expo Go aberto no iPhone
echo    2. OU abra o Expo no PC
echo    3. Escaneie o QR code que aparecerá
echo    4. Teste o PsiqueIA!
echo.
echo 🔄 Iniciando servidor...
echo.

npx expo start --tunnel --clear

echo.
echo ⚠️  Se houver erro, pressione qualquer tecla para tentar novamente
pause >nul
goto :eof