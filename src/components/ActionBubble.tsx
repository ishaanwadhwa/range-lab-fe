import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { colors } from "../theme/colors";
import { getActionText } from "../utils/TimelineEngine";
import { Position } from "../types/spot";

interface ActionBubbleProps {
  position: Position;
  action: string;
  amount?: number;
  visible: boolean;
}

export const ActionBubble: React.FC<ActionBubbleProps> = ({
  position,
  action,
  amount,
  visible,
}) => {
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto-fade after display
      const fadeTimeout = setTimeout(() => {
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }, 800);

      return () => clearTimeout(fadeTimeout);
    } else {
      opacityAnim.setValue(0);
      scaleAnim.setValue(0.8);
    }
  }, [visible, position, action]);

  const actionText = getActionText(action, amount);
  const isFold = action === "f";
  const isRaise = action === "r" || action === "b";

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: opacityAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <View
        style={[
          styles.bubble,
          isFold && styles.bubbleFold,
          isRaise && styles.bubbleRaise,
        ]}
      >
        <Text style={styles.posText}>{position}</Text>
        <Text style={styles.actionText}>{actionText}</Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: "40%",
    left: "50%",
    transform: [{ translateX: -60 }],
    zIndex: 100,
  },
  bubble: {
    backgroundColor: "rgba(0, 0, 0, 0.85)",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.accentBlue,
    minWidth: 120,
    alignItems: "center",
  },
  bubbleFold: {
    borderColor: colors.accentRed,
  },
  bubbleRaise: {
    borderColor: colors.accentYellow,
  },
  posText: {
    color: "#888",
    fontSize: 11,
    fontWeight: "600",
    marginBottom: 2,
  },
  actionText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },
});

