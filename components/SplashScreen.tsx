import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  runOnJS,
  Easing,
} from 'react-native-reanimated';
import { Image } from 'expo-image';

const { width, height } = Dimensions.get('window');

interface SplashScreenProps {
  onAnimationComplete: () => void;
}

export default function SplashScreen({ onAnimationComplete }: SplashScreenProps) {
  const backgroundOpacity = useSharedValue(0);
  const imageScale = useSharedValue(0.8);
  const imageOpacity = useSharedValue(0);
  const hasCompleted = useRef(false);

  useEffect(() => {
    // Prevent multiple executions
    if (hasCompleted.current) return;
    hasCompleted.current = true;

    // Single animation sequence
    const startAnimation = () => {
      // Background fade in with zoom effect
      backgroundOpacity.value = withTiming(1, { 
        duration: 800,
        easing: Easing.out(Easing.quad)
      });

      // Image zoom and fade in with approximation effect
      imageOpacity.value = withDelay(300, withTiming(1, { 
        duration: 1000,
        easing: Easing.out(Easing.quad)
      }));

      imageScale.value = withDelay(300, withSequence(
        withTiming(1.1, { 
          duration: 800,
          easing: Easing.out(Easing.back(1.5))
        }),
        withTiming(1.05, { 
          duration: 400,
          easing: Easing.out(Easing.quad)
        }),
        withTiming(1, { 
          duration: 300,
          easing: Easing.out(Easing.quad)
        })
      ));

      // Exit animation after showing for adequate time
      setTimeout(() => {
        backgroundOpacity.value = withTiming(0, {
          duration: 500,
          easing: Easing.in(Easing.quad)
        });
        imageOpacity.value = withTiming(0, { 
          duration: 500,
          easing: Easing.in(Easing.quad)
        }, () => {
          runOnJS(onAnimationComplete)();
        });
      }, 2800);
    };

    startAnimation();
  }, []); // Empty dependency ensures single execution

  const backgroundAnimatedStyle = useAnimatedStyle(() => ({
    opacity: backgroundOpacity.value,
    transform: [{ scale: backgroundOpacity.value * 0.1 + 0.9 }],
  }));

  const imageAnimatedStyle = useAnimatedStyle(() => ({
    opacity: imageOpacity.value,
    transform: [{ scale: imageScale.value }],
  }));

  return (
    <View style={styles.container}>
      {/* Full Screen Background Image with Zoom Effect */}
      <Animated.View style={[StyleSheet.absoluteFill, backgroundAnimatedStyle]}>
        <Animated.View style={[styles.imageContainer, imageAnimatedStyle]}>
          <Image
            source={{ uri: 'https://cdn-ai.onspace.ai/onspace/project/image/fpo2oV7vEZAWhoQd5yzKKj/Imagem_46.jpeg' }}
            style={styles.fullScreenImage}
            contentFit="cover"
            priority="high"
          />
        </Animated.View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#10142C',
  },
  imageContainer: {
    flex: 1,
    width: width,
    height: height,
  },
  fullScreenImage: {
    width: '100%',
    height: '100%',
  },
});