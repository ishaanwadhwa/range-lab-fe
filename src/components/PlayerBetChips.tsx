import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { colors } from "../theme/colors";

interface PlayerBetChipsProps {
  amount: number;
  visible: boolean;
}

/**
 * Chips displayed in front of a player showing their current bet
 */
export const PlayerBetChips: React.FC<PlayerBetChipsProps> = ({
  amount,
  visible,
}) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible && amount > 0) {
      // Pop in animation
      scaleAnim.setValue(0.5);
      opacityAnim.setValue(0);

      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 6,
          tension: 100,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Fade out
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, amount]);

  if (!visible || amount <= 0) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: opacityAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      {/* Chip stack visual */}
      <View style={styles.chipStack}>
        <View style={styles.chip} />
        <View style={[styles.chip, styles.chipOffset1]} />
        <View style={[styles.chip, styles.chipOffset2]} />
      </View>
      
      {/* Amount text */}
      <Text style={styles.amountText}>{amount.toFixed(1)}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  chipStack: {
    width: 20,
    height: 16,
    position: "relative",
  },
  chip: {
    position: "absolute",
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.accentYellow,
    borderWidth: 2,
    borderColor: "#FFF",
  },
  chipOffset1: {
    left: 2,
    top: -2,
  },
  chipOffset2: {
    left: 4,
    top: -4,
  },
  amountText: {
    color: "#FFF",
    fontSize: 11,
    fontWeight: "700",
    textShadowColor: "rgba(0, 0, 0, 0.8)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});

