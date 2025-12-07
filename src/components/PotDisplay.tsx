import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors } from "../theme/colors";

export interface PotDisplayProps {
  pot: string;
  sidePot?: string;
}

export const PotDisplay: React.FC<PotDisplayProps> = ({ pot, sidePot }) => {
  return (
    <View style={styles.container}>
      {/* Chip icon */}
      <View style={styles.chipIcon}>
        <View style={styles.chipInner}>
          <Text style={styles.chipText}>●</Text>
        </View>
      </View>
      
      {/* Pot amount */}
      <View style={styles.potInfo}>
        <Text style={styles.potLabel}>Pot</Text>
        <Text style={styles.potAmount}>{pot}BB</Text>
      </View>
    </View>
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
    alignItems: "center",
    justifyContent: "center",
  },
  chipText: {
    color: "#FFFFFF",
    fontSize: 8,
    fontWeight: "700",
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
    color: colors.textPrimary,
    fontWeight: "700",
  },
});

