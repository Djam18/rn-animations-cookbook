import React, { useRef } from 'react';
import { View, Text, Button, Animated, StyleSheet } from 'react-native';

// Interpolation — mapping one Animated.Value to another range
// One value drives many properties simultaneously.
// inputRange: what the raw value is
// outputRange: what it maps to (can be color strings, deg strings, numbers)
// This is powerful: scroll position → header opacity, for example.

console.log('Interpolation recipes loaded');

export function ColorInterpolation() {
  const anim = useRef(new Animated.Value(0)).current;

  const animate = () => {
    Animated.sequence([
      Animated.timing(anim, { toValue: 1, duration: 600, useNativeDriver: false }),
      Animated.timing(anim, { toValue: 0, duration: 600, useNativeDriver: false }),
    ]).start();
  };

  // useNativeDriver: false required for color — not supported on native thread
  const backgroundColor = anim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ['#1976d2', '#f57c00', '#388e3c'],
  });

  const textColor = anim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#ffffff', '#ffffff'],
  });

  return (
    <View style={styles.demo}>
      <Text style={styles.label}>Color Interpolation (inputRange → color outputRange)</Text>
      <Animated.View style={[styles.colorBox, { backgroundColor }]}>
        <Animated.Text style={[styles.boxText, { color: textColor }]}>
          Color Box
        </Animated.Text>
      </Animated.View>
      <Button title="Animate Colors" onPress={animate} />
    </View>
  );
}

export function RotationInterpolation() {
  const anim = useRef(new Animated.Value(0)).current;

  const rotate = () => {
    Animated.timing(anim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start(() => anim.setValue(0));
  };

  const rotation = anim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  // Wobble: map 0→1 to degrees going back and forth
  const wobble = anim.interpolate({
    inputRange: [0, 0.2, 0.4, 0.6, 0.8, 1],
    outputRange: ['0deg', '-10deg', '10deg', '-10deg', '10deg', '0deg'],
  });

  return (
    <View style={styles.demo}>
      <Text style={styles.label}>Rotation Interpolation</Text>
      <View style={styles.row}>
        <Animated.View style={[styles.smallBox, { backgroundColor: '#1976d2', transform: [{ rotate: rotation }] }]}>
          <Text style={styles.boxText}>Spin</Text>
        </Animated.View>
        <Animated.View style={[styles.smallBox, { backgroundColor: '#f57c00', transform: [{ rotate: wobble }] }]}>
          <Text style={styles.boxText}>Wobble</Text>
        </Animated.View>
      </View>
      <Button title="Animate" onPress={rotate} />
    </View>
  );
}

export function ScaleInterpolation() {
  const scrollY = useRef(new Animated.Value(0)).current;

  // Simulate scroll: header shrinks as user scrolls down
  const headerHeight = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [120, 60],
    extrapolate: 'clamp', // don't go below 60 or above 120
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 80],
    outputRange: [1, 0.3],
    extrapolate: 'clamp',
  });

  const titleSize = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [24, 14],
    extrapolate: 'clamp',
  });

  const scrollUp = () => {
    Animated.timing(scrollY, { toValue: 0, duration: 400, useNativeDriver: false }).start();
  };

  const scrollDown = () => {
    Animated.timing(scrollY, { toValue: 100, duration: 400, useNativeDriver: false }).start();
  };

  return (
    <View style={styles.demo}>
      <Text style={styles.label}>Scroll-driven interpolation (extrapolate: clamp)</Text>
      <Animated.View style={[styles.header, { height: headerHeight, opacity: headerOpacity }]}>
        <Animated.Text style={[styles.headerTitle, { fontSize: titleSize }]}>
          Collapsible Header
        </Animated.Text>
      </Animated.View>
      <View style={styles.row}>
        <Button title="Scroll Down" onPress={scrollDown} />
        <Button title="Scroll Up" onPress={scrollUp} />
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
  colorBox: {
    height: 60,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  smallBox: {
    width: 70,
    height: 70,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginBottom: 12,
  },
  boxText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 11,
  },
  header: {
    backgroundColor: '#1976d2',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    overflow: 'hidden',
  },
  headerTitle: {
    color: '#fff',
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
  },
});
