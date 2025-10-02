import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRequireAuth } from '../../hooks/useAuth';
import { useAuth } from '../../hooks/useAuth';
import PatientDashboard from './patient-dashboard';
import PsychologistDashboard from './psychologist-dashboard';
import { LazyWrapper, LazyOnboardingScreen } from '../../components/ui/LazyComponents';
import { PerformanceMonitor } from '../../utils/performance';

export default function Dashboard() {
  const insets = useSafeAreaInsets();
  const { user, loading: authLoading, isPatient, isPsychologist } = useRequireAuth();
  const { showOnboarding, completeOnboarding } = useAuth();
  
  const [dashboardReady, setDashboardReady] = useState(false);

  console.log('🔄 Dashboard render:', { 
    user: !!user, 
    authLoading, 
    showOnboarding,
    userType: user?.profile?.user_type 
  });

  // TIMEOUT ULTRA-OTIMIZADO para dashboard - 500ms MAX
  useEffect(() => {
    PerformanceMonitor.startTimer('dashboard_init');
    
    const timeout = setTimeout(() => {
      console.log('🚀 Dashboard ultra ready (500ms ultra optimization)');
      setDashboardReady(true);
      PerformanceMonitor.endTimer('dashboard_init');
    }, 500); // Ultra-otimizado para 500ms

    return () => {
      clearTimeout(timeout);
      PerformanceMonitor.endTimer('dashboard_init');
    };
  }, []);

  // Show loading while auth is initializing - COM TIMEOUT ULTRA-OTIMIZADO
  if (authLoading || !dashboardReady) {
    return (
      <LinearGradient
        colors={['#0A0A1F', '#1A1A2E', '#16213E']}
        style={[styles.container, { paddingTop: insets.top }]}
      >
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#00E5FF" />
          <Text style={styles.loadingText}>Carregando...</Text>
          <View style={styles.progressDots}>
            <View style={[styles.dot, styles.dotActive]} />
            <View style={[styles.dot, styles.dotActive]} />
            <View style={[styles.dot, styles.dotActive]} />
          </View>
        </View>
      </LinearGradient>
    );
  }

  // If no user after loading, show message
  if (!user) {
    console.log('⚠️ No user found, should redirect to login');
    return (
      <LinearGradient
        colors={['#0A0A1F', '#1A1A2E', '#16213E']}
        style={[styles.container, { paddingTop: insets.top }]}
      >
        <View style={styles.loadingContainer}>
          <Text style={styles.errorText}>Redirecionando...</Text>
        </View>
      </LinearGradient>
    );
  }

  // Show onboarding with lazy loading
  if (showOnboarding && user.profile?.user_type) {
    console.log('🎯 Showing onboarding for user type:', user.profile.user_type);
    return (
      <LazyWrapper>
        <LazyOnboardingScreen
          userType={user.profile.user_type}
          onComplete={() => {
            console.log('✅ Onboarding completed');
            completeOnboarding();
          }}
        />
      </LazyWrapper>
    );
  }

  // Handle undefined user type
  if (!user.profile?.user_type) {
    return (
      <LinearGradient
        colors={['#0A0A1F', '#1A1A2E', '#16213E']}
        style={[styles.container, { paddingTop: insets.top }]}
      >
        <View style={styles.loadingContainer}>
          <Text style={styles.errorText}>
            Configurando perfil...
          </Text>
        </View>
      </LinearGradient>
    );
  }

  console.log('✅ Rendering dashboard for user type:', user.profile.user_type);

  // Render appropriate dashboard based on user type
  if (isPatient) {
    return <PatientDashboard />;
  }

  if (isPsychologist) {
    return <PsychologistDashboard />;
  }

  // Fallback for unknown user type
  return (
    <LinearGradient
      colors={['#0A0A1F', '#1A1A2E', '#16213E']}
      style={[styles.container, { paddingTop: insets.top }]}
    >
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>
          Carregando dashboard...
        </Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 20,
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
  },
  progressDots: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(0, 229, 255, 0.3)',
  },
  dotActive: {
    backgroundColor: '#00E5FF',
  },
  errorText: {
    color: '#00E5FF',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
});