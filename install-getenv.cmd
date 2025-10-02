@echo off
echo ========================================
echo    PSIQUEIA - INSTALANDO GETENV
echo ========================================
echo.

echo Instalando módulo getenv...
call npm install getenv --legacy-peer-deps --no-audit --no-fund

echo.
echo ✓ Getenv instalado!
echo Agora execute: launch-final.cmd
pause