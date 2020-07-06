import React, { useRef } from 'react';
import { View, Text, Button, Animated, StyleSheet } from 'react-native';

// Animated API — the classic React Native animation system
// Animated.Value tracks a value that can be animated.
// Animated.timing, Animated.spring, Animated.decay drive the value.
// Animated.View, Animated.Text, etc. subscribe to the value.
// The key insight: animations run on the UI thread, not JS thread (when useNativeDriver: true)

console.log('Animated API basics loaded');

export function FadeInDemo() {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const fadeOut = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={styles.demo}>
      <Text style={styles.label}>Fade (Animated.timing + opacity)</Text>
      <Animated.View style={[styles.box, { opacity: fadeAnim, backgroundColor: '#1976d2' }]}>
        <Text style={styles.boxText}>Fade Box</Text>
      </Animated.View>
      <View style={styles.row}>
        <Button title="Fade In" onPress={fadeIn} />
        <Button title="Fade Out" onPress={fadeOut} />
      </View>
    </View>
  );
}

export function SlideDemo() {
  const slideAnim = useRef(new Animated.Value(-100)).current;
  const visible = useRef(false);

  const toggle = () => {
    Animated.spring(slideAnim, {
      toValue: visible.current ? -100 : 0,
      useNativeDriver: true,
      damping: 15,
      stiffness: 100,
    }).start();
    visible.current = !visible.current;
  };

  return (
    <View style={styles.demo}>
      <Text style={styles.label}>Slide (Animated.spring + translateX)</Text>
      <Animated.View
        style={[
          styles.box,
          { backgroundColor: '#388e3c', transform: [{ translateX: slideAnim }] },
        ]}
      >
        <Text style={styles.boxText}>Slide Box</Text>
      </Animated.View>
      <Button title="Toggle Slide" onPress={toggle} />
    </View>
  );
}

export function ScaleDemo() {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const pulse = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 1.3, duration: 150, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
    ]).start();
  };

  return (
    <View style={styles.demo}>
      <Text style={styles.label}>Scale (Animated.sequence)</Text>
      <Animated.View
        style={[
          styles.box,
          { backgroundColor: '#f57c00', transform: [{ scale: scaleAnim }] },
        ]}
      >
        <Text style={styles.boxText}>Scale Box</Text>
      </Animated.View>
      <Button title="Pulse" onPress={pulse} />
    </View>
  );
}

export function LoopDemo() {
  const spinAnim = useRef(new Animated.Value(0)).current;
  const animRef = useRef(null);
  const running = useRef(false);

  const startSpin = () => {
    if (running.current) return;
    running.current = true;
    spinAnim.setValue(0);
    animRef.current = Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      })
    );
    animRef.current.start();
  };

  const stopSpin = () => {
    if (animRef.current) animRef.current.stop();
    running.current = false;
  };

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.demo}>
      <Text style={styles.label}>Loop + Rotation (Animated.loop)</Text>
      <Animated.View
        style={[
          styles.box,
          { backgroundColor: '#7b1fa2', transform: [{ rotate: spin }] },
        ]}
      >
        <Text style={styles.boxText}>Spin</Text>
      </Animated.View>
      <View style={styles.row}>
        <Button title="Start Spin" onPress={startSpin} />
        <Button title="Stop" onPress={stopSpin} />
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
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
    fontFamily: 'monospace',
  },
  box: {
    width: 100,
    height: 60,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  boxText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
});
