import { useContext, useEffect, useRef } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { router } from 'expo-router';
import { Alert, Platform } from 'react-native';
import { biometricAuthService } from '../services/biometricAuth';
import { PerformanceMonitor, CacheManager } from '../utils/performance';

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return {
    ...context,
    // Métodos de biometria integrados com cache agressivo
    isBiometricAvailable: async () => {
      const cached = CacheManager.get<boolean>('biometric_available');
      if (cached !== null) return cached;
      
      const available = await biometricAuthService.isAvailable();
      CacheManager.set('biometric_available', available, 120000); // 2 minutes cache
      return available;
    },
    
    isBiometricEnabled: async () => {
      const cached = CacheManager.get<boolean>('biometric_enabled');
      if (cached !== null) return cached;
      
      const enabled = await biometricAuthService.isBiometricEnabled();
      CacheManager.set('biometric_enabled', enabled, 60000); // 1 minute cache
      return enabled;
    },
    
    tryBiometricLogin: async () => {
      PerformanceMonitor.startTimer('biometric_login');
      try {
        const available = await biometricAuthService.isAvailable();
        const enabled = await biometricAuthService.isBiometricEnabled();
        
        if (!available || !enabled) {
          PerformanceMonitor.endTimer('biometric_login');
          return false;
        }
        
        const authenticated = await biometricAuthService.authenticate(
          'Use sua biometria para entrar no PsiqueIA'
        );
        
        if (authenticated) {
          const credentials = await biometricAuthService.getStoredCredentials();
          if (credentials) {
            await context.signIn(credentials.email, credentials.password);
            PerformanceMonitor.endTimer('biometric_login');
            return true;
          }
        }
        PerformanceMonitor.endTimer('biometric_login');
        return false;
      } catch (error) {
        console.error('Biometric login error:', error);
        PerformanceMonitor.endTimer('biometric_login');
        return false;
      }
    },
  };
}

export function useRequireAuth() {
  const { user, loading } = useAuth();
  const navigationAttempted = useRef(false);
  
  useEffect(() => {
    // TIMEOUT DE SEGURANÇA: Força navegação após 1 segundo (ULTRA-OTIMIZADO)
    const forceNavigation = setTimeout(() => {
      if (!user && !navigationAttempted.current) {
        console.log('⚠️ ULTRA FORCE NAVIGATION: Timeout reached (1s), going to login');
        navigationAttempted.current = true;
        try {
          router.replace('/login');
        } catch (error) {
          console.error('❌ Force navigation error:', error);
        }
      }
    }, 1000); // Ultra-otimizado para 1 segundo

    // Navegação normal - SEM loading check para evitar loops
    if (!user && !loading && !navigationAttempted.current) {
      navigationAttempted.current = true;
      
      // Delay ultra-otimizado para 50ms
      setTimeout(() => {
        try {
          console.log('🔄 Redirecting to login (normal flow)...');
          router.replace('/login');
        } catch (error) {
          console.error('❌ Navigation error:', error);
        }
      }, 50); // Ultra-otimizado para 50ms
    }
    
    // Reset flag when user logs in
    if (user && navigationAttempted.current) {
      navigationAttempted.current = false;
      CacheManager.clear(); // Clear cache on user change
    }

    return () => clearTimeout(forceNavigation);
  }, [user]); // APENAS user como dependência

  return {
    user,
    loading,
    isAuthenticated: !!user,
    isPatient: user?.profile?.user_type === 'patient',
    isPsychologist: user?.profile?.user_type === 'psychologist',
  };
}

// Cross-platform alert utility ultra-otimizado
export function showAlert(title: string, message: string, onOk?: () => void) {
  if (Platform.OS === 'web') {
    alert(`${title}\n${message}`);
    onOk?.();
  } else {
    Alert.alert(title, message, onOk ? [{ text: 'OK', onPress: onOk }] : undefined);
  }
}

// Navigation utilities com performance tracking
export function navigateWithAuth(path: string) {
  PerformanceMonitor.startTimer('navigation');
  try {
    router.push(path as any);
    PerformanceMonitor.endTimer('navigation');
  } catch (error) {
    console.error('❌ Navigation error:', error);
    PerformanceMonitor.endTimer('navigation');
    showAlert('Erro de Navegação', 'Não foi possível navegar para a página solicitada.');
  }
}

// App actions hook - ULTRA-OTIMIZADO com memoização agressiva
export const useAppActions = () => {
  const { user } = useAuth();
  
  // Memoized handlers para evitar re-renders
  const handlers = useRef({
    handleNotifications: () => {
      showAlert(
        '🔔 Central de Notificações',
        '📬 Suas notificações ativas:\n\n📅 Nova sessão agendada para hoje às 15:30\n🧘 Lembrete: Exercício de respiração (5 min)\n💬 Nova mensagem na comunidade'
      );
    },

    handleCalendar: () => {
      showAlert('📅 Calendário', 'Visualização do calendário em desenvolvimento.');
    },

    handleNewSession: () => {
      showAlert('➕ Nova Sessão', 'Sistema de agendamento em desenvolvimento.');
    },

    handleExercises: () => {
      showAlert('🧘 Exercícios', 'Biblioteca de bem-estar em desenvolvimento.');
    },

    handleChatAI: () => {
      showAlert('🤖 PsiqueIA Assistant', 'Assistente de IA em desenvolvimento.');
    },

    handleEnterSession: () => {
      showAlert('🎥 Entrar na Sessão', 'Sistema de videochamadas em desenvolvimento.');
    },

    handleReschedule: () => {
      showAlert('🔄 Reagendar', 'Sistema de reagendamento em desenvolvimento.');
    },

    updateMood: (currentMood: number) => {
      const newMood = Math.floor(Math.random() * 10) + 1;
      showAlert('😊 Humor Atualizado', `Seu humor foi registrado: ${newMood}/10`);
      return newMood;
    },

    handlePracticeNow: () => {
      showAlert('🫁 Exercício de Respiração', 'Iniciando exercício de respiração 4-7-8...');
    },

    handleChat: () => {
      PerformanceMonitor.startTimer('chat_navigation');
      try {
        router.push('/chat-list');
        PerformanceMonitor.endTimer('chat_navigation');
      } catch (error) {
        console.error('❌ Chat navigation error:', error);
        PerformanceMonitor.endTimer('chat_navigation');
        showAlert('Erro', 'Não foi possível abrir o chat.');
      }
    },

    handleChatList: () => {
      PerformanceMonitor.startTimer('chat_list_navigation');
      try {
        router.push('/chat-list');
        PerformanceMonitor.endTimer('chat_list_navigation');
      } catch (error) {
        console.error('❌ Chat list navigation error:', error);
        PerformanceMonitor.endTimer('chat_list_navigation');
        showAlert('Erro', 'Não foi possível abrir a lista de chats.');
      }
    },
  });

  return handlers.current;
};