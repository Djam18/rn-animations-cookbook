import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  interpolate,
  Extrapolation,
  FadeIn,
  FadeOut,
  SlideInRight,
  SlideOutRight,
  ZoomIn,
  ZoomOut,
  Layout,
  // Reanimated 2.10+ new shared element API
  // Note: Full shared element transitions require React Navigation integration
  // This demo shows the layout animation side of it
} from 'react-native-reanimated';

// Reanimated 3 introduced significant improvements:
// - Better TypeScript support
// - New entering/exiting animations API
// - Layout animations (smooth list reordering)
// - Improved performance on JSI bridge
// - Shared element transitions (with React Navigation 6)

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

// Demo 1: Entering/Exiting animations (Reanimated 2.10+)
function EnteringExitingDemo() {
  const [visible, setVisible] = useState(true);
  const [animType, setAnimType] = useState<'fade' | 'slide' | 'zoom'>('fade');

  const enterAnim = animType === 'fade' ? FadeIn : animType === 'slide' ? SlideInRight : ZoomIn;
  const exitAnim = animType === 'fade' ? FadeOut : animType === 'slide' ? SlideOutRight : ZoomOut;

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Entering / Exiting Animations</Text>
      <View style={styles.row}>
        {(['fade', 'slide', 'zoom'] as const).map(t => (
          <TouchableOpacity
            key={t}
            onPress={() => setAnimType(t)}
            style={[styles.chip, animType === t && styles.chipActive]}
          >
            <Text style={[styles.chipText, animType === t && styles.chipTextActive]}>{t}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity onPress={() => setVisible(v => !v)} style={styles.btn}>
        <Text style={styles.btnText}>{visible ? 'Hide' : 'Show'}</Text>
      </TouchableOpacity>
      {visible && (
        <Animated.View
          entering={enterAnim.duration(400)}
          exiting={exitAnim.duration(300)}
          style={styles.animBox}
        >
          <Text style={styles.animBoxText}>Animated Box</Text>
        </Animated.View>
      )}
    </View>
  );
}

// Demo 2: Layout animations (smooth list reordering)
function LayoutAnimationDemo() {
  const [items, setItems] = useState(
    Array.from({ length: 5 }, (_, i) => ({ id: i, color: COLORS[i], label: `Item ${i + 1}` }))
  );

  function shuffle() {
    setItems(prev => [...prev].sort(() => Math.random() - 0.5));
  }

  function remove(id: number) {
    setItems(prev => prev.filter(item => item.id !== id));
  }

  function add() {
    const newId = Date.now();
    setItems(prev => [
      { id: newId, color: COLORS[newId % COLORS.length], label: `Item ${newId % 100}` },
      ...prev,
    ]);
  }

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Layout Animations (list reorder)</Text>
      <View style={styles.row}>
        <TouchableOpacity onPress={shuffle} style={styles.btn}>
          <Text style={styles.btnText}>Shuffle</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={add} style={[styles.btn, { backgroundColor: '#10b981' }]}>
          <Text style={styles.btnText}>Add</Text>
        </TouchableOpacity>
      </View>
      {items.map(item => (
        <Animated.View
          key={item.id}
          entering={FadeIn.springify()}
          exiting={FadeOut}
          layout={Layout.springify()}
          style={[styles.listItem, { backgroundColor: item.color }]}
        >
          <Text style={styles.listItemText}>{item.label}</Text>
          <TouchableOpacity onPress={() => remove(item.id)}>
            <Text style={styles.removeBtn}>✕</Text>
          </TouchableOpacity>
        </Animated.View>
      ))}
    </View>
  );
}

// Demo 3: withTiming + withSpring improvements in Reanimated 2.10
function TimingSpringDemo() {
  const progress = useSharedValue(0);
  const springy = useSharedValue(0);

  const boxStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: interpolate(progress.value, [0, 1], [0, 200], Extrapolation.CLAMP) },
    ],
    backgroundColor: `rgb(${Math.round(interpolate(progress.value, [0, 1], [59, 239]))}, ${Math.round(interpolate(progress.value, [0, 1], [130, 68]))}, ${Math.round(interpolate(progress.value, [0, 1], [246, 68]))})`,
  }));

  const springStyle = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(springy.value, [0, 1], [1, 1.5], Extrapolation.CLAMP) }],
  }));

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>withTiming + Extrapolation</Text>
      <Animated.View style={[styles.smallBox, boxStyle]} />
      <View style={styles.row}>
        <TouchableOpacity onPress={() => { progress.value = withTiming(progress.value === 0 ? 1 : 0, { duration: 600 }); }} style={styles.btn}>
          <Text style={styles.btnText}>Animate</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { springy.value = withSpring(springy.value === 0 ? 1 : 0); }} style={[styles.btn, { backgroundColor: '#8b5cf6' }]}>
          <Text style={styles.btnText}>Spring</Text>
        </TouchableOpacity>
      </View>
      <Animated.View style={[styles.springBox, springStyle]}>
        <Text>Spring!</Text>
      </Animated.View>
    </View>
  );
}

export default function SharedElementTransitions() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Reanimated 2.10 — New APIs</Text>
      <Text style={styles.subtitle}>
        Reanimated 2.10 apporte: Entering/Exiting animations, Layout animations smooth,
        Extrapolation enum (fini les strings "clamp"/"extend"), meilleur TS support.
      </Text>
      <EnteringExitingDemo />
      <LayoutAnimationDemo />
      <TimingSpringDemo />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: '700', padding: 16, paddingBottom: 4 },
  subtitle: { fontSize: 13, color: '#6b7280', paddingHorizontal: 16, paddingBottom: 16 },
  section: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  sectionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 12 },
  row: { flexDirection: 'row', gap: 8, marginBottom: 12, flexWrap: 'wrap' },
  btn: { paddingHorizontal: 16, paddingVertical: 8, backgroundColor: '#3b82f6', borderRadius: 6 },
  btnText: { color: 'white', fontWeight: '600' },
  chip: { paddingHorizontal: 12, paddingVertical: 6, backgroundColor: '#f3f4f6', borderRadius: 20 },
  chipActive: { backgroundColor: '#3b82f6' },
  chipText: { color: '#374151', fontSize: 13 },
  chipTextActive: { color: 'white' },
  animBox: { height: 80, backgroundColor: '#3b82f6', borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginTop: 8 },
  animBoxText: { color: 'white', fontWeight: '600' },
  listItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 12, borderRadius: 8, marginBottom: 8 },
  listItemText: { color: 'white', fontWeight: '600' },
  removeBtn: { color: 'white', fontSize: 16, padding: 4 },
  smallBox: { width: 50, height: 50, borderRadius: 8, marginBottom: 12 },
  springBox: { width: 60, height: 60, backgroundColor: '#8b5cf6', borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginTop: 12 },
});
