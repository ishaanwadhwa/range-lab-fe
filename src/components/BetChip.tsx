import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { colors } from "../theme/colors";

interface BetChipProps {
  amount: number;
  startX: number;
  startY: number;
  visible: boolean;
  onAnimationComplete?: () => void;
}

/**
 * Animated chip that appears at a position and slides to pot center
 */
export const BetChip: React.FC<BetChipProps> = ({
  amount,
  startX,
  startY,
  visible,
  onAnimationComplete,
}) => {
  const translateX = useRef(new Animated.Value(startX)).current;
  const translateY = useRef(new Animated.Value(startY)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    if (visible && amount > 0) {
      // Reset to start position
      translateX.setValue(startX);
      translateY.setValue(startY);
      opacity.setValue(0);
      scale.setValue(0.5);

      // Animate: appear, then slide to center (0,0 relative to pot)
      Animated.sequence([
        // Pop in at start position
        Animated.parallel([
          Animated.timing(opacity, {
            toValue: 1,
            duration: 150,
            useNativeDriver: true,
          }),
          Animated.spring(scale, {
            toValue: 1,
            friction: 8,
            useNativeDriver: true,
          }),
        ]),
        // Pause briefly
        Animated.delay(200),
        // Slide to pot center
        Animated.parallel([
          Animated.timing(translateX, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(translateY, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 0.6,
            duration: 400,
            useNativeDriver: true,
          }),
        ]),
        // Fade out as it merges
        Animated.timing(opacity, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start(() => {
        onAnimationComplete?.();
      });
    }
  }, [visible, amount, startX, startY]);

  if (!visible || amount <= 0) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity,
          transform: [
            { translateX },
            { translateY },
            { scale },
          ],
        },
      ]}
    >
      <View style={styles.chip}>
        <Text style={styles.amount}>{amount.toFixed(1)}</Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    zIndex: 50,
  },
  chip: {
    backgroundColor: colors.accentYellow,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#FFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 5,
  },
  amount: {
    color: "#000",
    fontSize: 12,
    fontWeight: "700",
  },
});

