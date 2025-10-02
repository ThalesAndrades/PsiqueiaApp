# PsiqueiaApp

Um aplicativo iOS desenvolvido com React Native e Expo para gerenciamento de saúde mental.

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Start the Project

```bash
npm run start         # Start Expo development server
npm run ios           # Launch iOS simulator
npm run web           # Start the web version
```

### 3. Build for iOS

Para gerar o projeto nativo iOS e abrir no Xcode:

```bash
npm run ios:prebuild  # Gera o projeto iOS nativo
npm run xcode         # Abre o projeto no Xcode
```

## Xcode Cloud Setup

Este projeto está configurado para funcionar com o Xcode Cloud. Para mais informações sobre como habilitar e configurar o Xcode Cloud, consulte [XCODE_CLOUD_SETUP.md](./XCODE_CLOUD_SETUP.md).

### Shared Schemes

O projeto usa a scheme **PsiqueiaApp** que está configurada como compartilhada (shared) e versionada no Git para permitir builds no Xcode Cloud.

## Main Dependencies

- React Native: 0.79.3
- React: 19.0.0
- Expo: ~53.0.9
- Expo Router: ~5.0.7
- Supabase: ^2.50.0

For a full list of dependencies, see [package.json](./package.json).

## License

This project is private. For collaboration inquiries, please contact the author.
