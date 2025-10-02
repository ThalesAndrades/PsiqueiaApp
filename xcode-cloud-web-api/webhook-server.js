#!/usr/bin/env node

/**
 * 🔔 SERVIDOR DE WEBHOOKS XCODE CLOUD
 * 
 * Sistema para receber notificações em tempo real do Xcode Cloud
 */

const express = require('express');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

class XcodeCloudWebhookServer {
    constructor(port = 3001) {
        this.app = express();
        this.port = port;
        this.webhookSecret = process.env.XCODE_CLOUD_WEBHOOK_SECRET || 'default-secret';
        this.logPath = path.join(process.cwd(), 'xcode-cloud-web-api', 'webhook-logs');
        
        this.setupMiddleware();
        this.setupRoutes();
        this.ensureLogDirectory();
    }

    /**
     * ⚙️ Configurar middleware
     */
    setupMiddleware() {
        // Middleware para capturar raw body (necessário para verificação de assinatura)
        this.app.use('/webhook', express.raw({ type: 'application/json' }));
        this.app.use(express.json());
        this.app.use(express.static(path.join(__dirname, 'public')));
        
        // CORS para desenvolvimento
        this.app.use((req, res, next) => {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
            res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
            next();
        });
    }

    /**
     * 🛣️ Configurar rotas
     */
    setupRoutes() {
        // Rota principal
        this.app.get('/', (req, res) => {
            res.json({
                status: 'active',
                service: 'Xcode Cloud Webhook Server',
                version: '1.0.0',
                endpoints: {
                    webhook: '/webhook',
                    status: '/status',
                    logs: '/logs',
                    dashboard: '/dashboard'
                }
            });
        });

        // Webhook principal do Xcode Cloud
        this.app.post('/webhook', (req, res) => {
            this.handleXcodeCloudWebhook(req, res);
        });

        // Status do servidor
        this.app.get('/status', (req, res) => {
            res.json({
                status: 'running',
                uptime: process.uptime(),
                memory: process.memoryUsage(),
                timestamp: new Date().toISOString()
            });
        });

        // Logs recentes
        this.app.get('/logs', (req, res) => {
            this.getRecentLogs(req, res);
        });

        // Dashboard simples
        this.app.get('/dashboard', (req, res) => {
            this.serveDashboard(req, res);
        });

        // API para obter eventos recentes
        this.app.get('/api/events', (req, res) => {
            this.getRecentEvents(req, res);
        });
    }

    /**
     * 🔐 Verificar assinatura do webhook
     */
    verifyWebhookSignature(payload, signature) {
        if (!signature) {
            return false;
        }

        const expectedSignature = crypto
            .createHmac('sha256', this.webhookSecret)
            .update(payload)
            .digest('hex');

        const providedSignature = signature.replace('sha256=', '');
        
        return crypto.timingSafeEqual(
            Buffer.from(expectedSignature, 'hex'),
            Buffer.from(providedSignature, 'hex')
        );
    }

    /**
     * 🔔 Processar webhook do Xcode Cloud
     */
    handleXcodeCloudWebhook(req, res) {
        console.log('🔔 Webhook recebido do Xcode Cloud');
        
        try {
            const signature = req.headers['x-hub-signature-256'] || req.headers['x-signature'];
            const payload = req.body;
            
            // Verificar assinatura (se configurada)
            if (this.webhookSecret !== 'default-secret' && !this.verifyWebhookSignature(payload, signature)) {
                console.log('❌ Assinatura do webhook inválida');
                return res.status(401).json({ error: 'Invalid signature' });
            }

            // Parsear payload
            let eventData;
            try {
                eventData = typeof payload === 'string' ? JSON.parse(payload) : payload;
            } catch (error) {
                console.error('❌ Erro ao parsear payload:', error);
                return res.status(400).json({ error: 'Invalid JSON payload' });
            }

            // Processar evento
            this.processWebhookEvent(eventData);
            
            // Responder sucesso
            res.status(200).json({ 
                status: 'received',
                timestamp: new Date().toISOString()
            });

        } catch (error) {
            console.error('❌ Erro ao processar webhook:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    /**
     * ⚡ Processar evento do webhook
     */
    processWebhookEvent(eventData) {
        const eventType = eventData.type || eventData.eventType || 'unknown';
        const timestamp = new Date().toISOString();
        
        console.log(`📨 Evento recebido: ${eventType}`);
        
        // Estrutura do evento
        const processedEvent = {
            id: crypto.randomUUID(),
            type: eventType,
            timestamp: timestamp,
            data: eventData,
            processed: true
        };

        // Processar diferentes tipos de eventos
        switch (eventType) {
            case 'build.started':
                this.handleBuildStarted(processedEvent);
                break;
            case 'build.completed':
                this.handleBuildCompleted(processedEvent);
                break;
            case 'build.failed':
                this.handleBuildFailed(processedEvent);
                break;
            case 'test.completed':
                this.handleTestCompleted(processedEvent);
                break;
            default:
                this.handleGenericEvent(processedEvent);
        }

        // Salvar evento
        this.saveEvent(processedEvent);
        
        // Notificar dashboard (se conectado via WebSocket)
        this.notifyDashboard(processedEvent);
    }

    /**
     * 🏗️ Processar início de build
     */
    handleBuildStarted(event) {
        console.log('🏗️ Build iniciado:', event.data.buildId || 'ID não disponível');
        
        // Aqui você pode adicionar lógica personalizada:
        // - Enviar notificação para Slack/Discord
        // - Atualizar status em dashboard
        // - Iniciar monitoramento
    }

    /**
     * ✅ Processar build completado
     */
    handleBuildCompleted(event) {
        console.log('✅ Build completado:', event.data.buildId || 'ID não disponível');
        
        // Lógica para build completado:
        // - Notificar equipe
        // - Atualizar métricas
        // - Preparar para deploy
    }

    /**
     * ❌ Processar build falhado
     */
    handleBuildFailed(event) {
        console.log('❌ Build falhou:', event.data.buildId || 'ID não disponível');
        
        // Lógica para build falhado:
        // - Alertar desenvolvedores
        // - Coletar logs de erro
        // - Criar issue automático
    }

    /**
     * 🧪 Processar testes completados
     */
    handleTestCompleted(event) {
        console.log('🧪 Testes completados:', event.data.testResults || 'Resultados não disponíveis');
        
        // Lógica para testes:
        // - Analisar resultados
        // - Gerar relatórios
        // - Notificar sobre falhas
    }

    /**
     * 📝 Processar evento genérico
     */
    handleGenericEvent(event) {
        console.log('📝 Evento genérico processado:', event.type);
    }

    /**
     * 💾 Salvar evento
     */
    saveEvent(event) {
        const date = new Date().toISOString().split('T')[0];
        const logFile = path.join(this.logPath, `events-${date}.json`);
        
        let events = [];
        if (fs.existsSync(logFile)) {
            try {
                const content = fs.readFileSync(logFile, 'utf8');
                events = JSON.parse(content);
            } catch (error) {
                console.error('❌ Erro ao ler log existente:', error);
            }
        }
        
        events.push(event);
        
        // Manter apenas os últimos 1000 eventos por dia
        if (events.length > 1000) {
            events = events.slice(-1000);
        }
        
        try {
            fs.writeFileSync(logFile, JSON.stringify(events, null, 2));
        } catch (error) {
            console.error('❌ Erro ao salvar evento:', error);
        }
    }

    /**
     * 📊 Obter eventos recentes
     */
    getRecentEvents(req, res) {
        const limit = parseInt(req.query.limit) || 50;
        const date = new Date().toISOString().split('T')[0];
        const logFile = path.join(this.logPath, `events-${date}.json`);
        
        try {
            if (fs.existsSync(logFile)) {
                const content = fs.readFileSync(logFile, 'utf8');
                const events = JSON.parse(content);
                const recentEvents = events.slice(-limit).reverse();
                
                res.json({
                    events: recentEvents,
                    total: events.length,
                    date: date
                });
            } else {
                res.json({
                    events: [],
                    total: 0,
                    date: date
                });
            }
        } catch (error) {
            console.error('❌ Erro ao obter eventos:', error);
            res.status(500).json({ error: 'Failed to load events' });
        }
    }

    /**
     * 📋 Obter logs recentes
     */
    getRecentLogs(req, res) {
        const limit = parseInt(req.query.limit) || 100;
        
        try {
            const files = fs.readdirSync(this.logPath)
                .filter(file => file.startsWith('events-') && file.endsWith('.json'))
                .sort()
                .reverse()
                .slice(0, 3); // Últimos 3 dias
            
            let allEvents = [];
            
            for (const file of files) {
                const filePath = path.join(this.logPath, file);
                const content = fs.readFileSync(filePath, 'utf8');
                const events = JSON.parse(content);
                allEvents = allEvents.concat(events);
            }
            
            const recentEvents = allEvents
                .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                .slice(0, limit);
            
            res.json({
                events: recentEvents,
                total: allEvents.length,
                files: files.length
            });
        } catch (error) {
            console.error('❌ Erro ao obter logs:', error);
            res.status(500).json({ error: 'Failed to load logs' });
        }
    }

    /**
     * 🎨 Servir dashboard
     */
    serveDashboard(req, res) {
        const dashboardHTML = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Xcode Cloud Dashboard</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f5f5f7; }
        .header { background: #1d1d1f; color: white; padding: 1rem; text-align: center; }
        .container { max-width: 1200px; margin: 2rem auto; padding: 0 1rem; }
        .card { background: white; border-radius: 12px; padding: 1.5rem; margin-bottom: 1rem; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .status { display: flex; gap: 1rem; margin-bottom: 2rem; }
        .status-item { flex: 1; text-align: center; padding: 1rem; background: #007aff; color: white; border-radius: 8px; }
        .events { max-height: 400px; overflow-y: auto; }
        .event { padding: 0.75rem; border-left: 4px solid #007aff; margin-bottom: 0.5rem; background: #f8f9fa; border-radius: 4px; }
        .event.build-started { border-color: #ff9500; }
        .event.build-completed { border-color: #34c759; }
        .event.build-failed { border-color: #ff3b30; }
        .refresh-btn { background: #007aff; color: white; border: none; padding: 0.5rem 1rem; border-radius: 6px; cursor: pointer; }
        .timestamp { font-size: 0.8rem; color: #666; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🚀 Xcode Cloud Dashboard</h1>
        <p>Monitoramento em tempo real</p>
    </div>
    
    <div class="container">
        <div class="status">
            <div class="status-item">
                <h3 id="total-events">0</h3>
                <p>Total de Eventos</p>
            </div>
            <div class="status-item">
                <h3 id="builds-today">0</h3>
                <p>Builds Hoje</p>
            </div>
            <div class="status-item">
                <h3 id="last-event">-</h3>
                <p>Último Evento</p>
            </div>
        </div>
        
        <div class="card">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                <h2>📨 Eventos Recentes</h2>
                <button class="refresh-btn" onclick="loadEvents()">Atualizar</button>
            </div>
            <div class="events" id="events-container">
                <p>Carregando eventos...</p>
            </div>
        </div>
    </div>

    <script>
        async function loadEvents() {
            try {
                const response = await fetch('/api/events?limit=20');
                const data = await response.json();
                
                document.getElementById('total-events').textContent = data.total;
                document.getElementById('builds-today').textContent = data.events.filter(e => e.type.includes('build')).length;
                document.getElementById('last-event').textContent = data.events.length > 0 ? 
                    new Date(data.events[0].timestamp).toLocaleTimeString() : '-';
                
                const container = document.getElementById('events-container');
                if (data.events.length === 0) {
                    container.innerHTML = '<p>Nenhum evento encontrado</p>';
                    return;
                }
                
                container.innerHTML = data.events.map(event => \`
                    <div class="event \${event.type.replace('.', '-')}">
                        <strong>\${event.type}</strong>
                        <div class="timestamp">\${new Date(event.timestamp).toLocaleString()}</div>
                        <div style="margin-top: 0.5rem; font-size: 0.9rem;">
                            \${JSON.stringify(event.data, null, 2).substring(0, 200)}...
                        </div>
                    </div>
                \`).join('');
            } catch (error) {
                console.error('Erro ao carregar eventos:', error);
                document.getElementById('events-container').innerHTML = '<p>Erro ao carregar eventos</p>';
            }
        }
        
        // Carregar eventos inicialmente
        loadEvents();
        
        // Atualizar a cada 30 segundos
        setInterval(loadEvents, 30000);
    </script>
</body>
</html>`;
        
        res.send(dashboardHTML);
    }

    /**
     * 🔔 Notificar dashboard (placeholder para WebSocket)
     */
    notifyDashboard(event) {
        // Aqui você pode implementar WebSocket para notificações em tempo real
        console.log('📡 Notificação enviada para dashboard:', event.type);
    }

    /**
     * 📁 Garantir diretório de logs
     */
    ensureLogDirectory() {
        if (!fs.existsSync(this.logPath)) {
            fs.mkdirSync(this.logPath, { recursive: true });
        }
    }

    /**
     * 🚀 Iniciar servidor
     */
    start() {
        this.app.listen(this.port, () => {
            console.log('🚀 SERVIDOR DE WEBHOOKS XCODE CLOUD INICIADO');
            console.log(`📡 Servidor rodando em: http://localhost:${this.port}`);
            console.log(`🎨 Dashboard disponível em: http://localhost:${this.port}/dashboard`);
            console.log(`🔔 Webhook URL: http://localhost:${this.port}/webhook`);
            console.log('\n📋 CONFIGURAÇÃO NO APP STORE CONNECT:');
            console.log(`   Webhook URL: http://your-domain.com:${this.port}/webhook`);
            console.log(`   Secret: ${this.webhookSecret}`);
        });
    }

    /**
     * 🛑 Parar servidor
     */
    stop() {
        console.log('🛑 Parando servidor de webhooks...');
        process.exit(0);
    }
}

// Exportar classe
module.exports = XcodeCloudWebhookServer;

// Executar se chamado diretamente
if (require.main === module) {
    const server = new XcodeCloudWebhookServer();
    
    // Handlers para parada graceful
    process.on('SIGINT', () => server.stop());
    process.on('SIGTERM', () => server.stop());
    
    server.start();
}