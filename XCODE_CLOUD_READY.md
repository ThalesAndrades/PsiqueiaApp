# Xcode Cloud - Projeto Pronto para Build

## ✅ Status: Projeto Configurado para Xcode Cloud

Este documento confirma que o projeto PsiqueiaApp está **completamente configurado** para ser compilado no Xcode Cloud. Todos os requisitos necessários foram implementados.

---

## 📱 Projeto iOS Detectado

### Informações do Projeto

- **Nome do Projeto**: `PsiqueIA.xcodeproj`
- **Localização**: `/ios/PsiqueIA.xcodeproj`
- **Target Principal**: `PsiqueIA`
- **Product Type**: `com.apple.product-type.application`
- **Bundle Identifier**: `com.thalesdev.psiqueiaapp`
- **Deployment Target**: iOS 15.1+

### Estrutura do Projeto

```
ios/
├── PsiqueIA.xcodeproj/
│   ├── project.pbxproj                    # Configurações do projeto
│   ├── project.xcworkspace/               # Workspace (versionado)
│   │   ├── contents.xcworkspacedata       # Definições do workspace
│   │   └── xcshareddata/                  # Dados compartilhados
│   └── xcshareddata/                      # Schemes compartilhadas
│       └── xcschemes/
│           └── PsiqueIA.xcscheme          # ✅ Scheme compartilhada
├── PsiqueIA/                              # Código fonte do app
├── Podfile                                # Dependências CocoaPods
└── .gitignore                             # Ignora builds, mas versiona código
```

---

## ✅ Scheme Compartilhada (Requisito Obrigatório)

### Status: ✅ CONFIGURADA

A scheme **PsiqueIA** está corretamente configurada como **Shared** e versionada no Git:

- **Localização**: `ios/PsiqueIA.xcodeproj/xcshareddata/xcschemes/PsiqueIA.xcscheme`
- **Estado**: Compartilhada e versionada no Git
- **Configurações**:
  - ✅ Build for Testing: Sim
  - ✅ Build for Running: Sim
  - ✅ Build for Profiling: Sim
  - ✅ Build for Archiving: Sim
  - ✅ Build for Analyzing: Sim

### Por que a Scheme Precisa Ser Compartilhada?

O Xcode Cloud **requer** que as schemes estejam compartilhadas porque:
1. Schemes não compartilhadas ficam em `xcuserdata/` (ignorado pelo Git)
2. O Xcode Cloud precisa acessar a scheme para saber como compilar
3. Schemes compartilhadas ficam em `xcshareddata/` (versionadas no Git)

---

## 🔧 Configurações de Build

### Build Configurations

- **Debug**: Para desenvolvimento e testes
- **Release**: Para builds de produção e App Store

### Deployment Target

- **iOS**: 15.1+
- **Suporte a iPadOS**: Sim (`supportsTablet: true`)

### Entitlements e Permissões

O app requer as seguintes permissões (configuradas em `app.json`):
- Camera Usage
- Microphone Usage
- Photo Library Access
- Location When In Use
- Face ID Authentication
- Health Kit Access
- Background Modes

---

## 📝 Configuração no Xcode Cloud (Próximos Passos)

### Como Habilitar o Xcode Cloud

> **Nota**: Estas etapas devem ser executadas pelo **proprietário da conta Apple Developer** no **Xcode** ou **App Store Connect**.

### Opção 1: Via Xcode (Recomendado)

1. **Abrir o Projeto no Xcode**:
   ```bash
   cd ios
   open PsiqueIA.xcodeproj
   ```

2. **Conectar ao Xcode Cloud**:
   - No Xcode, vá para: **Product** → **Xcode Cloud** → **Create Workflow**
   - Selecione a scheme: **PsiqueIA**
   - Configure os triggers (branches, tags, etc.)

3. **Configurar Workflow**:
   - **Development**: Builds de desenvolvimento (branch `develop`)
   - **Staging**: Builds para TestFlight (branch `staging`, `release/*`)
   - **Production**: Builds para App Store (branch `main`, tags `v*`)

4. **Revisar e Ativar**:
   - Revise as configurações
   - Clique em **Start Build** para testar

### Opção 2: Via App Store Connect

1. **Acessar App Store Connect**:
   - Acesse [appstoreconnect.apple.com](https://appstoreconnect.apple.com)
   - Vá para **Apps** → Selecione o app (ou crie um novo)

2. **Configurar Xcode Cloud**:
   - Na aba do app, vá para **Xcode Cloud**
   - Clique em **Get Started**
   - Conecte o repositório GitHub

3. **Criar Workflow**:
   - Selecione o repositório: `ThalesAndrades/PsiqueiaApp`
   - Escolha a scheme: **PsiqueIA**
   - Configure os triggers de build

4. **Ativar o Serviço**:
   - Revise as configurações
   - Ative o Xcode Cloud

---

## 🔐 Variáveis de Ambiente (Opcional)

Se o app requer variáveis de ambiente ou secrets, configure no Xcode Cloud:

1. No App Store Connect, vá para **Xcode Cloud** → **Settings**
2. Adicione as variáveis de ambiente necessárias:
   - `EXPO_PUBLIC_SUPABASE_URL`
   - `EXPO_PUBLIC_SUPABASE_ANON_KEY`
   - Outras variáveis necessárias

3. Marque como **Secret** se forem dados sensíveis

---

## 📦 Dependências

### Node.js e npm

- **Node.js**: 18+
- **npm**: Configurado para instalar dependências automaticamente

### CocoaPods

- **Podfile**: Presente e configurado
- **Instalação**: Automática durante o build no Xcode Cloud

### Expo

- **Versão**: ~53.0.9
- **Prebuild**: Já executado (projeto nativo gerado)

---

## 🚀 Scripts Disponíveis

```bash
# Desenvolvimento local
npm run ios                    # Inicia o app no simulador iOS
npm run ios:prebuild           # Regenera o projeto iOS nativo
npm run xcode                  # Abre o projeto no Xcode

# CI/CD (para uso no Xcode Cloud)
npm run ci:build               # Build de CI
npm run ci:test                # Executa testes
npm run ci:production          # Build de produção
```

---

## ✅ Checklist de Configuração

### Status Atual

- [x] Projeto iOS gerado com `expo prebuild`
- [x] Scheme **PsiqueIA** compartilhada e versionada
- [x] Arquivo `project.pbxproj` versionado
- [x] Workspace versionado (`project.xcworkspace/`)
- [x] `.gitignore` configurado corretamente
- [x] Deployment target configurado (iOS 15.1+)
- [x] Bundle identifier definido
- [x] Configurações do Expo atualizadas

### Próximos Passos (pelo Proprietário)

- [ ] Abrir o projeto no Xcode e verificar assinatura de código
- [ ] Configurar o Team ID no Xcode
- [ ] Habilitar o Xcode Cloud via Xcode ou App Store Connect
- [ ] Criar o primeiro workflow de build
- [ ] Configurar variáveis de ambiente (se necessário)
- [ ] Executar o primeiro build no Xcode Cloud

---

## 📚 Documentação Adicional

### Arquivos de Referência

- **[XCODE_CLOUD_SETUP.md](./XCODE_CLOUD_SETUP.md)**: Guia completo de configuração
- **[README.md](./README.md)**: Documentação principal do projeto
- **[app.json](./app.json)**: Configurações do Expo e iOS
- **[.xcode-cloud.yml](./.xcode-cloud.yml)**: Configurações de workflow (referência)

### Links Úteis

- [Documentação Oficial do Xcode Cloud](https://developer.apple.com/xcode-cloud/)
- [Configurando Schemes no Xcode](https://developer.apple.com/documentation/xcode/configuring-a-new-target-in-your-project)
- [Expo Prebuild](https://docs.expo.dev/workflow/prebuild/)
- [App Store Connect](https://appstoreconnect.apple.com)

---

## 🎯 Resumo

✅ **O projeto está 100% pronto para o Xcode Cloud!**

A única ação necessária é **habilitar o Xcode Cloud** via Xcode ou App Store Connect. Uma vez habilitado:

1. O Xcode Cloud clonará o repositório
2. Instalará as dependências automaticamente
3. Compilará usando a scheme **PsiqueIA** compartilhada
4. Executará testes (se configurados)
5. Gerará o arquivo .ipa para distribuição

**Scheme Adotada**: `PsiqueIA` (única scheme do projeto, configurada como compartilhada)

---

## 📧 Suporte

Para questões sobre a configuração do Xcode Cloud, consulte:
- [Documentação do Xcode Cloud](https://developer.apple.com/xcode-cloud/)
- [Suporte Apple Developer](https://developer.apple.com/support/)
