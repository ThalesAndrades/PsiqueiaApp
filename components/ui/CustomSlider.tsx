import React, { useState } from 'react';
import { View, Text, StyleSheet, PanResponder, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';

interface CustomSliderProps {
  value: number;
  onValueChange: (value: number) => void;
  minimumValue?: number;
  maximumValue?: number;
  step?: number;
  title?: string;
  showValue?: boolean;
  disabled?: boolean;
}

const SLIDER_WIDTH = Dimensions.get('window').width - 80;
const THUMB_SIZE = 24;

export default function CustomSlider({
  value,
  onValueChange,
  minimumValue = 0,
  maximumValue = 100,
  step = 1,
  title,
  showValue = true,
  disabled = false,
}: CustomSliderProps) {
  const translateX = useSharedValue(0);
  const [isDragging, setIsDragging] = useState(false);

  const normalizedValue = (value - minimumValue) / (maximumValue - minimumValue);
  const initialPosition = normalizedValue * (SLIDER_WIDTH - THUMB_SIZE);

  React.useEffect(() => {
    translateX.value = withSpring(initialPosition, {
      damping: 15,
      stiffness: 150,
    });
  }, [value, initialPosition]);

  const updateValue = (position: number) => {
    const clampedPosition = Math.max(0, Math.min(position, SLIDER_WIDTH - THUMB_SIZE));
    const percentage = clampedPosition / (SLIDER_WIDTH - THUMB_SIZE);
    const rawValue = minimumValue + percentage * (maximumValue - minimumValue);
    const steppedValue = Math.round(rawValue / step) * step;
    const finalValue = Math.max(minimumValue, Math.min(maximumValue, steppedValue));
    
    onValueChange(finalValue);
  };

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => !disabled,
    onPanResponderGrant: () => {
      setIsDragging(true);
    },
    onPanResponderMove: (_, gestureState) => {
      const newPosition = initialPosition + gestureState.dx;
      translateX.value = Math.max(0, Math.min(newPosition, SLIDER_WIDTH - THUMB_SIZE));
      runOnJS(updateValue)(translateX.value);
    },
    onPanResponderRelease: () => {
      setIsDragging(false);
    },
  });

  const thumbAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { scale: isDragging ? 1.2 : 1 },
    ],
  }));

  const trackFillAnimatedStyle = useAnimatedStyle(() => ({
    width: translateX.value + THUMB_SIZE / 2,
  }));

  return (
    <View style={styles.container}>
      {title && (
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          {showValue && (
            <Text style={styles.valueText}>
              {value.toFixed(step < 1 ? 1 : 0)}
            </Text>
          )}
        </View>
      )}

      <View style={styles.sliderContainer}>
        {/* Track Background */}
        <View style={styles.track} />

        {/* Track Fill */}
        <Animated.View style={[styles.trackFill, trackFillAnimatedStyle]}>
          <LinearGradient
            colors={['#00E5FF', '#7B68EE', '#20B2AA']}
            style={styles.trackGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          />
        </Animated.View>

        {/* Thumb */}
        <Animated.View
          style={[styles.thumb, thumbAnimatedStyle, disabled && styles.thumbDisabled]}
          {...panResponder.panHandlers}
        >
          <LinearGradient
            colors={isDragging ? ['#00E5FF', '#7B68EE'] : ['#FFFFFF', '#F0F0F0']}
            style={styles.thumbGradient}
          />
          <View style={styles.thumbCenter} />
        </Animated.View>
      </View>

      {/* Min/Max Labels */}
      <View style={styles.labels}>
        <Text style={styles.labelText}>{minimumValue}</Text>
        <Text style={styles.labelText}>{maximumValue}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  valueText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00E5FF',
  },
  sliderContainer: {
    height: THUMB_SIZE,
    justifyContent: 'center',
    marginBottom: 8,
  },
  track: {
    height: 4,
    backgroundColor: 'rgba(123, 104, 238, 0.3)',
    borderRadius: 2,
    width: SLIDER_WIDTH,
  },
  trackFill: {
    position: 'absolute',
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  trackGradient: {
    flex: 1,
  },
  thumb: {
    position: 'absolute',
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    shadowColor: '#00E5FF',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  thumbDisabled: {
    opacity: 0.5,
  },
  thumbGradient: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbCenter: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00E5FF',
  },
  labels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: THUMB_SIZE / 2,
  },
  labelText: {
    fontSize: 12,
    color: '#7B68EE',
  },
});