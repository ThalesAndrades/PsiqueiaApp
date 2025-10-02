
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import GradientCard from '../../components/ui/GradientCard';
import PsiqueButton from '../../components/ui/PsiqueButton';
import { useAppActions, showAlert } from '../../hooks/useAuth';

export default function Sessions() {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'history'>('upcoming');
  const { handleCalendar, handleNewSession, handleEnterSession, handleReschedule } = useAppActions();

  const upcomingSessions = [
    {
      id: 1,
      date: '2024-01-15',
      time: '15:30',
      type: 'Terapia Cognitiva Comportamental',
      therapist: 'Dr. Maria Silva',
      status: 'confirmed',
    },
    {
      id: 2,
      date: '2024-01-18',
      time: '10:00',
      type: 'Sessão de Mindfulness',
      therapist: 'Dr. João Santos',
      status: 'pending',
    },
  ];

  const sessionHistory = [
    {
      id: 3,
      date: '2024-01-10',
      time: '14:00',
      type: 'Avaliação Inicial',
      therapist: 'Dr. Ana Costa',
      rating: 5,
      notes: 'Sessão muito produtiva',
    },
    {
      id: 4,
      date: '2024-01-08',
      time: '16:30',
      type: 'Terapia Individual',
      therapist: 'Dr. Maria Silva',
      rating: 4,
      notes: 'Bom progresso',
    },
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });
  };

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

  const handleViewDetails = (session: any) => {
    const isUpcoming = upcomingSessions.find(s => s.id === session.id);

    if (isUpcoming) {
      showAlert(
        '📋 Detalhes da Sessão',
        `📅 ${formatDate(session.date)}\n🕐 ${session.time}\n\n👨‍⚕️ Terapeuta: ${session.therapist}\n📋 Tipo: ${session.type}\n\n📍 Status: ${getStatusText(session.status)}\n\n💡 Recomendações:\n• Chegue 5 minutos antes\n• Teste sua conexão prévia\n• Tenha água por perto\n• Ambiente silencioso\n\n📞 Dúvidas: (11) 9999-8888`
      );
    } else {
      const stars = '⭐'.repeat(session.rating) + '☆'.repeat(5 - session.rating);
      showAlert(
        '📜 Histórico da Sessão',
        `📅 ${formatDate(session.date)} - ${session.time}\n\n👨‍⚕️ Terapeuta: ${session.therapist}\n📋 Tipo: ${session.type}\n\n⭐ Sua avaliação: ${stars}\n(${session.rating}/5 estrelas)\n\n📝 Suas observações:\n"${session.notes}"\n\n📊 Progresso detectado:\n• Melhora na comunicação\n• Redução da ansiedade\n• Maior autoconhecimento`
      );
    }
  };

  return (
    <LinearGradient
      colors={['#0A0A1F', '#1A1A2E', '#16213E']}
      style={[styles.container, { paddingTop: insets.top }]}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Sessões</Text>
        <TouchableOpacity style={styles.calendarButton} onPress={handleCalendar}>
          <MaterialIcons name="calendar-today" size={24} color="#00E5FF" />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'upcoming' && styles.activeTab]}
          onPress={() => setActiveTab('upcoming')}
        >
          <Text style={[styles.tabText, activeTab === 'upcoming' && styles.activeTabText]}>
            Próximas
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'history' && styles.activeTab]}
          onPress={() => setActiveTab('history')}
        >
          <Text style={[styles.tabText, activeTab === 'history' && styles.activeTabText]}>
            Histórico
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {activeTab === 'upcoming' ? (
          <>
            {/* Botão Nova Sessão */}
            <PsiqueButton
              title="➕ Agendar Nova Sessão"
              onPress={handleNewSession}
              style={styles.newSessionButton}
            />

            {/* Próximas Sessões */}
            {upcomingSessions.map((session) => (
              <GradientCard key={session.id} style={styles.sessionCard}>
                <View style={styles.sessionContent}>
                  <View style={styles.sessionHeader}>
                    <Text style={styles.sessionDate}>
                      {formatDate(session.date)}
                    </Text>
                    <View style={[
                      styles.statusBadge,
                      { backgroundColor: getStatusColor(session.status) + '20' }
                    ]}>
                      <Text style={[
                        styles.statusText,
                        { color: getStatusColor(session.status) }
                      ]}>
                        {getStatusText(session.status)}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.sessionTime}>{session.time}</Text>
                  <Text style={styles.sessionType}>{session.type}</Text>
                  <Text style={styles.therapistName}>{session.therapist}</Text>

                  <View style={styles.sessionActions}>
                    <PsiqueButton
                      title="🎥 Entrar"
                      onPress={handleEnterSession}
                      style={styles.actionButton}
                      variant="primary"
                    />
                    <PsiqueButton
                      title="🔄 Reagendar"
                      onPress={handleReschedule}
                      style={styles.actionButton}
                      variant="outline"
                    />
                  </View>

                  <TouchableOpacity
                    style={styles.viewDetailsButton}
                    onPress={() => handleViewDetails(session)}
                  >
                    <Text style={styles.viewDetailsText}>👁️ Ver Detalhes</Text>
                    <MaterialIcons name="arrow-forward" size={16} color="#00E5FF" />
                  </TouchableOpacity>
                </View>
              </GradientCard>
            ))}
          </>
        ) : (
          <>
            {/* Histórico de Sessões */}
            {sessionHistory.map((session) => (
              <GradientCard key={session.id} style={styles.sessionCard}>
                <View style={styles.sessionContent}>
                  <Text style={styles.sessionDate}>
                    {formatDate(session.date)} - {session.time}
                  </Text>
                  <Text style={styles.sessionType}>{session.type}</Text>
                  <Text style={styles.therapistName}>{session.therapist}</Text>

                  {/* Rating */}
                  <View style={styles.ratingContainer}>
                    <Text style={styles.ratingLabel}>Sua avaliação:</Text>
                    <View style={styles.stars}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <MaterialIcons
                          key={star}
                          name="star"
                          size={16}
                          color={star <= session.rating ? '#FFD700' : '#666'}
                        />
                      ))}
                    </View>
                  </View>

                  {session.notes && (
                    <Text style={styles.sessionNotes}>💭 &quot;{session.notes}&quot;</Text>
                  )}

                  <TouchableOpacity
                    style={styles.viewDetailsButton}
                    onPress={() => handleViewDetails(session)}
                  >
                    <Text style={styles.viewDetailsText}>📜 Ver Detalhes Completos</Text>
                    <MaterialIcons name="arrow-forward" size={16} color="#00E5FF" />
                  </TouchableOpacity>
                </View>
              </GradientCard>
            ))}
          </>
        )}

        {/* Estatísticas */}
        <GradientCard style={styles.statsCard}>
          <View style={styles.statsContent}>
            <Text style={styles.statsTitle}>📊 Estatísticas do Mês</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <MaterialIcons name="psychology" size={24} color="#00E5FF" />
                <Text style={styles.statValue}>12</Text>
                <Text style={styles.statLabel}>Sessões</Text>
              </View>
              <View style={styles.statItem}>
                <MaterialIcons name="schedule" size={24} color="#7B68EE" />
                <Text style={styles.statValue}>8h</Text>
                <Text style={styles.statLabel}>Total</Text>
              </View>
              <View style={styles.statItem}>
                <MaterialIcons name="star" size={24} color="#FFD700" />
                <Text style={styles.statValue}>4.8</Text>
                <Text style={styles.statLabel}>Avaliação</Text>
              </View>
            </View>
          </View>
        </GradientCard>
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
  },
  calendarButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#16213E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabs: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: '#16213E',
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#00E5FF',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#7B68EE',
  },
  activeTabText: {
    color: '#1A1A2E',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  newSessionButton: {
    marginBottom: 24,
  },
  sessionCard: {
    marginBottom: 16,
  },
  sessionContent: {
    padding: 20,
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sessionDate: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    textTransform: 'capitalize',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  sessionTime: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00E5FF',
    marginBottom: 8,
  },
  sessionType: {
    fontSize: 16,
    color: '#7B68EE',
    marginBottom: 4,
  },
  therapistName: {
    fontSize: 14,
    color: '#999',
    marginBottom: 16,
  },
  sessionActions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  actionButton: {
    flex: 1,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  ratingLabel: {
    fontSize: 14,
    color: '#7B68EE',
    marginRight: 8,
  },
  stars: {
    flexDirection: 'row',
    gap: 2,
  },
  sessionNotes: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
    marginTop: 8,
    marginBottom: 12,
  },
  viewDetailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  viewDetailsText: {
    fontSize: 14,
    color: '#00E5FF',
    marginRight: 4,
  },
  statsCard: {
    marginTop: 24,
  },
  statsContent: {
    padding: 20,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    gap: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  statLabel: {
    fontSize: 12,
    color: '#7B68EE',
  },
});
