import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import GradientCard from '../../components/ui/GradientCard';
import PsiqueButton from '../../components/ui/PsiqueButton';
import { LazyWrapper, LazyInteractiveInfographic } from '../../components/ui/LazyComponents';
import { useAuth, useAppActions } from '../../hooks/useAuth';

const { width } = Dimensions.get('window');

// Memoized components for performance
const MemoizedQuickAction = React.memo(({ action, onPress }: { action: any; onPress: () => void }) => (
  <TouchableOpacity style={styles.actionCard} onPress={onPress}>
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
));
MemoizedQuickAction.displayName = 'MemoizedQuickAction';

const MemoizedMoodCard = React.memo(({ 
  moodScore, 
  onUpdateMood, 
  getMoodEmoji, 
  getMoodColor, 
  getMoodLabel 
}: {
  moodScore: number;
  onUpdateMood: () => void;
  getMoodEmoji: (score: number) => string;
  getMoodColor: (score: number) => string;
  getMoodLabel: (score: number) => string;
}) => (
  <GradientCard style={styles.moodCard}>
    <View style={styles.moodContent}>
      <View style={styles.moodHeader}>
        <Text style={styles.moodTitle}>Seu Humor Hoje</Text>
        <Text style={styles.moodEmoji}>{getMoodEmoji(moodScore)}</Text>
      </View>
      <View style={styles.moodScore}>
        <Text style={[styles.moodScoreText, { color: getMoodColor(moodScore) }]}>
          {moodScore}/10
        </Text>
        <Text style={[styles.moodLabel, { color: getMoodColor(moodScore) }]}>
          {getMoodLabel(moodScore)}
        </Text>
      </View>
      <View style={styles.moodBar}>
        <LinearGradient
          colors={['#FF6B6B', '#FFD700', '#20B2AA']}
          style={[styles.moodFill, { width: `${moodScore * 10}%` }]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        />
      </View>
      <PsiqueButton 
        title="Atualizar Humor" 
        onPress={onUpdateMood}
        style={styles.moodButton}
        variant="outline"
      />
    </View>
  </GradientCard>
));
MemoizedMoodCard.displayName = 'MemoizedMoodCard';

export default function PatientDashboard() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { 
    handleNotifications, 
    handleExercises, 
    handleEnterSession,
    handlePracticeNow,
    handleChat,
    updateMood
  } = useAppActions();
  
  const [moodScore, setMoodScore] = useState(7);

  // Memoized data to prevent recalculation on every render
  const patientProgressData = useMemo(() => [
    { id: '1', title: 'Sessão de Ansiedade', category: 'Terapia Individual', type: 'Concluída', color: '#00E5FF' },
    { id: '2', title: 'Exercício de Respiração', category: 'Bem-estar', type: 'Em Progresso', color: '#7B68EE' },
    { id: '3', title: 'Consulta Inicial', category: 'Terapia Individual', type: 'Concluída', color: '#00E5FF' },
    { id: '4', title: 'Meditação Guiada', category: 'Bem-estar', type: 'Disponível', color: '#7B68EE' },
    { id: '5', title: 'Terapia de Casal', category: 'Terapia em Grupo', type: 'Agendada', color: '#20B2AA' },
    { id: '6', title: 'Diário de Humor', category: 'Bem-estar', type: 'Pendente', color: '#7B68EE' },
    { id: '7', title: 'Sessão de Mindfulness', category: 'Terapia Individual', type: 'Concluída', color: '#00E5FF' },
    { id: '8', title: 'Grupo de Apoio', category: 'Terapia em Grupo', type: 'Agendada', color: '#20B2AA' },
  ], []);

  const patientCategories = useMemo(() => [
    { name: 'Terapia Individual', color: '#00E5FF', icon: 'psychology', count: 3 },
    { name: 'Bem-estar', color: '#7B68EE', icon: 'self-improvement', count: 3 },
    { name: 'Terapia em Grupo', color: '#20B2AA', icon: 'groups', count: 2 },
  ], []);

  const quickActions = useMemo(() => [
    { 
      icon: 'psychology', 
      title: 'Próxima Sessão', 
      color: '#00E5FF', 
      subtitle: 'Hoje, 15:30',
      bgColor: 'rgba(0, 229, 255, 0.1)',
      onPress: handleEnterSession
    },
    { 
      icon: 'favorite', 
      title: 'Humor Diário', 
      color: '#FF6B9D', 
      subtitle: 'Registrar',
      bgColor: 'rgba(255, 107, 157, 0.1)',
      onPress: () => {
        const newMood = updateMood(moodScore);
        setMoodScore(newMood);
      }
    },
    { 
      icon: 'self-improvement', 
      title: 'Exercícios', 
      color: '#7B68EE', 
      subtitle: '3 disponíveis',
      bgColor: 'rgba(123, 104, 238, 0.1)',
      onPress: handleExercises
    },
    { 
      icon: 'chat', 
      title: 'Chat', 
      color: '#20B2AA', 
      subtitle: 'Terapeuta',
      bgColor: 'rgba(32, 178, 170, 0.1)',
      onPress: handleChat
    },
  ], [handleEnterSession, handleExercises, handleChat, updateMood, moodScore]);

  // Memoized mood functions
  const getMoodColor = useCallback((score: number) => {
    if (score >= 8) return '#20B2AA';
    if (score >= 6) return '#FFD700';
    if (score >= 4) return '#FF8C00';
    return '#FF6B6B';
  }, []);

  const getMoodEmoji = useCallback((score: number) => {
    if (score >= 8) return '😊';
    if (score >= 6) return '😐';
    if (score >= 4) return '😔';
    return '😢';
  }, []);

  const getMoodLabel = useCallback((score: number) => {
    if (score >= 8) return 'Excelente';
    if (score >= 6) return 'Bom';
    if (score >= 4) return 'Regular';
    return 'Precisa de atenção';
  }, []);

  // Memoized handlers
  const handleMoodUpdate = useCallback(() => {
    const newMood = updateMood(moodScore);
    setMoodScore(newMood);
  }, [updateMood, moodScore]);

  const handleInfographicItemPress = useCallback((item: any) => {
    console.log('Item selecionado:', item.title);
  }, []);

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
            <Text style={styles.greeting}>Olá, {user?.profile?.name?.split(' ')[0] || 'Paciente'}!</Text>
            <Text style={styles.subtitle}>Como você está se sentindo hoje?</Text>
          </View>
          <TouchableOpacity style={styles.notificationButton} onPress={handleNotifications}>
            <MaterialIcons name="notifications" size={24} color="#00E5FF" />
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationText}>2</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Humor Atual - Memoized */}
        <MemoizedMoodCard
          moodScore={moodScore}
          onUpdateMood={handleMoodUpdate}
          getMoodEmoji={getMoodEmoji}
          getMoodColor={getMoodColor}
          getMoodLabel={getMoodLabel}
        />

        {/* Infográfico Interativo - Lazy Loaded */}
        <GradientCard style={styles.infographicCard}>
          <View style={styles.infographicContent}>
            <LazyWrapper fallback={
              <View style={styles.infographicLoading}>
                <Text style={styles.loadingText}>Carregando progresso...</Text>
              </View>
            }>
              <LazyInteractiveInfographic
                data={patientProgressData}
                title="Meu Progresso Terapêutico"
                categories={patientCategories}
                onItemPress={handleInfographicItemPress}
              />
            </LazyWrapper>
          </View>
        </GradientCard>

        {/* Ações Rápidas - Memoized */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ações Rápidas</Text>
          <View style={styles.actionsGrid}>
            {quickActions.map((action, index) => (
              <MemoizedQuickAction
                key={index}
                action={action}
                onPress={action.onPress}
              />
            ))}
          </View>
        </View>

        {/* Próxima Sessão */}
        <GradientCard style={styles.nextSessionCard}>
          <View style={styles.nextSessionContent}>
            <View style={styles.sessionIcon}>
              <MaterialIcons name="event" size={32} color="#00E5FF" />
            </View>
            <View style={styles.nextSessionInfo}>
              <Text style={styles.nextSessionTitle}>Próxima Sessão</Text>
              <Text style={styles.nextSessionDate}>Hoje, 15:30</Text>
              <Text style={styles.nextSessionType}>Terapia Individual • Dr. Maria Silva</Text>
            </View>
            <PsiqueButton 
              title="Entrar" 
              onPress={handleEnterSession}
              style={styles.sessionButton}
            />
          </View>
        </GradientCard>

        {/* Dicas do Dia */}
        <GradientCard style={styles.tipsCard}>
          <View style={styles.tipsContent}>
            <View style={styles.tipsHeader}>
              <MaterialIcons name="lightbulb" size={24} color="#FFD700" />
              <Text style={styles.tipsTitle}>Dica do Dia</Text>
            </View>
            <Text style={styles.tipsText}>
              &quot;Pratique a respiração profunda por 5 minutos. Inspire lentamente pelo nariz, segure por 4 segundos e expire pela boca.&quot;
            </Text>
            <PsiqueButton 
              title="Praticar Agora" 
              onPress={handlePracticeNow}
              style={styles.tipsButton}
              variant="secondary"
            />
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
  moodCard: {
    marginBottom: 24,
  },
  moodContent: {
    padding: 24,
  },
  moodHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  moodTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  moodEmoji: {
    fontSize: 32,
  },
  moodScore: {
    alignItems: 'center',
    marginBottom: 20,
  },
  moodScoreText: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  moodLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
  },
  moodBar: {
    height: 8,
    backgroundColor: 'rgba(22, 33, 62, 0.6)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 20,
  },
  moodFill: {
    height: '100%',
    borderRadius: 4,
  },
  moodButton: {
    marginTop: 8,
  },
  infographicCard: {
    marginBottom: 24,
    minHeight: 400,
  },
  infographicContent: {
    padding: 20,
  },
  infographicLoading: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: '#7B68EE',
    fontSize: 16,
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
  nextSessionCard: {
    marginBottom: 24,
  },
  nextSessionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
    gap: 16,
  },
  sessionIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(0, 229, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextSessionInfo: {
    flex: 1,
  },
  nextSessionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  nextSessionDate: {
    fontSize: 18,
    color: '#00E5FF',
    fontWeight: '700',
    marginTop: 4,
  },
  nextSessionType: {
    fontSize: 14,
    color: '#7B68EE',
    marginTop: 2,
  },
  sessionButton: {
    minWidth: 80,
  },
  tipsCard: {
    marginBottom: 24,
  },
  tipsContent: {
    padding: 24,
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  tipsText: {
    fontSize: 14,
    color: '#FFFFFF',
    lineHeight: 22,
    marginBottom: 20,
  },
  tipsButton: {
    marginTop: 8,
  },
});