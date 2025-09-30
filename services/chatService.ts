import AsyncStorage from '@react-native-async-storage/async-storage';

export interface ChatMessage {
  id: string;
  text: string;
  senderId: string;
  senderName: string;
  senderType: 'patient' | 'psychologist';
  timestamp: string;
  read: boolean;
}

export interface ChatConversation {
  id: string;
  patientId: string;
  patientName: string;
  psychologistId: string;
  psychologistName: string;
  lastMessage?: ChatMessage;
  unreadCount: number;
  updatedAt: string;
}

class ChatService {
  private static instance: ChatService;
  
  static getInstance(): ChatService {
    if (!ChatService.instance) {
      ChatService.instance = new ChatService();
    }
    return ChatService.instance;
  }

  // Generate conversation ID from user IDs
  private getConversationId(patientId: string, psychologistId: string): string {
    return `chat_${[patientId, psychologistId].sort().join('_')}`;
  }

  // Get storage key for messages
  private getMessagesKey(conversationId: string): string {
    return `messages_${conversationId}`;
  }

  // Get storage key for conversations
  private getConversationsKey(userId: string): string {
    return `conversations_${userId}`;
  }

  // Create or get existing conversation
  async createConversation(
    patientId: string,
    patientName: string,
    psychologistId: string,
    psychologistName: string
  ): Promise<ChatConversation> {
    const conversationId = this.getConversationId(patientId, psychologistId);
    
    const conversation: ChatConversation = {
      id: conversationId,
      patientId,
      patientName,
      psychologistId,
      psychologistName,
      unreadCount: 0,
      updatedAt: new Date().toISOString(),
    };

    // Save conversation for both users
    await this.saveConversationForUser(patientId, conversation);
    await this.saveConversationForUser(psychologistId, conversation);

    return conversation;
  }

  // Save conversation reference for user
  private async saveConversationForUser(userId: string, conversation: ChatConversation): Promise<void> {
    try {
      const key = this.getConversationsKey(userId);
      const existingData = await AsyncStorage.getItem(key);
      const conversations: ChatConversation[] = existingData ? JSON.parse(existingData) : [];
      
      const existingIndex = conversations.findIndex(c => c.id === conversation.id);
      if (existingIndex >= 0) {
        conversations[existingIndex] = conversation;
      } else {
        conversations.push(conversation);
      }

      await AsyncStorage.setItem(key, JSON.stringify(conversations));
    } catch (error) {
      console.error('Error saving conversation:', error);
    }
  }

  // Get conversations for user
  async getConversations(userId: string): Promise<ChatConversation[]> {
    try {
      const key = this.getConversationsKey(userId);
      const data = await AsyncStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading conversations:', error);
      return [];
    }
  }

  // Send message
  async sendMessage(
    conversationId: string,
    text: string,
    senderId: string,
    senderName: string,
    senderType: 'patient' | 'psychologist'
  ): Promise<ChatMessage> {
    const message: ChatMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      text: text.trim(),
      senderId,
      senderName,
      senderType,
      timestamp: new Date().toISOString(),
      read: false,
    };

    try {
      // Save message
      const messagesKey = this.getMessagesKey(conversationId);
      const existingData = await AsyncStorage.getItem(messagesKey);
      const messages: ChatMessage[] = existingData ? JSON.parse(existingData) : [];
      messages.push(message);
      await AsyncStorage.setItem(messagesKey, JSON.stringify(messages));

      // Update conversation with last message
      await this.updateConversationLastMessage(conversationId, message);

      return message;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  // Update conversation with last message
  private async updateConversationLastMessage(conversationId: string, message: ChatMessage): Promise<void> {
    try {
      // Get conversation details (this is a simplified approach)
      const conversations = await this.getAllConversations();
      const conversation = conversations.find(c => c.id === conversationId);
      
      if (conversation) {
        const updatedConversation: ChatConversation = {
          ...conversation,
          lastMessage: message,
          updatedAt: message.timestamp,
          unreadCount: conversation.unreadCount + 1,
        };

        // Update for both users
        await this.saveConversationForUser(conversation.patientId, updatedConversation);
        await this.saveConversationForUser(conversation.psychologistId, updatedConversation);
      }
    } catch (error) {
      console.error('Error updating conversation:', error);
    }
  }

  // Get all conversations (helper method)
  private async getAllConversations(): Promise<ChatConversation[]> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const conversationKeys = keys.filter(key => key.startsWith('conversations_'));
      const allConversations: ChatConversation[] = [];

      for (const key of conversationKeys) {
        const data = await AsyncStorage.getItem(key);
        if (data) {
          const conversations: ChatConversation[] = JSON.parse(data);
          allConversations.push(...conversations);
        }
      }

      // Remove duplicates
      const uniqueConversations = allConversations.reduce((acc, current) => {
        const existing = acc.find(item => item.id === current.id);
        if (!existing) {
          acc.push(current);
        }
        return acc;
      }, [] as ChatConversation[]);

      return uniqueConversations;
    } catch (error) {
      console.error('Error getting all conversations:', error);
      return [];
    }
  }

  // Get messages for conversation
  async getMessages(conversationId: string): Promise<ChatMessage[]> {
    try {
      const key = this.getMessagesKey(conversationId);
      const data = await AsyncStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading messages:', error);
      return [];
    }
  }

  // Mark messages as read
  async markMessagesAsRead(conversationId: string, userId: string): Promise<void> {
    try {
      const messagesKey = this.getMessagesKey(conversationId);
      const data = await AsyncStorage.getItem(messagesKey);
      if (data) {
        const messages: ChatMessage[] = JSON.parse(data);
        const updatedMessages = messages.map(msg => 
          msg.senderId !== userId ? { ...msg, read: true } : msg
        );
        await AsyncStorage.setItem(messagesKey, JSON.stringify(updatedMessages));

        // Reset unread count for conversation
        await this.resetUnreadCount(conversationId, userId);
      }
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  }

  // Reset unread count
  private async resetUnreadCount(conversationId: string, userId: string): Promise<void> {
    try {
      const conversations = await this.getConversations(userId);
      const updatedConversations = conversations.map(conv => 
        conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv
      );
      
      const key = this.getConversationsKey(userId);
      await AsyncStorage.setItem(key, JSON.stringify(updatedConversations));
    } catch (error) {
      console.error('Error resetting unread count:', error);
    }
  }

  // Format timestamp for display
  formatTimestamp(timestamp: string): string {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      const minutes = Math.floor(diffInHours * 60);
      return minutes < 1 ? 'agora' : `${minutes}min`;
    } else if (diffInHours < 24) {
      return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    }
  }

  // Get mock conversations for demo (when no real data exists)
  getMockConversations(userType: 'patient' | 'psychologist'): ChatConversation[] {
    if (userType === 'patient') {
      return [
        {
          id: 'mock_patient_conversation',
          patientId: 'patient_1',
          patientName: 'Você',
          psychologistId: 'psychologist_1',
          psychologistName: 'Dra. Maria Silva',
          lastMessage: {
            id: 'mock_1',
            text: 'Como você está se sentindo hoje?',
            senderId: 'psychologist_1',
            senderName: 'Dra. Maria Silva',
            senderType: 'psychologist',
            timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 min ago
            read: false,
          },
          unreadCount: 1,
          updatedAt: new Date().toISOString(),
        },
      ];
    } else {
      return [
        {
          id: 'mock_psychologist_conversation',
          patientId: 'patient_1',
          patientName: 'João Santos',
          psychologistId: 'psychologist_1',
          psychologistName: 'Você',
          lastMessage: {
            id: 'mock_2',
            text: 'Obrigado pela sessão de hoje!',
            senderId: 'patient_1',
            senderName: 'João Santos',
            senderType: 'patient',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
            read: false,
          },
          unreadCount: 1,
          updatedAt: new Date().toISOString(),
        },
      ];
    }
  }

  // Get mock messages for demo
  getMockMessages(): ChatMessage[] {
    return [
      {
        id: 'mock_msg_1',
        text: 'Olá! Como você está se sentindo hoje?',
        senderId: 'psychologist_1',
        senderName: 'Dra. Maria Silva',
        senderType: 'psychologist',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        read: true,
      },
      {
        id: 'mock_msg_2',
        text: 'Oi doutora! Estou me sentindo um pouco ansioso hoje.',
        senderId: 'patient_1',
        senderName: 'João Santos',
        senderType: 'patient',
        timestamp: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
        read: true,
      },
      {
        id: 'mock_msg_3',
        text: 'Entendo. Você gostaria de conversar sobre o que está causando essa ansiedade?',
        senderId: 'psychologist_1',
        senderName: 'Dra. Maria Silva',
        senderType: 'psychologist',
        timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
        read: true,
      },
      {
        id: 'mock_msg_4',
        text: 'Sim, acho que seria bom. Estou com algumas preocupações sobre o trabalho.',
        senderId: 'patient_1',
        senderName: 'João Santos',
        senderType: 'patient',
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        read: false,
      },
    ];
  }
}

export const chatService = ChatService.getInstance();