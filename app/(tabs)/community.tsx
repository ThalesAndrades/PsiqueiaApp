import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import GradientCard from '../../components/ui/GradientCard';
import PsiqueButton from '../../components/ui/PsiqueButton';
import { useAppActions, showAlert } from '../../hooks/useAuth';

export default function Community() {
  const insets = useSafeAreaInsets();
  const [searchText, setSearchText] = useState('');
  const { handleNotifications } = useAppActions();

  const groups = [
    {
      id: 1,
      name: 'Ansiedade e Mindfulness',
      members: 234,
      description: 'Grupo de apoio para práticas de mindfulness e controle da ansiedade',
      color: '#00E5FF',
      isJoined: true,
    },
    {
      id: 2,
      name: 'Depressão e Autoestima',
      members: 187,
      description: 'Comunidade de apoio para superar a depressão e fortalecer a autoestima',
      color: '#7B68EE',
      isJoined: false,
    },
    {
      id: 3,
      name: 'Terapia Cognitiva',
      members: 156,
      description: 'Discussões sobre técnicas de terapia cognitivo-comportamental',
      color: '#20B2AA',
      isJoined: true,
    },
    {
      id: 4,
      name: 'Relacionamentos',
      members: 298,
      description: 'Apoio e dicas para melhorar relacionamentos interpessoais',
      color: '#FF6B9D',
      isJoined: false,
    },
  ];

  const discussions = [
    {
      id: 1,
      title: 'Como lidar com crises de ansiedade no trabalho?',
      author: 'Maria S.',
      replies: 23,
      likes: 45,
      time: '2h atrás',
      group: 'Ansiedade e Mindfulness',
    },
    {
      id: 2,
      title: 'Técnicas de respiração que realmente funcionam',
      author: 'João P.',
      replies: 15,
      likes: 32,
      time: '4h atrás',
      group: 'Ansiedade e Mindfulness',
    },
    {
      id: 3,
      title: 'Minha jornada com a terapia CBT',
      author: 'Ana C.',
      replies: 18,
      likes: 28,
      time: '6h atrás',
      group: 'Terapia Cognitiva',
    },
  ];

  const handleJoinGroup = (group: any) => {
    if (group.isJoined) {
      showAlert(
        `Grupo: ${group.name}`,
        `👥 ${group.members} membros\n\n📝 ${group.description}\n\n✅ Você já participa deste grupo!\n\n🔔 Últimas atividades:\n• 5 novas discussões\n• 12 comentários\n• 3 eventos programados`
      );
    } else {
      showAlert(
        `Ingressar: ${group.name}`,
        `👥 ${group.members} membros\n\n📝 ${group.description}\n\n🎯 Benefícios:\n• Suporte 24h da comunidade\n• Discussões moderadas\n• Eventos exclusivos\n• Recursos terapêuticos\n\n✅ Bem-vindo(a) ao grupo!`
      );
    }
  };

  const handleViewAllDiscussions = () => {
    showAlert(
      'Todas as Discussões',
      '💬 Central de Discussões\n\n🔥 Tópicos em alta:\n• Ansiedade no trabalho (156 respostas)\n• Técnicas de sono (89 respostas)\n• Relacionamentos tóxicos (134 respostas)\n• Autoestima e autoimagem (67 respostas)\n\n📊 Total: 2.847 discussões ativas'
    );
  };

  const handleNewDiscussion = () => {
    showAlert(
      'Nova Discussão',
      '✍️ Criar Novo Tópico\n\n📋 Diretrizes:\n• Seja respeitoso e empático\n• Compartilhe experiências construtivas\n• Evite conselhos médicos específicos\n• Use tags apropriadas\n\n🎯 Categorias:\n• Ansiedade • Depressão • Relacionamentos\n• Autoestima • Trabalho • Família'
    );
  };

  return (
    <LinearGradient
      colors={['#0A0A1F', '#1A1A2E', '#16213E']}
      style={[styles.container, { paddingTop: insets.top }]}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Comunidade</Text>
        <TouchableOpacity style={styles.notificationButton} onPress={handleNotifications}>
          <MaterialIcons name="notifications" size={24} color="#00E5FF" />
        </TouchableOpacity>
      </View>

      {/* Busca */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <MaterialIcons name="search" size={20} color="#7B68EE" />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar grupos ou discussões..."
            placeholderTextColor="#666"
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Estatísticas da Comunidade */}
        <GradientCard style={styles.statsCard}>
          <View style={styles.statsContent}>
            <Text style={styles.statsTitle}>Comunidade PsiqueIA</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <MaterialIcons name="groups" size={24} color="#00E5FF" />
                <Text style={styles.statValue}>3.2k</Text>
                <Text style={styles.statLabel}>Membros</Text>
              </View>
              <View style={styles.statItem}>
                <MaterialIcons name="forum" size={24} color="#7B68EE" />
                <Text style={styles.statValue}>156</Text>
                <Text style={styles.statLabel}>Discussões</Text>
              </View>
              <View style={styles.statItem}>
                <MaterialIcons name="favorite" size={24} color="#20B2AA" />
                <Text style={styles.statValue}>890</Text>
                <Text style={styles.statLabel}>Apoios</Text>
              </View>
            </View>
          </View>
        </GradientCard>

        {/* Meus Grupos */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Meus Grupos</Text>
          {groups
            .filter(group => group.isJoined)
            .map((group) => (
              <GradientCard key={group.id} style={styles.groupCard}>
                <TouchableOpacity style={styles.groupContent} onPress={() => handleJoinGroup(group)}>
                  <View style={styles.groupHeader}>
                    <View style={[styles.groupIcon, { backgroundColor: group.color + '20' }]}>
                      <MaterialIcons name="group" size={24} color={group.color} />
                    </View>
                    <View style={styles.groupInfo}>
                      <Text style={styles.groupName}>{group.name}</Text>
                      <Text style={styles.groupMembers}>{group.members} membros</Text>
                    </View>
                    <MaterialIcons name="arrow-forward-ios" size={16} color="#666" />
                  </View>
                  <Text style={styles.groupDescription}>{group.description}</Text>
                </TouchableOpacity>
              </GradientCard>
            ))}
        </View>

        {/* Discussões Recentes */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Discussões Recentes</Text>
            <TouchableOpacity onPress={handleViewAllDiscussions}>
              <Text style={styles.seeAllText}>Ver todas</Text>
            </TouchableOpacity>
          </View>
          
          {discussions.map((discussion) => (
            <GradientCard key={discussion.id} style={styles.discussionCard}>
              <TouchableOpacity style={styles.discussionContent}>
                <Text style={styles.discussionTitle}>{discussion.title}</Text>
                <Text style={styles.discussionGroup}>{discussion.group}</Text>
                <View style={styles.discussionMeta}>
                  <Text style={styles.discussionAuthor}>por {discussion.author}</Text>
                  <Text style={styles.discussionTime}>{discussion.time}</Text>
                </View>
                <View style={styles.discussionStats}>
                  <View style={styles.discussionStat}>
                    <MaterialIcons name="chat-bubble-outline" size={16} color="#7B68EE" />
                    <Text style={styles.discussionStatText}>{discussion.replies}</Text>
                  </View>
                  <View style={styles.discussionStat}>
                    <MaterialIcons name="favorite-border" size={16} color="#7B68EE" />
                    <Text style={styles.discussionStatText}>{discussion.likes}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </GradientCard>
          ))}
        </View>

        {/* Grupos Sugeridos */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Grupos Sugeridos</Text>
          {groups
            .filter(group => !group.isJoined)
            .map((group) => (
              <GradientCard key={group.id} style={styles.groupCard}>
                <View style={styles.groupContent}>
                  <View style={styles.groupHeader}>
                    <View style={[styles.groupIcon, { backgroundColor: group.color + '20' }]}>
                      <MaterialIcons name="group" size={24} color={group.color} />
                    </View>
                    <View style={styles.groupInfo}>
                      <Text style={styles.groupName}>{group.name}</Text>
                      <Text style={styles.groupMembers}>{group.members} membros</Text>
                    </View>
                  </View>
                  <Text style={styles.groupDescription}>{group.description}</Text>
                  <PsiqueButton 
                    title="Participar"
                    onPress={() => handleJoinGroup(group)}
                    style={styles.joinButton}
                    variant="outline"
                  />
                </View>
              </GradientCard>
            ))}
        </View>

        {/* Botão Nova Discussão */}
        <PsiqueButton 
          title="Iniciar Nova Discussão"
          onPress={handleNewDiscussion}
          style={styles.newDiscussionButton}
        />
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
  notificationButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#16213E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#16213E',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  statsCard: {
    marginBottom: 32,
  },
  statsContent: {
    padding: 24,
  },
  statsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20,
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
  section: {
    marginBottom: 32,
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
  },
  groupCard: {
    marginBottom: 16,
  },
  groupContent: {
    padding: 20,
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  groupIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  groupInfo: {
    flex: 1,
  },
  groupName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  groupMembers: {
    fontSize: 14,
    color: '#7B68EE',
    marginTop: 2,
  },
  groupDescription: {
    fontSize: 14,
    color: '#999',
    lineHeight: 20,
  },
  joinButton: {
    marginTop: 16,
  },
  discussionCard: {
    marginBottom: 16,
  },
  discussionContent: {
    padding: 20,
  },
  discussionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
    lineHeight: 22,
  },
  discussionGroup: {
    fontSize: 12,
    color: '#00E5FF',
    marginBottom: 8,
  },
  discussionMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  discussionAuthor: {
    fontSize: 14,
    color: '#7B68EE',
  },
  discussionTime: {
    fontSize: 14,
    color: '#666',
  },
  discussionStats: {
    flexDirection: 'row',
    gap: 20,
  },
  discussionStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  discussionStatText: {
    fontSize: 14,
    color: '#7B68EE',
  },
  newDiscussionButton: {
    marginTop: 20,
  },
});