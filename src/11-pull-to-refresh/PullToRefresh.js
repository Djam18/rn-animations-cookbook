import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, RefreshControl, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withRepeat,
  withSequence,
  Easing,
} from 'react-native-reanimated';

// Pull-to-refresh recipe
// Two versions:
// 1. Native RefreshControl — built into ScrollView, handles the pull detection
//    Easy to use but customization is limited.
// 2. Custom animated indicator — full control over the animation
//    Reanimated 2 drives the spinner while RefreshControl handles the pull gesture.

console.log('Pull-to-refresh recipe loaded');

const ITEMS_INITIAL = [
  { id: 1, title: 'Latest update', time: 'just now' },
  { id: 2, title: 'Previous item', time: '2 min ago' },
  { id: 3, title: 'Older item', time: '5 min ago' },
];

function AnimatedSpinner({ size = 24, color = '#1976d2' }) {
  const rotation = useSharedValue(0);

  React.useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { duration: 800, easing: Easing.linear }),
      -1,
      false
    );
    return () => {
      rotation.value = 0;
    };
  }, []);

  const spinStyle = useAnimatedStyle(() => {
    'worklet';
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  return (
    <Animated.View style={[{ width: size, height: size }, spinStyle]}>
      <View style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        borderWidth: 3,
        borderColor: '#e0e0e0',
        borderTopColor: color,
      }} />
    </Animated.View>
  );
}

export function PullToRefreshRecipe() {
  const [refreshing, setRefreshing] = useState(false);
  const [items, setItems] = useState(ITEMS_INITIAL);
  const [refreshCount, setRefreshCount] = useState(0);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Simulate data fetch
    setTimeout(() => {
      setItems(prev => [
        { id: Date.now(), title: `New item #${refreshCount + 1}`, time: 'just now' },
        ...prev.slice(0, 4),
      ]);
      setRefreshCount(c => c + 1);
      setRefreshing(false);
    }, 1500);
  }, [refreshCount]);

  return (
    <View style={styles.demo}>
      <Text style={styles.label}>
        Pull-to-refresh — native RefreshControl + custom animated spinner
      </Text>
      <View style={styles.listContainer}>
        <ScrollView
          style={{ maxHeight: 250 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#1976d2']}
              tintColor="#1976d2"
              title={refreshing ? 'Loading...' : 'Pull to refresh'}
              titleColor="#666"
            />
          }
        >
          {items.map(item => (
            <View key={item.id} style={styles.listItem}>
              <Text style={styles.itemTitle}>{item.title}</Text>
              <Text style={styles.itemTime}>{item.time}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      {refreshing && (
        <View style={styles.spinnerRow}>
          <AnimatedSpinner size={20} color="#1976d2" />
          <Text style={styles.spinnerText}>Custom animated spinner (Reanimated 2)</Text>
        </View>
      )}

      <Text style={styles.note}>
        Pull down inside the list above to refresh.
        Each pull adds a new item at the top.
      </Text>
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
  listContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#eee',
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  itemTitle: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  itemTime: {
    fontSize: 12,
    color: '#999',
  },
  spinnerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    gap: 8,
  },
  spinnerText: {
    fontSize: 12,
    color: '#666',
  },
  note: {
    marginTop: 8,
    fontSize: 12,
    color: '#888',
    fontStyle: 'italic',
  },
});
