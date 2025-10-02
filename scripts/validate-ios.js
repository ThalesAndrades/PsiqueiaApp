#!/usr/bin/env node

/**
 * Script de validação para configurações iOS - PsiqueiaApp
 * Verifica se todas as configurações estão corretas para conformidade com Apple
 */

const fs = require('fs');
const path = require('path');

class IOSValidator {
    constructor() {
        this.errors = [];
        this.warnings = [];
        this.success = [];
    }

    log(type, message) {
        const timestamp = new Date().toISOString();
        console.log(`[${timestamp}] ${type}: ${message}`);
        
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

    readJsonFile(filePath) {
        try {
            return JSON.parse(fs.readFileSync(filePath, 'utf8'));
        } catch (error) {
            this.log('ERROR', `Erro ao ler ${filePath}: ${error.message}`);
            return null;
        }
    }

    validateAppJson() {
        this.log('INFO', 'Validando app.json...');
        
        const appJsonPath = 'app.json';
        if (!this.fileExists(appJsonPath)) {
            this.log('ERROR', 'app.json não encontrado');
            return;
        }

        const appJson = this.readJsonFile(appJsonPath);
        if (!appJson) return;

        const expo = appJson.expo;
        if (!expo) {
            this.log('ERROR', 'Configuração expo não encontrada em app.json');
            return;
        }

        // Verificar configurações iOS
        if (!expo.ios) {
            this.log('ERROR', 'Configuração iOS não encontrada em app.json');
            return;
        }

        const ios = expo.ios;

        // Bundle Identifier
        if (!ios.bundleIdentifier) {
            this.log('ERROR', 'bundleIdentifier não definido');
        } else if (ios.bundleIdentifier === 'com.psiqueia.app') {
            this.log('SUCCESS', 'bundleIdentifier configurado corretamente');
        } else {
            this.log('WARNING', `bundleIdentifier: ${ios.bundleIdentifier}`);
        }

        // Build Number
        if (!ios.buildNumber) {
            this.log('WARNING', 'buildNumber não definido');
        } else {
            this.log('SUCCESS', `buildNumber: ${ios.buildNumber}`);
        }

        // Info.plist
        if (!ios.infoPlist) {
            this.log('ERROR', 'infoPlist não configurado');
        } else {
            this.log('SUCCESS', 'infoPlist configurado');
            
            // Verificar descrições de privacidade
            const privacyKeys = [
                'NSCameraUsageDescription',
                'NSMicrophoneUsageDescription',
                'NSPhotoLibraryUsageDescription',
                'NSLocationWhenInUseUsageDescription',
                'NSFaceIDUsageDescription'
            ];

            privacyKeys.forEach(key => {
                if (ios.infoPlist[key]) {
                    this.log('SUCCESS', `${key} configurado`);
                } else {
                    this.log('WARNING', `${key} não configurado`);
                }
            });
        }

        // Entitlements
        if (!ios.entitlements) {
            this.log('WARNING', 'entitlements não configurado');
        } else {
            this.log('SUCCESS', 'entitlements configurado');
        }
    }

    validateInfoPlist() {
        this.log('INFO', 'Validando Info.plist...');
        
        const infoPlistPath = 'ios/PsiqueiaApp/Info.plist';
        if (!this.fileExists(infoPlistPath)) {
            this.log('ERROR', 'Info.plist não encontrado');
            return;
        }

        this.log('SUCCESS', 'Info.plist encontrado');
    }

    validateEntitlements() {
        this.log('INFO', 'Validando entitlements...');
        
        const entitlementsPath = 'ios/PsiqueiaApp/PsiqueiaApp.entitlements';
        if (!this.fileExists(entitlementsPath)) {
            this.log('ERROR', 'PsiqueiaApp.entitlements não encontrado');
            return;
        }

        this.log('SUCCESS', 'PsiqueiaApp.entitlements encontrado');
    }

    validatePrivacyManifest() {
        this.log('INFO', 'Validando Privacy Manifest...');
        
        const privacyPath = 'ios/PsiqueiaApp/PrivacyInfo.xcprivacy';
        if (!this.fileExists(privacyPath)) {
            this.log('ERROR', 'PrivacyInfo.xcprivacy não encontrado');
            return;
        }

        this.log('SUCCESS', 'PrivacyInfo.xcprivacy encontrado');
    }

    validateXcodeCloud() {
        this.log('INFO', 'Validando Xcode Cloud...');
        
        const xcodeCloudPath = '.xcode-cloud.yml';
        if (!this.fileExists(xcodeCloudPath)) {
            this.log('ERROR', '.xcode-cloud.yml não encontrado');
            return;
        }

        this.log('SUCCESS', '.xcode-cloud.yml encontrado');
    }

    validateExportOptions() {
        this.log('INFO', 'Validando Export Options...');
        
        const exportOptionsPath = 'ios/ExportOptions.plist';
        if (!this.fileExists(exportOptionsPath)) {
            this.log('ERROR', 'ExportOptions.plist não encontrado');
            return;
        }

        this.log('SUCCESS', 'ExportOptions.plist encontrado');
    }

    validatePodfile() {
        this.log('INFO', 'Validando Podfile...');
        
        const podfilePath = 'ios/Podfile';
        if (!this.fileExists(podfilePath)) {
            this.log('ERROR', 'Podfile não encontrado');
            return;
        }

        this.log('SUCCESS', 'Podfile encontrado');
    }

    validateEnvironmentVariables() {
        this.log('INFO', 'Validando variáveis de ambiente...');
        
        const requiredEnvVars = [
            'APP_STORE_CONNECT_API_KEY_ID',
            'APP_STORE_CONNECT_ISSUER_ID',
            'DEVELOPMENT_TEAM'
        ];

        requiredEnvVars.forEach(envVar => {
            if (process.env[envVar]) {
                this.log('SUCCESS', `${envVar} definida`);
            } else {
                this.log('WARNING', `${envVar} não definida`);
            }
        });
    }

    validatePrivateKey() {
        this.log('INFO', 'Validando chave privada...');
        
        const privateKeyPath = 'private_keys/AuthKey_5D79LKKR26.p8';
        if (!this.fileExists(privateKeyPath)) {
            this.log('ERROR', 'Chave privada não encontrada');
            return;
        }

        this.log('SUCCESS', 'Chave privada encontrada');
    }

    run() {
        console.log('🔍 Iniciando validação das configurações iOS...\n');

        this.validateAppJson();
        this.validateInfoPlist();
        this.validateEntitlements();
        this.validatePrivacyManifest();
        this.validateXcodeCloud();
        this.validateExportOptions();
        this.validatePodfile();
        this.validateEnvironmentVariables();
        this.validatePrivateKey();

        console.log('\n📊 Resumo da validação:');
        console.log(`✅ Sucessos: ${this.success.length}`);
        console.log(`⚠️  Avisos: ${this.warnings.length}`);
        console.log(`❌ Erros: ${this.errors.length}`);

        if (this.errors.length > 0) {
            console.log('\n❌ Erros encontrados:');
            this.errors.forEach(error => console.log(`  - ${error}`));
        }

        if (this.warnings.length > 0) {
            console.log('\n⚠️  Avisos:');
            this.warnings.forEach(warning => console.log(`  - ${warning}`));
        }

        if (this.errors.length === 0) {
            console.log('\n🎉 Todas as configurações essenciais estão corretas!');
            return true;
        } else {
            console.log('\n🔧 Corrija os erros antes de prosseguir.');
            return false;
        }
    }
}

// Executar validação
const validator = new IOSValidator();
const isValid = validator.run();

process.exit(isValid ? 0 : 1);