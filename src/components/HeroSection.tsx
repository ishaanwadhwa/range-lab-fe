import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { HeroHand } from "./HeroHand";
import { colors } from "../theme/colors";

export interface HeroSectionProps {
  name: string;
  stack: string;
  cards: string[];
  position?: string;
}

/**
 * Compact hero section below the table.
 */
export const HeroSection: React.FC<HeroSectionProps> = ({
  name,
  stack,
  cards,
  position,
}) => {
  return (
    <View style={styles.container}>
      {/* Hero cards */}
      <HeroHand cards={cards} />

      {/* Hero info - inline */}
      <View style={styles.infoRow}>
        {position && (
          <View style={styles.positionBadge}>
            <Text style={styles.positionText}>{position}</Text>
          </View>
        )}
        <Text style={styles.nameText}>{name}</Text>
        <Text style={styles.stackText}>{stack}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingVertical: 4,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    gap: 8,
  },
  positionBadge: {
    backgroundColor: colors.accentBlue,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  positionText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "700",
  },
  nameText: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: "500",
  },
  stackText: {
    color: colors.accentYellow,
    fontSize: 13,
    fontWeight: "700",
  },
});
