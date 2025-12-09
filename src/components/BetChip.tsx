import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { colors } from "../theme/colors";

export type BetAction = "r" | "b" | "c" | "a"; // raise, bet, call, all-in

interface BetChipProps {
  amount: number;
  action?: BetAction;
  startX: number;
  startY: number;
  visible: boolean;
  onAnimationComplete?: () => void;
}

const ACTION_LABELS: Record<BetAction, string> = {
  r: "RAISE",
  b: "BET",
  c: "CALL",
  a: "ALL-IN",
};

/**
 * Animated chip that appears at a position and slides to pot center
 * Shows action type (RAISE/BET/CALL) with amount
 */
export const BetChip: React.FC<BetChipProps> = ({
  amount,
  action = "b",
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
        // Pause briefly so user can see the action
        Animated.delay(350),
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

  const actionLabel = ACTION_LABELS[action] || "BET";

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
        <Text style={styles.actionText}>{actionLabel}</Text>
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
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: colors.accentYellow,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "#FFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 5,
  },
  actionText: {
    color: "#000",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  amount: {
    color: "#000",
    fontSize: 13,
    fontWeight: "700",
  },
});
