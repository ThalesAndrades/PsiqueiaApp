#!/usr/bin/env node

/**
 * Script de Validação Final - Conformidade Apple
 * Verifica todos os aspectos necessários para aprovação na App Store
 */

const fs = require('fs');
const path = require('path');

class AppleComplianceValidator {
    constructor() {
        this.errors = [];
        this.warnings = [];
        this.success = [];
        this.criticalIssues = [];
    }

    log(type, message, critical = false) {
        const timestamp = new Date().toISOString();
        console.log(`[${timestamp}] ${type}: ${message}`);
        
        if (critical) {
            this.criticalIssues.push(message);
        }
        
        switch(type) {
            case 'ERROR':
                this.errors.push(message);
                break;
            case 'WARNING':
                this.warnings.push(message);
                break;
            case 'SUCCESS':
                this.success.push(message);
                break;
        }
    }

    fileExists(filePath) {
        return fs.existsSync(filePath);
    }

    readFile(filePath) {
        try {
            return fs.readFileSync(filePath, 'utf8');
        } catch (error) {
            this.log('ERROR', `Erro ao ler ${filePath}: ${error.message}`);
            return null;
        }
    }

    readJsonFile(filePath) {
        try {
            return JSON.parse(fs.readFileSync(filePath, 'utf8'));
        } catch (error) {
            this.log('ERROR', `Erro ao ler JSON ${filePath}: ${error.message}`);
            return null;
        }
    }

    validateAppStoreCompliance() {
        this.log('INFO', '🍎 Validando Conformidade com App Store...');
        
        // 1. Verificar app.json
        const appJson = this.readJsonFile('app.json');
        if (!appJson?.expo?.ios?.bundleIdentifier) {
            this.log('ERROR', 'Bundle Identifier não configurado', true);
        } else {
            this.log('SUCCESS', `Bundle ID: ${appJson.expo.ios.bundleIdentifier}`);
        }

        // 2. Verificar versão e build
        if (!appJson?.expo?.version) {
            this.log('ERROR', 'Versão do app não definida', true);
        } else {
            this.log('SUCCESS', `Versão: ${appJson.expo.version}`);
        }

        if (!appJson?.expo?.ios?.buildNumber) {
            this.log('WARNING', 'Build number não definido');
        } else {
            this.log('SUCCESS', `Build: ${appJson.expo.ios.buildNumber}`);
        }

        // 3. Verificar categoria
        if (!appJson?.expo?.ios?.config?.usesNonExemptEncryption === false) {
            this.log('SUCCESS', 'Configuração de criptografia definida');
        } else {
            this.log('WARNING', 'Configuração de criptografia não definida');
        }
    }

    validatePrivacyCompliance() {
        this.log('INFO', '🔒 Validando Conformidade de Privacidade...');
        
        // 1. Privacy Manifest
        if (!this.fileExists('ios/PsiqueiaApp/PrivacyInfo.xcprivacy')) {
            this.log('ERROR', 'Privacy Manifest obrigatório não encontrado', true);
        } else {
            this.log('SUCCESS', 'Privacy Manifest encontrado');
        }

        // 2. Info.plist privacy descriptions
        const infoPlistPath = 'ios/PsiqueiaApp/Info.plist';
        if (this.fileExists(infoPlistPath)) {
            const infoPlist = this.readFile(infoPlistPath);
            
            const requiredPrivacyKeys = [
                'NSCameraUsageDescription',
                'NSMicrophoneUsageDescription',
                'NSPhotoLibraryUsageDescription',
                'NSLocationWhenInUseUsageDescription',
                'NSFaceIDUsageDescription',
                'NSContactsUsageDescription',
                'NSCalendarsUsageDescription',
                'NSRemindersUsageDescription',
                'NSHealthShareUsageDescription',
                'NSHealthUpdateUsageDescription'
            ];

            let missingPrivacyDescriptions = 0;
            requiredPrivacyKeys.forEach(key => {
                if (infoPlist.includes(key)) {
                    this.log('SUCCESS', `${key} configurado`);
                } else {
                    this.log('WARNING', `${key} não encontrado`);
                    missingPrivacyDescriptions++;
                }
            });

            if (missingPrivacyDescriptions === 0) {
                this.log('SUCCESS', 'Todas as descrições de privacidade configuradas');
            }
        }
    }

    validateCodeSigningCompliance() {
        this.log('INFO', '✍️ Validando Assinatura de Código...');
        
        // 1. Entitlements
        if (!this.fileExists('ios/PsiqueiaApp/PsiqueiaApp.entitlements')) {
            this.log('ERROR', 'Arquivo de entitlements não encontrado', true);
        } else {
            this.log('SUCCESS', 'Entitlements configurado');
        }

        // 2. Export Options
        if (!this.fileExists('ios/ExportOptions.plist')) {
            this.log('ERROR', 'ExportOptions.plist não encontrado', true);
        } else {
            this.log('SUCCESS', 'Export Options configurado');
        }

        // 3. Provisioning Profile Configuration
        const exportOptions = this.readFile('ios/ExportOptions.plist');
        if (exportOptions && exportOptions.includes('app-store')) {
            this.log('SUCCESS', 'Método de distribuição App Store configurado');
        } else {
            this.log('WARNING', 'Método de distribuição não verificado');
        }
    }

    validateXcodeCloudCompliance() {
        this.log('INFO', '☁️ Validando Xcode Cloud...');
        
        if (!this.fileExists('.xcode-cloud.yml')) {
            this.log('WARNING', 'Xcode Cloud não configurado');
            return;
        }

        const xcodeCloud = this.readFile('.xcode-cloud.yml');
        if (xcodeCloud) {
            if (xcodeCloud.includes('production:')) {
                this.log('SUCCESS', 'Workflow de produção configurado');
            }
            if (xcodeCloud.includes('archive:')) {
                this.log('SUCCESS', 'Processo de archive configurado');
            }
            if (xcodeCloud.includes('export_ipa:')) {
                this.log('SUCCESS', 'Export IPA configurado');
            }
        }
    }

    validateHealthKitCompliance() {
        this.log('INFO', '🏥 Validando Conformidade HealthKit...');
        
        const entitlements = this.readFile('ios/PsiqueiaApp/PsiqueiaApp.entitlements');
        if (entitlements && entitlements.includes('com.apple.developer.healthkit')) {
            this.log('SUCCESS', 'HealthKit entitlement configurado');
            
            // Verificar se as descrições de uso estão presentes
            const infoPlist = this.readFile('ios/PsiqueiaApp/Info.plist');
            if (infoPlist) {
                if (infoPlist.includes('NSHealthShareUsageDescription')) {
                    this.log('SUCCESS', 'Descrição de compartilhamento HealthKit configurada');
                } else {
                    this.log('ERROR', 'Descrição de compartilhamento HealthKit obrigatória', true);
                }
                
                if (infoPlist.includes('NSHealthUpdateUsageDescription')) {
                    this.log('SUCCESS', 'Descrição de atualização HealthKit configurada');
                } else {
                    this.log('ERROR', 'Descrição de atualização HealthKit obrigatória', true);
                }
            }
        } else {
            this.log('INFO', 'HealthKit não configurado (opcional)');
        }
    }

    validateAppStoreMetadata() {
        this.log('INFO', '📝 Validando Metadados da App Store...');
        
        // Verificar descrições
        const ptDescription = this.fileExists('app-store-metadata/pt-BR/description.txt');
        const enDescription = this.fileExists('app-store-metadata/en-US/description.txt');
        
        if (ptDescription && enDescription) {
            this.log('SUCCESS', 'Descrições em múltiplos idiomas configuradas');
        } else {
            this.log('WARNING', 'Descrições em múltiplos idiomas não encontradas');
        }

        // Verificar keywords
        if (this.fileExists('app-store-metadata/keywords.txt')) {
            this.log('SUCCESS', 'Keywords configuradas');
        } else {
            this.log('WARNING', 'Keywords não configuradas');
        }

        // Verificar informações da App Store
        if (this.fileExists('app-store-metadata/app-store-info.json')) {
            this.log('SUCCESS', 'Informações da App Store configuradas');
            
            const appStoreInfo = this.readJsonFile('app-store-metadata/app-store-info.json');
            if (appStoreInfo) {
                // Verificar categoria
                if (appStoreInfo.app_information?.category?.primary === 'Medical') {
                    this.log('SUCCESS', 'Categoria Medical configurada');
                } else {
                    this.log('WARNING', 'Categoria Medical não configurada');
                }

                // Verificar age rating
                if (appStoreInfo.app_information?.content_rating === '4+') {
                    this.log('SUCCESS', 'Age rating 4+ configurado');
                } else {
                    this.log('WARNING', 'Age rating não configurado adequadamente');
                }
            }
        }
    }

    validateBuildConfiguration() {
        this.log('INFO', '🔧 Validando Configuração de Build...');
        
        // Verificar Podfile
        if (this.fileExists('ios/Podfile')) {
            const podfile = this.readFile('ios/Podfile');
            if (podfile) {
                if (podfile.includes('use_expo_modules!')) {
                    this.log('SUCCESS', 'Expo modules configurado');
                }
                if (podfile.includes('use_react_native!')) {
                    this.log('SUCCESS', 'React Native configurado');
                }
                if (podfile.includes('platform :ios')) {
                    this.log('SUCCESS', 'Plataforma iOS configurada');
                }
            }
        }

        // Verificar project.pbxproj
        if (this.fileExists('ios/PsiqueiaApp.xcodeproj/project.pbxproj')) {
            this.log('SUCCESS', 'Projeto Xcode configurado');
        } else {
            this.log('ERROR', 'Projeto Xcode não encontrado', true);
        }
    }

    validateSecurityCompliance() {
        this.log('INFO', '🛡️ Validando Conformidade de Segurança...');
        
        // Verificar App Transport Security
        const infoPlist = this.readFile('ios/PsiqueiaApp/Info.plist');
        if (infoPlist) {
            if (infoPlist.includes('NSAppTransportSecurity')) {
                this.log('SUCCESS', 'App Transport Security configurado');
            } else {
                this.log('WARNING', 'App Transport Security não configurado');
            }
        }

        // Verificar se não há chaves hardcoded
        const appJson = this.readJsonFile('app.json');
        if (appJson) {
            const jsonString = JSON.stringify(appJson);
            if (jsonString.includes('sk_') || jsonString.includes('pk_') || jsonString.includes('secret')) {
                this.log('ERROR', 'Possíveis chaves secretas encontradas no app.json', true);
            } else {
                this.log('SUCCESS', 'Nenhuma chave secreta encontrada no app.json');
            }
        }
    }

    generateComplianceReport() {
        console.log('\n' + '='.repeat(60));
        console.log('📋 RELATÓRIO FINAL DE CONFORMIDADE APPLE');
        console.log('='.repeat(60));
        
        console.log(`\n📊 Estatísticas:`);
        console.log(`✅ Sucessos: ${this.success.length}`);
        console.log(`⚠️  Avisos: ${this.warnings.length}`);
        console.log(`❌ Erros: ${this.errors.length}`);
        console.log(`🚨 Problemas Críticos: ${this.criticalIssues.length}`);

        if (this.criticalIssues.length > 0) {
            console.log(`\n🚨 PROBLEMAS CRÍTICOS (devem ser corrigidos):`);
            this.criticalIssues.forEach((issue, index) => {
                console.log(`  ${index + 1}. ${issue}`);
            });
        }

        if (this.errors.length > 0) {
            console.log(`\n❌ ERROS:`);
            this.errors.forEach((error, index) => {
                console.log(`  ${index + 1}. ${error}`);
            });
        }

        if (this.warnings.length > 0) {
            console.log(`\n⚠️  AVISOS:`);
            this.warnings.forEach((warning, index) => {
                console.log(`  ${index + 1}. ${warning}`);
            });
        }

        // Determinar status geral
        let overallStatus;
        let statusIcon;
        let statusMessage;

        if (this.criticalIssues.length > 0) {
            overallStatus = 'CRÍTICO';
            statusIcon = '🚨';
            statusMessage = 'Problemas críticos devem ser corrigidos antes da submissão';
        } else if (this.errors.length > 0) {
            overallStatus = 'FALHOU';
            statusIcon = '❌';
            statusMessage = 'Erros devem ser corrigidos antes da submissão';
        } else if (this.warnings.length > 5) {
            overallStatus = 'ATENÇÃO';
            statusIcon = '⚠️';
            statusMessage = 'Muitos avisos - revisar antes da submissão';
        } else {
            overallStatus = 'APROVADO';
            statusIcon = '✅';
            statusMessage = 'Projeto pronto para submissão à App Store';
        }

        console.log(`\n${statusIcon} STATUS GERAL: ${overallStatus}`);
        console.log(`📝 ${statusMessage}`);

        if (overallStatus === 'APROVADO') {
            console.log(`\n🎉 PARABÉNS! Seu projeto está em conformidade com as diretrizes da Apple!`);
            console.log(`\n📋 Próximos passos:`);
            console.log(`  1. Configurar variáveis de ambiente no Xcode Cloud`);
            console.log(`  2. Fazer upload da chave privada da API`);
            console.log(`  3. Configurar provisioning profiles`);
            console.log(`  4. Executar build de teste`);
            console.log(`  5. Submeter para revisão da Apple`);
        }

        console.log('\n' + '='.repeat(60));
        
        return overallStatus === 'APROVADO' || overallStatus === 'ATENÇÃO';
    }

    run() {
        console.log('🔍 Iniciando Validação Final de Conformidade Apple...\n');

        this.validateAppStoreCompliance();
        this.validatePrivacyCompliance();
        this.validateCodeSigningCompliance();
        this.validateXcodeCloudCompliance();
        this.validateHealthKitCompliance();
        this.validateAppStoreMetadata();
        this.validateBuildConfiguration();
        this.validateSecurityCompliance();

        return this.generateComplianceReport();
    }
}

// Executar validação
const validator = new AppleComplianceValidator();
const isCompliant = validator.run();

process.exit(isCompliant ? 0 : 1);