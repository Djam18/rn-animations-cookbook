import React, { useState } from 'react';
import { View, Text, Button, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  Layout,
  FadeIn,
  FadeOut,
  SlideInLeft,
  SlideOutRight,
  ZoomIn,
  ZoomOut,
  BounceIn,
} from 'react-native-reanimated';

// Reanimated 2 layout animations — enter/exit/layout animations
// Much cleaner than LayoutAnimation from the core.
// FadeIn/FadeOut, SlideInLeft/SlideOutRight, ZoomIn/ZoomOut, BounceIn...
// entering, exiting, layout props on Animated.View
// This is one of the killer features of Reanimated 2.

console.log('Reanimated 2 layout animations loaded');

export function EnterExitAnimations() {
  const [items, setItems] = useState([
    { id: 1, text: 'First item', color: '#1976d2' },
    { id: 2, text: 'Second item', color: '#388e3c' },
    { id: 3, text: 'Third item', color: '#f57c00' },
  ]);
  const [counter, setCounter] = useState(4);

  const addItem = () => {
    const colors = ['#7b1fa2', '#c62828', '#00838f', '#558b2f'];
    const color = colors[(counter - 4) % colors.length];
    setItems(prev => [{ id: counter, text: `Item #${counter}`, color }, ...prev]);
    setCounter(c => c + 1);
  };

  const removeItem = (id) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  return (
    <View style={styles.demo}>
      <Text style={styles.label}>
        entering/exiting props — FadeIn, SlideInLeft, SlideOutRight, Layout
      </Text>
      <Button title="Add Item" onPress={addItem} />
      <View style={{ marginTop: 8 }}>
        {items.map(item => (
          <Animated.View
            key={item.id}
            entering={SlideInLeft.duration(300)}
            exiting={SlideOutRight.duration(250)}
            layout={Layout.springify()}
            style={[styles.listItem, { backgroundColor: item.color }]}
          >
            <Text style={styles.itemText}>{item.text}</Text>
            <TouchableOpacity onPress={() => removeItem(item.id)} style={styles.removeBtn}>
              <Text style={styles.removeText}>✕</Text>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </View>
    </View>
  );
}

export function VariousEnterAnimations() {
  const [visible, setVisible] = useState(false);

  return (
    <View style={styles.demo}>
      <Text style={styles.label}>
        FadeIn | ZoomIn | BounceIn — entering animation presets
      </Text>
      <Button title={visible ? 'Hide' : 'Show Cards'} onPress={() => setVisible(v => !v)} />
      {visible && (
        <View style={styles.cardsRow}>
          <Animated.View entering={FadeIn.delay(0).duration(400)} exiting={FadeOut} style={[styles.card, { backgroundColor: '#1976d2' }]}>
            <Text style={styles.cardLabel}>FadeIn</Text>
          </Animated.View>
          <Animated.View entering={ZoomIn.delay(150).duration(400)} exiting={ZoomOut} style={[styles.card, { backgroundColor: '#388e3c' }]}>
            <Text style={styles.cardLabel}>ZoomIn</Text>
          </Animated.View>
          <Animated.View entering={BounceIn.delay(300)} style={[styles.card, { backgroundColor: '#f57c00' }]}>
            <Text style={styles.cardLabel}>BounceIn</Text>
          </Animated.View>
        </View>
      )}
    </View>
  );
}

export function TabSwitcherWithAnimation() {
  const [activeTab, setActiveTab] = useState(0);
  const TABS = ['Home', 'Search', 'Profile'];

  return (
    <View style={styles.demo}>
      <Text style={styles.label}>Tab content with FadeIn on switch</Text>
      <View style={styles.tabBar}>
        {TABS.map((tab, i) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tabButton, activeTab === i && styles.tabButtonActive]}
            onPress={() => setActiveTab(i)}
          >
            <Text style={[styles.tabLabel, activeTab === i && styles.tabLabelActive]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <Animated.View
        key={activeTab}
        entering={FadeIn.duration(200)}
        style={styles.tabContent}
      >
        <Text style={styles.tabContentText}>Content for {TABS[activeTab]}</Text>
      </Animated.View>
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
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 6,
  },
  itemText: {
    flex: 1,
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  removeBtn: {
    padding: 4,
  },
  removeText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    fontWeight: 'bold',
  },
  cardsRow: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 8,
  },
  card: {
    flex: 1,
    height: 70,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardLabel: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    padding: 4,
    marginBottom: 12,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  tabButtonActive: {
    backgroundColor: '#fff',
  },
  tabLabel: {
    fontSize: 13,
    color: '#666',
  },
  tabLabelActive: {
    color: '#1976d2',
    fontWeight: '600',
  },
  tabContent: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    minHeight: 60,
    justifyContent: 'center',
  },
  tabContentText: {
    fontSize: 14,
    color: '#333',
  },
});
