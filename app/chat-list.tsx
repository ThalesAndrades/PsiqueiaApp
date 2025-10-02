import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Stack, router } from 'expo-router';
import { useChat } from '../hooks/useChat';
import { useAuth } from '../hooks/useAuth';
import { chatService } from '../services/chatService';
import GradientCard from '../components/ui/GradientCard';

export default function ChatListScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { conversations, loading, totalUnreadCount } = useChat();

  const handleConversationPress = (conversation: any) => {
    const otherUser = conversation.patientId === user?.id 
      ? {
          name: conversation.psychologistName,
          type: 'psychologist',
        }
      : {
          name: conversation.patientName,
          type: 'patient',
        };

    router.push({
      pathname: '/chat',
      params: {
        conversationId: conversation.id,
        otherUserName: otherUser.name,
        otherUserType: otherUser.type,
      },
    });
  };

  const handleStartNewChat = async () => {
    if (!user) return;

    // For demo purposes, create a mock conversation
    if (user.profile?.user_type === 'patient') {
      router.push({
        pathname: '/chat',
        params: {
          conversationId: 'mock_patient_conversation',
          otherUserName: 'Dra. Maria Silva',
          otherUserType: 'psychologist',
        },
      });
    } else {
      router.push({
        pathname: '/chat',
        params: {
          conversationId: 'mock_psychologist_conversation',
          otherUserName: 'João Santos',
          otherUserType: 'patient',
        },
      });
    }
  };

  const getUserIcon = (conversation: any) => {
    const isUserPatient = user?.profile?.user_type === 'patient';
    return isUserPatient ? 'psychology' : 'person';
  };

  const getUserColor = (conversation: any) => {
    const isUserPatient = user?.profile?.user_type === 'patient';
    return isUserPatient ? '#7B68EE' : '#00E5FF';
  };

  const getOtherUserName = (conversation: any) => {
    return conversation.patientId === user?.id 
      ? conversation.psychologistName 
      : conversation.patientName;
  };

  return (
    <LinearGradient
      colors={['#0A0E1A', '#1A1A2E', '#16213E']}
      style={[styles.container, { paddingTop: insets.top }]}
    >
      <Stack.Screen 
        options={{
          title: 'Mensagens',
          headerStyle: {
            backgroundColor: 'transparent',
          },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 18,
          },
          headerTransparent: true,
          headerBlurEffect: 'dark',
        }}
      />

      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.title}>Conversas</Text>
          {totalUnreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>{totalUnreadCount}</Text>
            </View>
          )}
        </View>
        <TouchableOpacity style={styles.newChatButton} onPress={handleStartNewChat}>
          <MaterialIcons name="add-comment" size={24} color="#00E5FF" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#00E5FF" />
            <Text style={styles.loadingText}>Carregando conversas...</Text>
          </View>
        ) : conversations.length === 0 ? (
          <View style={styles.emptyContainer}>
            <MaterialIcons name="chat-bubble-outline" size={64} color="#7B68EE" />
            <Text style={styles.emptyTitle}>Nenhuma conversa ainda</Text>
            <Text style={styles.emptySubtitle}>
              {user?.profile?.user_type === 'patient' 
                ? 'Inicie uma conversa com seu psicólogo'
                : 'Suas conversas com pacientes aparecerão aqui'
              }
            </Text>
            <TouchableOpacity style={styles.startChatButton} onPress={handleStartNewChat}>
              <LinearGradient
                colors={['#00E5FF', '#7B68EE']}
                style={styles.startChatGradient}
              >
                <MaterialIcons name="chat" size={20} color="#FFFFFF" />
                <Text style={styles.startChatText}>Iniciar Conversa</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        ) : (
          conversations.map((conversation) => (
            <GradientCard key={conversation.id} style={styles.conversationCard}>
              <TouchableOpacity 
                style={styles.conversationContent}
                onPress={() => handleConversationPress(conversation)}
                activeOpacity={0.8}
              >
                <View style={[
                  styles.avatar, 
                  { backgroundColor: getUserColor(conversation) + '20' }
                ]}>
                  <MaterialIcons 
                    name={getUserIcon(conversation) as any} 
                    size={24} 
                    color={getUserColor(conversation)} 
                  />
                </View>

                <View style={styles.conversationInfo}>
                  <View style={styles.conversationHeader}>
                    <Text style={styles.conversationName}>
                      {getOtherUserName(conversation)}
                    </Text>
                    <Text style={styles.conversationTime}>
                      {conversation.lastMessage 
                        ? chatService.formatTimestamp(conversation.lastMessage.timestamp)
                        : ''
                      }
                    </Text>
                  </View>

                  <View style={styles.conversationFooter}>
                    <Text style={styles.lastMessage} numberOfLines={1}>
                      {conversation.lastMessage?.text || 'Conversa iniciada'}
                    </Text>
                    {conversation.unreadCount > 0 && (
                      <View style={styles.unreadCount}>
                        <Text style={styles.unreadCountText}>
                          {conversation.unreadCount}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>

                <MaterialIcons name="arrow-forward-ios" size={16} color="#666" />
              </TouchableOpacity>
            </GradientCard>
          ))
        )}
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
    paddingTop: 80, // Account for header
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  unreadBadge: {
    backgroundColor: '#FF6B6B',
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  unreadText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  newChatButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 229, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 255, 0.3)',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    gap: 16,
  },
  loadingText: {
    color: '#7B68EE',
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    gap: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#7B68EE',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  startChatButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  startChatGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    gap: 8,
  },
  startChatText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  conversationCard: {
    marginBottom: 12,
  },
  conversationContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  conversationInfo: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  conversationName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  conversationTime: {
    fontSize: 12,
    color: '#7B68EE',
  },
  conversationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    fontSize: 14,
    color: '#999',
    flex: 1,
    marginRight: 8,
  },
  unreadCount: {
    backgroundColor: '#00E5FF',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  unreadCountText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
});