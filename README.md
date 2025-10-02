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

Este projeto está **completamente configurado** para funcionar com o Xcode Cloud. 

### ✅ Status: Pronto para Build

- ✅ Projeto iOS nativo gerado
- ✅ Scheme **PsiqueIA** compartilhada e versionada
- ✅ Configurações de build adequadas
- ✅ Deployment target: iOS 15.1+

**Para detalhes completos e instruções de como habilitar o Xcode Cloud, consulte**: 
- **[XCODE_CLOUD_READY.md](./XCODE_CLOUD_READY.md)** - Documentação completa de configuração
- [XCODE_CLOUD_SETUP.md](./XCODE_CLOUD_SETUP.md) - Guia detalhado de uso

### Scheme Usada

O projeto usa a scheme **PsiqueIA** que está configurada como compartilhada (shared) e versionada no Git em:
```
ios/PsiqueIA.xcodeproj/xcshareddata/xcschemes/PsiqueIA.xcscheme
```

Esta é a única scheme do projeto e será usada automaticamente pelo Xcode Cloud para builds e arquivamento.

## Main Dependencies

- React Native: 0.79.3
- React: 19.0.0
- Expo: ~53.0.9
- Expo Router: ~5.0.7
- Supabase: ^2.50.0

For a full list of dependencies, see [package.json](./package.json).

## License

This project is private. For collaboration inquiries, please contact the author.
