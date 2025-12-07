import React from "react";
import { View, Text, ViewStyle } from "react-native";
import Animated, {
  AnimatedStyleProp,
  useAnimatedStyle
} from "react-native-reanimated";

export interface ChipProps {
  color?: string;
  value?: string;
  style?: ViewStyle;
  animatedStyle?: AnimatedStyleProp<ViewStyle>;
}

/**
 * Small visual chip with optional animatedStyle applied from parent.
 * Keeps its own base styling minimal and purely presentational.
 */
export const Chip: React.FC<ChipProps> = ({
  color = "#38bdf8",
  value,
  style,
  animatedStyle
}) => {
  const baseStyle = useAnimatedStyle(() => {
    return {};
  });

  return (
    <Animated.View
      style={[
        {
          width: 24,
          height: 24,
          borderRadius: 9999,
          backgroundColor: color,
          alignItems: "center",
          justifyContent: "center",
          shadowColor: "#000",
          shadowOpacity: 0.35,
          shadowRadius: 4,
          shadowOffset: { width: 0, height: 2 }
        },
        style,
        baseStyle,
        animatedStyle
      ]}
    >
      {value ? (
        <Text
          style={{
            fontSize: 10,
            fontWeight: "700",
            color: "#111827"
          }}
        >
          {value}
        </Text>
      ) : null}
    </Animated.View>
  );
};


