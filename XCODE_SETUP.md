# Configuração do PsiqueiaApp para Xcode

## Pré-requisitos

Para usar este projeto React Native/Expo no Xcode, você precisará:

1. **macOS** - O Xcode só funciona em sistemas macOS
2. **Xcode** - Baixe da App Store ou do site de desenvolvedores da Apple
3. **Node.js** - Versão 18 ou superior
4. **Expo CLI** - Para gerenciar o projeto

## Passos para Configuração
/
### 1. Clone o Repositório

```bash
git clone https://github.com/ThalesAndrades/PsiqueiaApp.git
cd PsiqueiaApp
```

### 2. Instale as Dependências

```bash
npm install
```

### 3. Configure as Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com suas configurações:

```env
EXPO_PUBLIC_SUPABASE_URL=sua_url_do_supabase
EXPO_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
```

### 4. Gere os Arquivos Nativos do iOS

```bash
npx expo prebuild --platform ios --clean
```

Este comando criará a pasta `ios/` com todos os arquivos nativos necessários para o Xcode.

### 5. Abra o Projeto no Xcode

```bash
open ios/PsiqueiaApp.xcworkspace
```

Ou navegue até a pasta `ios/` e abra o arquivo `PsiqueiaApp.xcworkspace` diretamente no Xcode.

## Configurações Importantes no Xcode

### Bundle Identifier
- O bundle identifier está configurado como: `com.psiquia.app`
- Certifique-se de que este ID seja único se você planeja publicar na App Store

### Certificados e Provisioning Profiles
1. Vá para **Signing & Capabilities**
2. Selecione sua equipe de desenvolvimento
3. Configure os certificados apropriados

### Permissões Configuradas
O app já está configurado com as seguintes permissões:
- Câmera (`NSCameraUsageDescription`)
- Microfone (`NSMicrophoneUsageDescription`)
- Galeria de Fotos (`NSPhotoLibraryUsageDescription`)
- Localização (`NSLocationWhenInUseUsageDescription`)
- Face ID (`NSFaceIDUsageDescription`)

## Executando o Projeto

### Modo de Desenvolvimento
```bash
npx expo start --ios
```

### Build para Dispositivo/Simulador
1. No Xcode, selecione o dispositivo de destino
2. Pressione `Cmd + R` para executar
3. Ou use o botão "Play" na interface do Xcode

## Estrutura do Projeto

```
PsiqueiaApp/
├── app/                 # Páginas e rotas (Expo Router)
├── components/          # Componentes reutilizáveis
├── constants/           # Constantes e configurações
├── hooks/              # Custom hooks
├── assets/             # Imagens, fontes, etc.
├── ios/                # Arquivos nativos do iOS (gerados)
├── android/            # Arquivos nativos do Android (gerados)
└── package.json        # Dependências e scripts
```

## Troubleshooting

### Erro de Módulos Não Encontrados
```bash
rm -rf node_modules
npm install
npx expo prebuild --clean
```

### Problemas de Certificado
1. Verifique se você está logado com sua Apple ID no Xcode
2. Certifique-se de ter um certificado de desenvolvedor válido
3. Configure o provisioning profile correto

### Erro de Build
1. Limpe o build: `Product > Clean Build Folder`
2. Recompile o projeto
3. Verifique se todas as dependências estão instaladas

## Recursos Adicionais

- [Documentação do Expo](https://docs.expo.dev/)
- [Guia do React Native](https://reactnative.dev/docs/getting-started)
- [Documentação do Xcode](https://developer.apple.com/xcode/)

## Suporte

Para problemas específicos do projeto, abra uma issue no repositório GitHub:
https://github.com/ThalesAndrades/PsiqueiaApp/issues