import React from 'react';
import { ScrollView, Text, StyleSheet } from 'react-native';
import { EnterExitAnimations, VariousEnterAnimations, TabSwitcherWithAnimation } from './src/07-reanimated2-layout/LayoutAnimations';

export default function App() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>RN Animations Cookbook</Text>
      <Text style={styles.subtitle}>07 - Reanimated 2 Layout Animations</Text>
      <EnterExitAnimations />
      <VariousEnterAnimations />
      <TabSwitcherWithAnimation />
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
