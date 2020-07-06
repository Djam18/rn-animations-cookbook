import React from 'react';
import { ScrollView, Text, StyleSheet } from 'react-native';
import { FadeInDemo, SlideDemo, ScaleDemo, LoopDemo } from './src/01-animated-basics/AnimatedBasics';

// rn-animations-cookbook
// After navigation, diving into animations.
// React Native has two animation systems:
// 1. Animated (built-in, JS-driven, can use native driver)
// 2. Reanimated 2 (community, runs entirely on UI thread — much more powerful)
// Starting with Animated basics, will get to Reanimated 2 later.

export default function App() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>RN Animations Cookbook</Text>
      <Text style={styles.subtitle}>01 - Animated API Basics</Text>
      <FadeInDemo />
      <SlideDemo />
      <ScaleDemo />
      <LoopDemo />
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
