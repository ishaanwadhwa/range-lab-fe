import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, StyleProp, ViewStyle, Animated } from "react-native";
import { colors } from "../theme/colors";

export type SeatStatus = "fold" | "call" | "raise" | "check" | "all_in" | "sit_out" | "to_act" | null;
export type PositionLabel = "SB" | "BB" | "UTG" | "MP" | "CO" | "BTN" | null;

export interface SeatProps {
  name: string;
  stack: string;
  status?: SeatStatus;
  position?: PositionLabel;
  lastAction?: string; // "x", "c", "f", "b", "r", "a"
  lastBetAmount?: number; // Amount for bets/raises
  isFolded?: boolean;
  isActive?: boolean;
  style?: StyleProp<ViewStyle>;
}

// Action display mapping
const ACTION_DISPLAY: Record<string, { label: string; color: string; showAmount: boolean }> = {
  x: { label: "CHECK", color: colors.statusCheck, showAmount: false },
  c: { label: "CALL", color: colors.statusCall, showAmount: true },
  f: { label: "FOLD", color: colors.statusFold, showAmount: false },
  b: { label: "BET", color: colors.accentYellow, showAmount: true },
  r: { label: "RAISE", color: colors.accentOrange, showAmount: true },
  a: { label: "ALL-IN", color: colors.accentOrange, showAmount: false },
};

export const Seat: React.FC<SeatProps> = ({
  name,
  stack,
  position,
  lastAction,
  lastBetAmount,
  isFolded = false,
  isActive = true,
  style,
}) => {
  const initial = name.charAt(0).toUpperCase();
  const displayName = name.length > 5 ? `${name.slice(0, 5)}..` : name;
  
  const actionInfo = lastAction ? ACTION_DISPLAY[lastAction] : null;
  
  // Fade animation for action label
  const actionOpacity = useRef(new Animated.Value(0)).current;
  const actionScale = useRef(new Animated.Value(0.8)).current;
  
  useEffect(() => {
    if (lastAction) {
      // Reset and animate in
      actionOpacity.setValue(0);
      actionScale.setValue(0.8);
      
      Animated.parallel([
        Animated.timing(actionOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(actionScale, {
          toValue: 1,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [lastAction, lastBetAmount]);

  // Dim opacity for folded players
  const seatOpacity = isFolded ? 0.4 : 1;

  // Build action label text
  const getActionLabel = () => {
    if (!actionInfo) return "";
    if (actionInfo.showAmount && lastBetAmount) {
      return `${actionInfo.label} ${lastBetAmount}`;
    }
    return actionInfo.label;
  };

  return (
    <View style={[styles.container, { opacity: seatOpacity }, style]}>
      {/* Card backs - only show if not folded */}
      {!isFolded && (
        <View style={styles.cardsRow}>
          <View style={[styles.cardBack, { transform: [{ rotate: "-10deg" }] }]} />
          <View style={[styles.cardBack, styles.cardBackOverlap, { transform: [{ rotate: "10deg" }] }]} />
        </View>
      )}
      
      {/* Folded cards (grey, face down) */}
      {isFolded && (
        <View style={styles.cardsRow}>
          <View style={[styles.cardBackFolded, { transform: [{ rotate: "-10deg" }] }]} />
          <View style={[styles.cardBackFolded, styles.cardBackOverlap, { transform: [{ rotate: "10deg" }] }]} />
        </View>
      )}

      {/* Avatar with glow for active players */}
      <View style={[
        styles.avatar,
        isActive && !isFolded && styles.avatarActive,
        isFolded && styles.avatarFolded,
      ]}>
        <Text style={[styles.avatarText, isFolded && styles.avatarTextFolded]}>{initial}</Text>
        {position && (
          <View style={[styles.posBadge, isFolded && styles.posBadgeFolded]}>
            <Text style={styles.posText}>{position}</Text>
          </View>
        )}
      </View>

      {/* Info pill */}
      <View style={[styles.infoPill, isFolded && styles.infoPillFolded]}>
        <Text style={[styles.nameText, isFolded && styles.textFolded]}>{displayName}</Text>
        <Text style={[styles.stackText, isFolded && styles.textFolded]}>{stack}</Text>
      </View>

      {/* Action label (CHECK, FOLD, RAISE 2.3, etc.) */}
      {actionInfo && (
        <Animated.View 
          style={[
            styles.actionBadge, 
            { 
              backgroundColor: actionInfo.color, 
              opacity: actionOpacity,
              transform: [{ scale: actionScale }],
            }
          ]}
        >
          <Text style={styles.actionText}>{getActionLabel()}</Text>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    width: 70,
  },
  cardsRow: {
    flexDirection: "row",
    marginBottom: -6,
  },
  cardBack: {
    width: 44,
    height: 60,
    borderRadius: 8,
    backgroundColor: "#DC2626",
    borderWidth: 2,
    borderColor: "#FFF",
  },
  cardBackFolded: {
    width: 44,
    height: 60,
    borderRadius: 8,
    backgroundColor: "#374151",
    borderWidth: 2,
    borderColor: "#4B5563",
  },
  cardBackOverlap: {
    marginLeft: -24,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#1F2937",
    borderWidth: 2,
    borderColor: "#4B5563",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  avatarActive: {
    borderColor: colors.accentBlue,
    borderWidth: 2,
    shadowColor: colors.accentBlue,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 6,
    elevation: 4,
  },
  avatarFolded: {
    backgroundColor: "#111827",
    borderColor: "#374151",
  },
  avatarText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "700",
  },
  avatarTextFolded: {
    color: "#6B7280",
  },
  posBadge: {
    position: "absolute",
    top: -5,
    right: -12,
    backgroundColor: colors.accentBlue,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 5,
  },
  posBadgeFolded: {
    backgroundColor: "#4B5563",
  },
  posText: {
    color: "#FFF",
    fontSize: 8,
    fontWeight: "700",
  },
  infoPill: {
    marginTop: 3,
    backgroundColor: "rgba(0,0,0,0.9)",
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8,
    alignItems: "center",
  },
  infoPillFolded: {
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  nameText: {
    color: "#FFF",
    fontSize: 10,
    fontWeight: "500",
  },
  stackText: {
    color: colors.accentYellow,
    fontSize: 11,
    fontWeight: "700",
  },
  textFolded: {
    color: "#6B7280",
  },
  actionBadge: {
    marginTop: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 3,
  },
  actionText: {
    color: "#FFF",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
});
