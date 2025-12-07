import React from "react";
import { View, StyleSheet } from "react-native";
import { Card } from "./Card";

export interface HeroHandProps {
  cards: string[];
}

export const HeroHand: React.FC<HeroHandProps> = ({ cards }) => {
  if (!cards?.length) return null;

  return (
    <View style={styles.container}>
      <Card
        card={cards[0]}
        size="medium"
        style={[styles.card, styles.cardFirst]}
      />
      {cards[1] && (
        <Card
          card={cards[1]}
          size="medium"
          style={[styles.card, styles.cardSecond]}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  card: {},
  cardFirst: {
    transform: [{ rotate: "-5deg" }],
    zIndex: 1,
  },
  cardSecond: {
    marginLeft: -12,
    transform: [{ rotate: "5deg" }],
    zIndex: 2,
  },
});
