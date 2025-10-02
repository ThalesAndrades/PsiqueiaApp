# ✅ CHECKLIST FINAL DE DEPLOYMENT - PSIQUEIAAPP

## 🎯 OBJETIVO
Este checklist garante que todos os passos para deployment no App Store sejam seguidos corretamente.

---

## 📋 PRÉ-REQUISITOS (Windows - ✅ COMPLETO)

### ✅ Ambiente de Desenvolvimento
- [x] Node.js instalado e funcionando
- [x] npm instalado e funcionando  
- [x] Dependências do projeto instaladas
- [x] Scripts de validação criados
- [x] Documentação completa gerada

### ✅ Configurações do Projeto
- [x] `app.json` configurado corretamente
- [x] Bundle ID: `com.thalesdev.psiqueiaapp`
- [x] Build number configurado
- [x] Permissões de privacidade definidas
- [x] HealthKit configurado
- [x] Plataforma iOS habilitada

### ✅ Metadados do App Store
- [x] Descrições em português e inglês
- [x] Palavras-chave definidas
- [x] Notas da versão v1.0.0
- [x] Informações do app (categoria, idade, etc.)
- [x] Guia de screenshots criado

### ✅ Chave API e Configurações
- [x] Chave privada `AuthKey_5D79LKKR26.p8` configurada
- [x] Configuração do Xcode Cloud preparada
- [x] Scripts de validação funcionando

---

## 🖥️ DEPLOYMENT (macOS/Linux - ⏳ PENDENTE)

### 🔄 Geração do Projeto iOS
- [ ] Executar script automático: `bash scripts/deploy-macos.sh`
- [ ] OU executar manualmente: `npx expo prebuild --platform ios --clean`
- [ ] Verificar se diretório `ios/` foi criado
- [ ] Confirmar `ios/PsiqueiaApp/Info.plist` existe
- [ ] Confirmar `ios/PsiqueiaApp/PsiqueiaApp.entitlements` existe

### 🔧 Configuração do Xcode Cloud
- [ ] Acessar [App Store Connect](https://appstoreconnect.apple.com)
- [ ] Navegar para Xcode Cloud → Environment Variables
- [ ] Configurar variáveis:
  - [ ] `APP_STORE_CONNECT_API_KEY_ID` = `5D79LKKR26`
  - [ ] `APP_STORE_CONNECT_ISSUER_ID` = `[SEU_ISSUER_ID]`
  - [ ] `DEVELOPMENT_TEAM` = `[SEU_TEAM_ID]`

### 🔑 Upload da Chave Privada
- [ ] Acessar App Store Connect → Users and Access → Keys
- [ ] Fazer upload do arquivo: `private_keys/AuthKey_5D79LKKR26.p8`
- [ ] Verificar se a chave foi aceita

### 📱 Provisioning Profiles
- [ ] Acessar [Apple Developer Portal](https://developer.apple.com)
- [ ] Navegar para Certificates, Identifiers & Profiles
- [ ] Criar/verificar App ID: `com.thalesdev.psiqueiaapp`
- [ ] Criar provisioning profile para Development
- [ ] Criar provisioning profile para App Store Distribution

### 🔨 Build de Teste
Escolher uma das opções:

#### Opção A - Build Local (macOS)
- [ ] Executar: `npm run ios`
- [ ] Verificar se o app abre no simulador
- [ ] Testar funcionalidades principais
- [ ] Verificar se não há erros de build

#### Opção B - Build via Xcode Cloud
- [ ] Configurar repositório Git remoto
- [ ] Executar: `git push origin main`
- [ ] Monitorar build no App Store Connect
- [ ] Verificar se build foi bem-sucedido

---

## 📝 CRIAÇÃO DO LISTING NO APP STORE

### 🆕 Criar Novo App
- [ ] Acessar App Store Connect → My Apps
- [ ] Clicar em "+" → New App
- [ ] Configurar informações básicas:
  - [ ] **Name**: PsiqueiaApp
  - [ ] **Bundle ID**: com.thalesdev.psiqueiaapp
  - [ ] **SKU**: psiqueiaapp-v1
  - [ ] **Primary Language**: Portuguese (Brazil)

### 📊 Configurar Metadados
- [ ] **App Information**:
  - [ ] Category: Medical
  - [ ] Age Rating: 4+
  - [ ] Content Rights: Não contém conteúdo de terceiros

- [ ] **Pricing and Availability**:
  - [ ] Price: Free
  - [ ] Availability: All countries

### 📝 Descrições e Textos
- [ ] **App Store Description** (Português):
  ```
  Copiar de: app-store-metadata/pt-BR/description.txt
  ```
- [ ] **App Store Description** (Inglês):
  ```
  Copiar de: app-store-metadata/en-US/description.txt
  ```
- [ ] **Keywords**:
  ```
  Copiar de: app-store-metadata/keywords.txt
  ```
- [ ] **What's New in This Version**:
  ```
  Copiar de: app-store-metadata/release-notes/v1.0.0.md
  ```

### 📸 Screenshots e Mídia
- [ ] Criar screenshots seguindo: `app-store-metadata/screenshots/README.md`
- [ ] **iPhone 6.7"** (obrigatório):
  - [ ] Screenshot 1: Dashboard principal
  - [ ] Screenshot 2: Monitoramento de humor
  - [ ] Screenshot 3: Exercícios de mindfulness
  - [ ] Screenshot 4: Diário emocional
  - [ ] Screenshot 5: Relatórios e insights
- [ ] **iPhone 5.5"** (obrigatório):
  - [ ] Mesmos screenshots redimensionados
- [ ] **iPad Pro 12.9"** (opcional):
  - [ ] Screenshots otimizados para tablet

### 🔒 Informações de Revisão
- [ ] **App Review Information**:
  - [ ] Contact Information: Seus dados
  - [ ] Demo Account: Não necessário (app não requer login)
  - [ ] Notes: "App de saúde mental com foco em privacidade. Todos os dados são armazenados localmente no dispositivo."

### 🏥 Informações de Saúde (HealthKit)
- [ ] **Health and Fitness**: Sim
- [ ] **Health Records**: Não
- [ ] **HealthKit Usage**: 
  ```
  Este app integra com o Apple Health para sincronizar dados de bem-estar e humor, 
  permitindo um acompanhamento mais completo da saúde mental do usuário.
  ```

---

## 🚀 SUBMISSÃO FINAL

### 📤 Upload do Build
- [ ] Verificar se build aparece em App Store Connect
- [ ] Selecionar build na seção "Build"
- [ ] Aguardar processamento completo

### 🔍 Revisão Final
- [ ] Verificar todas as informações preenchidas
- [ ] Confirmar screenshots carregados
- [ ] Verificar descrições em todos os idiomas
- [ ] Confirmar configurações de privacidade

### ✅ Submeter para Revisão
- [ ] Clicar em "Submit for Review"
- [ ] Responder questionário de export compliance:
  - [ ] "Does your app use encryption?" → Sim (HTTPS)
  - [ ] "Is your app designed to use cryptography or does it contain or incorporate cryptography?" → Não (apenas HTTPS padrão)
- [ ] Confirmar submissão

---

## 📊 MONITORAMENTO PÓS-SUBMISSÃO

### 📈 Acompanhar Status
- [ ] Monitorar status no App Store Connect
- [ ] Aguardar "In Review" (24-48h)
- [ ] Responder possíveis questões da Apple
- [ ] Aguardar aprovação (2-7 dias)

### 🎉 Pós-Aprovação
- [ ] Configurar data de lançamento
- [ ] Preparar materiais de marketing
- [ ] Monitorar reviews e ratings
- [ ] Planejar atualizações futuras

---

## 🆘 RECURSOS DE SUPORTE

### 📖 Documentação
- `DEPLOYMENT_GUIDE.md` - Guia completo
- `NEXT_STEPS.md` - Próximos passos
- `DEPLOYMENT_SUMMARY.md` - Resumo do projeto

### 🛠️ Scripts Úteis
- `bash scripts/deploy-macos.sh` - Deployment automático
- `node scripts/check-deployment-status.js` - Verificar status
- `node scripts/final-validation.js` - Validação completa

### 🔗 Links Importantes
- [App Store Connect](https://appstoreconnect.apple.com)
- [Apple Developer Portal](https://developer.apple.com)
- [App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [HealthKit Guidelines](https://developer.apple.com/health-fitness/)

---

## ⚠️ NOTAS IMPORTANTES

1. **Privacidade**: Todos os dados são armazenados localmente
2. **HealthKit**: Integração configurada e documentada
3. **Criptografia**: Apenas HTTPS padrão (não requer licença especial)
4. **Idade**: App adequado para 4+ anos
5. **Categoria**: Medical (categoria correta para apps de saúde mental)

---

**🎯 Status Atual**: ✅ Pronto para deployment (aguardando geração do projeto iOS em macOS/Linux)

**📅 Próximo Passo**: Executar `bash scripts/deploy-macos.sh` em um Mac ou Linux