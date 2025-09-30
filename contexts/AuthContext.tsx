import React, { createContext, useState, useEffect, ReactNode, useRef, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService, AuthUser } from '../services/auth';
import { CacheManager, PerformanceMonitor } from '../utils/performance';

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  showOnboarding: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string, userType: 'patient' | 'psychologist') => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: any) => Promise<void>;
  completeOnboarding: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ONBOARDING_KEY = 'onboarding_completed';
const USER_CACHE_KEY = 'cached_user';
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes cache

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  
  // Ultra performance optimizations
  const mountedRef = useRef(true);
  const lastRefreshRef = useRef(0);
  const initializingRef = useRef(false);

  // Memoized context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    user,
    loading,
    showOnboarding,
    signIn: async (email: string, password: string) => {
      PerformanceMonitor.startTimer('auth_signin');
      try {
        console.log('🔐 Signing in...');
        await authService.signIn(email, password);
        const currentUser = await authService.getCurrentUser();
        
        if (mountedRef.current) {
          setUser(currentUser);
          setShowOnboarding(false);
          
          // Cache user data aggressively
          if (currentUser) {
            CacheManager.set(USER_CACHE_KEY, currentUser, CACHE_TTL);
          }
        }
      } catch (error) {
        console.error('❌ Sign in error:', error);
        throw error;
      } finally {
        PerformanceMonitor.endTimer('auth_signin');
      }
    },

    signUp: async (email: string, password: string, name: string, userType: 'patient' | 'psychologist') => {
      PerformanceMonitor.startTimer('auth_signup');
      try {
        console.log('📝 Signing up...');
        await authService.signUp(email, password, name, userType);
        const currentUser = await authService.getCurrentUser();
        
        if (mountedRef.current) {
          setUser(currentUser);
          setShowOnboarding(true);
          
          // Cache user data aggressively
          if (currentUser) {
            CacheManager.set(USER_CACHE_KEY, currentUser, CACHE_TTL);
          }
        }
      } catch (error) {
        console.error('❌ Sign up error:', error);
        throw error;
      } finally {
        PerformanceMonitor.endTimer('auth_signup');
      }
    },

    signOut: async () => {
      PerformanceMonitor.startTimer('auth_signout');
      try {
        console.log('🚪 Signing out...');
        await authService.signOut();
        
        if (mountedRef.current) {
          setUser(null);
          setShowOnboarding(false);
          
          // Clear cache
          CacheManager.delete(USER_CACHE_KEY);
        }
      } catch (error) {
        console.error('❌ Sign out error:', error);
        throw error;
      } finally {
        PerformanceMonitor.endTimer('auth_signout');
      }
    },

    updateProfile: async (updates: any) => {
      try {
        const updatedProfile = await authService.updateProfile(updates);
        if (user && mountedRef.current) {
          const updatedUser = {
            ...user,
            profile: updatedProfile,
          };
          setUser(updatedUser);
          
          // Update cache
          CacheManager.set(USER_CACHE_KEY, updatedUser, CACHE_TTL);
        }
      } catch (error) {
        console.error('❌ Update profile error:', error);
        throw error;
      }
    },

    completeOnboarding: async () => {
      if (user) {
        try {
          await AsyncStorage.setItem(`${ONBOARDING_KEY}_${user.id}`, 'true');
          if (mountedRef.current) {
            setShowOnboarding(false);
          }
        } catch (error) {
          console.error('❌ Complete onboarding error:', error);
        }
      }
    },
  }), [user, loading, showOnboarding]);

  // Ultra-optimized initialization with aggressive caching
  useEffect(() => {
    let forceTimeout: NodeJS.Timeout;

    const initializeAuth = async () => {
      if (initializingRef.current) return;
      initializingRef.current = true;

      try {
        PerformanceMonitor.startTimer('auth_init');
        console.log('🔄 Initializing auth...');

        // Try cache first for INSTANT load
        const cachedUser = CacheManager.get<AuthUser>(USER_CACHE_KEY);
        if (cachedUser && mountedRef.current) {
          console.log('⚡ Loading cached user (INSTANT)');
          setUser(cachedUser);
          setLoading(false);
        }

        // Ultra-aggressive throttle - minimum 15 seconds between calls
        const now = Date.now();
        if (now - lastRefreshRef.current < 15000 && cachedUser) {
          console.log('⚠️ Ultra-throttling auth refresh, using cache');
          return;
        }
        lastRefreshRef.current = now;

        // Get fresh data
        const currentUser = await authService.getCurrentUser();
        
        if (mountedRef.current) {
          setUser(currentUser);
          
          // Cache fresh data aggressively
          if (currentUser) {
            CacheManager.set(USER_CACHE_KEY, currentUser, CACHE_TTL);
            
            try {
              const completed = await AsyncStorage.getItem(`${ONBOARDING_KEY}_${currentUser.id}`);
              setShowOnboarding(!completed);
            } catch (error) {
              console.warn('Error checking onboarding:', error);
              setShowOnboarding(false);
            }
          } else {
            CacheManager.delete(USER_CACHE_KEY);
          }
        }
      } catch (error) {
        console.error('❌ Error initializing auth:', error);
        if (mountedRef.current) {
          setUser(null);
          setShowOnboarding(false);
          CacheManager.delete(USER_CACHE_KEY);
        }
      } finally {
        if (mountedRef.current) {
          clearTimeout(forceTimeout);
          setLoading(false);
          initializingRef.current = false;
        }
        PerformanceMonitor.endTimer('auth_init');
      }
    };

    // TIMEOUT DE SEGURANÇA: NUNCA mais que 800ms (ULTRA-OTIMIZADO)
    forceTimeout = setTimeout(() => {
      if (mountedRef.current && loading) {
        console.log('⚠️ ULTRA FORCE STOP: Auth loading timeout reached (800ms)');
        setLoading(false);
        setUser(null);
        initializingRef.current = false;
      }
    }, 800); // Ultra-otimizado para 800ms

    // Start initialization with minimal delay - 20ms
    const initTimeout = setTimeout(initializeAuth, 20);

    return () => {
      mountedRef.current = false;
      initializingRef.current = false;
      clearTimeout(initTimeout);
      clearTimeout(forceTimeout);
    };
  }, []);

  // Auto-refresh with intelligent caching (every 10 minutes)
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(async () => {
      if (mountedRef.current && !loading) {
        try {
          console.log('🔄 Auto-refreshing user data...');
          const currentUser = await authService.getCurrentUser();
          if (currentUser && mountedRef.current) {
            setUser(currentUser);
            CacheManager.set(USER_CACHE_KEY, currentUser, CACHE_TTL);
          }
        } catch (error) {
          console.warn('⚠️ Auto-refresh failed:', error);
        }
      }
    }, 10 * 60 * 1000); // 10 minutes

    return () => clearInterval(interval);
  }, [user, loading]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}