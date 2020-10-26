# RN Animations Cookbook

After [rn-navigation-masterclass](../rn-navigation-masterclass), deep-diving into animations.
20+ recipes covering the full animation stack: Animated API → Reanimated 2 → Gesture Handler.

React Native 0.62 | Expo | Reanimated 2 | July–October 2020

---

## Two Animation Systems

| | Animated API | Reanimated 2 |
|-|-------------|--------------|
| Thread | JS (bridge crossing) | UI thread (native) |
| Performance | Good with `useNativeDriver` | Excellent, always native |
| Colors | Supported (`useNativeDriver: false`) | `interpolateColor()` |
| Gestures | OK | Seamless via `useAnimatedGestureHandler` |
| API | Imperative, callback-based | Hook-based, declarative |
| Enter/exit anim | No | Yes (`entering`, `exiting` props) |
| When to use | Simple animations, color | Complex gestures, 60fps critical |

---

## Recipe Catalog

### 01 — Animated API Basics
`Animated.Value`, `withTiming`, `withSpring`, `Animated.loop`, `Animated.sequence`

```js
const fadeAnim = useRef(new Animated.Value(0)).current;
Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();
<Animated.View style={{ opacity: fadeAnim }} />
```

### 02 — Interpolation
Map one value to colors, degrees, sizes. One `Animated.Value` drives many properties.

```js
const color = anim.interpolate({
  inputRange: [0, 0.5, 1],
  outputRange: ['#1976d2', '#f57c00', '#388e3c'],
});
const rotation = scrollY.interpolate({
  inputRange: [0, 100],
  outputRange: ['0deg', '360deg'],
  extrapolate: 'clamp',
});
```

### 03 — LayoutAnimation
Animate layout changes automatically. Just call before `setState`.

```js
LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
setExpanded(!expanded); // React Native animates the result
```

### 04 — Reanimated 2: Introduction
`useSharedValue`, `useAnimatedStyle`, worklets — all on the UI thread.

```js
const offset = useSharedValue(0);
const style = useAnimatedStyle(() => {
  'worklet';
  return { transform: [{ translateX: offset.value }] };
});
offset.value = withSpring(100);
```

### 05 — Reanimated 2: Animation Drivers
`withTiming`, `withSpring`, `withSequence`, `withRepeat`, `withDelay`, `cancelAnimation`

```js
// Shake effect
translateX.value = withSequence(
  withTiming(-10, { duration: 60 }),
  withTiming(10, { duration: 60 }),
  withTiming(-10, { duration: 60 }),
  withTiming(0, { duration: 60 })
);

// Infinite bounce
translateY.value = withRepeat(
  withSequence(
    withTiming(-20, { duration: 300 }),
    withTiming(0, { duration: 300 })
  ),
  -1, false
);
```

### 06 — Gesture Handler
`PanGestureHandler`, `PinchGestureHandler`, `RotationGestureHandler` + `useAnimatedGestureHandler`

```js
const gestureHandler = useAnimatedGestureHandler({
  onStart: (_, ctx) => { 'worklet'; ctx.startX = translateX.value; },
  onActive: (event, ctx) => { 'worklet'; translateX.value = ctx.startX + event.translationX; },
  onEnd: (event) => { 'worklet'; translateX.value = withDecay({ velocity: event.velocityX }); },
});
```

### 07 — Reanimated 2 Layout Animations
Enter/exit animations with presets. Much cleaner than LayoutAnimation.

```jsx
<Animated.View
  entering={SlideInLeft.duration(300)}
  exiting={SlideOutRight.duration(250)}
  layout={Layout.springify()}
>
  {/* content */}
</Animated.View>
```

### 08 — Skeleton Loader
Shimmer effect: `interpolateColor` pulsing between `#e0e0e0` and `#f5f5f5`.

### 09 — Bottom Sheet
`PanGestureHandler` + snap points + `runOnJS` + backdrop opacity.

### 10 — Swipeable Card (Tinder-like)
Rotation interpolation, like/nope labels, throw threshold, card stack.

### 11 — Pull-to-Refresh
`RefreshControl` (native) + custom Reanimated 2 spinner.

### 12 — Parallax Scroll
`Animated.event` tracking `scrollY`. Header translates at 50% scroll speed.

### 13 — Carousel
`snapToInterval` + `Animated.event` scrollX → dot indicator width.

---

## Reanimated 2 Quick Reference

```js
import Animated, {
  useSharedValue,       // like useRef, synced JS ↔ UI thread
  useAnimatedStyle,     // derives style, runs on UI thread
  useAnimatedGestureHandler, // gesture handler on UI thread
  withTiming,           // linear animation with easing
  withSpring,           // physics-based spring
  withDelay,            // delay before animation
  withSequence,         // chain animations
  withRepeat,           // repeat N times (-1 = infinite)
  withDecay,            // decelerate with velocity
  cancelAnimation,      // stop a running animation
  interpolate,          // map value to range
  interpolateColor,     // map value to color
  Extrapolate,          // clamp / extend
  Easing,               // easing curves
  Layout,               // layout animation config
  FadeIn, FadeOut,      // enter/exit presets
  SlideInLeft, SlideOutRight,
  ZoomIn, ZoomOut,
  BounceIn,
  runOnJS,              // call JS function from worklet
} from 'react-native-reanimated';
```

---

## Stack

- React Native 0.62.2 (Expo SDK 38)
- react-native-reanimated 2.0.0-alpha (UI thread animations)
- react-native-gesture-handler 1.7.0
- Pure JavaScript (no TypeScript in this repo)

## Next

- Full app with these animations (medtrack-mobile)
- react-native-skia (2022)
- Reanimated 3 (2022)
