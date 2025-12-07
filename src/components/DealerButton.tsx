import React from "react";
import { View, Text, StyleSheet, StyleProp, ViewStyle } from "react-native";
import { colors } from "../theme/colors";

export interface DealerButtonProps {
  style?: StyleProp<ViewStyle>;
}

export const DealerButton: React.FC<DealerButtonProps> = ({ style }) => {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.text}>D</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.dealerButton,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 4,
  },
  text: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "800",
  },
});

