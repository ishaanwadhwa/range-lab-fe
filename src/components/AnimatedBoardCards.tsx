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
  
  // Track the cards array to detect when a new spot loads
  const prevCardsRef = useRef<string[]>([]);
  
  // Reset everything when cards array changes (new spot loaded)
  useEffect(() => {
    const cardsKey = cards.join(",");
    const prevKey = prevCardsRef.current.join(",");
    
    if (cardsKey !== prevKey) {
      // New spot - reset all animations
      cardAnims.forEach((anim) => {
        anim.stopAnimation();
        anim.setValue(0);
      });
      setRevealedCount(0);
      prevCardsRef.current = cards;
    }
  }, [cards, cardAnims]);

  // Animate cards based on visibleCount
  useEffect(() => {
    if (visibleCount === 0) {
      // Reset all animations
      cardAnims.forEach((anim) => {
        anim.stopAnimation();
        anim.setValue(0);
      });
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
  }, [visibleCount, revealedCount, cardAnims]);

  // Generate a stable key based on the entire board
  const boardKey = cards.slice(0, 5).join("-") || "empty";

  return (
    <View style={styles.container}>
      {[0, 1, 2, 3, 4].map((idx) => {
        const card = cards[idx];
        const anim = cardAnims[idx];
        const shouldShow = idx < visibleCount && card;

        // If no card for this slot, render empty placeholder
        if (!card) {
          return <View key={`${boardKey}-empty-${idx}`} style={styles.emptySlot} />;
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
            key={`${boardKey}-${idx}`}
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
