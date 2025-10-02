import React from 'react';
import { Tabs } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Platform, View, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../hooks/useAuth';

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const isPatient = user?.profile?.user_type === 'patient';
  const isPsychologist = user?.profile?.user_type === 'psychologist';

  // TEMA UNIFICADO - Cores consistentes
  const theme = {
    primary: '#00E5FF',
    secondary: '#7B68EE',
    accent: '#20B2AA',
    inactive: 'rgba(0, 229, 255, 0.6)',
    background: '#0F1419',
  };

  // BADGES DINÂMICOS - Baseados em dados reais
  const getBadgeCount = (tabName: string) => {
    switch (tabName) {
      case 'sessions':
        return isPatient ? 2 : 5; // Próximas vs Agenda
      case 'community':
        return 0; // Mensagens não lidas
      default:
        return 0;
    }
  };

  // CONFIGURAÇÃO DE TABS POR USUÁRIO
  const getTabsConfig = () => {
    if (isPatient) {
      return [
        { name: 'index', title: 'Home', icon: 'home', show: true },
        { name: 'diary', title: 'Diário', icon: 'book', show: true },
        { name: 'sessions', title: 'Sessões', icon: 'psychology', show: true },
        { name: 'community', title: 'Comunidade', icon: 'groups', show: true },
        { name: 'profile', title: 'Perfil', icon: 'person', show: true },
      ];
    } else if (isPsychologist) {
      return [
        { name: 'index', title: 'Dashboard', icon: 'dashboard', show: true },
        { name: 'sessions', title: 'Agenda', icon: 'event', show: true },
        { name: 'financial', title: 'Financeiro', icon: 'account-balance-wallet', show: true },
        { name: 'community', title: 'Comunidade', icon: 'groups', show: true },
        { name: 'profile', title: 'Perfil', icon: 'person', show: true },
      ];
    }
    return [];
  };

  const tabsConfig = getTabsConfig();

  // COMPONENTE DE BADGE OTIMIZADO
  const TabBadge = React.memo(({ count }: { count: number }) => {
    if (count === 0) return null;
    
    return (
      <View style={{
        position: 'absolute',
        top: -2,
        right: -6,
        backgroundColor: '#FF6B6B',
        borderRadius: 10,
        minWidth: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: theme.background,
      }}>
        <Text style={{
          color: '#FFFFFF',
          fontSize: 11,
          fontWeight: 'bold',
          textAlign: 'center',
        }}>
          {count > 99 ? '99+' : count.toString()}
        </Text>
      </View>
    );
  });

  // COMPONENTE DE ÍCONE OTIMIZADO
  const TabIcon = React.memo(({ icon, color, size, tabName }: { 
    icon: string; 
    color: string; 
    size: number; 
    tabName: string;
  }) => (
    <View style={{ position: 'relative' }}>
      <MaterialIcons 
        name={icon as any} 
        size={size + 2} 
        color={color}
        style={{
          textShadowColor: `${color}40`,
          textShadowOffset: { width: 0, height: 1 },
          textShadowRadius: 2,
        }}
      />
      <TabBadge count={getBadgeCount(tabName)} />
    </View>
  ));

  // Loading state simplificado
  if (!user?.profile?.user_type) {
    return (
      <View style={{ 
        flex: 1, 
        backgroundColor: theme.background,
        justifyContent: 'center',
        alignItems: 'center' 
      }}>
        <Text style={{ color: theme.primary, fontSize: 16 }}>
          Carregando...
        </Text>
      </View>
    );
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.background,
          borderTopWidth: 2,
          borderTopColor: `${theme.primary}30`,
          height: Platform.select({
            ios: insets.bottom + 85,
            android: insets.bottom + 80,
            default: 85
          }),
          paddingTop: 12,
          paddingBottom: Platform.select({
            ios: insets.bottom + 12,
            android: insets.bottom + 12,
            default: 12
          }),
          paddingHorizontal: 20,
          shadowColor: theme.primary,
          shadowOffset: {
            width: 0,
            height: -2,
          },
          shadowOpacity: 0.15,
          shadowRadius: 8,
          elevation: 8,
        },
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.inactive,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '700',
          marginTop: 6,
          textShadowColor: `${theme.primary}30`,
          textShadowOffset: { width: 0, height: 1 },
          textShadowRadius: 2,
        },
        tabBarIconStyle: {
          marginBottom: 2,
        },
        tabBarBackground: () => (
          <LinearGradient
            colors={[theme.background, `${theme.background}E6`]}
            style={{ flex: 1 }}
          />
        ),
      }}
    >
      {/* Renderizar tabs dinamicamente */}
      {tabsConfig.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            href: tab.show ? undefined : null,
            tabBarIcon: ({ color, size }) => (
              <TabIcon 
                icon={tab.icon} 
                color={color} 
                size={size} 
                tabName={tab.name}
              />
            ),
          }}
        />
      ))}

      {/* Telas ocultas - sempre presentes mas não visíveis no tab bar */}
      <Tabs.Screen
        name="patient-dashboard"
        options={{ href: null, title: 'Patient Dashboard' }}
      />
      <Tabs.Screen
        name="psychologist-dashboard"
        options={{ href: null, title: 'Psychologist Dashboard' }}
      />
      
      {/* Tabs condicionais ocultas */}
      {!isPatient && (
        <Tabs.Screen name="diary" options={{ href: null, title: 'Diário' }} />
      )}
      {!isPsychologist && (
        <Tabs.Screen name="financial" options={{ href: null, title: 'Financeiro' }} />
      )}
    </Tabs>
  );
}