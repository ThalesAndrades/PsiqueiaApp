import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedProps,
  withTiming,
  withSequence,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import Svg, { Circle, Path } from 'react-native-svg';
import { MaterialIcons } from '@expo/vector-icons';

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface DiarySuccessAnimationProps {
  visible: boolean;
  onComplete?: () => void;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function DiarySuccessAnimation({ 
  visible, 
  onComplete 
}: DiarySuccessAnimationProps) {
  const trimmedTo1 = useSharedValue(0);
  const trimmedTo2 = useSharedValue(0);
  const trimmedTo3 = useSharedValue(0);
  const trimmedTo4 = useSharedValue(0);
  const containerOpacity = useSharedValue(0);
  const containerScale = useSharedValue(0.8);
  const iconOpacity = useSharedValue(0);
  const iconScale = useSharedValue(0.5);
  const textOpacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      // Container animation
      containerOpacity.value = withTiming(1, { 
        duration: 300, 
        easing: Easing.out(Easing.quad) 
      });
      containerScale.value = withTiming(1, { 
        duration: 400, 
        easing: Easing.out(Easing.back(1.2)) 
      });

      // Multiple circle animations (AnimatablePair style)
      trimmedTo1.value = withSequence(
        withTiming(1, { 
          duration: 1500, 
          easing: Easing.out(Easing.quad) 
        }),
        withTiming(0, { 
          duration: 500, 
          easing: Easing.in(Easing.quad) 
        })
      );

      trimmedTo2.value = withSequence(
        withDelay(200, withTiming(1, { 
          duration: 2000, 
          easing: Easing.out(Easing.quad) 
        })),
        withTiming(0, { 
          duration: 500, 
          easing: Easing.in(Easing.quad) 
        })
      );

      trimmedTo3.value = withSequence(
        withDelay(400, withTiming(1, { 
          duration: 1800, 
          easing: Easing.out(Easing.quad) 
        })),
        withTiming(0, { 
          duration: 500, 
          easing: Easing.in(Easing.quad) 
        })
      );

      trimmedTo4.value = withSequence(
        withDelay(600, withTiming(1, { 
          duration: 1600, 
          easing: Easing.out(Easing.quad) 
        })),
        withTiming(0, { 
          duration: 500, 
          easing: Easing.in(Easing.quad) 
        })
      );

      // Icon animation
      iconOpacity.value = withDelay(800, withTiming(1, { 
        duration: 600, 
        easing: Easing.out(Easing.quad) 
      }));
      iconScale.value = withDelay(800, withSequence(
        withTiming(1.3, { 
          duration: 300, 
          easing: Easing.out(Easing.back(1.8)) 
        }),
        withTiming(1, { 
          duration: 200, 
          easing: Easing.out(Easing.quad) 
        })
      ));

      // Text animation
      textOpacity.value = withDelay(1200, withTiming(1, { 
        duration: 600, 
        easing: Easing.out(Easing.quad) 
      }));

      // Auto hide after animation
      setTimeout(() => {
        containerOpacity.value = withTiming(0, { 
          duration: 400, 
          easing: Easing.in(Easing.quad) 
        });
        containerScale.value = withTiming(0.8, { 
          duration: 400, 
          easing: Easing.in(Easing.quad) 
        });
        
        setTimeout(() => {
          onComplete?.();
        }, 400);
      }, 3500);
    }
  }, [visible]);

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: containerOpacity.value,
    transform: [{ scale: containerScale.value }],
  }));

  const iconAnimatedStyle = useAnimatedStyle(() => ({
    opacity: iconOpacity.value,
    transform: [{ scale: iconScale.value }],
  }));

  const textAnimatedStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
  }));

  // Animated props for SVG circles (AnimatablePair style)
  const circle1AnimatedProps = useAnimatedProps(() => {
    const radius = 100;
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference * (1 - trimmedTo1.value);
    
    return {
      strokeDasharray,
      strokeDashoffset,
    };
  });

  const circle2AnimatedProps = useAnimatedProps(() => {
    const radius = 80;
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference * (1 - trimmedTo2.value);
    
    return {
      strokeDasharray,
      strokeDashoffset,
    };
  });

  const circle3AnimatedProps = useAnimatedProps(() => {
    const radius = 60;
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference * (1 - trimmedTo3.value);
    
    return {
      strokeDasharray,
      strokeDashoffset,
    };
  });

  const circle4AnimatedProps = useAnimatedProps(() => {
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference * (1 - trimmedTo4.value);
    
    return {
      strokeDasharray,
      strokeDashoffset,
    };
  });

  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <Animated.View style={[styles.container, containerAnimatedStyle]}>
        <View style={styles.animationContainer}>
          <Svg width={240} height={240} style={styles.svg}>
            {/* Outer circle */}
            <AnimatedCircle
              cx="120"
              cy="120"
              r="100"
              stroke="#00E5FF"
              strokeWidth="8"
              strokeLinecap="round"
              fill="none"
              animatedProps={circle1AnimatedProps}
              opacity={0.9}
            />
            
            {/* Second circle */}
            <AnimatedCircle
              cx="120"
              cy="120"
              r="80"
              stroke="#7B68EE"
              strokeWidth="6"
              strokeLinecap="round"
              fill="none"
              animatedProps={circle2AnimatedProps}
              opacity={0.8}
              transform="rotate(90 120 120)"
            />
            
            {/* Third circle */}
            <AnimatedCircle
              cx="120"
              cy="120"
              r="60"
              stroke="#20B2AA"
              strokeWidth="5"
              strokeLinecap="round"
              fill="none"
              animatedProps={circle3AnimatedProps}
              opacity={0.7}
              transform="rotate(180 120 120)"
            />
            
            {/* Inner circle */}
            <AnimatedCircle
              cx="120"
              cy="120"
              r="40"
              stroke="#FFD700"
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
              animatedProps={circle4AnimatedProps}
              opacity={0.6}
              transform="rotate(270 120 120)"
            />
            
            {/* Center gradient circle */}
            <Circle
              cx="120"
              cy="120"
              r="30"
              fill="url(#gradient)"
              opacity={0.9}
            />
            
            {/* Gradient definition */}
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00E5FF" stopOpacity={0.4} />
                <stop offset="33%" stopColor="#7B68EE" stopOpacity={0.3} />
                <stop offset="66%" stopColor="#20B2AA" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#FFD700" stopOpacity={0.4} />
              </linearGradient>
            </defs>
          </Svg>
          
          {/* Success icon */}
          <Animated.View style={[styles.iconContainer, iconAnimatedStyle]}>
            <MaterialIcons name="check" size={36} color="#FFFFFF" />
          </Animated.View>
        </View>
        
        {/* Success text */}
        <Animated.Text style={[styles.successText, textAnimatedStyle]}>
          ✨ Entrada salva com sucesso! 📝
        </Animated.Text>
        <Animated.Text style={[styles.subText, textAnimatedStyle]}>
          Seu progresso está sendo registrado
        </Animated.Text>
        <Animated.Text style={[styles.motivationalText, textAnimatedStyle]}>
          Parabéns por cuidar da sua saúde mental! 🌟
        </Animated.Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(10, 10, 31, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  animationContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  svg: {
    position: 'absolute',
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(0, 229, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(0, 229, 255, 0.4)',
    shadowColor: '#00E5FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  successText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 229, 255, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    marginBottom: 8,
  },
  subText: {
    fontSize: 14,
    color: '#7B68EE',
    textAlign: 'center',
    opacity: 0.9,
    marginBottom: 12,
  },
  motivationalText: {
    fontSize: 16,
    color: '#20B2AA',
    textAlign: 'center',
    fontWeight: '600',
    opacity: 0.8,
  },
});