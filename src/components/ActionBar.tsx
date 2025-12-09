/**
 * ActionBar - Decision buttons
 * "Dark Confidence" design
 */

import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { colors } from "../theme/colors";

export type ActionConfig = {
  id: string;
  label: string;
  subLabel?: string;
  variant?: "default" | "highlight" | "danger";
};

const VARIANT_STYLES = {
  default: {
    bg: colors.surface,
    border: colors.border,
    text: colors.textPrimary,
    sub: colors.textMuted,
    check: colors.textMuted,
  },
  highlight: {
    bg: colors.greenDim,
    border: colors.green,
    text: colors.green,
    sub: colors.green,
    check: colors.green,
  },
  danger: {
    bg: colors.redDim,
    border: colors.red,
    text: colors.red,
    sub: colors.red,
    check: colors.red,
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
        const v = VARIANT_STYLES[variant];
        const isActive = variant !== "default";

        return (
          <Pressable
            key={action.id}
            onPress={() => isReady && onSelectAction?.(action.id)}
            style={({ pressed }) => [
              styles.button,
              { backgroundColor: v.bg, borderColor: v.border },
              !isReady && styles.buttonDisabled,
              pressed && isReady && styles.buttonPressed,
            ]}
          >
            {isActive && <Text style={[styles.checkmark, { color: v.check }]}>✓</Text>}
            <View style={styles.labelWrap}>
              <Text style={[styles.label, { color: v.text }]}>
                {action.label}
              </Text>
              {action.subLabel && (
                <Text style={[styles.subLabel, { color: v.sub }]}>
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
    backgroundColor: colors.bg,
  },
  button: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 14,
    borderWidth: 1,
    gap: 6,
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  buttonPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },
  checkmark: {
    fontSize: 12,
    fontWeight: "700",
  },
  labelWrap: {
    alignItems: "center",
  },
  label: {
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  subLabel: {
    fontSize: 11,
    marginTop: 2,
  },
});
