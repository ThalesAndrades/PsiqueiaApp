import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface GradientCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  colors?: string[];
}

export default function GradientCard({ 
  children, 
  style, 
  colors = ['rgba(26, 26, 46, 0.95)', 'rgba(22, 33, 62, 0.95)', 'rgba(15, 52, 96, 0.85)'] 
}: GradientCardProps) {
  return (
    <View style={[styles.container, style]}>
      <LinearGradient
        colors={colors}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.border}>
          <LinearGradient
            colors={['rgba(0, 229, 255, 0.6)', 'rgba(123, 104, 238, 0.4)', 'rgba(32, 178, 170, 0.5)']}
            style={styles.borderGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.content}>
              {children}
            </View>
          </LinearGradient>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#00E5FF',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  gradient: {
    flex: 1,
  },
  border: {
    padding: 1.5,
    flex: 1,
  },
  borderGradient: {
    borderRadius: 14.5,
    flex: 1,
  },
  content: {
    flex: 1,
    backgroundColor: 'rgba(26, 26, 46, 0.95)',
    borderRadius: 13,
    margin: 1,
    backdropFilter: 'blur(10px)',
  },
});