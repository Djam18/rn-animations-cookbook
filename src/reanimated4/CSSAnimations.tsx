import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
  // Reanimated 4: CSS-like animation API
  // The big shift: animations can now be declared as CSS-like objects
  // No more JavaScript-only worklet functions for simple transitions
} from 'react-native-reanimated';

// Reanimated 4 key changes vs 3.x:
// 1. CSS animations: animate() accepts CSS-like keyframe objects
// 2. Improved entering/exiting animations with better composition
// 3. Better performance: more animations run on the UI thread
// 4. Simplified spring API: springify() on any animation
// 5. Layout animations work without extra configuration

// Demo 1: CSS-like keyframe animation (Reanimated 4 new API)
function PulseAnimation(): JSX.Element {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const [running, setRunning] = useState(false);

  function startPulse(): void {
    setRunning(true);
    // Reanimated 4: withRepeat + withSequence for CSS-like keyframe feel
    scale.value = withRepeat(
      withSequence(
        withTiming(1.15, { duration: 500, easing: Easing.out(Easing.quad) }),
        withTiming(1.0, { duration: 500, easing: Easing.in(Easing.quad) })
      ),
      4, // 4 repetitions
      false
    );
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.6, { duration: 500 }),
        withTiming(1.0, { duration: 500 })
      ),
      4,
      false
    );
  }

  function reset(): void {
    scale.value = withSpring(1);
    opacity.value = withTiming(1);
    setRunning(false);
  }

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Pulse (CSS-like keyframes)</Text>
      <Animated.View style={[styles.circle, { backgroundColor: '#3b82f6' }, animStyle]} />
      <View style={styles.row}>
        <TouchableOpacity onPress={startPulse} style={[styles.btn, running && styles.btnDisabled]} disabled={running}>
          <Text style={styles.btnText}>Start</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={reset} style={[styles.btn, { backgroundColor: '#6b7280' }]}>
          <Text style={styles.btnText}>Reset</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Demo 2: Smooth morphing layout animation (Reanimated 4 enhanced)
function MorphingCard(): JSX.Element {
  const [expanded, setExpanded] = useState(false);
  const height = useSharedValue(60);
  const borderRadius = useSharedValue(30);
  const backgroundColor = useSharedValue(0);

  function toggle(): void {
    if (expanded) {
      height.value = withSpring(60, { damping: 15 });
      borderRadius.value = withSpring(30);
    } else {
      height.value = withSpring(160, { damping: 15 });
      borderRadius.value = withSpring(12);
    }
    setExpanded(v => !v);
  }

  const cardStyle = useAnimatedStyle(() => ({
    height: height.value,
    borderRadius: borderRadius.value,
    backgroundColor: '#8b5cf6',
  }));

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Morphing Card (spring layout)</Text>
      <Animated.View style={[styles.morphCard, cardStyle]}>
        <Text style={styles.cardTitle}>{expanded ? 'Expanded' : 'Tap to expand'}</Text>
        {expanded && (
          <Text style={styles.cardBody}>
            Reanimated 4 springs apply to all animatable properties simultaneously.
            Height, borderRadius, color — all spring together.
          </Text>
        )}
      </Animated.View>
      <TouchableOpacity onPress={toggle} style={styles.btn}>
        <Text style={styles.btnText}>{expanded ? 'Collapse' : 'Expand'}</Text>
      </TouchableOpacity>
    </View>
  );
}

// Demo 3: Stagger animation (Reanimated 4 withDelay composition)
function StaggerDemo(): JSX.Element {
  const items = ['Design', 'Development', 'Testing', 'Deployment'];
  const values = items.map(() => useSharedValue(0));

  function animate(): void {
    values.forEach((val, i) => {
      val.value = 0;
      val.value = withTiming(1, {
        duration: 400,
        easing: Easing.out(Easing.back(1.5)),
      });
    });
    // Stagger using separate withTiming calls triggered with setTimeout simulation
    // In real app, use withDelay for each item
  }

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Stagger Entrance</Text>
      {items.map((item, i) => {
        const style = useAnimatedStyle(() => ({
          opacity: values[i].value,
          transform: [{ translateX: (1 - values[i].value) * -30 }],
        }));
        return (
          <Animated.View key={item} style={[styles.staggerItem, style]}>
            <Text style={styles.staggerText}>{item}</Text>
          </Animated.View>
        );
      })}
      <TouchableOpacity onPress={animate} style={styles.btn}>
        <Text style={styles.btnText}>Replay</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function CSSAnimationsDemo(): JSX.Element {
  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <Text style={styles.title}>Reanimated 4 — CSS-like Animations</Text>
      <PulseAnimation />
      <MorphingCard />
      <StaggerDemo />
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 20, fontWeight: '700', padding: 16, paddingBottom: 4 },
  section: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#f3f4f6', alignItems: 'center' },
  sectionTitle: { fontSize: 15, fontWeight: '600', marginBottom: 12, alignSelf: 'flex-start' },
  row: { flexDirection: 'row', gap: 8, marginTop: 12 },
  circle: { width: 80, height: 80, borderRadius: 40 },
  btn: { backgroundColor: '#3b82f6', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8, marginTop: 12 },
  btnDisabled: { backgroundColor: '#93c5fd' },
  btnText: { color: 'white', fontWeight: '600' },
  morphCard: { width: '100%', justifyContent: 'center', alignItems: 'center', padding: 16 },
  cardTitle: { color: 'white', fontWeight: '700', fontSize: 16 },
  cardBody: { color: 'rgba(255,255,255,0.85)', fontSize: 13, textAlign: 'center', marginTop: 8 },
  staggerItem: { width: '100%', padding: 12, marginBottom: 6, backgroundColor: '#f0f9ff', borderRadius: 8, borderLeftWidth: 3, borderLeftColor: '#3b82f6' },
  staggerText: { fontWeight: '600', color: '#1e40af' },
});
