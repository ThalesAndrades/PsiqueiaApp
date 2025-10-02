@echo off
cls
echo.
echo ========================================
echo    🚀 PsiqueIA - TESTE DIRETO
echo ========================================
echo.
echo 📱 VOCÊ JÁ TEM O EXPO GO ABERTO - PERFEITO!
echo.
echo ⏳ Iniciando servidor...
echo    (Pode demorar 30-60 segundos)
echo.

cd /d "C:\Users\Thales\Desktop\Psiqueia Oficial"

REM Usar npx diretamente sem verificações
npx expo start --tunnel --clear

echo.
echo ✅ Pronto para escanear!
pause