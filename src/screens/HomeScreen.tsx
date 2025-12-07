import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";
import { TrainStackParamList } from "../navigation/RootNavigator";
import { colors } from "../theme/colors";

type Props = NativeStackScreenProps<TrainStackParamList, "Home">;

export const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const handleStartDrill = () => {
    navigation.navigate("AnimatedDrill");
  };

  return (
    <View style={styles.container}>
      {/* Hero section */}
      <View style={styles.hero}>
        {/* Logo / brand */}
        <View style={styles.logoContainer}>
          <Text style={styles.logoEmoji}>♠️</Text>
          <Text style={styles.logoText}>RangeLab</Text>
        </View>

        {/* Tagline */}
        <Text style={styles.tagline}>Train your poker decisions</Text>

        {/* Quick stats row */}
        <View style={styles.quickStats}>
          <View style={styles.statPill}>
            <Text style={styles.statValue}>4</Text>
            <Text style={styles.statLabel}>day streak</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statPill}>
            <Text style={styles.statValue}>73%</Text>
            <Text style={styles.statLabel}>accuracy</Text>
          </View>
        </View>
      </View>

      {/* Main CTA */}
      <View style={styles.ctaContainer}>
        <Pressable
          onPress={handleStartDrill}
          style={({ pressed }) => [
            styles.ctaButton,
            pressed && styles.ctaButtonPressed
          ]}
        >
          <LinearGradient
            colors={["#3B82F6", "#2563EB"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.ctaGradient}
          >
            <Text style={styles.ctaIcon}>▶︎</Text>
            <Text style={styles.ctaText}>Start Training</Text>
          </LinearGradient>
        </Pressable>

        {/* Session info */}
        <Text style={styles.sessionHint}>
          Turn spots · 6-max · 100bb
        </Text>
      </View>

      {/* Bottom decorative element */}
      <View style={styles.bottomDecor}>
        <View style={styles.decorCard}>
          <Text style={styles.decorCardText}>A♠</Text>
        </View>
        <View style={[styles.decorCard, styles.decorCard2]}>
          <Text style={styles.decorCardText}>K♥</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 24
  },
  hero: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 40
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8
  },
  logoEmoji: {
    fontSize: 36,
    marginRight: 12
  },
  logoText: {
    fontSize: 36,
    fontWeight: "800",
    color: "#ffffff",
    letterSpacing: -1
  },
  tagline: {
    fontSize: 17,
    color: "#6B7280",
    marginBottom: 32
  },
  quickStats: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)"
  },
  statPill: {
    alignItems: "center",
    paddingHorizontal: 16
  },
  statValue: {
    fontSize: 22,
    fontWeight: "700",
    color: "#ffffff"
  },
  statLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: "rgba(255,255,255,0.1)"
  },
  ctaContainer: {
    alignItems: "center",
    paddingBottom: 120
  },
  ctaButton: {
    borderRadius: 28,
    shadowColor: "#3B82F6",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8
  },
  ctaButtonPressed: {
    transform: [{ scale: 0.97 }],
    shadowOpacity: 0.2
  },
  ctaGradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 28
  },
  ctaIcon: {
    fontSize: 18,
    color: "#ffffff",
    marginRight: 10
  },
  ctaText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#ffffff",
    letterSpacing: 0.3
  },
  sessionHint: {
    fontSize: 13,
    color: "#4B5563",
    marginTop: 16
  },
  bottomDecor: {
    position: "absolute",
    bottom: 100,
    right: 24,
    flexDirection: "row"
  },
  decorCard: {
    width: 44,
    height: 60,
    backgroundColor: "rgba(255,255,255,0.03)",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    alignItems: "center",
    justifyContent: "center",
    transform: [{ rotate: "8deg" }]
  },
  decorCard2: {
    marginLeft: -20,
    transform: [{ rotate: "-4deg" }]
  },
  decorCardText: {
    fontSize: 14,
    fontWeight: "600",
    color: "rgba(255,255,255,0.15)"
  }
});
