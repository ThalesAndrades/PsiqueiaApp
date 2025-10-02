#!/usr/bin/env node

/**
 * 🌐 INTEGRAÇÃO WEB COM XCODE CLOUD
 * 
 * Sistema completo para conectar com Xcode Cloud via App Store Connect API
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

class XcodeCloudWebAPI {
    constructor() {
        this.baseURL = 'https://api.appstoreconnect.apple.com';
        this.apiVersion = 'v1';
        
        // Configurações do projeto
        this.config = {
            keyId: process.env.APP_STORE_CONNECT_API_KEY_ID || '5D79LKKR26',
            issuerId: process.env.APP_STORE_CONNECT_ISSUER_ID,
            privateKey: process.env.APP_STORE_CONNECT_PRIVATE_KEY,
            bundleId: 'com.psiqueia.app',
            appName: 'PsiqueiaApp'
        };
        
        this.token = null;
        this.tokenExpiry = null;
    }

    /**
     * 🔐 Gerar JWT Token para autenticação
     */
    generateJWTToken() {
        console.log('🔐 Gerando JWT token para App Store Connect API...');
        
        if (!this.config.privateKey) {
            throw new Error('❌ Chave privada não configurada. Configure APP_STORE_CONNECT_PRIVATE_KEY');
        }

        // Processar a chave privada
        let privateKey = this.config.privateKey.replace(/\\n/g, '\n');
        
        // Verificar se a chave está no formato correto
        if (!privateKey.includes('-----BEGIN PRIVATE KEY-----')) {
            throw new Error('Formato de chave privada inválido');
        }

        const now = Math.floor(Date.now() / 1000);
        const payload = {
            iss: this.config.issuerId,
            iat: now,
            exp: now + (20 * 60), // 20 minutos
            aud: 'appstoreconnect-v1'
        };

        const header = {
            alg: 'ES256',
            kid: this.config.keyId,
            typ: 'JWT'
        };

        try {
            this.token = jwt.sign(payload, privateKey, { 
                algorithm: 'ES256',
                header: header
            });
            this.tokenExpiry = now + (20 * 60);
            
            console.log('✅ JWT token gerado com sucesso');
            return this.token;
        } catch (error) {
            console.error('❌ Erro ao gerar JWT token:', error.message);
            throw error;
        }
    }

    /**
     * 🔄 Verificar se token precisa ser renovado
     */
    ensureValidToken() {
        const now = Math.floor(Date.now() / 1000);
        if (!this.token || now >= (this.tokenExpiry - 60)) {
            this.generateJWTToken();
        }
        return this.token;
    }

    /**
     * 🌐 Fazer requisição para App Store Connect API
     */
    async makeAPIRequest(endpoint, method = 'GET', data = null) {
        return new Promise((resolve, reject) => {
            const token = this.ensureValidToken();
            const url = `${this.baseURL}/${this.apiVersion}/${endpoint}`;
            
            const options = {
                method: method,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            };

            console.log(`🌐 ${method} ${endpoint}`);

            const req = https.request(url, options, (res) => {
                let responseData = '';
                
                res.on('data', (chunk) => {
                    responseData += chunk;
                });
                
                res.on('end', () => {
                    try {
                        const jsonData = JSON.parse(responseData);
                        
                        if (res.statusCode >= 200 && res.statusCode < 300) {
                            resolve(jsonData);
                        } else {
                            console.error(`❌ API Error ${res.statusCode}:`, jsonData);
                            reject(new Error(`API Error: ${res.statusCode} - ${JSON.stringify(jsonData)}`));
                        }
                    } catch (error) {
                        console.error('❌ Erro ao parsear resposta:', error);
                        reject(error);
                    }
                });
            });

            req.on('error', (error) => {
                console.error('❌ Erro na requisição:', error);
                reject(error);
            });

            if (data) {
                req.write(JSON.stringify(data));
            }

            req.end();
        });
    }

    /**
     * 📱 Buscar informações do app
     */
    async getAppInfo() {
        console.log('📱 Buscando informações do app...');
        
        try {
            const response = await this.makeAPIRequest(`apps?filter[bundleId]=${this.config.bundleId}`);
            
            if (response.data && response.data.length > 0) {
                const app = response.data[0];
                console.log(`✅ App encontrado: ${app.attributes.name} (${app.id})`);
                return app;
            } else {
                console.log('⚠️ App não encontrado com Bundle ID:', this.config.bundleId);
                return null;
            }
        } catch (error) {
            console.error('❌ Erro ao buscar app:', error.message);
            throw error;
        }
    }

    /**
     * 🏗️ Buscar builds do Xcode Cloud
     */
    async getXcodeCloudBuilds(appId, limit = 10) {
        console.log(`🏗️ Buscando builds do Xcode Cloud para app ${appId}...`);
        
        try {
            const endpoint = `builds?filter[app]=${appId}&limit=${limit}&sort=-createdDate&include=buildBundles,icons`;
            const response = await this.makeAPIRequest(endpoint);
            
            console.log(`✅ Encontrados ${response.data.length} builds`);
            return response.data;
        } catch (error) {
            console.error('❌ Erro ao buscar builds:', error.message);
            throw error;
        }
    }

    /**
     * 🧪 Buscar informações do TestFlight
     */
    async getTestFlightBuilds(appId) {
        console.log(`🧪 Buscando builds do TestFlight para app ${appId}...`);
        
        try {
            const endpoint = `builds?filter[app]=${appId}&filter[processingState]=VALID&limit=20&sort=-createdDate`;
            const response = await this.makeAPIRequest(endpoint);
            
            console.log(`✅ Encontrados ${response.data.length} builds do TestFlight`);
            return response.data;
        } catch (error) {
            console.error('❌ Erro ao buscar builds do TestFlight:', error.message);
            throw error;
        }
    }

    /**
     * 📊 Buscar métricas e analytics
     */
    async getBuildMetrics(buildId) {
        console.log(`📊 Buscando métricas do build ${buildId}...`);
        
        try {
            const endpoint = `builds/${buildId}?include=buildBundles,icons,individualTesters,betaGroups`;
            const response = await this.makeAPIRequest(endpoint);
            
            console.log(`✅ Métricas obtidas para build ${buildId}`);
            return response.data;
        } catch (error) {
            console.error('❌ Erro ao buscar métricas:', error.message);
            throw error;
        }
    }

    /**
     * 🔔 Configurar webhook para notificações
     */
    async setupWebhook(webhookUrl) {
        console.log('🔔 Configurando webhook para notificações...');
        
        // Nota: Webhooks do Xcode Cloud são configurados via Xcode ou App Store Connect
        // Esta função prepara a estrutura para receber webhooks
        
        const webhookConfig = {
            url: webhookUrl,
            events: [
                'build.started',
                'build.completed',
                'build.failed',
                'test.completed'
            ],
            secret: crypto.randomBytes(32).toString('hex')
        };
        
        console.log('✅ Configuração de webhook preparada');
        console.log('📝 Configure manualmente no App Store Connect:');
        console.log(`   URL: ${webhookUrl}`);
        console.log(`   Secret: ${webhookConfig.secret}`);
        
        return webhookConfig;
    }

    /**
     * 📈 Gerar relatório completo
     */
    async generateReport() {
        console.log('📈 Gerando relatório completo do Xcode Cloud...');
        
        try {
            const app = await this.getAppInfo();
            if (!app) {
                throw new Error('App não encontrado');
            }

            const builds = await this.getXcodeCloudBuilds(app.id, 20);
            const testFlightBuilds = await this.getTestFlightBuilds(app.id);
            
            const report = {
                app: {
                    id: app.id,
                    name: app.attributes.name,
                    bundleId: app.attributes.bundleId,
                    sku: app.attributes.sku
                },
                builds: {
                    total: builds.length,
                    recent: builds.slice(0, 5).map(build => ({
                        id: build.id,
                        version: build.attributes.version,
                        buildNumber: build.attributes.buildNumber,
                        processingState: build.attributes.processingState,
                        createdDate: build.attributes.createdDate,
                        expirationDate: build.attributes.expirationDate
                    }))
                },
                testFlight: {
                    total: testFlightBuilds.length,
                    validBuilds: testFlightBuilds.filter(b => b.attributes.processingState === 'VALID').length
                },
                summary: {
                    lastBuildDate: builds.length > 0 ? builds[0].attributes.createdDate : null,
                    successRate: this.calculateSuccessRate(builds),
                    averageBuildTime: this.calculateAverageBuildTime(builds)
                },
                generatedAt: new Date().toISOString()
            };
            
            console.log('✅ Relatório gerado com sucesso');
            return report;
        } catch (error) {
            console.error('❌ Erro ao gerar relatório:', error.message);
            throw error;
        }
    }

    /**
     * 📊 Calcular taxa de sucesso
     */
    calculateSuccessRate(builds) {
        if (builds.length === 0) return 0;
        
        const successfulBuilds = builds.filter(build => 
            build.attributes.processingState === 'VALID' || 
            build.attributes.processingState === 'PROCESSING'
        ).length;
        
        return Math.round((successfulBuilds / builds.length) * 100);
    }

    /**
     * ⏱️ Calcular tempo médio de build
     */
    calculateAverageBuildTime(builds) {
        // Esta é uma estimativa, pois a API não fornece tempo de build diretamente
        return 'N/A (não disponível via API)';
    }

    /**
     * 🚀 Inicializar integração completa
     */
    async initialize() {
        console.log('🚀 INICIALIZANDO INTEGRAÇÃO WEB COM XCODE CLOUD\n');
        
        try {
            // Verificar configuração
            if (!this.config.issuerId || !this.config.privateKey) {
                console.log('⚠️ Configuração incompleta. Configurando variáveis...');
                await this.setupEnvironment();
            }
            
            // Gerar token
            this.generateJWTToken();
            
            // Testar conexão
            const app = await this.getAppInfo();
            if (app) {
                console.log('✅ Conexão com App Store Connect estabelecida');
                
                // Gerar relatório inicial
                const report = await this.generateReport();
                await this.saveReport(report);
                
                console.log('\n🎉 INTEGRAÇÃO WEB CONFIGURADA COM SUCESSO!');
                console.log('\n📋 PRÓXIMOS PASSOS:');
                console.log('1. Configure as variáveis de ambiente');
                console.log('2. Execute o dashboard web');
                console.log('3. Configure webhooks no App Store Connect');
                
                return true;
            }
        } catch (error) {
            console.error('❌ Erro na inicialização:', error.message);
            return false;
        }
    }

    /**
     * ⚙️ Configurar ambiente
     */
    async setupEnvironment() {
        const envConfig = `# 🔐 CONFIGURAÇÃO DA APP STORE CONNECT API

# Obrigatórias
APP_STORE_CONNECT_API_KEY_ID=${this.config.keyId}
APP_STORE_CONNECT_ISSUER_ID=your-issuer-id-here
APP_STORE_CONNECT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----
your-private-key-content-here
-----END PRIVATE KEY-----"

# Opcionais
XCODE_CLOUD_WEBHOOK_URL=https://your-domain.com/webhook
XCODE_CLOUD_WEBHOOK_SECRET=your-webhook-secret
`;
        
        const envPath = path.join(process.cwd(), '.env.xcode-cloud');
        fs.writeFileSync(envPath, envConfig);
        
        console.log(`✅ Arquivo de configuração criado: ${envPath}`);
        console.log('📝 Configure as variáveis antes de continuar');
    }

    /**
     * 💾 Salvar relatório
     */
    async saveReport(report) {
        const reportPath = path.join(process.cwd(), 'xcode-cloud-web-api', 'reports');
        if (!fs.existsSync(reportPath)) {
            fs.mkdirSync(reportPath, { recursive: true });
        }
        
        const filename = `xcode-cloud-report-${new Date().toISOString().split('T')[0]}.json`;
        const filePath = path.join(reportPath, filename);
        
        fs.writeFileSync(filePath, JSON.stringify(report, null, 2));
        console.log(`📊 Relatório salvo em: ${filePath}`);
    }
}

/**
 * 🧪 TESTE DE CONEXÃO COM A API
 */
async function testAPIConnection() {
    try {
        console.log('🔍 Testando conexão com App Store Connect API...');
        
        // Carregar variáveis de ambiente
        require('dotenv').config({ path: '.env.xcode-cloud' });
        
        const keyId = process.env.APP_STORE_CONNECT_API_KEY_ID;
        const issuerId = process.env.APP_STORE_CONNECT_ISSUER_ID;
        const privateKey = process.env.APP_STORE_CONNECT_PRIVATE_KEY;
        
        if (!keyId || !issuerId || !privateKey) {
            return {
                success: false,
                error: 'Credenciais não configuradas no .env.xcode-cloud'
            };
        }
        
        // Criar instância da API
        const api = new XcodeCloudWebAPI();
        
        // Fazer requisição de teste
        const response = await api.makeAPIRequest('apps');
        
        if (response && response.data) {
            return {
                success: true,
                message: 'Conexão estabelecida com sucesso!',
                appsCount: response.data.length,
                apps: response.data.slice(0, 3).map(app => ({
                    id: app.id,
                    name: app.attributes.name,
                    bundleId: app.attributes.bundleId
                }))
            };
        } else {
            return {
                success: false,
                error: 'Resposta inválida da API'
            };
        }
        
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
}

// Exportar classe e funções para uso em outros módulos
module.exports = {
    XcodeCloudWebAPI,
    testAPIConnection
};

// Executar se chamado diretamente
if (require.main === module) {
    const api = new XcodeCloudWebAPI();
    api.initialize().catch(console.error);
}