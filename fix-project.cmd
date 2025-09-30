@echo off
echo.
echo ========================================
echo    PsiqueIA - Fix Project Issues
echo ========================================
echo.

echo Escolha uma opcao:
echo.
echo 1. Limpar cache e reinstalar dependencias
echo 2. Reset completo do projeto
echo 3. Verificar configuracoes
echo 4. Limpar apenas cache do Metro
echo 5. Sair
echo.
set /p choice="Digite sua opcao (1-5): "

if "%choice%"=="1" goto clean_install
if "%choice%"=="2" goto reset_project
if "%choice%"=="3" goto check_config
if "%choice%"=="4" goto clear_metro
if "%choice%"=="5" goto end
goto invalid_choice

:clean_install
echo.
echo [LIMPEZA E REINSTALACAO]
echo.
echo Removendo node_modules...
if exist "node_modules" rmdir /s /q "node_modules"
echo.
echo Removendo package-lock.json...
if exist "package-lock.json" del "package-lock.json"
echo.
echo Removendo yarn.lock...
if exist "yarn.lock" del "yarn.lock"
echo.
echo Instalando dependencias...
call npm install
echo.
echo ✅ Limpeza concluida!
goto end

:reset_project
echo.
echo [RESET COMPLETO]
echo.
echo ⚠️  ATENCAO: Isso removera todos os arquivos gerados!
echo Tem certeza? (s/n)
set /p confirm=
if /i not "%confirm%"=="s" goto end

echo.
echo Executando reset...
if exist "scripts\reset-project.js" (
    call node scripts\reset-project.js
) else (
    echo Script de reset nao encontrado, fazendo limpeza manual...
    if exist "ios" rmdir /s /q "ios"
    if exist "android" rmdir /s /q "android"
    if exist ".expo" rmdir /s /q ".expo"
    if exist "node_modules" rmdir /s /q "node_modules"
)
echo.
echo Reinstalando dependencias...
call npm install
echo.
echo ✅ Reset concluido!
goto end

:check_config
echo.
echo [VERIFICACAO DE CONFIGURACOES]
echo.
call node check-project.js
echo.
call node ios-build-check.js
goto end

:clear_metro
echo.
echo [LIMPEZA DO CACHE METRO]
echo.
echo Limpando cache do Metro...
call npx expo start --clear
goto end

:invalid_choice
echo.
echo Opcao invalida! Tente novamente.
echo.
goto start

:end
echo.
echo Pressione qualquer tecla para sair...
pause >nul