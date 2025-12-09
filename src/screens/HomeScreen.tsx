/**
 * HomeScreen - Training Hub
 * "Dark Confidence" design
 */

import React from "react";
import { View, Text, Pressable, StyleSheet, Alert } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";
import { TrainStackParamList } from "../navigation/RootNavigator";
import { colors } from "../theme/colors";
import { resetOnboarding } from "../storage";

type Props = NativeStackScreenProps<TrainStackParamList, "Home">;

export const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const handleStartDrill = () => {
    navigation.navigate("AnimatedDrill");
  };

  // DEV ONLY: Reset onboarding
  const handleDevReset = async () => {
    await resetOnboarding();
    Alert.alert("Reset", "Restart app to see onboarding");
  };

  return (
    <View style={styles.container}>
      {/* Decorative background gradient */}
      <LinearGradient
        colors={["rgba(212, 168, 75, 0.05)", "transparent", "transparent"]}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 0.5 }}
      />
      
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>WELCOME BACK</Text>
          <Text style={styles.brandName}>RangeLab</Text>
        </View>
        <View style={styles.streak}>
          <Text style={styles.streakNumber}>4</Text>
          <Text style={styles.streakLabel}>day streak</Text>
        </View>
      </View>

      {/* Main content */}
      <View style={styles.content}>
        {/* Stats card */}
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>73%</Text>
            <Text style={styles.statLabel}>Accuracy</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>142</Text>
            <Text style={styles.statLabel}>Spots done</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>+2.1</Text>
            <Text style={styles.statLabel}>EV saved</Text>
          </View>
        </View>

        {/* Today's focus */}
        <View style={styles.focusSection}>
          <Text style={styles.sectionLabel}>TODAY'S FOCUS</Text>
          <View style={styles.focusCard}>
            <View style={styles.focusIcon}>
              <Text style={styles.focusIconText}>🎯</Text>
            </View>
            <View style={styles.focusContent}>
              <Text style={styles.focusTitle}>Turn Decisions</Text>
              <Text style={styles.focusDesc}>6-max · 100bb · IP as PFR</Text>
            </View>
            <Text style={styles.focusCount}>24</Text>
          </View>
        </View>

        {/* Suit decorations */}
        <Text style={styles.suitDecor}>♠ ♥ ♦ ♣</Text>
      </View>

      {/* CTA */}
      <View style={styles.ctaSection}>
        <Pressable
          style={({ pressed }) => [styles.ctaButton, pressed && styles.ctaPressed]}
          onPress={handleStartDrill}
        >
          <LinearGradient
            colors={[colors.gold, "#B8860B"]}
            style={styles.ctaGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.ctaText}>START TRAINING</Text>
          </LinearGradient>
        </Pressable>
        
        <Text style={styles.ctaHint}>~10 min session · 15 spots</Text>
      </View>

      {/* DEV Reset button */}
      {__DEV__ && (
        <Pressable onPress={handleDevReset} style={styles.devReset}>
          <Text style={styles.devResetText}>↻ Reset Onboarding</Text>
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  
  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 32,
  },
  greeting: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.textMuted,
    letterSpacing: 2,
  },
  brandName: {
    fontSize: 28,
    fontWeight: "900",
    color: colors.textPrimary,
    letterSpacing: -0.5,
  },
  streak: {
    alignItems: "center",
    backgroundColor: colors.goldDim,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.gold,
  },
  streakNumber: {
    fontSize: 22,
    fontWeight: "900",
    color: colors.gold,
  },
  streakLabel: {
    fontSize: 10,
    color: colors.gold,
    letterSpacing: 0.5,
  },
  
  // Content
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  
  // Stats card
  statsCard: {
    flexDirection: "row",
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontSize: 28,
    fontWeight: "900",
    color: colors.textPrimary,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.border,
    marginHorizontal: 8,
  },
  
  // Focus section
  focusSection: {
    marginTop: 32,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.gold,
    letterSpacing: 2,
    marginBottom: 12,
  },
  focusCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 14,
  },
  focusIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.goldDim,
    alignItems: "center",
    justifyContent: "center",
  },
  focusIconText: {
    fontSize: 22,
  },
  focusContent: {
    flex: 1,
  },
  focusTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  focusDesc: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 2,
  },
  focusCount: {
    fontSize: 24,
    fontWeight: "900",
    color: colors.gold,
  },
  
  // Decorations
  suitDecor: {
    textAlign: "center",
    fontSize: 24,
    color: colors.border,
    letterSpacing: 16,
    marginTop: 40,
  },
  
  // CTA
  ctaSection: {
    paddingHorizontal: 24,
    paddingBottom: 120,
  },
  ctaButton: {
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: colors.gold,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  ctaPressed: {
    transform: [{ scale: 0.98 }],
    shadowOpacity: 0.2,
  },
  ctaGradient: {
    paddingVertical: 20,
    alignItems: "center",
  },
  ctaText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#000",
    letterSpacing: 2,
  },
  ctaHint: {
    textAlign: "center",
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 12,
  },
  
  // Dev reset
  devReset: {
    position: "absolute",
    bottom: 100,
    left: 24,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: colors.redDim,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.red,
  },
  devResetText: {
    color: colors.red,
    fontSize: 11,
    fontWeight: "600",
  },
});
