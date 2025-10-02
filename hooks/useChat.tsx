import { useState, useEffect, useCallback, useRef } from 'react';
import { chatService, ChatMessage, ChatConversation } from '../services/chatService';
import { useAuth } from './useAuth';

export function useChat() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(true);
  const lastRefreshRef = useRef(0);

  // Load conversations for current user
  const loadConversations = useCallback(async () => {
    if (!user || !mountedRef.current) {
      console.log('⚠️ No user available or component unmounted');
      return;
    }

    // Throttle requests - minimum 5 seconds between calls
    const now = Date.now();
    if (now - lastRefreshRef.current < 5000) {
      console.log('⚠️ Throttling conversation refresh');
      return;
    }
    lastRefreshRef.current = now;

    try {
      setLoading(true);
      setError(null);
      console.log('🔄 Loading conversations for user:', user.id);

      let userConversations = await chatService.getConversations(user.id);
      
      // If no real conversations, show mock data for demo
      if (userConversations.length === 0) {
        console.log('📝 No conversations found, using mock data');
        userConversations = chatService.getMockConversations(user.profile?.user_type || 'patient');
      }

      if (mountedRef.current) {
        setConversations(userConversations);
        console.log('✅ Loaded conversations:', userConversations.length);
      }
    } catch (err) {
      console.error('❌ Error loading conversations:', err);
      if (mountedRef.current) {
        setError('Erro ao carregar conversas');
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, [user?.id, user?.profile?.user_type]);

  // Create new conversation
  const createConversation = useCallback(async (
    patientId: string,
    patientName: string,
    psychologistId: string,
    psychologistName: string
  ): Promise<ChatConversation | null> => {
    try {
      console.log('🔄 Creating new conversation...');
      
      const conversation = await chatService.createConversation(
        patientId,
        patientName,
        psychologistId,
        psychologistName
      );
      
      await loadConversations(); // Refresh conversations
      console.log('✅ Conversation created successfully');
      return conversation;
    } catch (err) {
      console.error('❌ Error creating conversation:', err);
      if (mountedRef.current) {
        setError('Erro ao criar conversa');
      }
      return null;
    }
  }, [loadConversations]);

  // Get total unread count
  const getTotalUnreadCount = useCallback((): number => {
    const total = conversations.reduce((sum, conv) => sum + conv.unreadCount, 0);
    return total;
  }, [conversations]);

  // Initialize conversations on mount - only once
  useEffect(() => {
    if (user && mountedRef.current) {
      loadConversations();
    }
    
    return () => {
      mountedRef.current = false;
    };
  }, [user?.id]); // Only depend on user ID, not the loadConversations function

  // Controlled auto-refresh - much less frequent
  useEffect(() => {
    if (!user) return;
    
    // Refresh every 60 seconds instead of 30
    const interval = setInterval(() => {
      if (mountedRef.current) {
        console.log('🔄 Auto-refreshing conversations (60s interval)...');
        loadConversations();
      }
    }, 60000);
    
    return () => {
      clearInterval(interval);
    };
  }, [user?.id]); // Only depend on user ID

  return {
    conversations,
    loading,
    error,
    totalUnreadCount: getTotalUnreadCount(),
    loadConversations,
    createConversation,
  };
}

export function useChatMessages(conversationId: string) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(true);
  const lastRefreshRef = useRef(0);

  // Load messages for conversation
  const loadMessages = useCallback(async () => {
    if (!conversationId || !mountedRef.current) {
      console.log('⚠️ No conversation ID provided or component unmounted');
      return;
    }

    // Throttle requests - minimum 3 seconds between calls
    const now = Date.now();
    if (now - lastRefreshRef.current < 3000) {
      console.log('⚠️ Throttling message refresh');
      return;
    }
    lastRefreshRef.current = now;

    try {
      setLoading(true);
      setError(null);
      console.log('🔄 Loading messages for conversation:', conversationId);

      let conversationMessages = await chatService.getMessages(conversationId);
      
      // If no real messages, show mock data for demo
      if (conversationMessages.length === 0 && conversationId.includes('mock')) {
        console.log('📝 No messages found, using mock data');
        conversationMessages = chatService.getMockMessages();
      }

      if (mountedRef.current) {
        setMessages(conversationMessages);
        console.log('✅ Loaded messages:', conversationMessages.length);

        // Mark messages as read when loading
        if (user && conversationMessages.length > 0) {
          await chatService.markMessagesAsRead(conversationId, user.id);
        }
      }
    } catch (err) {
      console.error('❌ Error loading messages:', err);
      if (mountedRef.current) {
        setError('Erro ao carregar mensagens');
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, [conversationId, user?.id]);

  // Send message
  const sendMessage = useCallback(async (text: string): Promise<boolean> => {
    if (!user || !text.trim() || sending || !mountedRef.current) {
      console.log('⚠️ Cannot send message:', { user: !!user, text: text.trim(), sending });
      return false;
    }

    try {
      setSending(true);
      setError(null);
      console.log('🔄 Sending message...');

      const message = await chatService.sendMessage(
        conversationId,
        text,
        user.id,
        user.profile?.name || 'Usuário',
        user.profile?.user_type || 'patient'
      );

      // Add message to local state immediately for better UX
      if (mountedRef.current) {
        setMessages(prev => [...prev, message]);
        console.log('✅ Message sent successfully');
      }
      return true;
    } catch (err) {
      console.error('❌ Error sending message:', err);
      if (mountedRef.current) {
        setError('Erro ao enviar mensagem');
      }
      return false;
    } finally {
      if (mountedRef.current) {
        setSending(false);
      }
    }
  }, [conversationId, user, sending]);

  // Initialize messages on mount - only once
  useEffect(() => {
    if (conversationId && mountedRef.current) {
      loadMessages();
    }
    
    return () => {
      mountedRef.current = false;
    };
  }, [conversationId]); // Only depend on conversationId

  // Controlled auto-refresh - less frequent
  useEffect(() => {
    if (!conversationId) return;

    // Refresh every 30 seconds instead of 10
    const interval = setInterval(() => {
      if (mountedRef.current) {
        console.log('🔄 Auto-refreshing messages (30s interval)...');
        loadMessages();
      }
    }, 30000);
    
    return () => {
      clearInterval(interval);
    };
  }, [conversationId]); // Only depend on conversationId

  return {
    messages,
    loading,
    sending,
    error,
    sendMessage,
    loadMessages,
  };
}