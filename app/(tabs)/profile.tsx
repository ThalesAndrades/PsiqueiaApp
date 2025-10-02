import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import GradientCard from '../../components/ui/GradientCard';
import PsiqueButton from '../../components/ui/PsiqueButton';
import CustomToggle from '../../components/ui/CustomToggle';
import BottomSheet from '../../components/ui/BottomSheet';
import CustomSlider from '../../components/ui/CustomSlider';
import { useAuth, showAlert } from '../../hooks/useAuth';
import { router } from 'expo-router';

export default function Profile() {
  const insets = useSafeAreaInsets();
  const { user, signOut } = useAuth();
  
  // Settings state
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [autoSync, setAutoSync] = useState(false);
  
  // Slider settings
  const [sessionReminder, setSessionReminder] = useState(30);
  const [dataSync, setDataSync] = useState(60);
  const [screenTimeout, setScreenTimeout] = useState(120);
  
  // Bottom sheet state
  const [settingsSheetVisible, setSettingsSheetVisible] = useState(false);
  const [aboutSheetVisible, setAboutSheetVisible] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      'Sair da Conta',
      'Tem certeza que deseja sair?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Sair', 
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
              router.replace('/login');
            } catch (error) {
              Alert.alert('Erro', 'Erro ao fazer logout');
            }
          }
        }
      ]
    );
  };

  const profileStats = [
    { label: 'Sessões Realizadas', value: '24', icon: 'psychology' },
    { label: 'Dias Consecutivos', value: '12', icon: 'calendar-today' },
    { label: 'Horas de Terapia', value: '18h', icon: 'schedule' },
    { label: 'Progresso Geral', value: '85%', icon: 'trending-up' },
  ];

  const menuItems = [
    { 
      icon: 'person', 
      title: 'Editar Perfil', 
      subtitle: 'Alterar dados pessoais',
      onPress: () => showAlert(
        'Editar Perfil',
        '👤 Dados Pessoais\n\n✏️ Você pode alterar:\n• Nome completo\n• Email de contato\n• Foto de perfil\n• Preferências de comunicação\n• Informações de emergência\n\n💾 Alterações são salvas automaticamente'
      )
    },
    { 
      icon: 'settings', 
      title: 'Configurações', 
      subtitle: 'Notificações e preferências',
      onPress: () => setSettingsSheetVisible(true)
    },
    { 
      icon: 'security', 
      title: 'Privacidade', 
      subtitle: 'Configurações de privacidade',
      onPress: () => showAlert(
        'Privacidade e Segurança',
        '🔒 Controles de Privacidade\n\n🛡️ Opções disponíveis:\n• Visibilidade do perfil\n• Compartilhamento de progresso\n• Histórico de sessões\n• Dados biométricos\n• Backup automático\n\n✅ Todos os dados são criptografados'
      )
    },
    { 
      icon: 'payment', 
      title: 'Pagamentos', 
      subtitle: 'Métodos de pagamento',
      onPress: () => showAlert(
        'Métodos de Pagamento',
        '💳 Formas de Pagamento\n\n💰 Disponíveis:\n• Cartão de crédito/débito\n• PIX instantâneo\n• Transferência bancária\n• Carteira digital\n\n🔄 Pagamento recorrente configurado:\nVISA ***1234 - Próximo: 15/02/2024'
      )
    },
    { 
      icon: 'help', 
      title: 'Ajuda', 
      subtitle: 'Central de ajuda e suporte',
      onPress: () => showAlert(
        'Central de Ajuda',
        '🆘 Suporte PsiqueIA\n\n📞 Canais de atendimento:\n• Chat online: Seg-Sex 8h-18h\n• WhatsApp: (11) 9999-8888\n• Email: suporte@psiquia.com\n• FAQ: 50+ perguntas frequentes\n\n⚡ Tempo médio de resposta: 15 minutos'
      )
    },
    { 
      icon: 'info', 
      title: 'Sobre', 
      subtitle: 'Versão e informações do app',
      onPress: () => setAboutSheetVisible(true)
    },
  ];

  const achievements = [
    { icon: 'star', title: 'Primeira Sessão', color: '#FFD700', completed: true },
    { icon: 'local-fire-department', title: 'Sequência de 7 dias', color: '#FF6B6B', completed: true },
    { icon: 'psychology', title: '10 Sessões', color: '#00E5FF', completed: true },
    { icon: 'groups', title: 'Membro da Comunidade', color: '#7B68EE', completed: false },
  ];

  const getUserTypeIcon = () => {
    return user?.profile?.user_type === 'psychologist' ? 'psychology' : 'person';
  };

  const getUserTypeLabel = () => {
    return user?.profile?.user_type === 'psychologist' ? 'Psicólogo(a)' : 'Paciente';
  };

  const getUserTypeColor = () => {
    return user?.profile?.user_type === 'psychologist' ? '#7B68EE' : '#00E5FF';
  };

  const handleShareProgress = () => {
    showAlert(
      'Compartilhar Progresso',
      '📊 Compartilhar Conquistas\n\n✨ Seu progresso será compartilhado:\n• 24 sessões completadas\n• 85% de progresso geral\n• 12 dias consecutivos\n\n📱 Onde compartilhar:\n• WhatsApp • Instagram • Facebook\n• Twitter • Email • LinkedIn'
    );
  };

  const handleExportData = () => {
    showAlert(
      'Exportar Dados',
      '📁 Download dos Seus Dados\n\n📋 Relatório incluirá:\n• Histórico completo de sessões\n• Registros do diário pessoal\n• Estatísticas de progresso\n• Configurações do perfil\n\n📧 PDF será enviado por email em 5 minutos'
    );
  };

  return (
    <LinearGradient
      colors={['#0A0A1F', '#1A1A2E', '#16213E']}
      style={[styles.container, { paddingTop: insets.top }]}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Perfil</Text>
        <TouchableOpacity 
          style={styles.settingsButton}
          onPress={() => setSettingsSheetVisible(true)}
        >
          <MaterialIcons name="settings" size={24} color="#00E5FF" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Informações do Perfil */}
        <GradientCard style={styles.profileCard}>
          <View style={styles.profileContent}>
            <View style={styles.avatarContainer}>
              <LinearGradient
                colors={['#00E5FF', '#7B68EE', '#20B2AA']}
                style={styles.avatar}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <MaterialIcons name={getUserTypeIcon() as any} size={48} color="#FFFFFF" />
              </LinearGradient>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.userName}>{user?.profile?.name || 'Usuário'}</Text>
              <Text style={styles.userEmail}>{user?.email}</Text>
              <View style={styles.userTypeBadge}>
                <MaterialIcons 
                  name={getUserTypeIcon() as any} 
                  size={16} 
                  color={getUserTypeColor()} 
                />
                <Text style={[styles.userTypeText, { color: getUserTypeColor() }]}>
                  {getUserTypeLabel()}
                </Text>
              </View>
            </View>
            <TouchableOpacity style={styles.editButton} onPress={menuItems[0].onPress}>
              <MaterialIcons name="edit" size={20} color="#00E5FF" />
            </TouchableOpacity>
          </View>
        </GradientCard>

        {/* Estatísticas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Suas Estatísticas</Text>
          <View style={styles.statsGrid}>
            {profileStats.map((stat, index) => (
              <GradientCard key={index} style={styles.statCard}>
                <View style={styles.statContent}>
                  <MaterialIcons name={stat.icon as any} size={24} color="#00E5FF" />
                  <Text style={styles.statValue}>{stat.value}</Text>
                  <Text style={styles.statLabel}>{stat.label}</Text>
                </View>
              </GradientCard>
            ))}
          </View>
        </View>

        {/* Conquistas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Conquistas</Text>
          <View style={styles.achievementsGrid}>
            {achievements.map((achievement, index) => (
              <GradientCard key={index} style={styles.achievementCard}>
                <View style={[
                  styles.achievementContent,
                  !achievement.completed && styles.achievementIncomplete
                ]}>
                  <MaterialIcons 
                    name={achievement.icon as any} 
                    size={32} 
                    color={achievement.completed ? achievement.color : '#666'} 
                  />
                  <Text style={[
                    styles.achievementTitle,
                    !achievement.completed && styles.achievementTitleIncomplete
                  ]}>
                    {achievement.title}
                  </Text>
                  {achievement.completed && (
                    <MaterialIcons name="check-circle" size={16} color="#20B2AA" />
                  )}
                </View>
              </GradientCard>
            ))}
          </View>
        </View>

        {/* Menu de Configurações */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Menu</Text>
          {menuItems.map((item, index) => (
            <GradientCard key={index} style={styles.menuCard}>
              <TouchableOpacity style={styles.menuContent} onPress={item.onPress}>
                <View style={styles.menuIcon}>
                  <MaterialIcons name={item.icon as any} size={24} color="#00E5FF" />
                </View>
                <View style={styles.menuText}>
                  <Text style={styles.menuTitle}>{item.title}</Text>
                  <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
                </View>
                <MaterialIcons name="arrow-forward-ios" size={16} color="#666" />
              </TouchableOpacity>
            </GradientCard>
          ))}
        </View>

        {/* Quick Settings */}
        <GradientCard style={styles.quickSettingsCard}>
          <View style={styles.quickSettingsContent}>
            <Text style={styles.quickSettingsTitle}>Configurações Rápidas</Text>
            
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <MaterialIcons name="notifications" size={20} color="#00E5FF" />
                <Text style={styles.settingLabel}>Notificações</Text>
              </View>
              <CustomToggle 
                isOn={notifications} 
                onToggle={setNotifications}
                size="medium"
              />
            </View>

            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <MaterialIcons name="volume-up" size={20} color="#7B68EE" />
                <Text style={styles.settingLabel}>Sons</Text>
              </View>
              <CustomToggle 
                isOn={soundEnabled} 
                onToggle={setSoundEnabled}
                size="medium"
              />
            </View>
          </View>
        </GradientCard>

        {/* Botões de Ação */}
        <View style={styles.actionButtons}>
          <PsiqueButton 
            title="Compartilhar Progresso"
            onPress={handleShareProgress}
            style={styles.actionButton}
            variant="outline"
          />
          <PsiqueButton 
            title="Exportar Dados"
            onPress={handleExportData}
            style={styles.actionButton}
            variant="secondary"
          />
        </View>

        {/* Sair */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <MaterialIcons name="logout" size={20} color="#FF6B6B" />
          <Text style={styles.logoutText}>Sair da Conta</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Settings Bottom Sheet */}
      <BottomSheet
        visible={settingsSheetVisible}
        onClose={() => setSettingsSheetVisible(false)}
        title="Configurações Avançadas"
        snapPoints={[0.4, 0.7, 0.9]}
      >
        <View style={styles.sheetContent}>
          <Text style={styles.sheetSectionTitle}>Notificações</Text>
          
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <MaterialIcons name="dark-mode" size={20} color="#7B68EE" />
              <Text style={styles.settingLabel}>Modo Escuro</Text>
            </View>
            <CustomToggle 
              isOn={darkMode} 
              onToggle={setDarkMode}
              size="medium"
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <MaterialIcons name="sync" size={20} color="#20B2AA" />
              <Text style={styles.settingLabel}>Sincronização Automática</Text>
            </View>
            <CustomToggle 
              isOn={autoSync} 
              onToggle={setAutoSync}
              size="medium"
            />
          </View>

          <Text style={styles.sheetSectionTitle}>Temporizadores</Text>
          
          <CustomSlider
            title="Lembrete de Sessão (minutos)"
            value={sessionReminder}
            onValueChange={setSessionReminder}
            minimumValue={5}
            maximumValue={120}
            step={5}
          />

          <CustomSlider
            title="Sincronização de Dados (segundos)"
            value={dataSync}
            onValueChange={setDataSync}
            minimumValue={30}
            maximumValue={300}
            step={10}
          />
        </View>
      </BottomSheet>

      {/* About Bottom Sheet */}
      <BottomSheet
        visible={aboutSheetVisible}
        onClose={() => setAboutSheetVisible(false)}
        title="Sobre o PsiqueIA"
        snapPoints={[0.3, 0.6]}
      >
        <View style={styles.aboutContent}>
          <Text style={styles.aboutTitle}>PsiqueIA</Text>
          <Text style={styles.aboutVersion}>Versão 1.0.0</Text>
          <Text style={styles.aboutDescription}>
            Transformando mentes com inteligência artificial. Uma plataforma completa para terapia e bem-estar mental.
          </Text>
          
          <View style={styles.aboutStats}>
            <View style={styles.aboutStat}>
              <Text style={styles.aboutStatValue}>1000+</Text>
              <Text style={styles.aboutStatLabel}>Usuários</Text>
            </View>
            <View style={styles.aboutStat}>
              <Text style={styles.aboutStatValue}>500+</Text>
              <Text style={styles.aboutStatLabel}>Sessões</Text>
            </View>
            <View style={styles.aboutStat}>
              <Text style={styles.aboutStatValue}>50+</Text>
              <Text style={styles.aboutStatLabel}>Psicólogos</Text>
            </View>
          </View>
        </View>
      </BottomSheet>
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
  settingsButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#16213E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  profileCard: {
    marginBottom: 32,
  },
  profileContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
  },
  avatarContainer: {
    marginRight: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  userEmail: {
    fontSize: 14,
    color: '#7B68EE',
    marginTop: 4,
  },
  userTypeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 4,
  },
  userTypeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#16213E',
    justifyContent: 'center',
    alignItems: 'center',
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
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    marginBottom: 16,
  },
  statContent: {
    padding: 20,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#7B68EE',
    textAlign: 'center',
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  achievementCard: {
    width: '48%',
    marginBottom: 16,
  },
  achievementContent: {
    padding: 20,
    alignItems: 'center',
    gap: 8,
  },
  achievementIncomplete: {
    opacity: 0.5,
  },
  achievementTitle: {
    fontSize: 12,
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: '600',
  },
  achievementTitleIncomplete: {
    color: '#666',
  },
  menuCard: {
    marginBottom: 12,
  },
  menuContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  menuIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#16213E',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuText: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  menuSubtitle: {
    fontSize: 14,
    color: '#7B68EE',
    marginTop: 2,
  },
  quickSettingsCard: {
    marginBottom: 24,
  },
  quickSettingsContent: {
    padding: 20,
  },
  quickSettingsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingLabel: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
  },
  actionButton: {
    flex: 1,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  logoutText: {
    fontSize: 16,
    color: '#FF6B6B',
    fontWeight: '600',
  },
  sheetContent: {
    flex: 1,
  },
  sheetSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
    marginTop: 20,
  },
  aboutContent: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  aboutTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#00E5FF',
    marginBottom: 8,
  },
  aboutVersion: {
    fontSize: 16,
    color: '#7B68EE',
    marginBottom: 20,
  },
  aboutDescription: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  aboutStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  aboutStat: {
    alignItems: 'center',
  },
  aboutStatValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00E5FF',
  },
  aboutStatLabel: {
    fontSize: 12,
    color: '#7B68EE',
    marginTop: 4,
  },
});