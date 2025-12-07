import React from "react";
import { View, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "../theme/colors";

export interface TableFeltProps {
  children?: React.ReactNode;
}

/**
 * CSS-rendered poker table with purple felt and dark rail.
 * Compact portrait orientation for mobile - leaves room for hero below.
 */
export const TableFelt: React.FC<TableFeltProps> = ({ children }) => {
  return (
    <View style={styles.container}>
      {/* Outer rail (dark border) */}
      <View style={styles.rail}>
        {/* Inner felt (purple gradient) */}
        <LinearGradient
          colors={[colors.tableFeltStart, colors.tableFeltEnd]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={styles.felt}
        >
          {/* Inner border highlight */}
          <View style={styles.feltInnerBorder}>
            {children}
          </View>
        </LinearGradient>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    aspectRatio: 0.9, // Slightly taller than wide, but not too tall
    alignItems: "center",
    justifyContent: "center",
  },
  rail: {
    width: "100%",
    height: "100%",
    borderRadius: 999,
    backgroundColor: colors.tableRail,
    borderWidth: 5,
    borderColor: colors.tableRailBorder,
    padding: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 10,
  },
  felt: {
    flex: 1,
    borderRadius: 999,
    overflow: "hidden",
  },
  feltInnerBorder: {
    flex: 1,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.06)",
    position: "relative",
  },
});
