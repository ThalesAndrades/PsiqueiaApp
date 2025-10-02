import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface PsiqueButtonProps {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  variant?: 'primary' | 'secondary' | 'outline';
  disabled?: boolean;
}

export default function PsiqueButton({ 
  title, 
  onPress, 
  style, 
  textStyle, 
  variant = 'primary',
  disabled = false
}: PsiqueButtonProps) {
  if (variant === 'primary') {
    return (
      <TouchableOpacity 
        style={[styles.container, disabled && styles.disabled, style]} 
        onPress={onPress}
        disabled={disabled}
      >
        <LinearGradient
          colors={disabled ? ['#444', '#333'] : ['#00E5FF', '#7B68EE', '#20B2AA']}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Text style={[styles.text, textStyle]}>{title}</Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity 
      style={[
        styles.container, 
        variant === 'outline' && styles.outline,
        variant === 'secondary' && styles.secondary,
        disabled && styles.disabled,
        style
      ]} 
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={[
        styles.text, 
        variant === 'outline' && styles.outlineText,
        variant === 'secondary' && styles.secondaryText,
        disabled && styles.disabledText,
        textStyle
      ]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: 'hidden',
    minHeight: 50,
    shadowColor: '#00E5FF',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  outline: {
    borderWidth: 2,
    borderColor: '#00E5FF',
    backgroundColor: 'rgba(0, 229, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  outlineText: {
    color: '#00E5FF',
  },
  secondary: {
    backgroundColor: 'rgba(22, 33, 62, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: 'rgba(123, 104, 238, 0.3)',
  },
  secondaryText: {
    color: '#7B68EE',
  },
  disabled: {
    opacity: 0.5,
    shadowOpacity: 0,
    elevation: 0,
  },
  disabledText: {
    color: '#666',
  },
});