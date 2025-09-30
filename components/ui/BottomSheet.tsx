import React, { useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  PanResponder,
  BackHandler,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  snapPoints?: number[];
  initialSnap?: number;
}

export default function BottomSheet({
  visible,
  onClose,
  title,
  children,
  snapPoints = [0.3, 0.6, 0.9],
  initialSnap = 1,
}: BottomSheetProps) {
  const insets = useSafeAreaInsets();
  const translateY = useSharedValue(SCREEN_HEIGHT);
  const backdropOpacity = useSharedValue(0);
  const currentSnapIndex = useSharedValue(initialSnap);

  const snapPointsPixels = snapPoints.map(point => SCREEN_HEIGHT * (1 - point));

  useEffect(() => {
    if (visible) {
      backdropOpacity.value = withTiming(1, { duration: 300 });
      translateY.value = withSpring(snapPointsPixels[initialSnap], {
        damping: 15,
        stiffness: 150,
      });
    } else {
      backdropOpacity.value = withTiming(0, { duration: 300 });
      translateY.value = withSpring(SCREEN_HEIGHT, {
        damping: 15,
        stiffness: 150,
      });
    }
  }, [visible]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (visible) {
        onClose();
        return true;
      }
      return false;
    });

    return () => backHandler.remove();
  }, [visible, onClose]);

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, gestureState) => {
      return Math.abs(gestureState.dy) > 10;
    },
    onPanResponderMove: (_, gestureState) => {
      const newY = snapPointsPixels[currentSnapIndex.value] + gestureState.dy;
      if (newY >= snapPointsPixels[snapPointsPixels.length - 1] && newY <= SCREEN_HEIGHT) {
        translateY.value = newY;
      }
    },
    onPanResponderRelease: (_, gestureState) => {
      const currentY = snapPointsPixels[currentSnapIndex.value] + gestureState.dy;
      const velocity = gestureState.vy;

      // Determine the closest snap point
      let closestSnapIndex = 0;
      let minDistance = Math.abs(currentY - snapPointsPixels[0]);

      snapPointsPixels.forEach((snapPoint, index) => {
        const distance = Math.abs(currentY - snapPoint);
        if (distance < minDistance) {
          minDistance = distance;
          closestSnapIndex = index;
        }
      });

      // Consider velocity for swipe gestures
      if (velocity > 500 && currentSnapIndex.value > 0) {
        closestSnapIndex = Math.max(0, currentSnapIndex.value - 1);
      } else if (velocity < -500 && currentSnapIndex.value < snapPointsPixels.length - 1) {
        closestSnapIndex = Math.min(snapPointsPixels.length - 1, currentSnapIndex.value + 1);
      }

      // Close if swiped down from smallest snap point
      if (closestSnapIndex === 0 && gestureState.dy > 100) {
        runOnJS(onClose)();
        return;
      }

      currentSnapIndex.value = closestSnapIndex;
      translateY.value = withSpring(snapPointsPixels[closestSnapIndex], {
        damping: 15,
        stiffness: 150,
      });
    },
  });

  const sheetAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const backdropAnimatedStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  if (!visible) return null;

  return (
    <Modal
      transparent
      visible={visible}
      statusBarTranslucent
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <Animated.View style={[styles.backdrop, backdropAnimatedStyle]}>
          <TouchableOpacity style={styles.backdropTouch} onPress={onClose} />
        </Animated.View>

        <Animated.View
          style={[styles.sheet, sheetAnimatedStyle]}
          {...panResponder.panHandlers}
        >
          <LinearGradient
            colors={['rgba(26, 26, 46, 0.98)', 'rgba(22, 33, 62, 0.98)', 'rgba(15, 52, 96, 0.95)']}
            style={styles.sheetGradient}
          >
            {/* Handle */}
            <View style={styles.handle}>
              <View style={styles.handleBar} />
            </View>

            {/* Header */}
            {title && (
              <View style={styles.header}>
                <Text style={styles.title}>{title}</Text>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <MaterialIcons name="close" size={24} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            )}

            {/* Content */}
            <View style={[styles.content, { paddingBottom: insets.bottom + 20 }]}>
              {children}
            </View>
          </LinearGradient>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  backdropTouch: {
    flex: 1,
  },
  sheet: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: SCREEN_HEIGHT,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  sheetGradient: {
    flex: 1,
  },
  handle: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  handleBar: {
    width: 40,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(123, 104, 238, 0.2)',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(123, 104, 238, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: 20,
  },
});