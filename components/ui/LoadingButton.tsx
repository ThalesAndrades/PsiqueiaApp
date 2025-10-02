import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface LoadingButtonProps {
  title: string;
  onPress: () => void | Promise<void>;
  style?: ViewStyle;
  textStyle?: TextStyle;
  variant?: 'primary' | 'secondary' | 'outline';
  disabled?: boolean;
  loading?: boolean;
}

export default function LoadingButton({ 
  title, 
  onPress, 
  style, 
  textStyle, 
  variant = 'primary',
  disabled = false,
  loading = false
}: LoadingButtonProps) {
  const [internalLoading, setInternalLoading] = React.useState(false);
  const isLoading = loading || internalLoading;
  const isDisabled = disabled || isLoading;

  const handlePress = async () => {
    if (isDisabled) return;
    
    try {
      setInternalLoading(true);
      await Promise.resolve(onPress());
    } catch (error) {
      console.error('Button action error:', error);
    } finally {
      setInternalLoading(false);
    }
  };

  const renderContent = () => (
    <>
      {isLoading && <ActivityIndicator size="small" color="#FFFFFF" style={styles.spinner} />}
      <Text style={[
        styles.text, 
        variant === 'outline' && styles.outlineText,
        variant === 'secondary' && styles.secondaryText,
        isDisabled && styles.disabledText,
        textStyle
      ]}>
        {isLoading ? 'Carregando...' : title}
      </Text>
    </>
  );

  if (variant === 'primary') {
    return (
      <TouchableOpacity 
        style={[styles.container, isDisabled && styles.disabled, style]} 
        onPress={handlePress}
        disabled={isDisabled}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={isDisabled ? ['#444', '#333'] : ['#00E5FF', '#7B68EE', '#20B2AA']}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          {renderContent()}
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
        isDisabled && styles.disabled,
        style
      ]} 
      onPress={handlePress}
      disabled={isDisabled}
      activeOpacity={0.8}
    >
      {renderContent()}
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
    flexDirection: 'row',
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
  spinner: {
    marginRight: 8,
  },
  outline: {
    borderWidth: 2,
    borderColor: '#00E5FF',
    backgroundColor: 'rgba(0, 229, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    flexDirection: 'row',
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
    flexDirection: 'row',
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