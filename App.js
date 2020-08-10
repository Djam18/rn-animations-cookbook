import React from 'react';
import { ScrollView, Text, StyleSheet } from 'react-native';
import { WithTimingDemo, WithSpringDemo, WithSequenceDemo, WithRepeatDemo } from './src/05-reanimated2-animations/AnimationDrivers';

export default function App() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>RN Animations Cookbook</Text>
      <Text style={styles.subtitle}>05 - Reanimated 2: withTiming, withSpring, withSequence</Text>
      <WithTimingDemo />
      <WithSpringDemo />
      <WithSequenceDemo />
      <WithRepeatDemo />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
    marginTop: 40,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
});
