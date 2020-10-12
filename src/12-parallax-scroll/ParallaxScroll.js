import React, { useRef } from 'react';
import { View, Text, ScrollView, Animated, Dimensions, StyleSheet } from 'react-native';

// Parallax scroll recipe — header image scrolls at half the speed
// Using the classic Animated.event approach here (not Reanimated 2)
// because ScrollView's onScroll integrates naturally with Animated.event.
// The key: track scrollY with Animated.Value, interpolate header translateY.

const SCREEN_WIDTH = Dimensions.get('window').width;
const HEADER_HEIGHT = 220;
const PARALLAX_FACTOR = 0.5; // header moves at 50% of scroll speed

console.log('Parallax scroll recipe loaded');

const ARTICLES = [
  { id: 1, title: 'Getting Started with React Native', category: 'Tutorial', readTime: '5 min', color: '#e3f2fd' },
  { id: 2, title: 'Reanimated 2 vs Animated API', category: 'Deep Dive', readTime: '8 min', color: '#e8f5e9' },
  { id: 3, title: 'Navigation Patterns in 2020', category: 'Architecture', readTime: '6 min', color: '#fff3e0' },
  { id: 4, title: 'Building a Swipeable Card Stack', category: 'Recipe', readTime: '10 min', color: '#f3e5f5' },
  { id: 5, title: 'Gesture Handler Best Practices', category: 'Tips', readTime: '4 min', color: '#fce4ec' },
  { id: 6, title: 'Performance Optimization Tricks', category: 'Performance', readTime: '7 min', color: '#e0f7fa' },
];

export function ParallaxScrollRecipe() {
  const scrollY = useRef(new Animated.Value(0)).current;

  // Header moves up at PARALLAX_FACTOR speed relative to scroll
  // So it appears to scroll slower = parallax effect
  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT],
    outputRange: [0, -HEADER_HEIGHT * PARALLAX_FACTOR],
    extrapolate: 'clamp',
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT * 0.8],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const headerScale = scrollY.interpolate({
    inputRange: [-100, 0],
    outputRange: [1.3, 1],
    extrapolate: 'clamp',
  });

  const titleTranslateY = scrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT],
    outputRange: [0, 30],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.demo}>
      <Text style={styles.label}>
        Parallax scroll — header moves at {PARALLAX_FACTOR * 100}% scroll speed
      </Text>
      <View style={styles.container}>
        {/* Parallax header */}
        <Animated.View
          style={[
            styles.header,
            {
              transform: [
                { translateY: headerTranslateY },
                { scale: headerScale },
              ],
            },
          ]}
        >
          <Animated.View style={{ opacity: headerOpacity, transform: [{ translateY: titleTranslateY }] }}>
            <Text style={styles.headerTitle}>Animation Cookbook</Text>
            <Text style={styles.headerSubtitle}>Scroll down to see parallax</Text>
          </Animated.View>
        </Animated.View>

        {/* Scrollable content */}
        <Animated.ScrollView
          style={styles.scrollView}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true }
          )}
          scrollEventThrottle={16}
          contentContainerStyle={{ paddingTop: HEADER_HEIGHT }}
        >
          <View style={styles.content}>
            {ARTICLES.map(article => (
              <View key={article.id} style={[styles.article, { backgroundColor: article.color }]}>
                <View style={styles.articleHeader}>
                  <Text style={styles.articleCategory}>{article.category}</Text>
                  <Text style={styles.articleReadTime}>{article.readTime} read</Text>
                </View>
                <Text style={styles.articleTitle}>{article.title}</Text>
              </View>
            ))}
          </View>
        </Animated.ScrollView>
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
  container: {
    height: 380,
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: HEADER_HEIGHT,
    backgroundColor: '#1976d2',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 0,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
    textAlign: 'center',
  },
  scrollView: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
    backgroundColor: 'transparent',
  },
  content: {
    backgroundColor: '#f5f5f5',
    minHeight: 400,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 12,
  },
  article: {
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
  },
  articleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  articleCategory: {
    fontSize: 11,
    fontWeight: '700',
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  articleReadTime: {
    fontSize: 11,
    color: '#999',
  },
  articleTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
});
