import { useState, useEffect, useCallback } from 'react';
import { router, usePathname } from 'expo-router';
import { useAuth } from './useAuth';

interface TabConfig {
  name: string;
  title: string;
  icon: string;
  path: string;
  requiresAuth?: boolean;
  allowedUserTypes?: ('patient' | 'psychologist')[];
  badge?: number;
}

export function useTabNavigation() {
  const { user } = useAuth();
  const pathname = usePathname();
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  const isAuthenticated = !!user;

  const isPatient = user?.profile?.user_type === 'patient';
  const isPsychologist = user?.profile?.user_type === 'psychologist';

  // Configuração de tabs por tipo de usuário
  const getTabsForUserType = useCallback((): TabConfig[] => {
    if (isPatient) {
      return [
        {
          name: 'dashboard',
          title: 'Home',
          icon: 'home',
          path: '/(tabs)',
          requiresAuth: true,
          allowedUserTypes: ['patient'],
          badge: 0,
        },
        {
          name: 'diary',
          title: 'Diário',
          icon: 'book',
          path: '/(tabs)/diary',
          requiresAuth: true,
          allowedUserTypes: ['patient'],
          badge: 0,
        },
        {
          name: 'sessions',
          title: 'Sessões',
          icon: 'psychology',
          path: '/(tabs)/sessions',
          requiresAuth: true,
          allowedUserTypes: ['patient'],
          badge: 2, // Próximas sessões
        },
        {
          name: 'community',
          title: 'Comunidade',
          icon: 'groups',
          path: '/(tabs)/community',
          requiresAuth: true,
          allowedUserTypes: ['patient', 'psychologist'],
          badge: 0,
        },
        {
          name: 'profile',
          title: 'Perfil',
          icon: 'person',
          path: '/(tabs)/profile',
          requiresAuth: true,
          allowedUserTypes: ['patient', 'psychologist'],
          badge: 0,
        },
      ];
    } else if (isPsychologist) {
      return [
        {
          name: 'dashboard',
          title: 'Dashboard',
          icon: 'dashboard',
          path: '/(tabs)',
          requiresAuth: true,
          allowedUserTypes: ['psychologist'],
          badge: 0,
        },
        {
          name: 'sessions',
          title: 'Agenda',
          icon: 'event',
          path: '/(tabs)/sessions',
          requiresAuth: true,
          allowedUserTypes: ['psychologist'],
          badge: 5, // Sessões do dia
        },
        {
          name: 'financial',
          title: 'Financeiro',
          icon: 'account-balance-wallet',
          path: '/(tabs)/financial',
          requiresAuth: true,
          allowedUserTypes: ['psychologist'],
          badge: 0,
        },
        {
          name: 'community',
          title: 'Comunidade',
          icon: 'groups',
          path: '/(tabs)/community',
          requiresAuth: true,
          allowedUserTypes: ['patient', 'psychologist'],
          badge: 0,
        },
        {
          name: 'profile',
          title: 'Perfil',
          icon: 'person',
          path: '/(tabs)/profile',
          requiresAuth: true,
          allowedUserTypes: ['patient', 'psychologist'],
          badge: 0,
        },
      ];
    }
    return [];
  }, [isPatient, isPsychologist]);

  const tabs = getTabsForUserType();

  // Atualizar índice ativo baseado na rota atual
  useEffect(() => {
    const currentIndex = tabs.findIndex(tab => {
      if (tab.path === '/(tabs)') {
        return pathname === '/' || pathname === '/(tabs)';
      }
      return pathname.includes(tab.name);
    });
    
    if (currentIndex !== -1) {
      setActiveTabIndex(currentIndex);
    }
  }, [pathname, tabs]);

  // Navegação inteligente com validações
  const navigateToTab = useCallback((tabName: string) => {
    const tab = tabs.find(t => t.name === tabName);
    
    if (!tab) {
      console.warn(`Tab '${tabName}' not found`);
      return false;
    }

    // Verificar autenticação
    if (tab.requiresAuth && !isAuthenticated) {
      router.replace('/login');
      return false;
    }

    // Verificar permissões de usuário
    if (tab.allowedUserTypes && user?.profile?.user_type) {
      if (!tab.allowedUserTypes.includes(user.profile.user_type)) {
        console.warn(`User type '${user.profile.user_type}' not allowed for tab '${tabName}'`);
        return false;
      }
    }

    try {
      router.push(tab.path as any);
      return true;
    } catch (error) {
      console.error('Navigation error:', error);
      return false;
    }
  }, [tabs, isAuthenticated, user]);

  // Verificar se uma tab pode ser acessada
  const canAccessTab = useCallback((tabName: string): boolean => {
    const tab = tabs.find(t => t.name === tabName);
    if (!tab) return false;

    if (tab.requiresAuth && !isAuthenticated) return false;
    
    if (tab.allowedUserTypes && user?.profile?.user_type) {
      return tab.allowedUserTypes.includes(user.profile.user_type);
    }
    
    return true;
  }, [tabs, isAuthenticated, user]);

  // Obter configuração de cores por tipo de usuário
  const getTabColors = useCallback(() => {
    return {
      primary: isPatient ? '#00E5FF' : '#7B68EE',
      secondary: isPatient ? '#20B2AA' : '#00E5FF',
      inactive: isPatient ? 'rgba(0, 229, 255, 0.6)' : 'rgba(123, 104, 238, 0.6)',
      background: '#0F1419',
      shadow: isPatient ? '#00E5FF' : '#7B68EE',
    };
  }, [isPatient]);

  // Obter badges dinâmicos
  const getBadgeCount = useCallback((tabName: string): number => {
    // Aqui você pode implementar lógica para badges dinâmicos
    // baseados em dados reais do usuário
    switch (tabName) {
      case 'sessions':
        return isPatient ? 2 : 5; // Próximas sessões vs sessões do dia
      case 'community':
        return 0; // Mensagens não lidas
      default:
        return 0;
    }
  }, [isPatient]);

  return {
    tabs,
    activeTabIndex,
    navigateToTab,
    canAccessTab,
    getTabColors,
    getBadgeCount,
    isPatient,
    isPsychologist,
  };
}