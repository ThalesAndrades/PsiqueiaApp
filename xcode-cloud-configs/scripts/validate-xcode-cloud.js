#!/usr/bin/env node

/**
 * 🔍 SCRIPT DE VALIDAÇÃO DO XCODE CLOUD
 * 
 * Valida se todas as configurações estão corretas
 */

const fs = require('fs');
const path = require('path');

class XcodeCloudValidator {
    constructor() {
        this.projectRoot = process.cwd();
        this.errors = [];
        this.warnings = [];
        this.success = [];
    }

    async validate() {
        console.log('🔍 VALIDANDO CONFIGURAÇÕES DO XCODE CLOUD\n');
        
        await this.validateFiles();
        await this.validateEnvironmentVariables();
        await this.validateWorkflows();
        await this.validatePrivateKey();
        
        this.printResults();
    }

    async validateFiles() {
        console.log('📁 Validando arquivos...');
        
        const requiredFiles = [
            '.xcode-cloud.yml',
            'xcode-cloud-configs/environment-variables-complete.json',
            'package.json',
            'app.json',
            'eas.json'
        ];
        
        requiredFiles.forEach(file => {
            const filePath = path.join(this.projectRoot, file);
            if (fs.existsSync(filePath)) {
                this.success.push(`✅ Arquivo encontrado: ${file}`);
            } else {
                this.errors.push(`❌ Arquivo obrigatório não encontrado: ${file}`);
            }
        });
    }

    async validateEnvironmentVariables() {
        console.log('🔧 Validando variáveis de ambiente...');
        
        const envVarsPath = path.join(this.projectRoot, 'xcode-cloud-configs/environment-variables-complete.json');
        
        if (!fs.existsSync(envVarsPath)) {
            this.errors.push('❌ Arquivo de variáveis de ambiente não encontrado');
            return;
        }
        
        const envVars = JSON.parse(fs.readFileSync(envVarsPath, 'utf8'));
        const requiredVars = [
            'APP_STORE_CONNECT_API_KEY_ID',
            'APP_STORE_CONNECT_ISSUER_ID',
            'DEVELOPMENT_TEAM',
            'IOS_BUNDLE_IDENTIFIER'
        ];
        
        requiredVars.forEach(varName => {
            if (envVars[varName]) {
                if (envVars[varName].value.includes('[') || envVars[varName].value.includes('CONFIGURAR')) {
                    this.warnings.push(`⚠️  Variável precisa ser configurada: ${varName}`);
                } else {
                    this.success.push(`✅ Variável configurada: ${varName}`);
                }
            } else {
                this.errors.push(`❌ Variável obrigatória não encontrada: ${varName}`);
            }
        });
    }

    async validateWorkflows() {
        console.log('⚙️ Validando workflows...');
        
        const workflowPath = path.join(this.projectRoot, '.xcode-cloud.yml');
        
        if (!fs.existsSync(workflowPath)) {
            this.errors.push('❌ Arquivo .xcode-cloud.yml não encontrado');
            return;
        }
        
        const workflowContent = fs.readFileSync(workflowPath, 'utf8');
        
        if (workflowContent.includes('development')) {
            this.success.push('✅ Workflow de desenvolvimento configurado');
        }
        
        if (workflowContent.includes('staging')) {
            this.success.push('✅ Workflow de staging configurado');
        }
        
        if (workflowContent.includes('production')) {
            this.success.push('✅ Workflow de produção configurado');
        }
    }

    async validatePrivateKey() {
        console.log('🔑 Validando chave privada...');
        
        const privateKeyPath = path.join(this.projectRoot, 'private_keys/AuthKey_5D79LKKR26.p8');
        
        if (fs.existsSync(privateKeyPath)) {
            this.success.push('✅ Chave privada encontrada localmente');
            this.warnings.push('⚠️  Lembre-se de fazer upload da chave no App Store Connect');
        } else {
            this.warnings.push('⚠️  Chave privada não encontrada - faça upload no App Store Connect');
        }
    }

    printResults() {
        console.log('\n📊 RESULTADOS DA VALIDAÇÃO\n');
        
        if (this.success.length > 0) {
            console.log('✅ SUCESSOS:');
            this.success.forEach(msg => console.log(`  ${msg}`));
            console.log('');
        }
        
        if (this.warnings.length > 0) {
            console.log('⚠️  AVISOS:');
            this.warnings.forEach(msg => console.log(`  ${msg}`));
            console.log('');
        }
        
        if (this.errors.length > 0) {
            console.log('❌ ERROS:');
            this.errors.forEach(msg => console.log(`  ${msg}`));
            console.log('');
        }
        
        const total = this.success.length + this.warnings.length + this.errors.length;
        const successRate = Math.round((this.success.length / total) * 100);
        
        console.log(`📈 TAXA DE SUCESSO: ${successRate}%`);
        
        if (this.errors.length === 0) {
            console.log('\n🎉 CONFIGURAÇÃO VÁLIDA! Pronto para usar o Xcode Cloud.');
        } else {
            console.log('\n🔧 CORRIJA OS ERROS ANTES DE CONTINUAR.');
        }
    }
}

// Executar validação
const validator = new XcodeCloudValidator();
validator.validate().catch(console.error);
