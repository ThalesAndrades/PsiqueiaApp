import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, Stack, router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useChatMessages } from '../hooks/useChat';
import { useAuth } from '../hooks/useAuth';
import ChatBubble from '../components/ui/ChatBubble';
import ChatInput from '../components/ui/ChatInput';

export default function ChatScreen() {
  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef<ScrollView>(null);
  const { user } = useAuth();
  
  // Get conversation data from route params
  const params = useLocalSearchParams();
  const conversationId = params.conversationId as string;
  const otherUserName = params.otherUserName as string;
  const otherUserType = params.otherUserType as string;

  // Chat messages hook
  const { messages, loading, sending, error, sendMessage } = useChatMessages(conversationId);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages.length]);

  // Handle send message
  const handleSendMessage = async (text: string): Promise<boolean> => {
    const success = await sendMessage(text);
    if (success) {
      // Scroll to bottom after sending
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
    return success;
  };

  // Handle back navigation
  const handleBackPress = () => {
    router.back();
  };

  if (!user || !conversationId) {
    return (
      <LinearGradient
        colors={['#0A0E1A', '#1A1A2E', '#16213E']}
        style={styles.container}
      >
        <View style={styles.errorContainer}>
          <ActivityIndicator size="large" color="#00E5FF" />
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={['#0A0E1A', '#1A1A2E', '#16213E']}
      style={[styles.container, { paddingTop: insets.top }]}
    >
      <Stack.Screen 
        options={{
          title: otherUserName || 'Chat',
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

      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        {/* Messages Area */}
        <View style={styles.messagesContainer}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#00E5FF" />
            </View>
          ) : (
            <ScrollView
              ref={scrollViewRef}
              style={styles.scrollView}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {messages.map((message) => (
                <ChatBubble
                  key={message.id}
                  message={message}
                  isCurrentUser={message.senderId === user.id}
                  showTimestamp={true}
                />
              ))}
              
              {/* Sending indicator */}
              {sending && (
                <View style={styles.sendingIndicator}>
                  <ActivityIndicator size="small" color="#7B68EE" />
                </View>
              )}
            </ScrollView>
          )}
        </View>

        {/* Input Area */}
        <ChatInput
          onSendMessage={handleSendMessage}
          disabled={loading}
          placeholder={`Mensagem para ${otherUserName}...`}
        />
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
    paddingTop: 80, // Account for header
  },
  messagesContainer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 20,
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendingIndicator: {
    alignSelf: 'flex-end',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
});