import React from 'react';
import { View, Text, Button, Animated as RNAnimated, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
} from 'react-native-reanimated';

// Reanimated 2 — the game changer
// Unlike Animated API (JS thread), Reanimated 2 runs animations on the UI thread.
// No more "useNativeDriver: true" — it's always native.
// Worklets: functions that run on the UI thread with the 'worklet' directive.
//
// Key concepts:
// - useSharedValue(): like useRef but synced between JS and UI thread
// - useAnimatedStyle(): derives style from shared values, runs on UI thread
// - withTiming(), withSpring(): animation drivers
// - 'worklet': directive to make a function run on the UI thread
//
// The API looks like React hooks — much cleaner than Animated!

console.log('Reanimated 2 intro loaded');

export function SharedValueDemo() {
  const offset = useSharedValue(0);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    'worklet';
    return {
      transform: [{ translateX: offset.value }],
      opacity: opacity.value,
    };
  });

  const moveRight = () => {
    offset.value = withTiming(100, { duration: 400 });
  };

  const moveLeft = () => {
    offset.value = withTiming(-100, { duration: 400 });
  };

  const reset = () => {
    offset.value = withSpring(0);
    opacity.value = withTiming(1, { duration: 200 });
  };

  const hide = () => {
    opacity.value = withTiming(0, { duration: 300 });
  };

  return (
    <View style={styles.demo}>
      <Text style={styles.label}>
        useSharedValue + useAnimatedStyle
        {'\n'}Runs on UI thread — no JS bridge crossing
      </Text>
      <Animated.View style={[styles.box, animatedStyle, { backgroundColor: '#1976d2' }]}>
        <Text style={styles.boxText}>Reanimated Box</Text>
      </Animated.View>
      <View style={styles.row}>
        <Button title="← Left" onPress={moveLeft} />
        <Button title="Reset" onPress={reset} />
        <Button title="Right →" onPress={moveRight} />
      </View>
      <View style={[styles.row, { marginTop: 8 }]}>
        <Button title="Hide" onPress={hide} />
      </View>
    </View>
  );
}

export function CompareAnimatedVsReanimated() {
  // Animated API version (JS thread)
  const rnAnimValue = React.useRef(new RNAnimated.Value(0)).current;

  // Reanimated 2 version (UI thread)
  const sharedValue = useSharedValue(0);

  const reanimatedBoxStyle = useAnimatedStyle(() => {
    'worklet';
    return { transform: [{ translateX: sharedValue.value }] };
  });

  const rnTranslateX = rnAnimValue.interpolate({
    inputRange: [0, 80],
    outputRange: [0, 80],
  });

  const run = () => {
    // Animated API: JS thread drives this
    RNAnimated.sequence([
      RNAnimated.timing(rnAnimValue, { toValue: 80, duration: 600, useNativeDriver: true }),
      RNAnimated.timing(rnAnimValue, { toValue: 0, duration: 600, useNativeDriver: true }),
    ]).start();

    // Reanimated 2: UI thread drives this
    sharedValue.value = withTiming(80, { duration: 600 }, () => {
      'worklet';
      sharedValue.value = withTiming(0, { duration: 600 });
    });
  };

  return (
    <View style={styles.demo}>
      <Text style={styles.label}>
        Side-by-side: Animated API (top) vs Reanimated 2 (bottom)
        {'\n'}Both animate the same movement. Reanimated stays smooth under JS thread load.
      </Text>

      <Text style={styles.sublabel}>Animated API (JS thread)</Text>
      <RNAnimated.View
        style={[styles.compareBox, { backgroundColor: '#f57c00', transform: [{ translateX: rnTranslateX }] }]}
      >
        <Text style={styles.boxText}>Animated</Text>
      </RNAnimated.View>

      <Text style={styles.sublabel}>Reanimated 2 (UI thread)</Text>
      <Animated.View style={[styles.compareBox, { backgroundColor: '#388e3c' }, reanimatedBoxStyle]}>
        <Text style={styles.boxText}>Reanimated 2</Text>
      </Animated.View>

      <Button title="Run Both" onPress={run} />
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
    lineHeight: 18,
  },
  sublabel: {
    fontSize: 11,
    color: '#666',
    marginBottom: 6,
    marginTop: 4,
  },
  box: {
    width: 140,
    height: 60,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  compareBox: {
    width: 120,
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  boxText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
});
