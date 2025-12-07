import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { colors } from "../theme/colors";

export type ActionConfig = {
  id: string;
  label: string;
  subLabel?: string;
  variant?: "default" | "highlight" | "danger";
};

// Variant colors
const VARIANT_STYLES = {
  default: {
    bg: "#1A1A1A",
    border: "#333",
  },
  highlight: {
    bg: "#10B981", // Green for correct
    border: "#10B981",
  },
  danger: {
    bg: "#EF4444", // Red for wrong selection
    border: "#EF4444",
  },
};

export interface ActionBarProps {
  phase?: "replay" | "ready";
  actions?: ActionConfig[];
  onSelectAction?: (id: string) => void;
}

const DEFAULT_ACTIONS: ActionConfig[] = [
  { id: "check_fold", label: "C/F", variant: "default" },
  { id: "call", label: "Call", subLabel: "0.50BB", variant: "default" },
  { id: "call_any", label: "Call Any", variant: "default" },
];

export const ActionBar: React.FC<ActionBarProps> = ({
  phase = "ready",
  actions = DEFAULT_ACTIONS,
  onSelectAction,
}) => {
  const isReady = phase === "ready";

  return (
    <View style={styles.container}>
      {actions.map((action) => {
        const variant = action.variant || "default";
        const variantStyle = VARIANT_STYLES[variant];
        const isHighlight = variant === "highlight";
        const isDanger = variant === "danger";

        return (
          <Pressable
            key={action.id}
            onPress={() => isReady && onSelectAction?.(action.id)}
            style={({ pressed }) => [
              styles.button,
              { backgroundColor: variantStyle.bg, borderColor: variantStyle.border },
              !isReady && styles.buttonDisabled,
              pressed && isReady && styles.buttonPressed,
            ]}
          >
            <Text style={[styles.checkmark, (isHighlight || isDanger) && { color: "#fff" }]}>✓</Text>
            <View style={styles.labelWrap}>
              <Text style={[styles.label, (isHighlight || isDanger) && styles.labelHighlight]}>
                {action.label}
              </Text>
              {action.subLabel && (
                <Text style={[styles.subLabel, (isHighlight || isDanger) && styles.subLabelHighlight]}>
                  {action.subLabel}
                </Text>
              )}
            </View>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 100, // Space for tab bar
    gap: 8,
  },
  button: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: "#1A1A1A",
    borderWidth: 1,
    borderColor: "#333",
    gap: 4,
  },
  buttonHighlight: {
    backgroundColor: colors.accentGreen,
    borderColor: colors.accentGreen,
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  buttonPressed: {
    opacity: 0.7,
  },
  checkmark: {
    fontSize: 12,
    color: "#666",
  },
  labelWrap: {
    alignItems: "center",
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#fff",
  },
  labelHighlight: {
    color: "#fff",
  },
  subLabel: {
    fontSize: 10,
    color: "#888",
  },
  subLabelHighlight: {
    color: "rgba(255,255,255,0.8)",
  },
});
