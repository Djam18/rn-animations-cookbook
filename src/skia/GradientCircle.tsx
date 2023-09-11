import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import {
  Canvas,
  Circle,
  RadialGradient,
  vec,
  useValue,
  useComputedValue,
  useTiming,
  Easing,
} from '@shopify/react-native-skia';

// @shopify/react-native-skia — GPU-accelerated 2D graphics
// Runs on the UI thread (like Reanimated) → no JS bridge for rendering
// Perfect for: custom shapes, gradients, masks, blur effects, paths

// Animated gradient circle — pulses with a radial gradient
export function AnimatedGradientCircle(): JSX.Element {
  const size = 200;
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 10;

  // Skia uses its own animation values (not Reanimated SharedValue)
  // But they can be connected to Reanimated via react-native-skia bridge
  const progress = useValue(0);

  // Animated inner radius — creates pulsing effect
  const innerRadius = useComputedValue(
    () => r * 0.3 + progress.current * r * 0.2,
    [progress]
  );

  // Colors animate from blue to purple
  const color1 = useComputedValue(
    () => {
      const t = progress.current;
      const r = Math.round(59 + t * (139 - 59));
      const g = Math.round(130 - t * 130);
      const b = Math.round(246 - t * (246 - 246));
      return `rgb(${r},${g},${b})`;
    },
    [progress]
  );

  useEffect(() => {
    // Pulse animation: 0 → 1 → 0 looping
    const animate = () => {
      progress.current = Math.sin(Date.now() / 1000) * 0.5 + 0.5;
      requestAnimationFrame(animate);
    };
    const rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [progress]);

  return (
    <View style={styles.container}>
      <Canvas style={{ width: size, height: size }}>
        <Circle cx={cx} cy={cy} r={r}>
          <RadialGradient
            c={vec(cx, cy)}
            r={r}
            colors={['#60a5fa', '#3b82f6', '#1d4ed8', '#1e1b4b']}
          />
        </Circle>
        {/* Inner highlight */}
        <Circle cx={cx - r * 0.2} cy={cy - r * 0.2} r={r * 0.15} color="rgba(255,255,255,0.3)" />
      </Canvas>
    </View>
  );
}

// Static gradient circle — simpler demo
export function GradientCircle({ size = 150 }: { size?: number }): JSX.Element {
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 8;

  return (
    <Canvas style={{ width: size, height: size }}>
      {/* Outer circle with radial gradient */}
      <Circle cx={cx} cy={cy} r={r}>
        <RadialGradient
          c={vec(cx * 0.7, cy * 0.6)}
          r={r * 1.2}
          colors={['#fbbf24', '#f59e0b', '#d97706', '#92400e']}
        />
      </Circle>
      {/* Specular highlight */}
      <Circle cx={cx - r * 0.25} cy={cy - r * 0.25} r={r * 0.2} color="rgba(255,255,255,0.4)" />
    </Canvas>
  );
}

export default GradientCircle;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 20,
  },
});
