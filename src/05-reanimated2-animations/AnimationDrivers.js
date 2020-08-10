import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withDelay,
  withSequence,
  withRepeat,
  Easing,
  cancelAnimation,
} from 'react-native-reanimated';

// Reanimated 2 animation drivers
// withTiming: linear interpolation with easing
// withSpring: physics-based spring animation
// withDelay: delay before animation starts
// withSequence: chain animations one after another
// withRepeat: repeat an animation N times (or infinitely)
// cancelAnimation: stop a running animation

console.log('Reanimated 2 animation drivers loaded');

export function WithTimingDemo() {
  const translateX = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    'worklet';
    return { transform: [{ translateX: translateX.value }] };
  });

  const ease = () => {
    translateX.value = withTiming(150, { duration: 600, easing: Easing.ease });
  };

  const bounce = () => {
    translateX.value = withTiming(150, { duration: 600, easing: Easing.bounce });
  };

  const elastic = () => {
    translateX.value = withTiming(150, { duration: 800, easing: Easing.elastic(1.5) });
  };

  const reset = () => {
    translateX.value = withTiming(0, { duration: 300 });
  };

  return (
    <View style={styles.demo}>
      <Text style={styles.label}>withTiming — easing curves</Text>
      <Animated.View style={[styles.box, { backgroundColor: '#1976d2' }, animatedStyle]}>
        <Text style={styles.boxText}>Box</Text>
      </Animated.View>
      <View style={styles.row}>
        <Button title="Ease" onPress={ease} />
        <Button title="Bounce" onPress={bounce} />
        <Button title="Elastic" onPress={elastic} />
        <Button title="Reset" onPress={reset} />
      </View>
    </View>
  );
}

export function WithSpringDemo() {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    'worklet';
    return { transform: [{ scale: scale.value }] };
  });

  const bouncySpring = () => {
    scale.value = withSpring(1.5, {
      damping: 3,      // low damping = bouncy
      stiffness: 100,
      mass: 1,
    });
  };

  const dampedSpring = () => {
    scale.value = withSpring(1.5, {
      damping: 20,     // high damping = less bouncy
      stiffness: 200,
    });
  };

  const reset = () => {
    scale.value = withSpring(1, { damping: 15 });
  };

  return (
    <View style={styles.demo}>
      <Text style={styles.label}>withSpring — damping + stiffness</Text>
      <Animated.View style={[styles.box, { backgroundColor: '#388e3c' }, animatedStyle]}>
        <Text style={styles.boxText}>Spring</Text>
      </Animated.View>
      <View style={styles.row}>
        <Button title="Bouncy (damping=3)" onPress={bouncySpring} />
        <Button title="Damped (damping=20)" onPress={dampedSpring} />
        <Button title="Reset" onPress={reset} />
      </View>
    </View>
  );
}

export function WithSequenceDemo() {
  const translateX = useSharedValue(0);
  const scale = useSharedValue(1);

  const shakeStyle = useAnimatedStyle(() => {
    'worklet';
    return { transform: [{ translateX: translateX.value }, { scale: scale.value }] };
  });

  const shake = () => {
    translateX.value = withSequence(
      withTiming(-10, { duration: 60 }),
      withTiming(10, { duration: 60 }),
      withTiming(-10, { duration: 60 }),
      withTiming(10, { duration: 60 }),
      withTiming(0, { duration: 60 })
    );
  };

  const popThenFade = () => {
    scale.value = withSequence(
      withSpring(1.3, { damping: 5 }),
      withDelay(200, withSpring(1, { damping: 10 }))
    );
  };

  return (
    <View style={styles.demo}>
      <Text style={styles.label}>withSequence + withDelay</Text>
      <Animated.View style={[styles.box, { backgroundColor: '#f57c00' }, shakeStyle]}>
        <Text style={styles.boxText}>Sequence</Text>
      </Animated.View>
      <View style={styles.row}>
        <Button title="Shake" onPress={shake} />
        <Button title="Pop then Fade" onPress={popThenFade} />
      </View>
    </View>
  );
}

export function WithRepeatDemo() {
  const translateY = useSharedValue(0);
  const isRunning = React.useRef(false);

  const bounceStyle = useAnimatedStyle(() => {
    'worklet';
    return { transform: [{ translateY: translateY.value }] };
  });

  const startBounce = () => {
    if (isRunning.current) return;
    isRunning.current = true;
    translateY.value = withRepeat(
      withSequence(
        withTiming(-20, { duration: 300, easing: Easing.out(Easing.quad) }),
        withTiming(0, { duration: 300, easing: Easing.in(Easing.quad) })
      ),
      -1,   // -1 = infinite
      false // don't reverse
    );
  };

  const stopBounce = () => {
    cancelAnimation(translateY);
    translateY.value = withTiming(0, { duration: 200 });
    isRunning.current = false;
  };

  return (
    <View style={styles.demo}>
      <Text style={styles.label}>withRepeat (infinite bounce) + cancelAnimation</Text>
      <Animated.View style={[styles.box, { backgroundColor: '#7b1fa2' }, bounceStyle]}>
        <Text style={styles.boxText}>Bounce</Text>
      </Animated.View>
      <View style={styles.row}>
        <Button title="Start Bouncing" onPress={startBounce} />
        <Button title="Stop" onPress={stopBounce} />
      </View>
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
  box: {
    width: 80,
    height: 60,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  boxText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 11,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
});
