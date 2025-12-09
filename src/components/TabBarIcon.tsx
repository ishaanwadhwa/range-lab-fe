/**
 * TabBarIcon - Navigation icons
 * "Dark Confidence" design
 */

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors } from "../theme/colors";

export type TabIconName = "train" | "spots" | "stats";

interface TabBarIconProps {
  name: TabIconName;
  focused: boolean;
  color: string;
}

export const TabBarIcon: React.FC<TabBarIconProps> = ({
  name,
  focused,
  color,
}) => {
  const iconMap: Record<TabIconName, string> = {
    train: "▶",
    spots: "♠",
    stats: "◎",
  };

  return (
    <View style={styles.container}>
      {focused && <View style={styles.activeIndicator} />}
      <Text
        style={[
          styles.icon,
          { color },
          focused && styles.iconFocused,
          name === "spots" && styles.iconSpade,
        ]}
      >
        {iconMap[name]}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 6,
  },
  activeIndicator: {
    position: "absolute",
    top: 0,
    width: 20,
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.gold,
  },
  icon: {
    fontSize: 20,
    fontWeight: "400",
  },
  iconFocused: {
    fontWeight: "600",
  },
  iconSpade: {
    fontSize: 22,
  },
});
