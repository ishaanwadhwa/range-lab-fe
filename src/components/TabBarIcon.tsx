import React from "react";
import { View, Text, StyleSheet } from "react-native";

export type TabIconName = "train" | "spots" | "stats";

interface TabBarIconProps {
  name: TabIconName;
  focused: boolean;
  color: string;
}

/**
 * Simple, elegant tab icons inspired by SF Symbols.
 * Using unicode/emoji-based icons for now; can swap for SVG later.
 */
export const TabBarIcon: React.FC<TabBarIconProps> = ({
  name,
  focused,
  color
}) => {
  const iconMap: Record<TabIconName, string> = {
    train: "▶︎", // play symbol
    spots: "♠︎", // spade for poker
    stats: "◉" // circle/chart
  };

  return (
    <View style={styles.container}>
      {focused && <View style={styles.activeIndicator} />}
      <Text
        style={[
          styles.icon,
          { color },
          focused && styles.iconFocused,
          name === "spots" && styles.iconSpade
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
    paddingTop: 6
  },
  activeIndicator: {
    position: "absolute",
    top: 0,
    width: 24,
    height: 3,
    borderRadius: 2,
    backgroundColor: "#3B82F6" // blue-500
  },
  icon: {
    fontSize: 20,
    fontWeight: "400"
  },
  iconFocused: {
    fontWeight: "600"
  },
  iconSpade: {
    fontSize: 22
  }
});

