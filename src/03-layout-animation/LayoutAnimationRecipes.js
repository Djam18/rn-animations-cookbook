import React, { useState } from 'react';
import { View, Text, Button, LayoutAnimation, Platform, UIManager, StyleSheet, TouchableOpacity } from 'react-native';

// LayoutAnimation — animate layout changes automatically
// Just call LayoutAnimation.configureNext() before a setState.
// React Native will animate the resulting layout change.
// Much simpler than Animated for layout changes.
// Caveat: LayoutAnimation requires manual enable on Android.
// On iOS it works out of the box.

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental &&
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

console.log('LayoutAnimation recipes loaded');

export function ExpandCollapseDemo() {
  const [expanded, setExpanded] = useState(false);

  const toggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(prev => !prev);
  };

  return (
    <View style={styles.demo}>
      <Text style={styles.label}>Expand / Collapse (LayoutAnimation.Presets.easeInEaseOut)</Text>
      <View style={styles.card}>
        <TouchableOpacity onPress={toggle} style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Accordion Item</Text>
          <Text style={styles.chevron}>{expanded ? '▲' : '▼'}</Text>
        </TouchableOpacity>
        {expanded && (
          <View style={styles.cardBody}>
            <Text style={styles.cardBodyText}>
              This content animates in and out because we called
              LayoutAnimation.configureNext() before the setState.
              React Native handles the rest automatically.
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

export function ListInsertDeleteDemo() {
  const [items, setItems] = useState(['Item A', 'Item B', 'Item C']);
  const [counter, setCounter] = useState(4);

  const addItem = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
    setItems(prev => [`Item ${String.fromCharCode(64 + counter)}`, ...prev]);
    setCounter(c => c + 1);
  };

  const removeItem = (index) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <View style={styles.demo}>
      <Text style={styles.label}>List insert/delete (LayoutAnimation.Presets.spring)</Text>
      <Button title="Add Item at Top" onPress={addItem} />
      <View style={{ marginTop: 8 }}>
        {items.map((item, i) => (
          <View key={item} style={styles.listRow}>
            <Text style={styles.listText}>{item}</Text>
            <TouchableOpacity onPress={() => removeItem(i)} style={styles.deleteBtn}>
              <Text style={styles.deleteText}>✕</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );
}

export function CustomLayoutAnimationDemo() {
  const [showBox, setShowBox] = useState(false);

  const toggle = () => {
    // Custom LayoutAnimation config
    LayoutAnimation.configureNext({
      duration: 400,
      create: {
        type: LayoutAnimation.Types.spring,
        property: LayoutAnimation.Properties.scaleXY,
        springDamping: 0.7,
      },
      update: {
        type: LayoutAnimation.Types.spring,
        springDamping: 0.7,
      },
      delete: {
        type: LayoutAnimation.Types.easeOut,
        property: LayoutAnimation.Properties.opacity,
      },
    });
    setShowBox(prev => !prev);
  };

  return (
    <View style={styles.demo}>
      <Text style={styles.label}>Custom LayoutAnimation config (create/update/delete)</Text>
      <Button title={showBox ? 'Hide Box' : 'Show Box'} onPress={toggle} />
      {showBox && (
        <View style={[styles.box, { marginTop: 12 }]}>
          <Text style={styles.boxText}>Custom Animation Box</Text>
        </View>
      )}
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
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  chevron: {
    fontSize: 12,
    color: '#666',
  },
  cardBody: {
    padding: 14,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  cardBodyText: {
    fontSize: 13,
    color: '#555',
    lineHeight: 19,
  },
  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
    marginBottom: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#eee',
  },
  listText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  deleteBtn: {
    padding: 4,
  },
  deleteText: {
    color: '#f44336',
    fontSize: 14,
    fontWeight: 'bold',
  },
  box: {
    backgroundColor: '#1976d2',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
  },
  boxText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
