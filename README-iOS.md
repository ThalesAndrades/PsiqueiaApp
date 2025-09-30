# PsiqueIA - Guia de Compilação iOS

## 📱 Sobre o Projeto
PsiqueIA é um aplicativo React Native/Expo para saúde mental, otimizado para iOS com suporte à New Architecture do React Native 0.79.

## ✅ Status da Verificação
- **Estrutura do Projeto**: ✅ Completa
- **Dependências**: ✅ Todas instaladas
- **Configurações iOS**: ✅ Configuradas
- **TypeScript**: ✅ Configurado
- **Permissões**: ✅ Definidas

## 🔧 Configurações Principais

### Bundle Identifier
```
com.psiquia.app
```

### Permissões iOS Configuradas
- **NSCameraUsageDescription**: Acesso à câmera
- **NSMicrophoneUsageDescription**: Acesso ao microfone  
- **NSPhotoLibraryUsageDescription**: Acesso à galeria
- **NSFaceIDUsageDescription**: Autenticação biométrica

### Dependências Críticas
- **Expo SDK**: ~53.0.9
- **React Native**: 0.79.3 (New Architecture)
- **React**: 19.0.0
- **Expo Router**: ~5.0.7
- **React Native Reanimated**: 3.17.4

## 🚀 Passos para Compilação

### 1. Preparação do Ambiente
```bash
# Instalar dependências
npm install

# Verificar configuração
node ios-build-check.js
```

### 2. Prebuild para iOS
```bash
# Gerar arquivos nativos iOS
npx expo prebuild --platform ios --clean

# Instalar pods (se necessário)
cd ios && pod install && cd ..
```

### 3. Abrir no Xcode
```bash
# Abrir workspace (não o .xcodeproj)
open ios/psiquia-app.xcworkspace
```

### 4. Configuração no Xcode
1. Selecionar o projeto na sidebar
2. Em "Signing & Capabilities":
   - Escolher seu Team de desenvolvimento
   - Verificar Bundle Identifier: `com.psiquia.app`
3. Selecionar dispositivo/simulador
4. Build (⌘+B) e Run (⌘+R)

## 📋 Arquivos de Configuração

### babel.config.js
- Configurado com `babel-preset-expo`
- Plugins para Reanimated e NativeWind

### metro.config.js
- Suporte a NativeWind
- Extensões de arquivo adicionais
- Otimizações de performance

### app.json
- Configurações específicas iOS
- Plugins Expo necessários
- Permissões definidas

### eas.json
- Configuração para builds EAS
- Perfis de desenvolvimento, preview e produção

## 🎨 Recursos Implementados

### UI/UX
- **NativeWind**: Tailwind CSS para React Native
- **Gradientes**: LinearGradient do Expo
- **Animações**: React Native Reanimated 3
- **Tema**: Suporte a modo claro/escuro

### Funcionalidades
- **Autenticação**: Supabase + Biometria
- **Navegação**: Expo Router com tabs
- **Chat**: Sistema de mensagens
- **Dashboard**: Paciente e Psicólogo
- **Diário**: Registro de humor
- **Perfil**: Configurações do usuário

### Performance
- **Lazy Loading**: Componentes carregados sob demanda
- **Memory Management**: Limpeza automática
- **Performance Monitor**: Métricas de performance
- **Error Boundary**: Tratamento de erros

## 🔍 Troubleshooting

### Problemas Comuns

#### 1. Erro de Signing
```
Solução: Configurar Team no Xcode
```

#### 2. Pods não encontrados
```bash
cd ios
pod install --repo-update
```

#### 3. Metro bundler issues
```bash
npx expo start --clear
```

#### 4. TypeScript errors
```bash
npx tsc --noEmit
```

### Comandos Úteis
```bash
# Verificar projeto
node check-project.js

# Verificar iOS específico  
node ios-build-check.js

# Limpar cache
npx expo start --clear

# Reset completo
npm run reset-project
```

## 📱 Testando no Dispositivo

### Simulador iOS
1. Abrir Xcode
2. Window → Devices and Simulators
3. Selecionar simulador desejado
4. Build e Run no Xcode

### Dispositivo Físico
1. Conectar iPhone via USB
2. Confiar no computador
3. Selecionar device no Xcode
4. Build e Run

## 🚀 Deploy

### TestFlight (Recomendado)
```bash
# Build para produção
eas build --platform ios

# Submit para App Store Connect
eas submit --platform ios
```

### Build Local
```bash
# Archive no Xcode
Product → Archive

# Upload para App Store Connect
Window → Organizer → Upload
```

## 📞 Suporte

Para problemas específicos:
1. Verificar logs do Xcode
2. Executar `node ios-build-check.js`
3. Consultar documentação do Expo
4. Verificar issues no GitHub do projeto

---

**Versão**: 1.0.0  
**Última atualização**: Janeiro 2025  
**Compatibilidade**: iOS 13.0+, Xcode 15.0+