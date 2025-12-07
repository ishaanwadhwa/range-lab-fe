import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { colors } from "../theme/colors";

interface AnimatedPotProps {
  amount: number;
}

export const AnimatedPot: React.FC<AnimatedPotProps> = ({ amount }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const prevAmount = useRef(amount);

  useEffect(() => {
    if (amount !== prevAmount.current) {
      // Bounce animation when pot changes
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.15,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 5,
          useNativeDriver: true,
        }),
      ]).start();

      prevAmount.current = amount;
    }
  }, [amount]);

  return (
    <Animated.View
      style={[
        styles.container,
        { transform: [{ scale: scaleAnim }] },
      ]}
    >
      {/* Chip icon */}
      <View style={styles.chipIcon}>
        <View style={styles.chipInner} />
      </View>

      {/* Pot info */}
      <View style={styles.potInfo}>
        <Text style={styles.potLabel}>Pot</Text>
        <Text style={styles.potAmount}>{amount.toFixed(0)}BB</Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 8,
  },
  chipIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.accentRed,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  chipInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FFFFFF",
  },
  potInfo: {
    alignItems: "flex-start",
  },
  potLabel: {
    fontSize: 10,
    color: colors.accentYellow,
    fontWeight: "600",
  },
  potAmount: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "700",
  },
});

