import React from "react";
import { View, StyleSheet } from "react-native";
import { Card } from "./Card";

export interface BoardCardsProps {
  cards: string[];
}

export const BoardCards: React.FC<BoardCardsProps> = ({ cards }) => {
  if (!cards?.length) return null;

  return (
    <View style={styles.container}>
      {cards.map((card, index) => (
        <Card
          key={`${card}-${index}`}
          card={card}
          size="medium"
          style={styles.card}
        />
      ))}
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
  card: {},
});
