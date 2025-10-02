import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, usePathname } from 'expo-router';
import { useAuth } from '../../hooks/useAuth';

interface TabItem {
  name: string;
  title: string;
  icon: string;
  path: string;
  badge?: number;
  active?: boolean;
}

export default function SmartTabBar() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const pathname = usePathname();
  const isPatient = user?.profile?.user_type === 'patient';

  // UNIFIED THEME - Same colors for consistency
  const theme = {
    primary: '#00E5FF',
    secondary: '#7B68EE',
    accent: '#20B2AA',
    inactive: 'rgba(0, 229, 255, 0.6)',
    background: '#0F1419',
  };

  const getPatientTabs = (): TabItem[] => [
    {
      name: 'dashboard',
      title: 'Home',
      icon: 'home',
      path: '/(tabs)',
      active: pathname === '/' || pathname === '/(tabs)',
    },
    {
      name: 'diary',
      title: 'Diário',
      icon: 'book',
      path: '/(tabs)/diary',
      active: pathname.includes('/diary'),
    },
    {
      name: 'sessions',
      title: 'Sessões',
      icon: 'psychology',
      path: '/(tabs)/sessions',
      badge: 2,
      active: pathname.includes('/sessions'),
    },
    {
      name: 'community',
      title: 'Comunidade',
      icon: 'groups',
      path: '/(tabs)/community',
      active: pathname.includes('/community'),
    },
    {
      name: 'profile',
      title: 'Perfil',
      icon: 'person',
      path: '/(tabs)/profile',
      active: pathname.includes('/profile'),
    },
  ];

  const getPsychologistTabs = (): TabItem[] => [
    {
      name: 'dashboard',
      title: 'Dashboard',
      icon: 'dashboard',
      path: '/(tabs)',
      active: pathname === '/' || pathname === '/(tabs)',
    },
    {
      name: 'sessions',
      title: 'Agenda',
      icon: 'event',
      path: '/(tabs)/sessions',
      badge: 5,
      active: pathname.includes('/sessions'),
    },
    {
      name: 'financial',
      title: 'Financeiro',
      icon: 'account-balance-wallet',
      path: '/(tabs)/financial',
      active: pathname.includes('/financial'),
    },
    {
      name: 'community',
      title: 'Comunidade',
      icon: 'groups',
      path: '/(tabs)/community',
      active: pathname.includes('/community'),
    },
    {
      name: 'profile',
      title: 'Perfil',
      icon: 'person',
      path: '/(tabs)/profile',
      active: pathname.includes('/profile'),
    },
  ];

  const tabs = isPatient ? getPatientTabs() : getPsychologistTabs();

  const handleTabPress = (tab: TabItem) => {
    try {
      router.push(tab.path as any);
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  const TabButton = React.memo(({ tab }: { tab: TabItem }) => (
    <TouchableOpacity
      style={[styles.tabButton, tab.active && styles.tabButtonActive]}
      onPress={() => handleTabPress(tab)}
      activeOpacity={0.7}
    >
      {tab.active ? (
        <LinearGradient
          colors={[theme.primary, theme.secondary]}
          style={styles.activeTabGradient}
        >
          <MaterialIcons name={tab.icon as any} size={22} color="#FFFFFF" />
          {tab.badge && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{tab.badge}</Text>
            </View>
          )}
        </LinearGradient>
      ) : (
        <View style={styles.inactiveTab}>
          <MaterialIcons 
            name={tab.icon as any} 
            size={22} 
            color={theme.inactive} 
          />
          {tab.badge && (
            <View style={[styles.badge, { backgroundColor: '#FF6B6B' }]}>
              <Text style={styles.badgeText}>{tab.badge}</Text>
            </View>
          )}
        </View>
      )}
      <Text style={[
        styles.tabLabel,
        { color: tab.active ? theme.primary : theme.inactive },
        tab.active && styles.tabLabelActive
      ]}>
        {tab.title}
      </Text>
    </TouchableOpacity>
  ));

  return (
    <View style={[
      styles.container,
      { 
        paddingBottom: insets.bottom + 8,
        borderTopColor: `${theme.primary}30`
      }
    ]}>
      <LinearGradient
        colors={['rgba(15, 20, 25, 0.98)', 'rgba(26, 26, 46, 0.95)']}
        style={styles.gradient}
      >
        <View style={styles.tabsContainer}>
          {tabs.map((tab) => (
            <TabButton key={tab.name} tab={tab} />
          ))}
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  gradient: {
    paddingTop: 8,
    paddingHorizontal: 8,
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 8,
    minWidth: 50,
    position: 'relative',
  },
  tabButtonActive: {
    transform: [{ translateY: -2 }],
  },
  activeTabGradient: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#00E5FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    position: 'relative',
  },
  inactiveTab: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#FF6B6B',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: 'bold',
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 4,
    textAlign: 'center',
  },
  tabLabelActive: {
    textShadowColor: 'rgba(0, 229, 255, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});