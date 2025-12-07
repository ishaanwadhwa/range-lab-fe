import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View, Text } from "react-native";
import { parseCard } from "../utils/cardUtils";
import { colors } from "../theme/colors";

interface AnimatedCardProps {
  card: string;
  index: number;
  isVisible: boolean;
  delay?: number;
}

const CARD_WIDTH = 44;
const CARD_HEIGHT = 60;

export const AnimatedCard: React.FC<AnimatedCardProps> = ({
  card,
  index,
  isVisible,
  delay = 0,
}) => {
  const flipAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isVisible) {
      // Animate in with delay based on index
      const totalDelay = delay + index * 150;

      Animated.sequence([
        Animated.delay(totalDelay),
        Animated.parallel([
          Animated.timing(opacityAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 8,
            tension: 100,
            useNativeDriver: true,
          }),
          Animated.timing(flipAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    } else {
      // Reset
      flipAnim.setValue(0);
      scaleAnim.setValue(0.8);
      opacityAnim.setValue(0);
    }
  }, [isVisible, index, delay]);

  const { rank, suit, color } = parseCard(card);

  // Flip interpolation (Y rotation effect via scale)
  const flipInterpolate = flipAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0.5, 1],
  });

  return (
    <Animated.View
      style={[
        styles.cardContainer,
        {
          opacity: opacityAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <View style={styles.card}>
        <View style={styles.corner}>
          <Text style={[styles.rank, { color }]}>{rank}</Text>
          <Text style={[styles.suit, { color }]}>{suit}</Text>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    marginHorizontal: 2,
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    backgroundColor: colors.cardBackground,
    borderRadius: 8,
    padding: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  corner: {
    alignItems: "center",
  },
  rank: {
    fontSize: 18,
    fontWeight: "700",
    lineHeight: 20,
  },
  suit: {
    fontSize: 14,
    marginTop: -4,
  },
});

