import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet, Animated } from "react-native";
import { Card } from "./Card";
import { formatCard } from "../utils/SpotParser";

interface AnimatedBoardCardsProps {
  cards: string[];
  visibleCount: number; // 0, 3, 4, or 5
}

export const AnimatedBoardCards: React.FC<AnimatedBoardCardsProps> = ({
  cards,
  visibleCount,
}) => {
  // Track animations for each card slot
  const cardAnims = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]).current;

  const [revealedCount, setRevealedCount] = useState(0);

  useEffect(() => {
    // Animate cards based on visibleCount
    if (visibleCount === 0) {
      // Reset all
      cardAnims.forEach((anim) => anim.setValue(0));
      setRevealedCount(0);
    } else if (visibleCount === 3 && revealedCount < 3) {
      // Flop - animate cards 0, 1, 2 with stagger
      Animated.stagger(150, [
        Animated.spring(cardAnims[0], { toValue: 1, friction: 8, useNativeDriver: true }),
        Animated.spring(cardAnims[1], { toValue: 1, friction: 8, useNativeDriver: true }),
        Animated.spring(cardAnims[2], { toValue: 1, friction: 8, useNativeDriver: true }),
      ]).start(() => setRevealedCount(3));
    } else if (visibleCount === 4 && revealedCount < 4) {
      // Turn - animate card 3
      Animated.spring(cardAnims[3], { toValue: 1, friction: 8, useNativeDriver: true }).start(() => setRevealedCount(4));
    } else if (visibleCount === 5 && revealedCount < 5) {
      // River - animate card 4
      Animated.spring(cardAnims[4], { toValue: 1, friction: 8, useNativeDriver: true }).start(() => setRevealedCount(5));
    }
  }, [visibleCount, revealedCount]);

  return (
    <View style={styles.container}>
      {[0, 1, 2, 3, 4].map((idx) => {
        const card = cards[idx];
        const anim = cardAnims[idx];
        const shouldShow = idx < visibleCount && card;

        if (!card) {
          return <View key={idx} style={styles.emptySlot} />;
        }

        const scale = anim.interpolate({
          inputRange: [0, 1],
          outputRange: [0.5, 1],
        });

        const opacity = anim.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [0, 0.8, 1],
        });

        return (
          <Animated.View
            key={`${card}-${idx}`}
            style={[
              styles.cardWrapper,
              {
                opacity: shouldShow ? opacity : 0,
                transform: [{ scale: shouldShow ? scale : 0.5 }],
              },
            ]}
          >
            <Card card={formatCard(card)} size="medium" />
          </Animated.View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  cardWrapper: {
    // Card animation wrapper
  },
  emptySlot: {
    width: 44,
    height: 60,
  },
});
