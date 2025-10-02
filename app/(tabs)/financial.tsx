import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import GradientCard from '../../components/ui/GradientCard';
import PsiqueButton from '../../components/ui/PsiqueButton';
import { showAlert } from '../../hooks/useAuth';

const { width } = Dimensions.get('window');

export default function Financial() {
  const insets = useSafeAreaInsets();
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  const financialData = {
    month: {
      totalRevenue: 'R$ 12.450,00',
      sessionsCompleted: 48,
      averageSession: 'R$ 259,38',
      pendingPayments: 'R$ 1.850,00',
      growth: '+15.2%',
    },
    week: {
      totalRevenue: 'R$ 3.200,00',
      sessionsCompleted: 12,
      averageSession: 'R$ 266,67',
      pendingPayments: 'R$ 650,00',
      growth: '+8.5%',
    },
    year: {
      totalRevenue: 'R$ 148.500,00',
      sessionsCompleted: 580,
      averageSession: 'R$ 256,03',
      pendingPayments: 'R$ 4.200,00',
      growth: '+22.8%',
    },
  };

  const currentData = financialData[selectedPeriod as keyof typeof financialData];

  const recentTransactions = [
    {
      id: 1,
      patient: 'Maria Silva',
      amount: 'R$ 250,00',
      date: '15/01/2024',
      status: 'paid',
      method: 'PIX',
    },
    {
      id: 2,
      patient: 'João Santos',
      amount: 'R$ 280,00',
      date: '14/01/2024',
      status: 'pending',
      method: 'Cartão',
    },
    {
      id: 3,
      patient: 'Ana Costa',
      amount: 'R$ 220,00',
      date: '13/01/2024',
      status: 'paid',
      method: 'Transferência',
    },
    {
      id: 4,
      patient: 'Carlos Lima',
      amount: 'R$ 300,00',
      date: '12/01/2024',
      status: 'overdue',
      method: 'Boleto',
    },
  ];

  const monthlyChart = [
    { month: 'Jan', value: 12450, sessions: 48 },
    { month: 'Fev', value: 11200, sessions: 44 },
    { month: 'Mar', value: 13850, sessions: 52 },
    { month: 'Abr', value: 10950, sessions: 41 },
    { month: 'Mai', value: 15200, sessions: 58 },
    { month: 'Jun', value: 14100, sessions: 55 },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return '#20B2AA';
      case 'pending': return '#FFD700';
      case 'overdue': return '#FF6B6B';
      default: return '#7B68EE';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'paid': return 'Pago';
      case 'pending': return 'Pendente';
      case 'overdue': return 'Vencido';
      default: return status;
    }
  };

  const maxValue = Math.max(...monthlyChart.map(item => item.value));

  const handleExportReport = () => {
    showAlert(
      'Exportar Relatório',
      `📊 Relatório ${selectedPeriod === 'month' ? 'Mensal' : selectedPeriod === 'week' ? 'Semanal' : 'Anual'}\n\n📈 Receita: ${currentData.totalRevenue}\n👥 Sessões: ${currentData.sessionsCompleted}\n💰 Ticket Médio: ${currentData.averageSession}\n⏳ Pendentes: ${currentData.pendingPayments}\n\n📧 Relatório será enviado por email em 5 minutos.`
    );
  };

  const handleGenerateReport = () => {
    showAlert(
      'Relatório Mensal',
      '📋 Gerando relatório automático...\n\n✅ Receitas por categoria\n✅ Pacientes atendidos\n✅ Performance comparativa\n✅ Projeções futuras\n✅ Gastos operacionais\n\n🕐 Disponível em 2 minutos na seção Downloads.'
    );
  };

  const handleCollectPending = () => {
    const pendingCount = recentTransactions.filter(t => t.status === 'pending' || t.status === 'overdue').length;
    showAlert(
      'Sistema de Cobrança',
      `💳 Cobrança Automática Ativada\n\n📊 ${pendingCount} pagamentos pendentes\n💰 Total: ${currentData.pendingPayments}\n\n📧 Enviando lembretes por:\n• Email automatizado\n• SMS personalizado\n• WhatsApp Business\n\n⚡ Resultados em 24-48h`
    );
  };

  const handleConfigurePrices = () => {
    showAlert(
      'Configuração de Preços',
      '💰 Tabela de Valores Atual:\n\n👤 Individual: R$ 250,00\n👫 Casal: R$ 350,00\n👥 Grupo: R$ 150,00\n🏥 Avaliação: R$ 300,00\n📞 Online: -10%\n\n✏️ Para alterar valores, acesse:\nConfigurações > Precificação'
    );
  };

  const handleFullHistory = () => {
    const totalTransactions = recentTransactions.length * 12; // Simulate larger history
    const totalRevenue = '156.240,00';
    showAlert(
      'Histórico Completo',
      `📊 Relatório Anual Completo\n\n💰 Receita Total: R$ ${totalRevenue}\n📈 Transações: ${totalTransactions}\n👥 Pacientes Únicos: 89\n📅 Período: Jan 2024 - Dez 2024\n\n🔍 Filtros Disponíveis:\n• Por paciente\n• Por método de pagamento\n• Por status\n• Por período personalizado`
    );
  };

  return (
    <LinearGradient
      colors={['#0A0E1A', '#1A1A2E', '#16213E']}
      style={[styles.container, { paddingTop: insets.top }]}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Gestão Financeira</Text>
          <Text style={styles.subtitle}>Controle suas receitas e pagamentos</Text>
        </View>
        <TouchableOpacity style={styles.exportButton} onPress={handleExportReport}>
          <MaterialIcons name="file-download" size={24} color="#00E5FF" />
        </TouchableOpacity>
      </View>

      {/* Filtros de Período */}
      <View style={styles.periodSelector}>
        {[
          { key: 'week', label: 'Semana' },
          { key: 'month', label: 'Mês' },
          { key: 'year', label: 'Ano' },
        ].map((period) => (
          <TouchableOpacity
            key={period.key}
            style={[
              styles.periodButton,
              selectedPeriod === period.key && styles.periodButtonActive,
            ]}
            onPress={() => setSelectedPeriod(period.key)}
          >
            <Text
              style={[
                styles.periodText,
                selectedPeriod === period.key && styles.periodTextActive,
              ]}
            >
              {period.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Cards de Métricas */}
        <View style={styles.metricsContainer}>
          <View style={styles.metricsRow}>
            <GradientCard style={styles.metricCard}>
              <View style={styles.metricContent}>
                <View style={styles.metricHeader}>
                  <MaterialIcons name="attach-money" size={28} color="#00E5FF" />
                  <Text style={styles.growthText}>{currentData.growth}</Text>
                </View>
                <Text style={styles.metricValue}>{currentData.totalRevenue}</Text>
                <Text style={styles.metricLabel}>Receita Total</Text>
              </View>
            </GradientCard>
            
            <GradientCard style={styles.metricCard}>
              <View style={styles.metricContent}>
                <MaterialIcons name="psychology" size={28} color="#7B68EE" />
                <Text style={styles.metricValue}>{currentData.sessionsCompleted}</Text>
                <Text style={styles.metricLabel}>Sessões</Text>
              </View>
            </GradientCard>
          </View>
          
          <View style={styles.metricsRow}>
            <GradientCard style={styles.metricCard}>
              <View style={styles.metricContent}>
                <MaterialIcons name="trending-up" size={28} color="#20B2AA" />
                <Text style={styles.metricValue}>{currentData.averageSession}</Text>
                <Text style={styles.metricLabel}>Ticket Médio</Text>
              </View>
            </GradientCard>
            
            <GradientCard style={styles.metricCard}>
              <View style={styles.metricContent}>
                <MaterialIcons name="schedule" size={28} color="#FFD700" />
                <Text style={styles.metricValue}>{currentData.pendingPayments}</Text>
                <Text style={styles.metricLabel}>Pendentes</Text>
              </View>
            </GradientCard>
          </View>
        </View>

        {/* Gráfico de Receita Mensal */}
        <GradientCard style={styles.chartCard}>
          <View style={styles.chartContent}>
            <Text style={styles.chartTitle}>Receita dos Últimos 6 Meses</Text>
            <View style={styles.chartContainer}>
              {monthlyChart.map((item, index) => (
                <View key={index} style={styles.chartBar}>
                  <View style={styles.chartBarContainer}>
                    <LinearGradient
                      colors={['#00E5FF', '#7B68EE', '#20B2AA']}
                      style={[
                        styles.chartBarFill,
                        { height: `${(item.value / maxValue) * 100}%` }
                      ]}
                    />
                  </View>
                  <Text style={styles.chartValue}>R$ {(item.value / 1000).toFixed(1)}k</Text>
                  <Text style={styles.chartLabel}>{item.month}</Text>
                  <Text style={styles.chartSessions}>{item.sessions} sessões</Text>
                </View>
              ))}
            </View>
          </View>
        </GradientCard>

        {/* Transações Recentes */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Transações Recentes</Text>
            <TouchableOpacity onPress={handleFullHistory}>
              <Text style={styles.seeAllText}>Ver todas</Text>
            </TouchableOpacity>
          </View>

          {recentTransactions.map((transaction) => (
            <GradientCard key={transaction.id} style={styles.transactionCard}>
              <View style={styles.transactionContent}>
                <View style={styles.transactionLeft}>
                  <Text style={styles.transactionPatient}>{transaction.patient}</Text>
                  <Text style={styles.transactionDate}>{transaction.date} • {transaction.method}</Text>
                </View>
                <View style={styles.transactionRight}>
                  <Text style={styles.transactionAmount}>{transaction.amount}</Text>
                  <View style={[
                    styles.statusBadge,
                    { backgroundColor: getStatusColor(transaction.status) + '20' }
                  ]}>
                    <Text style={[
                      styles.statusText,
                      { color: getStatusColor(transaction.status) }
                    ]}>
                      {getStatusText(transaction.status)}
                    </Text>
                  </View>
                </View>
              </View>
            </GradientCard>
          ))}
        </View>

        {/* Ações Rápidas */}
        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Ações Rápidas</Text>
          <View style={styles.actionsGrid}>
            <PsiqueButton 
              title="Gerar Relatório"
              onPress={handleGenerateReport}
              style={styles.actionButton}
              variant="primary"
            />
            <PsiqueButton 
              title="Cobrar Pendentes"
              onPress={handleCollectPending}
              style={styles.actionButton}
              variant="outline"
            />
          </View>
          <View style={styles.actionsGrid}>
            <PsiqueButton 
              title="Configurar Preços"
              onPress={handleConfigurePrices}
              style={styles.actionButton}
              variant="secondary"
            />
            <PsiqueButton 
              title="Histórico Completo"
              onPress={handleFullHistory}
              style={styles.actionButton}
              variant="outline"
            />
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 229, 255, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#7B68EE',
    marginTop: 4,
  },
  exportButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0, 229, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 255, 0.3)',
  },
  periodSelector: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: 'rgba(22, 33, 62, 0.6)',
    borderRadius: 12,
    padding: 4,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  periodButtonActive: {
    backgroundColor: '#00E5FF',
  },
  periodText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7B68EE',
  },
  periodTextActive: {
    color: '#0A0E1A',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  metricsContainer: {
    marginBottom: 24,
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  metricCard: {
    width: '48%',
  },
  metricContent: {
    padding: 20,
    alignItems: 'center',
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 12,
  },
  growthText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#20B2AA',
    backgroundColor: 'rgba(32, 178, 170, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
    textAlign: 'center',
  },
  metricLabel: {
    fontSize: 12,
    color: '#7B68EE',
    textAlign: 'center',
  },
  chartCard: {
    marginBottom: 24,
  },
  chartContent: {
    padding: 20,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
    textAlign: 'center',
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 200,
    paddingHorizontal: 10,
  },
  chartBar: {
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 2,
  },
  chartBarContainer: {
    width: 24,
    height: 120,
    backgroundColor: 'rgba(22, 33, 62, 0.6)',
    borderRadius: 4,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  chartBarFill: {
    width: '100%',
    borderRadius: 4,
  },
  chartValue: {
    fontSize: 10,
    color: '#00E5FF',
    fontWeight: '600',
    marginTop: 8,
  },
  chartLabel: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
    marginTop: 4,
  },
  chartSessions: {
    fontSize: 9,
    color: '#7B68EE',
    marginTop: 2,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  seeAllText: {
    fontSize: 14,
    color: '#00E5FF',
    fontWeight: '600',
  },
  transactionCard: {
    marginBottom: 12,
  },
  transactionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  transactionLeft: {
    flex: 1,
  },
  transactionPatient: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  transactionDate: {
    fontSize: 12,
    color: '#7B68EE',
    marginTop: 4,
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00E5FF',
    marginBottom: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
  },
  quickActions: {
    marginBottom: 24,
  },
  actionsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  actionButton: {
    flex: 1,
  },
});