import React, { useState, useCallback } from 'react';
import { View, Text, Button, TouchableOpacity, Dimensions, StyleSheet } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  withSpring,
  withTiming,
  interpolate,
  Extrapolate,
  runOnJS,
} from 'react-native-reanimated';

// Bottom sheet recipe — slides up from bottom, gesture-dismissible
// Key concepts:
// - translateY drives the sheet position
// - PanGestureHandler + useAnimatedGestureHandler for dragging
// - runOnJS() to call JS functions from worklets (setState)
// - Backdrop with opacity interpolated from sheet position

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SHEET_HEIGHT = 320;
const SNAP_THRESHOLD = SHEET_HEIGHT * 0.4;

console.log('Bottom sheet recipe loaded');

export function BottomSheetRecipe() {
  const [isOpen, setIsOpen] = useState(false);
  const translateY = useSharedValue(SHEET_HEIGHT);

  const open = useCallback(() => {
    setIsOpen(true);
    translateY.value = withSpring(0, { damping: 20, stiffness: 150 });
  }, []);

  const close = useCallback(() => {
    translateY.value = withTiming(SHEET_HEIGHT, { duration: 300 }, () => {
      'worklet';
      runOnJS(setIsOpen)(false);
    });
  }, []);

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      'worklet';
      ctx.startY = translateY.value;
    },
    onActive: (event, ctx) => {
      'worklet';
      const newValue = ctx.startY + event.translationY;
      translateY.value = Math.max(0, newValue); // don't go above 0
    },
    onEnd: (event) => {
      'worklet';
      if (translateY.value > SNAP_THRESHOLD || event.velocityY > 500) {
        // Dismiss
        translateY.value = withTiming(SHEET_HEIGHT, { duration: 300 }, () => {
          'worklet';
          runOnJS(setIsOpen)(false);
        });
      } else {
        // Snap back to open
        translateY.value = withSpring(0, { damping: 20, stiffness: 150 });
      }
    },
  });

  const sheetStyle = useAnimatedStyle(() => {
    'worklet';
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  const backdropStyle = useAnimatedStyle(() => {
    'worklet';
    const opacity = interpolate(
      translateY.value,
      [0, SHEET_HEIGHT],
      [0.5, 0],
      Extrapolate.CLAMP
    );
    return { opacity };
  });

  return (
    <View style={styles.demo}>
      <Text style={styles.label}>
        Bottom Sheet — PanGestureHandler + snap points + backdrop
      </Text>
      <Button title="Open Bottom Sheet" onPress={open} />

      {isOpen && (
        <View style={StyleSheet.absoluteFillObject}>
          {/* Backdrop */}
          <Animated.View style={[styles.backdrop, backdropStyle]}>
            <TouchableOpacity style={{ flex: 1 }} onPress={close} activeOpacity={1} />
          </Animated.View>

          {/* Sheet */}
          <PanGestureHandler onGestureEvent={gestureHandler}>
            <Animated.View style={[styles.sheet, sheetStyle]}>
              <View style={styles.handle} />
              <Text style={styles.sheetTitle}>Bottom Sheet</Text>
              <Text style={styles.sheetText}>
                Drag down to dismiss. Gesture is handled on the UI thread
                via useAnimatedGestureHandler + Reanimated 2.
              </Text>
              <Text style={styles.sheetText}>
                Snap threshold: {SNAP_THRESHOLD}px from top.
                Swipe past it or flick fast to dismiss.
              </Text>
              <View style={{ marginTop: 20 }}>
                <Button title="Close" onPress={close} />
              </View>
            </Animated.View>
          </PanGestureHandler>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  demo: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    minHeight: 80,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
    fontFamily: 'monospace',
    lineHeight: 18,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000',
  },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: SHEET_HEIGHT,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingTop: 12,
    elevation: 10,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#ddd',
    alignSelf: 'center',
    marginBottom: 16,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  sheetText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 8,
  },
});
