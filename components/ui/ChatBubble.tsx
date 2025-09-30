import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { ChatMessage } from '../../services/chatService';
import { chatService } from '../../services/chatService';

interface ChatBubbleProps {
  message: ChatMessage;
  isCurrentUser: boolean;
  showTimestamp?: boolean;
}

export default function ChatBubble({ 
  message, 
  isCurrentUser, 
  showTimestamp = true 
}: ChatBubbleProps) {
  const getUserIcon = () => {
    return message.senderType === 'psychologist' ? 'psychology' : 'person';
  };

  const getUserColor = () => {
    return message.senderType === 'psychologist' ? '#7B68EE' : '#00E5FF';
  };

  return (
    <View style={[
      styles.container,
      isCurrentUser ? styles.currentUserContainer : styles.otherUserContainer
    ]}>
      {/* User Avatar */}
      {!isCurrentUser && (
        <View style={[styles.avatar, { backgroundColor: getUserColor() + '20' }]}>
          <MaterialIcons name={getUserIcon() as any} size={20} color={getUserColor()} />
        </View>
      )}

      {/* Message Content */}
      <View style={[
        styles.messageContainer,
        isCurrentUser ? styles.currentUserMessage : styles.otherUserMessage
      ]}>
        {isCurrentUser ? (
          <LinearGradient
            colors={['#00E5FF', '#7B68EE']}
            style={styles.messageGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.currentUserText}>{message.text}</Text>
          </LinearGradient>
        ) : (
          <View style={styles.otherUserMessageBg}>
            <Text style={styles.otherUserText}>{message.text}</Text>
          </View>
        )}

        {/* Timestamp and Status */}
        {showTimestamp && (
          <View style={[
            styles.timestampContainer,
            isCurrentUser ? styles.currentUserTimestamp : styles.otherUserTimestamp
          ]}>
            <Text style={styles.timestampText}>
              {chatService.formatTimestamp(message.timestamp)}
            </Text>
            {isCurrentUser && (
              <MaterialIcons 
                name={message.read ? 'done-all' : 'done'} 
                size={12} 
                color={message.read ? '#20B2AA' : '#7B68EE'} 
              />
            )}
          </View>
        )}
      </View>

      {/* Current User Avatar */}
      {isCurrentUser && (
        <View style={[styles.avatar, { backgroundColor: '#00E5FF20' }]}>
          <MaterialIcons name="person" size={20} color="#00E5FF" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginVertical: 4,
    paddingHorizontal: 16,
    alignItems: 'flex-end',
  },
  currentUserContainer: {
    justifyContent: 'flex-end',
  },
  otherUserContainer: {
    justifyContent: 'flex-start',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  messageContainer: {
    maxWidth: '75%',
    minWidth: 60,
  },
  currentUserMessage: {
    alignItems: 'flex-end',
  },
  otherUserMessage: {
    alignItems: 'flex-start',
  },
  messageGradient: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    borderBottomRightRadius: 6,
  },
  otherUserMessageBg: {
    backgroundColor: 'rgba(26, 26, 46, 0.95)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    borderBottomLeftRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(123, 104, 238, 0.3)',
  },
  currentUserText: {
    color: '#FFFFFF',
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '500',
  },
  otherUserText: {
    color: '#FFFFFF',
    fontSize: 16,
    lineHeight: 22,
  },
  timestampContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 4,
  },
  currentUserTimestamp: {
    alignSelf: 'flex-end',
  },
  otherUserTimestamp: {
    alignSelf: 'flex-start',
  },
  timestampText: {
    fontSize: 11,
    color: '#7B68EE',
    opacity: 0.8,
  },
});