@echo off
echo ========================================
echo    PSIQUEIA - INSTALAÇÃO LIMPA FINAL
echo ========================================
echo.

echo [1/5] Limpando cache do npm...
call npm cache clean --force

echo.
echo [2/5] Removendo package-lock.json...
if exist package-lock.json del package-lock.json

echo.
echo [3/5] Instalando dependências (pode demorar alguns minutos)...
call npm install --legacy-peer-deps --no-audit --no-fund

echo.
echo [4/5] Verificando instalação do Expo...
if exist node_modules\expo (
    echo ✓ Expo instalado com sucesso!
) else (
    echo ✗ Erro na instalação do Expo
    pause
    exit /b 1
)

echo.
echo [5/5] Iniciando PsiqueIA...
echo ✓ Abrindo no navegador: http://localhost:8081
echo ✓ Para iPhone: Use o Expo Go e escaneie o QR code
echo.

call npx expo start --web --tunnel --clear

echo.
echo ✓ PsiqueIA iniciado com sucesso!
echo ✓ Acesse: http://localhost:8081
pause