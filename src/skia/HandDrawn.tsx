import React from 'react';
import { View } from 'react-native';
import {
  Canvas,
  Path,
  Skia,
  Paint,
  vec,
  LinearGradient,
  BlurMask,
} from '@shopify/react-native-skia';

// Skia Path drawing — GPU-accelerated SVG-like paths
// Much better than SVG in RN: runs on UI thread, no JS bridge

// Custom heart shape using cubic bezier curves
function createHeartPath(cx: number, cy: number, size: number): ReturnType<typeof Skia.Path.Make> {
  const path = Skia.Path.Make();
  const s = size / 2;

  // Heart shape approximation with cubic beziers
  path.moveTo(cx, cy + s * 0.3);
  // Left side
  path.cubicTo(
    cx - s * 0.1, cy,
    cx - s, cy - s * 0.5,
    cx, cy - s * 0.1
  );
  // Right side
  path.cubicTo(
    cx + s, cy - s * 0.5,
    cx + s * 0.1, cy,
    cx, cy + s * 0.3
  );
  path.close();
  return path;
}

// Wave path using sine approximation
function createWavePath(width: number, height: number, amplitude: number, frequency: number): ReturnType<typeof Skia.Path.Make> {
  const path = Skia.Path.Make();
  path.moveTo(0, height / 2);

  const steps = 50;
  for (let i = 1; i <= steps; i++) {
    const x = (width / steps) * i;
    const y = height / 2 + Math.sin((i / steps) * Math.PI * 2 * frequency) * amplitude;
    path.lineTo(x, y);
  }
  return path;
}

export function HeartShape(): JSX.Element {
  const size = 200;
  const heartPath = createHeartPath(size / 2, size / 2, size * 0.4);

  return (
    <Canvas style={{ width: size, height: size }}>
      <Path path={heartPath}>
        <LinearGradient
          start={vec(0, 0)}
          end={vec(size, size)}
          colors={['#f43f5e', '#ec4899', '#a855f7']}
        />
      </Path>
      {/* Soft glow effect */}
      <Path path={heartPath} color="rgba(244,63,94,0.3)">
        <BlurMask blur={8} style="normal" />
      </Path>
    </Canvas>
  );
}

export function WaveAnimation(): JSX.Element {
  const width = 300;
  const height = 80;

  const wave1 = createWavePath(width, height, 15, 2);
  const wave2 = createWavePath(width, height, 10, 3);
  const wave3 = createWavePath(width, height, 8, 4);

  return (
    <Canvas style={{ width, height }}>
      {/* Multiple waves with different colors and blur */}
      <Path path={wave1} color="rgba(59,130,246,0.7)" style="stroke" strokeWidth={2}>
        <BlurMask blur={2} style="normal" />
      </Path>
      <Path path={wave2} color="rgba(99,102,241,0.5)" style="stroke" strokeWidth={2} />
      <Path path={wave3} color="rgba(168,85,247,0.4)" style="stroke" strokeWidth={1.5} />
    </Canvas>
  );
}

// Star shape with Skia paths
function createStarPath(cx: number, cy: number, outerR: number, innerR: number, points: number): ReturnType<typeof Skia.Path.Make> {
  const path = Skia.Path.Make();
  const angleStep = (Math.PI * 2) / points;

  for (let i = 0; i < points; i++) {
    const outerAngle = i * angleStep - Math.PI / 2;
    const innerAngle = outerAngle + angleStep / 2;

    const outerX = cx + Math.cos(outerAngle) * outerR;
    const outerY = cy + Math.sin(outerAngle) * outerR;
    const innerX = cx + Math.cos(innerAngle) * innerR;
    const innerY = cy + Math.sin(innerAngle) * innerR;

    if (i === 0) path.moveTo(outerX, outerY);
    else path.lineTo(outerX, outerY);
    path.lineTo(innerX, innerY);
  }
  path.close();
  return path;
}

export function StarRating({ rating = 4, max = 5 }: { rating?: number; max?: number }): JSX.Element {
  const starSize = 30;
  const gap = 4;
  const width = max * (starSize + gap);
  const height = starSize;

  return (
    <Canvas style={{ width, height }}>
      {Array.from({ length: max }, (_, i) => {
        const cx = i * (starSize + gap) + starSize / 2;
        const cy = starSize / 2;
        const filled = i < rating;
        const star = createStarPath(cx, cy, starSize / 2 - 2, starSize / 4, 5);

        return (
          <Path
            key={i}
            path={star}
            color={filled ? '#fbbf24' : '#e5e7eb'}
          />
        );
      })}
    </Canvas>
  );
}

export default HeartShape;
