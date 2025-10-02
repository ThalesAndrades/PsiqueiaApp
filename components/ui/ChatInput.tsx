import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
} from 'react-native-reanimated';

interface ChatInputProps {
  onSendMessage: (text: string) => Promise<boolean>;
  disabled?: boolean;
  placeholder?: string;
}

export default function ChatInput({ 
  onSendMessage, 
  disabled = false,
  placeholder = "Digite sua mensagem..."
}: ChatInputProps) {
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const inputScale = useSharedValue(1);
  const buttonScale = useSharedValue(1);

  const canSend = inputText.trim().length > 0 && !disabled && !isSending;

  const handleSend = async () => {
    if (!canSend) return;

    const messageText = inputText.trim();
    setInputText('');
    setIsSending(true);

    // Animate button
    buttonScale.value = withSpring(0.8, { duration: 100 }, () => {
      buttonScale.value = withSpring(1);
    });

    try {
      const success = await onSendMessage(messageText);
      if (!success) {
        // Restore text if sending failed
        setInputText(messageText);
      }
    } catch (error) {
      // Restore text if error occurred
      setInputText(messageText);
    } finally {
      setIsSending(false);
    }
  };

  const handleFocus = () => {
    inputScale.value = withSpring(1.02);
  };

  const handleBlur = () => {
    inputScale.value = withSpring(1);
  };

  const inputAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: inputScale.value }],
  }));

  const buttonAnimatedStyle = useAnimatedStyle(() => {
    const scale = buttonScale.value;
    const opacity = interpolate(scale, [0.8, 1], [0.7, 1]);
    
    return {
      transform: [{ scale }],
      opacity,
    };
  });

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.container}>
        <LinearGradient
          colors={['rgba(26, 26, 46, 0.95)', 'rgba(22, 33, 62, 0.95)']}
          style={styles.gradient}
        >
          <View style={styles.inputContainer}>
            <Animated.View style={[styles.textInputContainer, inputAnimatedStyle]}>
              <TextInput
                style={styles.textInput}
                value={inputText}
                onChangeText={setInputText}
                placeholder={placeholder}
                placeholderTextColor="#7B68EE"
                multiline
                maxLength={1000}
                onFocus={handleFocus}
                onBlur={handleBlur}
                editable={!disabled && !isSending}
                onSubmitEditing={handleSend}
                blurOnSubmit={false}
              />
            </Animated.View>

            <Animated.View style={buttonAnimatedStyle}>
              <TouchableOpacity
                style={[
                  styles.sendButton,
                  canSend && styles.sendButtonActive,
                  (!canSend || isSending) && styles.sendButtonDisabled
                ]}
                onPress={handleSend}
                disabled={!canSend}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={canSend 
                    ? ['#00E5FF', '#7B68EE'] 
                    : ['rgba(123, 104, 238, 0.3)', 'rgba(123, 104, 238, 0.3)']
                  }
                  style={styles.sendButtonGradient}
                >
                  <MaterialIcons 
                    name={isSending ? "hourglass-empty" : "send"} 
                    size={20} 
                    color="#FFFFFF" 
                  />
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </LinearGradient>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(123, 104, 238, 0.2)',
  },
  gradient: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
  },
  textInputContainer: {
    flex: 1,
    backgroundColor: 'rgba(22, 33, 62, 0.8)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 255, 0.3)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 44,
    maxHeight: 120,
  },
  textInput: {
    color: '#FFFFFF',
    fontSize: 16,
    lineHeight: 20,
    textAlignVertical: 'center',
    paddingVertical: 0,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
    shadowColor: '#00E5FF',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  sendButtonActive: {
    shadowOpacity: 0.4,
  },
  sendButtonDisabled: {
    shadowOpacity: 0.1,
    elevation: 2,
  },
  sendButtonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});