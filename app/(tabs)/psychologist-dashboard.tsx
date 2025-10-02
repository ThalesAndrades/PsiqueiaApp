import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import GradientCard from '../../components/ui/GradientCard';
import PsiqueButton from '../../components/ui/PsiqueButton';
import InteractiveInfographic from '../../components/ui/InteractiveInfographic';
import { useAuth, useAppActions } from '../../hooks/useAuth';

const { width } = Dimensions.get('window');

export default function PsychologistDashboard() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { handleNotifications, handleChatList } = useAppActions();

  // Dados do infográfico para psicólogos
  const psychologistData = [
    { id: '1', title: 'Maria Silva - Ansiedade', category: 'Pacientes Ativos', type: 'Sessão Hoje', color: '#00E5FF' },
    { id: '2', title: 'João Santos - Depressão', category: 'Pacientes Ativos', type: 'Próxima: 15h', color: '#00E5FF' },
    { id: '3', title: 'Ana Costa - Finalizada', category: 'Pacientes Inativos', type: 'Concluído', color: '#7B68EE' },
    { id: '4', title: 'Carlos Lima - Terapia Casal', category: 'Pacientes Ativos', type: 'Agendado', color: '#00E5FF' },
    { id: '5', title: 'Relatório Mensal', category: 'Administrativo', type: 'Pendente', color: '#20B2AA' },
    { id: '6', title: 'Atualização de Prontuário', category: 'Administrativo', type: 'Vencido', color: '#20B2AA' },
    { id: '7', title: 'Lúcia Santos - Trauma', category: 'Pacientes Ativos', type: 'Emergência', color: '#00E5FF' },
    { id: '8', title: 'Certificação Continuada', category: 'Desenvolvimento', type: 'Em Progresso', color: '#FFD700' },
  ];

  const psychologistCategories = [
    { name: 'Pacientes Ativos', color: '#00E5FF', icon: 'people', count: 4 },
    { name: 'Administrativo', color: '#20B2AA', icon: 'assignment', count: 2 },
    { name: 'Pacientes Inativos', color: '#7B68EE', icon: 'person-off', count: 1 },
    { name: 'Desenvolvimento', color: '#FFD700', icon: 'school', count: 1 },
  ];

  const quickActions = [
    { 
      icon: 'person-add', 
      title: 'Novo Paciente', 
      color: '#00E5FF', 
      subtitle: 'Cadastrar',
      bgColor: 'rgba(0, 229, 255, 0.1)',
      onPress: () => console.log('Novo Paciente')
    },
    { 
      icon: 'event', 
      title: 'Agendar Sessão', 
      color: '#7B68EE', 
      subtitle: 'Calendário',
      bgColor: 'rgba(123, 104, 238, 0.1)',
      onPress: () => console.log('Agendar Sessão')
    },
    { 
      icon: 'assessment', 
      title: 'Relatórios', 
      color: '#20B2AA', 
      subtitle: 'Análises',
      bgColor: 'rgba(32, 178, 170, 0.1)',
      onPress: () => console.log('Relatórios')
    },
    { 
      icon: 'chat', 
      title: 'Mensagens', 
      color: '#FF6B9D', 
      subtitle: '3 novas',
      bgColor: 'rgba(255, 107, 157, 0.1)',
      onPress: handleChatList
    },
  ];

  const todaySessions = [
    { id: 1, patient: 'Maria Silva', time: '09:00', type: 'Individual', status: 'confirmed' },
    { id: 2, patient: 'João Santos', time: '14:30', type: 'Casal', status: 'pending' },
    { id: 3, patient: 'Ana Costa', time: '16:00', type: 'Individual', status: 'confirmed' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return '#20B2AA';
      case 'pending': return '#FFD700';
      case 'cancelled': return '#FF6B6B';
      default: return '#7B68EE';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Confirmado';
      case 'pending': return 'Pendente';
      case 'cancelled': return 'Cancelado';
      default: return status;
    }
  };

  return (
    <LinearGradient
      colors={['#0A0E1A', '#1A1A2E', '#16213E']}
      style={[styles.container, { paddingTop: insets.top }]}
    >
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Dr(a). {user?.profile?.name?.split(' ')[0] || 'Psicólogo'}!</Text>
            <Text style={styles.subtitle}>Painel de Controle Profissional</Text>
          </View>
          <TouchableOpacity style={styles.notificationButton} onPress={handleNotifications}>
            <MaterialIcons name="notifications" size={24} color="#00E5FF" />
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationText}>5</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Métricas Principais */}
        <View style={styles.metricsContainer}>
          <View style={styles.metricsRow}>
            <GradientCard style={styles.metricCard}>
              <View style={styles.metricContent}>
                <View style={styles.metricIcon}>
                  <MaterialIcons name="people" size={28} color="#00E5FF" />
                </View>
                <Text style={styles.metricValue}>25</Text>
                <Text style={styles.metricLabel}>Pacientes Ativos</Text>
              </View>
            </GradientCard>
            
            <GradientCard style={styles.metricCard}>
              <View style={styles.metricContent}>
                <View style={styles.metricIcon}>
                  <MaterialIcons name="today" size={28} color="#7B68EE" />
                </View>
                <Text style={styles.metricValue}>3</Text>
                <Text style={styles.metricLabel}>Sessões Hoje</Text>
              </View>
            </GradientCard>
          </View>
          
          <View style={styles.metricsRow}>
            <GradientCard style={styles.metricCard}>
              <View style={styles.metricContent}>
                <View style={styles.metricIcon}>
                  <MaterialIcons name="date-range" size={28} color="#20B2AA" />
                </View>
                <Text style={styles.metricValue}>12</Text>
                <Text style={styles.metricLabel}>Esta Semana</Text>
              </View>
            </GradientCard>
            
            <GradientCard style={styles.metricCard}>
              <View style={styles.metricContent}>
                <View style={styles.metricIcon}>
                  <MaterialIcons name="star" size={28} color="#FFD700" />
                </View>
                <Text style={styles.metricValue}>4.8</Text>
                <Text style={styles.metricLabel}>Avaliação</Text>
              </View>
            </GradientCard>
          </View>
        </View>

        {/* Infográfico Interativo */}
        <GradientCard style={styles.infographicCard}>
          <View style={styles.infographicContent}>
            <InteractiveInfographic
              data={psychologistData}
              title="Visão Geral da Prática"
              categories={psychologistCategories}
              onItemPress={(item) => console.log('Item selecionado:', item.title)}
            />
          </View>
        </GradientCard>

        {/* Ações Rápidas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ações Rápidas</Text>
          <View style={styles.actionsGrid}>
            {quickActions.map((action, index) => (
              <TouchableOpacity key={index} style={styles.actionCard} onPress={action.onPress}>
                <GradientCard style={styles.actionGradientCard}>
                  <View style={styles.actionContent}>
                    <View style={[styles.actionIcon, { backgroundColor: action.bgColor }]}>
                      <MaterialIcons name={action.icon as any} size={28} color={action.color} />
                    </View>
                    <Text style={styles.actionTitle}>{action.title}</Text>
                    <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
                  </View>
                </GradientCard>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Sessões de Hoje */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Agenda do Dia</Text>
          <GradientCard style={styles.sessionsCard}>
            <View style={styles.sessionsContent}>
              {todaySessions.map((session) => (
                <View key={session.id} style={styles.sessionItem}>
                  <View style={styles.sessionTime}>
                    <View style={styles.timeIcon}>
                      <MaterialIcons name="schedule" size={20} color="#00E5FF" />
                    </View>
                    <Text style={styles.sessionTimeText}>{session.time}</Text>
                  </View>
                  <View style={styles.sessionInfo}>
                    <Text style={styles.sessionPatient}>{session.patient}</Text>
                    <Text style={styles.sessionType}>{session.type}</Text>
                  </View>
                  <View style={[styles.sessionStatus, { backgroundColor: getStatusColor(session.status) + '20' }]}>
                    <Text style={[styles.sessionStatusText, { color: getStatusColor(session.status) }]}>
                      {getStatusText(session.status)}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </GradientCard>
        </View>

        {/* Receita do Mês */}
        <GradientCard style={styles.revenueCard}>
          <View style={styles.revenueContent}>
            <View style={styles.revenueHeader}>
              <MaterialIcons name="account-balance-wallet" size={24} color="#20B2AA" />
              <Text style={styles.revenueTitle}>Receita do Mês</Text>
            </View>
            <Text style={styles.revenueValue}>R$ 12.450,00</Text>
            <Text style={styles.revenueGrowth}>+15.2% vs mês anterior</Text>
            <View style={styles.revenueStats}>
              <View style={styles.revenueStat}>
                <Text style={styles.revenueStatValue}>48</Text>
                <Text style={styles.revenueStatLabel}>Sessões</Text>
              </View>
              <View style={styles.revenueStat}>
                <Text style={styles.revenueStatValue}>R$ 259</Text>
                <Text style={styles.revenueStatLabel}>Ticket Médio</Text>
              </View>
            </View>
          </View>
        </GradientCard>

        {/* Botões de Ação */}
        <View style={styles.actionButtons}>
          <PsiqueButton 
            title="Agendar Sessão"
            onPress={() => {}}
            style={styles.primaryButton}
          />
          <PsiqueButton 
            title="Ver Agenda Completa"
            onPress={() => {}}
            style={styles.secondaryButton}
            variant="outline"
          />
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greeting: {
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
  notificationButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0, 229, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 255, 0.3)',
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#FF6B6B',
    borderRadius: 8,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: 'bold',
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
  metricIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(0, 229, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 12,
    color: '#7B68EE',
    textAlign: 'center',
  },
  infographicCard: {
    marginBottom: 24,
    minHeight: 400,
  },
  infographicContent: {
    padding: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: '48%',
    marginBottom: 16,
  },
  actionGradientCard: {
    flex: 1,
  },
  actionContent: {
    padding: 20,
    alignItems: 'center',
    minHeight: 130,
    justifyContent: 'center',
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
    textAlign: 'center',
  },
  actionSubtitle: {
    fontSize: 12,
    color: '#7B68EE',
    textAlign: 'center',
  },
  sessionsCard: {
    marginBottom: 16,
  },
  sessionsContent: {
    padding: 20,
  },
  sessionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(123, 104, 238, 0.2)',
  },
  sessionTime: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 90,
  },
  timeIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 229, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  sessionTimeText: {
    fontSize: 14,
    color: '#00E5FF',
    fontWeight: '600',
  },
  sessionInfo: {
    flex: 1,
    marginLeft: 16,
  },
  sessionPatient: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  sessionType: {
    fontSize: 14,
    color: '#7B68EE',
    marginTop: 2,
  },
  sessionStatus: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  sessionStatusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  revenueCard: {
    marginBottom: 24,
  },
  revenueContent: {
    padding: 24,
  },
  revenueHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  revenueTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  revenueValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#20B2AA',
    marginBottom: 8,
  },
  revenueGrowth: {
    fontSize: 14,
    color: '#20B2AA',
    marginBottom: 20,
  },
  revenueStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  revenueStat: {
    alignItems: 'center',
  },
  revenueStatValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  revenueStatLabel: {
    fontSize: 12,
    color: '#7B68EE',
    marginTop: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  primaryButton: {
    flex: 1,
  },
  secondaryButton: {
    flex: 1,
  },
});