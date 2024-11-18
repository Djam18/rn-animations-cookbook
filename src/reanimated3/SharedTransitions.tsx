import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
  Extrapolation,
  SharedTransition,
  withSequence,
  withDelay,
  ReduceMotion,
  Easing,
  // Reanimated 3.x new APIs:
  // - SharedTransition.custom() for custom shared element transitions
  // - ReduceMotion: respects system accessibility settings
  // - Improved spring physics (withSpring with mass, damping, stiffness)
} from 'react-native-reanimated';

// Reanimated 3.x key improvements over 2.x:
// 1. SharedTransition.custom() — define custom shared element transitions
// 2. ReduceMotion — respect system "reduce motion" accessibility setting
// 3. Better spring physics with new parameters
// 4. useAnimatedKeyboard() for keyboard-aware animations
// 5. FlatList animations improved (entering/exiting per item)
// 6. Worklet closures improved

interface Item {
  id: string;
  title: string;
  color: string;
  description: string;
}

const ITEMS: Item[] = [
  { id: '1', title: 'React Hooks', color: '#3b82f6', description: 'useState, useEffect, custom hooks' },
  { id: '2', title: 'TypeScript', color: '#10b981', description: 'Generics, utility types, strict mode' },
  { id: '3', title: 'Reanimated 3', color: '#8b5cf6', description: 'Worklets, SharedTransition, ReduceMotion' },
  { id: '4', title: 'React Native', color: '#f59e0b', description: 'New Architecture, Fabric, TurboModules' },
];

// Demo 1: ReduceMotion — accessibility-aware animations
function ReduceMotionDemo(): JSX.Element {
  const scale = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  function pulse(): void {
    // ReduceMotion.System: skips animation if user has "Reduce Motion" enabled in OS settings
    scale.value = withSequence(
      withSpring(1.2, { reduceMotion: ReduceMotion.System }),
      withSpring(1, { reduceMotion: ReduceMotion.System })
    );
  }

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>ReduceMotion (Reanimated 3.x)</Text>
      <Text style={styles.subtitle}>
        Respects OS "Reduce Motion" setting — animations disabled for accessibility users.
      </Text>
      <Animated.View style={[styles.box, animStyle, { backgroundColor: '#3b82f6' }]}>
        <Text style={styles.boxText}>Tap to pulse</Text>
      </Animated.View>
      <TouchableOpacity onPress={pulse} style={styles.btn}>
        <Text style={styles.btnText}>Pulse (ReduceMotion.System)</Text>
      </TouchableOpacity>
    </View>
  );
}

// Demo 2: Improved spring physics
function SpringPhysicsDemo(): JSX.Element {
  const y = useSharedValue(0);
  const [preset, setPreset] = useState<'bouncy' | 'stiff' | 'gentle'>('bouncy');

  const PRESETS = {
    bouncy: { mass: 1, damping: 8, stiffness: 200 },
    stiff: { mass: 0.5, damping: 20, stiffness: 400 },
    gentle: { mass: 2, damping: 30, stiffness: 80 },
  };

  const ballStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: y.value }],
  }));

  function drop(): void {
    y.value = 0;
    y.value = withSpring(150, PRESETS[preset]);
  }

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Spring Physics (mass/damping/stiffness)</Text>
      <View style={styles.row}>
        {(['bouncy', 'stiff', 'gentle'] as const).map(p => (
          <TouchableOpacity
            key={p}
            onPress={() => setPreset(p)}
            style={[styles.chip, preset === p && styles.chipActive]}
          >
            <Text style={[styles.chipText, preset === p && styles.chipTextActive]}>{p}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={{ height: 200, justifyContent: 'flex-start', alignItems: 'center', paddingTop: 20 }}>
        <Animated.View style={[styles.ball, ballStyle]} />
      </View>
      <TouchableOpacity onPress={drop} style={styles.btn}>
        <Text style={styles.btnText}>Drop</Text>
      </TouchableOpacity>
    </View>
  );
}

// Demo 3: FlatList item animations (Reanimated 3.x improvement)
function AnimatedList(): JSX.Element {
  const [items, setItems] = useState(ITEMS);

  function remove(id: string): void {
    setItems(prev => prev.filter(i => i.id !== id));
  }

  function reset(): void {
    setItems(ITEMS);
  }

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Animated FlatList items</Text>
      <TouchableOpacity onPress={reset} style={[styles.btn, { marginBottom: 8 }]}>
        <Text style={styles.btnText}>Reset</Text>
      </TouchableOpacity>
      <FlatList
        data={items}
        keyExtractor={item => item.id}
        scrollEnabled={false}
        renderItem={({ item, index }) => (
          <AnimatedListItem item={item} index={index} onRemove={remove} />
        )}
      />
    </View>
  );
}

function AnimatedListItem({
  item,
  index,
  onRemove,
}: {
  item: Item;
  index: number;
  onRemove: (id: string) => void;
}): JSX.Element {
  const opacity = useSharedValue(0);
  const translateX = useSharedValue(-50);

  React.useEffect(() => {
    opacity.value = withDelay(index * 80, withTiming(1, { duration: 300 }));
    translateX.value = withDelay(index * 80, withSpring(0));
  }, []);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <Animated.View style={[styles.listItem, { borderLeftColor: item.color }, style]}>
      <View style={{ flex: 1 }}>
        <Text style={styles.listTitle}>{item.title}</Text>
        <Text style={styles.listDesc}>{item.description}</Text>
      </View>
      <TouchableOpacity onPress={() => onRemove(item.id)}>
        <Text style={styles.removeBtn}>✕</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function SharedTransitionsDemo(): JSX.Element {
  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <Text style={styles.title}>Reanimated 3.x — New APIs</Text>
      <ReduceMotionDemo />
      <SpringPhysicsDemo />
      <AnimatedList />
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 22, fontWeight: '700', padding: 16, paddingBottom: 4 },
  section: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  sectionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  subtitle: { fontSize: 12, color: '#6b7280', marginBottom: 12 },
  row: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  box: { height: 60, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  boxText: { color: 'white', fontWeight: '600' },
  btn: { backgroundColor: '#3b82f6', padding: 12, borderRadius: 6, alignItems: 'center' },
  btnText: { color: 'white', fontWeight: '600' },
  chip: { paddingHorizontal: 12, paddingVertical: 6, backgroundColor: '#f3f4f6', borderRadius: 20 },
  chipActive: { backgroundColor: '#3b82f6' },
  chipText: { color: '#374151', fontSize: 13 },
  chipTextActive: { color: 'white' },
  ball: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#8b5cf6' },
  listItem: { flexDirection: 'row', alignItems: 'center', padding: 12, marginBottom: 8, borderRadius: 8, backgroundColor: '#f9fafb', borderLeftWidth: 4 },
  listTitle: { fontWeight: '600', marginBottom: 2 },
  listDesc: { fontSize: 12, color: '#6b7280' },
  removeBtn: { color: '#9ca3af', fontSize: 18, padding: 4 },
});
