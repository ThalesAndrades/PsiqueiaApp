@echo off
title PsiqueIA - Solucao Definitiva
color 0A

echo ========================================
echo    PSIQUEIA - SOLUCAO DEFINITIVA
echo ========================================
echo.

echo [ETAPA 1] Verificando ambiente...
if not exist "package.json" (
    echo ✗ Erro: package.json nao encontrado
    pause
    exit /b 1
)
echo ✓ Projeto encontrado

echo.
echo [ETAPA 2] Limpando instalacao anterior...
if exist "node_modules\ajv-keywords" (
    rd /s /q "node_modules\ajv-keywords"
    echo ✓ ajv-keywords removido
)

echo.
echo [ETAPA 3] Reinstalando dependencias...
echo Aguarde... isso pode levar alguns minutos
call npm install --force --legacy-peer-deps --no-audit --no-fund
if %errorlevel% neq 0 (
    echo ✗ Erro na instalacao
    echo Tentando metodo alternativo...
    call npm ci --legacy-peer-deps
)

echo.
echo [ETAPA 4] Verificando instalacao...
if exist "node_modules\expo" (
    echo ✓ Expo instalado com sucesso
) else (
    echo ✗ Expo nao encontrado
    pause
    exit /b 1
)

if exist "node_modules\getenv" (
    echo ✓ getenv instalado
) else (
    echo Instalando getenv...
    call npm install getenv --legacy-peer-deps
)

echo.
echo ========================================
echo    INICIANDO PSIQUEIA
echo ========================================
echo.
echo 📱 IPHONE: Abra o Expo Go e escaneie o QR code
echo 💻 PC: Acesse http://localhost:8081
echo 🌐 TUNNEL: URL sera exibida abaixo
echo.
echo Iniciando servidor...

call npx expo start --web --tunnel --clear

echo.
echo ✓ PsiqueIA iniciado com sucesso!
echo Pressione qualquer tecla para sair...
pause >nul