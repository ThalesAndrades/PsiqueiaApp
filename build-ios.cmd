@echo off
echo.
echo ========================================
echo    PsiqueIA - Build iOS Script
echo ========================================
echo.

echo [1/5] Verificando estrutura do projeto...
if not exist "package.json" (
    echo ERRO: package.json nao encontrado!
    pause
    exit /b 1
)

if not exist "app.json" (
    echo ERRO: app.json nao encontrado!
    pause
    exit /b 1
)

echo ✅ Estrutura do projeto OK
echo.

echo [2/5] Instalando dependencias...
call npm install
if %errorlevel% neq 0 (
    echo ERRO: Falha ao instalar dependencias!
    pause
    exit /b 1
)
echo ✅ Dependencias instaladas
echo.

echo [3/5] Executando verificacao do projeto...
call node check-project.js
echo.

echo [4/5] Gerando arquivos nativos iOS...
echo Executando: npx expo prebuild --platform ios --clean
call npx expo prebuild --platform ios --clean
if %errorlevel% neq 0 (
    echo.
    echo ⚠️  Prebuild com --clean falhou, tentando sem --clean...
    call npx expo prebuild --platform ios
    if %errorlevel% neq 0 (
        echo ERRO: Falha no prebuild!
        echo.
        echo Possiveis solucoes:
        echo - Verifique se o Expo CLI esta instalado: npm install -g @expo/cli
        echo - Tente executar: npm run reset-project
        echo - Verifique se todas as dependencias estao instaladas
        pause
        exit /b 1
    )
)
echo ✅ Arquivos iOS gerados
echo.

echo [5/5] Verificando arquivos gerados...
if exist "ios" (
    echo ✅ Pasta ios/ criada com sucesso
    
    if exist "ios\psiquiaapp.xcworkspace" (
        echo ✅ Workspace do Xcode encontrado
        echo.
        echo ========================================
        echo           BUILD CONCLUIDO!
        echo ========================================
        echo.
        echo Proximos passos:
        echo 1. Abra o Xcode
        echo 2. File ^> Open ^> Selecione: ios\psiquiaapp.xcworkspace
        echo 3. Configure seu Team de desenvolvimento
        echo 4. Selecione um simulador ou device
        echo 5. Pressione Cmd+R para executar
        echo.
        echo Deseja abrir o Xcode automaticamente? (s/n)
        set /p choice=
        if /i "%choice%"=="s" (
            echo Abrindo Xcode...
            start "" "ios\psiquiaapp.xcworkspace"
        )
    ) else (
        echo ⚠️  Workspace nao encontrado, mas pasta ios existe
        echo Verifique manualmente a pasta ios/
    )
) else (
    echo ERRO: Pasta ios nao foi criada!
    echo Verifique os logs acima para mais detalhes
    pause
    exit /b 1
)

echo.
echo ✅ Script concluido com sucesso!
echo.
pause