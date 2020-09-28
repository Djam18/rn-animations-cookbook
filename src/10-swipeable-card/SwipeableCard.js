import React, { useState } from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  withSpring,
  withTiming,
  interpolate,
  interpolateColor,
  Extrapolate,
  runOnJS,
} from 'react-native-reanimated';

// Swipeable card (Tinder-like) recipe
// - PanGestureHandler tracks horizontal drag
// - Card rotates as it's dragged
// - Left swipe = reject (red tint), right swipe = like (green tint)
// - Throw past threshold → animate off screen → remove from stack

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.3;
const CARDS = [
  { id: 1, name: 'React Native', emoji: '⚛️', desc: 'Build native apps with React' },
  { id: 2, name: 'Reanimated 2', emoji: '🎬', desc: 'Smooth 60fps animations' },
  { id: 3, name: 'Gesture Handler', emoji: '👆', desc: 'Native gesture recognition' },
  { id: 4, name: 'Expo', emoji: '🚀', desc: 'Build and deploy fast' },
];

console.log('Swipeable card recipe loaded');

function SwipeCard({ card, onSwipe, isTop }) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const gestureHandler = useAnimatedGestureHandler({
    onActive: (event) => {
      'worklet';
      translateX.value = event.translationX;
      translateY.value = event.translationY * 0.3; // vertical dampening
    },
    onEnd: (event) => {
      'worklet';
      if (Math.abs(translateX.value) > SWIPE_THRESHOLD || Math.abs(event.velocityX) > 800) {
        const direction = translateX.value > 0 ? 'right' : 'left';
        const targetX = direction === 'right' ? SCREEN_WIDTH * 1.5 : -SCREEN_WIDTH * 1.5;
        translateX.value = withTiming(targetX, { duration: 300 }, () => {
          'worklet';
          runOnJS(onSwipe)(card.id, direction);
        });
      } else {
        // Snap back
        translateX.value = withSpring(0, { damping: 15 });
        translateY.value = withSpring(0, { damping: 15 });
      }
    },
  });

  const cardStyle = useAnimatedStyle(() => {
    'worklet';
    const rotate = interpolate(
      translateX.value,
      [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      ['-20deg', '0deg', '20deg'],
      Extrapolate.CLAMP
    );
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotate },
      ],
    };
  });

  const likeOpacity = useAnimatedStyle(() => {
    'worklet';
    return {
      opacity: interpolate(translateX.value, [0, SWIPE_THRESHOLD], [0, 1], Extrapolate.CLAMP),
    };
  });

  const nopeOpacity = useAnimatedStyle(() => {
    'worklet';
    return {
      opacity: interpolate(translateX.value, [-SWIPE_THRESHOLD, 0], [1, 0], Extrapolate.CLAMP),
    };
  });

  if (!isTop) {
    return (
      <View style={[styles.card, { transform: [{ scale: 0.95 }], top: 8 }]}>
        <Text style={styles.cardEmoji}>{card.emoji}</Text>
        <Text style={styles.cardName}>{card.name}</Text>
      </View>
    );
  }

  return (
    <PanGestureHandler onGestureEvent={gestureHandler}>
      <Animated.View style={[styles.card, cardStyle]}>
        {/* LIKE label */}
        <Animated.View style={[styles.likeLabel, likeOpacity]}>
          <Text style={styles.likeLabelText}>LIKE 👍</Text>
        </Animated.View>

        {/* NOPE label */}
        <Animated.View style={[styles.nopeLabel, nopeOpacity]}>
          <Text style={styles.nopeLabelText}>NOPE 👎</Text>
        </Animated.View>

        <Text style={styles.cardEmoji}>{card.emoji}</Text>
        <Text style={styles.cardName}>{card.name}</Text>
        <Text style={styles.cardDesc}>{card.desc}</Text>
        <Text style={styles.hint}>← Swipe left/right →</Text>
      </Animated.View>
    </PanGestureHandler>
  );
}

export function SwipeableCardRecipe() {
  const [cards, setCards] = useState(CARDS);
  const [history, setHistory] = useState([]);

  const handleSwipe = (id, direction) => {
    setHistory(prev => [...prev, { id, direction }]);
    setCards(prev => prev.filter(c => c.id !== id));
  };

  const reset = () => {
    setCards(CARDS);
    setHistory([]);
  };

  return (
    <View style={styles.demo}>
      <Text style={styles.label}>
        Swipeable Card (Tinder-like) — rotate + labels + throw detection
      </Text>

      <View style={styles.stack}>
        {cards.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No more cards!</Text>
            <Text style={styles.emptyHint} onPress={reset}>Tap to reset</Text>
          </View>
        ) : (
          [...cards].reverse().map((card, i, arr) => (
            <SwipeCard
              key={card.id}
              card={card}
              onSwipe={handleSwipe}
              isTop={i === arr.length - 1}
            />
          ))
        )}
      </View>

      {history.length > 0 && (
        <View style={styles.historyRow}>
          {history.map(({ id, direction }) => {
            const card = CARDS.find(c => c.id === id);
            return (
              <Text key={id} style={styles.historyItem}>
                {card?.emoji} {direction === 'right' ? '✅' : '❌'}
              </Text>
            );
          })}
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
    lineHeight: 18,
  },
  stack: {
    height: 240,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  card: {
    position: 'absolute',
    width: 280,
    height: 200,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  cardEmoji: {
    fontSize: 40,
    marginBottom: 8,
  },
  cardName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
  },
  hint: {
    fontSize: 11,
    color: '#bbb',
  },
  likeLabel: {
    position: 'absolute',
    top: 16,
    left: 16,
    borderWidth: 3,
    borderColor: '#4caf50',
    borderRadius: 8,
    padding: 4,
    transform: [{ rotate: '-15deg' }],
  },
  likeLabelText: {
    color: '#4caf50',
    fontWeight: 'bold',
    fontSize: 16,
  },
  nopeLabel: {
    position: 'absolute',
    top: 16,
    right: 16,
    borderWidth: 3,
    borderColor: '#f44336',
    borderRadius: 8,
    padding: 4,
    transform: [{ rotate: '15deg' }],
  },
  nopeLabelText: {
    color: '#f44336',
    fontWeight: 'bold',
    fontSize: 16,
  },
  emptyState: {
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  emptyHint: {
    fontSize: 13,
    color: '#1976d2',
    textDecorationLine: 'underline',
  },
  historyRow: {
    flexDirection: 'row',
    marginTop: 12,
    flexWrap: 'wrap',
    gap: 8,
  },
  historyItem: {
    fontSize: 20,
  },
});
