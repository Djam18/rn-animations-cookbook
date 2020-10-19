import React, { useRef, useState } from 'react';
import { View, Text, ScrollView, Animated, Dimensions, TouchableOpacity, StyleSheet } from 'react-native';

// Carousel recipe — horizontal scroll with snap points
// Two approaches:
// 1. FlatList with pagingEnabled — snaps to exact page width (simple)
// 2. ScrollView with snapToInterval — snap to custom item width
// Using approach 2 here with Animated.event for slide indicator.

const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_WIDTH = SCREEN_WIDTH - 80;
const CARD_MARGIN = 10;
const SNAP_INTERVAL = CARD_WIDTH + CARD_MARGIN * 2;

console.log('Carousel recipe loaded');

const SLIDES = [
  { id: 1, title: 'Animated API', desc: 'The classic: Animated.Value, timing, spring, loop.', color: '#1976d2', emoji: '🎭' },
  { id: 2, title: 'Reanimated 2', desc: 'Next-gen: UI thread animations, worklets, shared values.', color: '#388e3c', emoji: '⚡' },
  { id: 3, title: 'Gesture Handler', desc: 'Pan, Pinch, Rotation — runs on the UI thread.', color: '#f57c00', emoji: '👆' },
  { id: 4, title: 'Layout Anim', desc: 'LayoutAnimation and Reanimated 2 entering/exiting.', color: '#7b1fa2', emoji: '🎪' },
  { id: 5, title: 'Recipes', desc: 'Bottom Sheet, Swipe Cards, Skeleton, Parallax...', color: '#c62828', emoji: '🍳' },
];

export function CarouselRecipe() {
  const scrollX = useRef(new Animated.Value(0)).current;
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef(null);

  const scrollToIndex = (index) => {
    scrollRef.current?.scrollTo({
      x: index * SNAP_INTERVAL,
      animated: true,
    });
  };

  return (
    <View style={styles.demo}>
      <Text style={styles.label}>
        Carousel — snapToInterval + Animated.event indicator
      </Text>

      <View style={styles.carouselContainer}>
        <Animated.ScrollView
          ref={scrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={SNAP_INTERVAL}
          decelerationRate="fast"
          contentContainerStyle={styles.scrollContent}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            {
              useNativeDriver: true,
              listener: (event) => {
                const index = Math.round(event.nativeEvent.contentOffset.x / SNAP_INTERVAL);
                setActiveIndex(Math.max(0, Math.min(index, SLIDES.length - 1)));
              },
            }
          )}
          scrollEventThrottle={16}
        >
          {SLIDES.map((slide, index) => {
            // Each card scales up when it's the active one
            const inputRange = [
              (index - 1) * SNAP_INTERVAL,
              index * SNAP_INTERVAL,
              (index + 1) * SNAP_INTERVAL,
            ];

            const scale = scrollX.interpolate({
              inputRange,
              outputRange: [0.9, 1, 0.9],
              extrapolate: 'clamp',
            });

            const opacity = scrollX.interpolate({
              inputRange,
              outputRange: [0.7, 1, 0.7],
              extrapolate: 'clamp',
            });

            return (
              <Animated.View
                key={slide.id}
                style={[styles.card, { backgroundColor: slide.color, transform: [{ scale }], opacity }]}
              >
                <Text style={styles.cardEmoji}>{slide.emoji}</Text>
                <Text style={styles.cardTitle}>{slide.title}</Text>
                <Text style={styles.cardDesc}>{slide.desc}</Text>
              </Animated.View>
            );
          })}
        </Animated.ScrollView>
      </View>

      {/* Dot indicators */}
      <View style={styles.dotsContainer}>
        {SLIDES.map((_, i) => {
          const inputRange = [
            (i - 1) * SNAP_INTERVAL,
            i * SNAP_INTERVAL,
            (i + 1) * SNAP_INTERVAL,
          ];

          const dotWidth = scrollX.interpolate({
            inputRange,
            outputRange: [8, 20, 8],
            extrapolate: 'clamp',
          });

          const dotOpacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.4, 1, 0.4],
            extrapolate: 'clamp',
          });

          return (
            <TouchableOpacity key={i} onPress={() => scrollToIndex(i)}>
              <Animated.View
                style={[
                  styles.dot,
                  { width: dotWidth, opacity: dotOpacity, backgroundColor: SLIDES[i].color },
                ]}
              />
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Numeric nav */}
      <View style={styles.nav}>
        <TouchableOpacity
          style={[styles.navBtn, activeIndex === 0 && styles.navBtnDisabled]}
          onPress={() => scrollToIndex(Math.max(0, activeIndex - 1))}
          disabled={activeIndex === 0}
        >
          <Text style={styles.navBtnText}>‹ Prev</Text>
        </TouchableOpacity>
        <Text style={styles.navCounter}>{activeIndex + 1} / {SLIDES.length}</Text>
        <TouchableOpacity
          style={[styles.navBtn, activeIndex === SLIDES.length - 1 && styles.navBtnDisabled]}
          onPress={() => scrollToIndex(Math.min(SLIDES.length - 1, activeIndex + 1))}
          disabled={activeIndex === SLIDES.length - 1}
        >
          <Text style={styles.navBtnText}>Next ›</Text>
        </TouchableOpacity>
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
    lineHeight: 18,
  },
  carouselContainer: {
    marginHorizontal: -16,
  },
  scrollContent: {
    paddingHorizontal: (SCREEN_WIDTH - CARD_WIDTH) / 2 - CARD_MARGIN,
  },
  card: {
    width: CARD_WIDTH,
    height: 180,
    borderRadius: 16,
    marginHorizontal: CARD_MARGIN,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardEmoji: {
    fontSize: 36,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  cardDesc: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
    lineHeight: 18,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    gap: 6,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  nav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  navBtn: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: '#1976d2',
  },
  navBtnDisabled: {
    backgroundColor: '#ccc',
  },
  navBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
  },
  navCounter: {
    fontSize: 13,
    color: '#666',
  },
});
