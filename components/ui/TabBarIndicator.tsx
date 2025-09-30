import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
} from 'react-native-reanimated';
import { useAuth } from '../../hooks/useAuth';

const { width: screenWidth } = Dimensions.get('window');

interface TabBarIndicatorProps {
  activeIndex: number;
  totalTabs: number;
}

export default function TabBarIndicator({ activeIndex, totalTabs }: TabBarIndicatorProps) {
  const { user } = useAuth();
  const isPatient = user?.profile?.user_type === 'patient';
  const translateX = useSharedValue(0);
  
  const tabWidth = screenWidth / totalTabs;
  const primaryColor = isPatient ? '#00E5FF' : '#7B68EE';
  const secondaryColor = isPatient ? '#20B2AA' : '#00E5FF';

  React.useEffect(() => {
    translateX.value = withSpring(activeIndex * tabWidth, {
      damping: 15,
      stiffness: 150,
    });
  }, [activeIndex, tabWidth]);

  const animatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      Math.abs(translateX.value % tabWidth),
      [0, tabWidth / 2, tabWidth],
      [1, 0.8, 1]
    );

    return {
      transform: [
        { translateX: translateX.value },
        { scale }
      ],
    };
  });

  return (
    <View style={[styles.container, { width: screenWidth }]}>
      <Animated.View style={[styles.indicator, { width: tabWidth }, animatedStyle]}>
        <LinearGradient
          colors={[primaryColor, secondaryColor]}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        />
        <View style={styles.glow}>
          <LinearGradient
            colors={[`${primaryColor}40`, 'transparent']}
            style={styles.glowGradient}
          />
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: 3,
    zIndex: 10,
  },
  indicator: {
    height: 3,
    borderRadius: 1.5,
    overflow: 'hidden',
  },
  gradient: {
    flex: 1,
  },
  glow: {
    position: 'absolute',
    top: -2,
    left: 0,
    right: 0,
    height: 7,
  },
  glowGradient: {
    flex: 1,
  },
});