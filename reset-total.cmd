@echo off
title PsiqueIA - Reset Total
color 0C

echo ========================================
echo    PSIQUEIA - RESET TOTAL
echo ========================================
echo.
echo ATENCAO: Este script vai resetar TUDO!
echo Pressione CTRL+C para cancelar ou
pause

echo.
echo [1/6] Parando todos os processos Node...
taskkill /f /im node.exe 2>nul
taskkill /f /im npm.exe 2>nul
taskkill /f /im npx.exe 2>nul
timeout /t 3 >nul

echo [2/6] Removendo node_modules completamente...
if exist "node_modules" (
    echo Removendo node_modules... (pode demorar)
    rd /s /q "node_modules"
    echo ✓ node_modules removido
)

echo [3/6] Removendo package-lock.json...
if exist "package-lock.json" (
    del "package-lock.json"
    echo ✓ package-lock.json removido
)

echo [4/6] Limpando cache npm...
call npm cache clean --force
call npm cache verify

echo [5/6] Instalacao limpa (sem ajv-keywords)...
echo Criando .npmrc temporario...
echo legacy-peer-deps=true > .npmrc
echo audit=false >> .npmrc
echo fund=false >> .npmrc

echo Instalando dependencias...
call npm install
if %errorlevel% neq 0 (
    echo Tentando com --force...
    call npm install --force
)

echo Instalando getenv separadamente...
call npm install getenv

echo [6/6] Verificando instalacao...
if exist "node_modules\expo" (
    echo ✓ Expo OK
) else (
    echo ✗ Expo FALHOU
    pause
    exit /b 1
)

if exist "node_modules\getenv" (
    echo ✓ getenv OK
) else (
    echo ✗ getenv FALHOU
)

echo.
echo ========================================
echo    INICIANDO PSIQUEIA LIMPO
echo ========================================
echo.
echo 📱 iPhone: Expo Go + QR Code
echo 💻 PC: http://localhost:8081
echo.

call npx expo start --web --tunnel --clear

echo.
echo ✓ SUCESSO! PsiqueIA rodando!
pause