@echo off
title PsiqueIA - Iniciando (Ignorando Erros)
color 0A

echo ========================================
echo    PSIQUEIA - INICIO FORCADO
echo ========================================
echo.
echo Tentando iniciar mesmo com erros...
echo.

echo 📱 IPHONE: Abra o Expo Go e escaneie o QR code
echo 💻 PC: Acesse http://localhost:8081
echo 🌐 TUNNEL: URL sera exibida abaixo
echo.

echo Iniciando servidor (ignorando erros)...
call npx expo start --web --tunnel --clear 2>nul || (
    echo.
    echo Tentando sem tunnel...
    call npx expo start --web --clear 2>nul || (
        echo.
        echo Tentando modo basico...
        call npx expo start --clear
    )
)

echo.
echo Se chegou ate aqui, o servidor pode estar rodando!
echo Verifique: http://localhost:8081
pause