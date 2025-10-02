import React, { useState, useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, Text, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AuthProvider } from '../contexts/AuthContext';
import ErrorBoundary from '../components/ErrorBoundary';
import { PerformanceMonitor, MemoryManager } from '../utils/performance';
import '../global.css';

function LoadingScreen() {
  return (
    <LinearGradient
      colors={['#0A0E1A', '#1A1A2E', '#16213E']}
      style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
    >
      <ActivityIndicator size="large" color="#00E5FF" />
      <Text style={{ color: '#FFFFFF', fontSize: 18, marginTop: 16 }}>
        PsiqueIA
      </Text>
      <View style={{ 
        flexDirection: 'row', 
        gap: 8, 
        marginTop: 12,
        alignItems: 'center' 
      }}>
        <View style={{ 
          width: 6, 
          height: 6, 
          borderRadius: 3, 
          backgroundColor: '#00E5FF' 
        }} />
        <View style={{ 
          width: 6, 
          height: 6, 
          borderRadius: 3, 
          backgroundColor: '#00E5FF' 
        }} />
        <View style={{ 
          width: 6, 
          height: 6, 
          borderRadius: 3, 
          backgroundColor: 'rgba(0, 229, 255, 0.3)' 
        }} />
      </View>
    </LinearGradient>
  );
}

function RootLayoutContent() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    
    PerformanceMonitor.startTimer('app_init');
    console.log('🚀 App initialization started');

    // TIMEOUT ULTRA-OTIMIZADO: NUNCA mais que 200ms (MÁXIMA VELOCIDADE)
    const forceReady = setTimeout(() => {
      if (mounted) {
        console.log('🚀 ULTRA FORCE READY: App initialization timeout (200ms MAXIMUM SPEED)');
        setAppIsReady(true);
        PerformanceMonitor.endTimer('app_init');
      }
    }, 200); // Ultra-otimizado para 200ms

    // Preparação instantânea - apenas 30ms
    const prepare = async () => {
      try {
        // Minimal preparation - only 30ms
        await new Promise(resolve => setTimeout(resolve, 30));
        
        // Skip all non-essential setup
        if (__DEV__) {
          console.log('🔧 Dev mode: Instant load');
        }
      } catch (e) {
        console.warn('App initialization error:', e);
      } finally {
        if (mounted) {
          clearTimeout(forceReady);
          setAppIsReady(true);
          PerformanceMonitor.endTimer('app_init');
          
          // Log performance in dev mode
          if (__DEV__) {
            setTimeout(() => {
              PerformanceMonitor.logSummary();
            }, 500);
          }
        }
      }
    };

    // Start immediately - zero delay
    prepare();

    return () => {
      mounted = false;
      clearTimeout(forceReady);
      MemoryManager.cleanup();
    };
  }, []);

  if (!appIsReady) {
    return <LoadingScreen />;
  }

  return (
    <ErrorBoundary>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="chat-list" options={{ headerShown: false }} />
        <Stack.Screen name="chat" options={{ headerShown: false }} />
      </Stack>
    </ErrorBoundary>
  );
}

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <RootLayoutContent />
      </AuthProvider>
    </ErrorBoundary>
  );
}