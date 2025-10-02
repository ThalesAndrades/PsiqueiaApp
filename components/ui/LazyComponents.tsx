import React, { Suspense } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

// Lazy load heavy components
export const LazyOnboardingScreen = React.lazy(() => import('../OnboardingScreen'));
export const LazyBiometricSetup = React.lazy(() => import('../BiometricSetup'));
export const LazyInteractiveInfographic = React.lazy(() => import('./InteractiveInfographic'));
export const LazyDiarySuccessAnimation = React.lazy(() => import('./DiarySuccessAnimation'));

// Elegant loading fallback
const LazyLoadingFallback = ({ message = "Carregando..." }: { message?: string }) => (
  <LinearGradient
    colors={['#0A0E1A', '#1A1A2E', '#16213E']}
    style={styles.container}
  >
    <View style={styles.loadingContent}>
      <ActivityIndicator size="large" color="#00E5FF" />
      <View style={styles.loadingText}>
        <View style={styles.loadingDot} />
        <View style={styles.loadingDot} />
        <View style={styles.loadingDot} />
      </View>
    </View>
  </LinearGradient>
);

// Lazy wrapper component
interface LazyWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const LazyWrapper: React.FC<LazyWrapperProps> = ({ 
  children, 
  fallback = <LazyLoadingFallback /> 
}) => (
  <Suspense fallback={fallback}>
    {children}
  </Suspense>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContent: {
    alignItems: 'center',
    gap: 20,
  },
  loadingText: {
    flexDirection: 'row',
    gap: 8,
  },
  loadingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#00E5FF',
    opacity: 0.6,
  },
});