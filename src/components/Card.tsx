import React from "react";
import { View, Text, StyleSheet, StyleProp, ViewStyle } from "react-native";
import { parseCard } from "../utils/cardUtils";
import { colors } from "../theme/colors";

export interface CardProps {
  card: string;
  size?: "small" | "medium" | "large";
  style?: StyleProp<ViewStyle>;
}

const SIZES = {
  small: { width: 36, height: 48, rankSize: 16, suitSize: 12, borderRadius: 6 },
  medium: { width: 44, height: 60, rankSize: 20, suitSize: 16, borderRadius: 8 },
  large: { width: 56, height: 76, rankSize: 26, suitSize: 20, borderRadius: 10 },
};

export const Card: React.FC<CardProps> = ({ card, size = "medium", style }) => {
  const { rank, suit, color } = parseCard(card);
  const dim = SIZES[size];

  return (
    <View
      style={[
        styles.card,
        {
          width: dim.width,
          height: dim.height,
          borderRadius: dim.borderRadius,
        },
        style,
      ]}
    >
      {/* Top-left corner */}
      <View style={styles.corner}>
        <Text style={[styles.rank, { fontSize: dim.rankSize, color }]}>{rank}</Text>
        <Text style={[styles.suit, { fontSize: dim.suitSize, color }]}>{suit}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cardBackground,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    padding: 4,
  },
  corner: {
    alignItems: "center",
  },
  rank: {
    fontWeight: "700",
    lineHeight: 22,
  },
  suit: {
    marginTop: -6,
  },
});
