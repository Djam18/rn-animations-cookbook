import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolateColor,
  Easing,
} from 'react-native-reanimated';

// Skeleton loader recipe — shimmer effect for loading states
// Two approaches:
// 1. Opacity pulse: fade between two colors
// 2. Shimmer: a moving highlight sweep
// Most apps use approach 1 (simpler), approach 2 looks better.

console.log('Skeleton loader recipe loaded');

function SkeletonBox({ width, height, borderRadius = 4, style }) {
  const shimmer = useSharedValue(0);

  useEffect(() => {
    shimmer.value = withRepeat(
      withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true // reverse: goes 0→1→0→1...
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    'worklet';
    const backgroundColor = interpolateColor(
      shimmer.value,
      [0, 1],
      ['#e0e0e0', '#f5f5f5']
    );
    return { backgroundColor };
  });

  return (
    <Animated.View
      style={[
        { width, height, borderRadius },
        animatedStyle,
        style,
      ]}
    />
  );
}

function SkeletonCard() {
  return (
    <View style={styles.card}>
      {/* Avatar */}
      <SkeletonBox width={48} height={48} borderRadius={24} style={{ marginRight: 12 }} />
      <View style={{ flex: 1 }}>
        {/* Name line */}
        <SkeletonBox width="70%" height={14} borderRadius={4} style={{ marginBottom: 8 }} />
        {/* Subtitle line */}
        <SkeletonBox width="40%" height={12} borderRadius={4} />
      </View>
    </View>
  );
}

function SkeletonPost() {
  return (
    <View style={styles.post}>
      {/* Header */}
      <View style={styles.postHeader}>
        <SkeletonBox width={36} height={36} borderRadius={18} style={{ marginRight: 10 }} />
        <View style={{ flex: 1 }}>
          <SkeletonBox width="50%" height={12} borderRadius={4} style={{ marginBottom: 6 }} />
          <SkeletonBox width="30%" height={10} borderRadius={4} />
        </View>
      </View>
      {/* Image placeholder */}
      <SkeletonBox width="100%" height={160} borderRadius={8} style={{ marginBottom: 12 }} />
      {/* Text lines */}
      <SkeletonBox width="100%" height={12} borderRadius={4} style={{ marginBottom: 6 }} />
      <SkeletonBox width="90%" height={12} borderRadius={4} style={{ marginBottom: 6 }} />
      <SkeletonBox width="60%" height={12} borderRadius={4} />
    </View>
  );
}

export function SkeletonLoaderRecipe() {
  const [loading, setLoading] = useState(true);
  const [data] = useState([
    { id: 1, name: 'Alice Johnson', bio: 'Senior Developer' },
    { id: 2, name: 'Bob Smith', bio: 'Product Designer' },
    { id: 3, name: 'Carol White', bio: 'Engineering Manager' },
  ]);

  useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => setLoading(false), 2500);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  return (
    <View style={styles.demo}>
      <Text style={styles.label}>Skeleton Loader — shimmer on loading state</Text>
      <Button
        title={loading ? 'Loading...' : 'Reload (show skeleton)'}
        onPress={() => setLoading(true)}
        disabled={loading}
      />
      <View style={{ marginTop: 12 }}>
        {loading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : (
          data.map(person => (
            <Animated.View key={person.id} style={styles.realCard}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{person.name[0]}</Text>
              </View>
              <View>
                <Text style={styles.personName}>{person.name}</Text>
                <Text style={styles.personBio}>{person.bio}</Text>
              </View>
            </Animated.View>
          ))
        )}
      </View>

      <View style={{ marginTop: 16 }}>
        <Text style={styles.sublabel}>Post skeleton (complex layout):</Text>
        <SkeletonPost />
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
  },
  sublabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 8,
    marginBottom: 8,
  },
  realCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 8,
    marginBottom: 8,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#1976d2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  personName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  personBio: {
    fontSize: 13,
    color: '#888',
  },
  post: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 14,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
});
