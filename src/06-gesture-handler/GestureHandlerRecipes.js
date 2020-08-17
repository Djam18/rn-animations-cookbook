import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PanGestureHandler, PinchGestureHandler, RotationGestureHandler, State } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  withSpring,
  withDecay,
} from 'react-native-reanimated';

// Gesture Handler — handles touch gestures on the UI thread
// Works seamlessly with Reanimated 2.
// useAnimatedGestureHandler runs on the UI thread — no JS bridge.
// GestureHandler v1 API: PanGestureHandler, PinchGestureHandler, RotationGestureHandler as wrapper components.
// (v2 will change this API completely — but that's not out yet in Aug 2020)

console.log('Gesture Handler recipes loaded');

export function PanGestureDemo() {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      'worklet';
      ctx.startX = translateX.value;
      ctx.startY = translateY.value;
    },
    onActive: (event, ctx) => {
      'worklet';
      translateX.value = ctx.startX + event.translationX;
      translateY.value = ctx.startY + event.translationY;
    },
    onEnd: (event) => {
      'worklet';
      // Decay: continue moving with velocity and decelerate
      translateX.value = withDecay({ velocity: event.velocityX });
      translateY.value = withDecay({ velocity: event.velocityY });
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    'worklet';
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
      ],
    };
  });

  const reset = () => {
    translateX.value = withSpring(0, { damping: 15 });
    translateY.value = withSpring(0, { damping: 15 });
  };

  return (
    <View style={styles.demo}>
      <Text style={styles.label}>PanGestureHandler + withDecay (throw it!)</Text>
      <View style={styles.panArea}>
        <PanGestureHandler onGestureEvent={gestureHandler}>
          <Animated.View style={[styles.draggableBox, animatedStyle]}>
            <Text style={styles.boxText}>Drag Me</Text>
          </Animated.View>
        </PanGestureHandler>
      </View>
      <Text style={styles.tapHint} onPress={reset}>Tap to reset</Text>
    </View>
  );
}

export function PinchGestureDemo() {
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);

  const gestureHandler = useAnimatedGestureHandler({
    onActive: (event) => {
      'worklet';
      scale.value = savedScale.value * event.scale;
    },
    onEnd: () => {
      'worklet';
      savedScale.value = scale.value;
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    'worklet';
    return { transform: [{ scale: scale.value }] };
  });

  const reset = () => {
    scale.value = withSpring(1, { damping: 15 });
    savedScale.value = 1;
  };

  return (
    <View style={styles.demo}>
      <Text style={styles.label}>PinchGestureHandler — pinch to zoom (persistent)</Text>
      <View style={styles.panArea}>
        <PinchGestureHandler onGestureEvent={gestureHandler}>
          <Animated.View style={[styles.pinchBox, animatedStyle]}>
            <Text style={styles.pinchEmoji}>🗺️</Text>
            <Text style={styles.boxText}>Pinch to zoom</Text>
          </Animated.View>
        </PinchGestureHandler>
      </View>
      <Text style={styles.tapHint} onPress={reset}>Tap to reset</Text>
    </View>
  );
}

export function RotationGestureDemo() {
  const rotation = useSharedValue(0);
  const savedRotation = useSharedValue(0);

  const gestureHandler = useAnimatedGestureHandler({
    onActive: (event) => {
      'worklet';
      rotation.value = savedRotation.value + event.rotation;
    },
    onEnd: () => {
      'worklet';
      savedRotation.value = rotation.value;
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    'worklet';
    return {
      transform: [{ rotate: `${rotation.value}rad` }],
    };
  });

  const reset = () => {
    rotation.value = withSpring(0, { damping: 15 });
    savedRotation.value = 0;
  };

  return (
    <View style={styles.demo}>
      <Text style={styles.label}>RotationGestureHandler — two-finger rotate</Text>
      <View style={styles.panArea}>
        <RotationGestureHandler onGestureEvent={gestureHandler}>
          <Animated.View style={[styles.rotateBox, animatedStyle]}>
            <Text style={styles.pinchEmoji}>⭐</Text>
            <Text style={styles.boxText}>Rotate me</Text>
          </Animated.View>
        </RotationGestureHandler>
      </View>
      <Text style={styles.tapHint} onPress={reset}>Tap to reset</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  demo: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
    fontFamily: 'monospace',
  },
  panArea: {
    height: 160,
    backgroundColor: '#e8f5e9',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#c8e6c9',
  },
  draggableBox: {
    width: 80,
    height: 80,
    backgroundColor: '#1976d2',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  pinchBox: {
    width: 100,
    height: 100,
    backgroundColor: '#f57c00',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rotateBox: {
    width: 100,
    height: 100,
    backgroundColor: '#7b1fa2',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pinchEmoji: {
    fontSize: 28,
    marginBottom: 4,
  },
  boxText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 11,
    textAlign: 'center',
  },
  tapHint: {
    marginTop: 8,
    fontSize: 12,
    color: '#1976d2',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});
