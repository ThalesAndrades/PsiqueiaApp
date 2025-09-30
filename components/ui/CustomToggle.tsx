import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
} from 'react-native-reanimated';

interface CustomToggleProps {
  isOn: boolean;
  onToggle: (value: boolean) => void;
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
}

export default function CustomToggle({ 
  isOn, 
  onToggle, 
  size = 'medium',
  disabled = false 
}: CustomToggleProps) {
  const progress = useSharedValue(isOn ? 1 : 0);

  React.useEffect(() => {
    progress.value = withSpring(isOn ? 1 : 0, {
      damping: 15,
      stiffness: 150,
    });
  }, [isOn]);

  const sizes = {
    small: { width: 44, height: 24, thumb: 20 },
    medium: { width: 52, height: 30, thumb: 26 },
    large: { width: 60, height: 36, thumb: 32 },
  };

  const currentSize = sizes[size];

  const trackAnimatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolate(
      progress.value,
      [0, 1],
      [0, 1]
    );

    return {
      backgroundColor: backgroundColor > 0.5 ? '#00E5FF' : 'rgba(123, 104, 238, 0.3)',
    };
  });

  const thumbAnimatedStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      progress.value,
      [0, 1],
      [2, currentSize.width - currentSize.thumb - 2]
    );

    const scale = interpolate(
      progress.value,
      [0, 0.5, 1],
      [1, 1.1, 1]
    );

    const rotation = interpolate(
      progress.value,
      [0, 1],
      [0, 360]
    );

    return {
      transform: [
        { translateX },
        { scale },
        { rotate: `${rotation}deg` },
      ],
    };
  });

  const iconAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      progress.value,
      [0, 0.5, 1],
      [0, 0, 1]
    );

    return { opacity };
  });

  const iconOffAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      progress.value,
      [0, 0.5, 1],
      [1, 0, 0]
    );

    return { opacity };
  });

  const handlePress = () => {
    if (!disabled) {
      onToggle(!isOn);
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={0.8}
      style={[
        styles.container,
        {
          width: currentSize.width,
          height: currentSize.height,
          opacity: disabled ? 0.5 : 1,
        },
      ]}
    >
      <Animated.View style={[styles.track, trackAnimatedStyle]}>
        <Animated.View
          style={[
            styles.thumb,
            {
              width: currentSize.thumb,
              height: currentSize.thumb,
            },
            thumbAnimatedStyle,
          ]}
        >
          <Animated.View style={[styles.iconContainer, iconAnimatedStyle]}>
            <MaterialIcons 
              name="check" 
              size={currentSize.thumb * 0.5} 
              color="#00E5FF" 
            />
          </Animated.View>
          <Animated.View style={[styles.iconContainer, styles.iconOff, iconOffAnimatedStyle]}>
            <MaterialIcons 
              name="close" 
              size={currentSize.thumb * 0.4} 
              color="#666" 
            />
          </Animated.View>
        </Animated.View>
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 50,
    shadowColor: '#00E5FF',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  track: {
    flex: 1,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: 'rgba(123, 104, 238, 0.2)',
    justifyContent: 'center',
  },
  thumb: {
    backgroundColor: '#FFFFFF',
    borderRadius: 50,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  iconContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconOff: {
    // Positioned absolutely within thumb
  },
});