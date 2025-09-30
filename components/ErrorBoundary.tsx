import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('🚨 Error Boundary Caught:', error);
    console.error('🚨 Error Info:', errorInfo);
  }

  handleRestart = () => {
    this.setState({ hasError: false, error: undefined });
    // Try to navigate to safe screen
    try {
      router.replace('/login');
    } catch (navError) {
      console.error('Navigation error:', navError);
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <LinearGradient
          colors={['#0A0E1A', '#1A1A2E', '#16213E']}
          style={styles.container}
        >
          <View style={styles.content}>
            <View style={styles.iconContainer}>
              <MaterialIcons name="error-outline" size={64} color="#FF6B6B" />
            </View>
            
            <Text style={styles.title}>Ops! Algo deu errado</Text>
            <Text style={styles.description}>
              Encontramos um erro inesperado. Não se preocupe, vamos resolver isso juntos!
            </Text>
            
            {__DEV__ && this.state.error && (
              <View style={styles.errorDetails}>
                <Text style={styles.errorTitle}>Detalhes do Erro (Dev Mode):</Text>
                <Text style={styles.errorMessage}>{this.state.error.message}</Text>
              </View>
            )}
            
            <TouchableOpacity style={styles.button} onPress={this.handleRestart}>
              <LinearGradient
                colors={['#00E5FF', '#7B68EE']}
                style={styles.buttonGradient}
              >
                <MaterialIcons name="refresh" size={20} color="#FFFFFF" />
                <Text style={styles.buttonText}>Tentar Novamente</Text>
              </LinearGradient>
            </TouchableOpacity>
            
            <Text style={styles.supportText}>
              Se o problema persistir, entre em contato com o suporte em{' '}
              <Text style={styles.supportEmail}>suporte@psiquia.com</Text>
            </Text>
          </View>
        </LinearGradient>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    alignItems: 'center',
    maxWidth: 350,
  },
  iconContainer: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
    opacity: 0.9,
  },
  errorDetails: {
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
    width: '100%',
  },
  errorTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FF6B6B',
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 12,
    color: '#FF6B6B',
    opacity: 0.8,
  },
  button: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 24,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    gap: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  supportText: {
    fontSize: 14,
    color: '#7B68EE',
    textAlign: 'center',
    opacity: 0.8,
  },
  supportEmail: {
    color: '#00E5FF',
    fontWeight: '600',
  },
});