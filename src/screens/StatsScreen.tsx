/**
 * StatsScreen - Progress & Analytics
 * "Dark Confidence" design
 */

import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { colors } from "../theme/colors";

interface StatCard {
  id: string;
  label: string;
  value: string;
  subtext?: string;
  trend?: "up" | "down" | "neutral";
}

const STATS: StatCard[] = [
  { id: "accuracy", label: "ACCURACY", value: "73%", subtext: "Last 7 days", trend: "up" },
  { id: "streak", label: "STREAK", value: "4", subtext: "days", trend: "up" },
  { id: "spots", label: "SPOTS", value: "142", subtext: "Total completed" },
  { id: "ev", label: "EV SAVED", value: "+8.3", subtext: "bb total", trend: "up" },
];

const RECENT_SESSIONS = [
  { date: "Today", spots: 12, accuracy: 75, evLoss: -0.4 },
  { date: "Yesterday", spots: 18, accuracy: 72, evLoss: -0.6 },
  { date: "Dec 5", spots: 15, accuracy: 80, evLoss: -0.2 },
];

export const StatsScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerLabel}>ANALYTICS</Text>
        <Text style={styles.headerTitle}>Your Progress</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Stats grid */}
        <View style={styles.statsGrid}>
          {STATS.map((stat) => (
            <View key={stat.id} style={styles.statCard}>
              <Text style={styles.statLabel}>{stat.label}</Text>
              <View style={styles.statValueRow}>
                <Text style={styles.statValue}>{stat.value}</Text>
                {stat.trend === "up" && <Text style={styles.trendUp}>↑</Text>}
                {stat.trend === "down" && <Text style={styles.trendDown}>↓</Text>}
              </View>
              {stat.subtext && (
                <Text style={styles.statSubtext}>{stat.subtext}</Text>
              )}
            </View>
          ))}
        </View>

        {/* Recent sessions */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>RECENT SESSIONS</Text>
          
          {RECENT_SESSIONS.map((session, idx) => (
            <View key={idx} style={styles.sessionRow}>
              <View style={styles.sessionDate}>
                <Text style={styles.sessionDateText}>{session.date}</Text>
              </View>
              <View style={styles.sessionStats}>
                <View style={styles.sessionStat}>
                  <Text style={styles.sessionStatValue}>{session.spots}</Text>
                  <Text style={styles.sessionStatLabel}>spots</Text>
                </View>
                <View style={styles.sessionStat}>
                  <Text style={styles.sessionStatValue}>{session.accuracy}%</Text>
                  <Text style={styles.sessionStatLabel}>accuracy</Text>
                </View>
                <View style={styles.sessionStat}>
                  <Text style={[
                    styles.sessionStatValue,
                    session.evLoss < 0 ? styles.evNegative : styles.evPositive
                  ]}>
                    {session.evLoss > 0 ? "+" : ""}{session.evLoss}
                  </Text>
                  <Text style={styles.sessionStatLabel}>EV</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Insights */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>INSIGHTS</Text>
          
          <View style={styles.insightCard}>
            <View style={styles.insightIcon}>
              <Text style={styles.insightIconText}>💡</Text>
            </View>
            <View style={styles.insightContent}>
              <Text style={styles.insightTitle}>Biggest Leak</Text>
              <Text style={styles.insightText}>
                Over-folding river vs small bets
              </Text>
            </View>
          </View>
          
          <View style={styles.insightCard}>
            <View style={styles.insightIcon}>
              <Text style={styles.insightIconText}>🎯</Text>
            </View>
            <View style={styles.insightContent}>
              <Text style={styles.insightTitle}>Strongest Area</Text>
              <Text style={styles.insightText}>
                C-betting accuracy is above average
              </Text>
            </View>
          </View>
        </View>

        {/* Decorative */}
        <Text style={styles.suitDecor}>♠ ♥ ♦ ♣</Text>
      </ScrollView>
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
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
  },
  headerLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.gold,
    letterSpacing: 2,
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "900",
    color: colors.textPrimary,
    letterSpacing: -0.5,
  },
  
  // Scroll
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 120,
  },
  
  // Stats grid
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 32,
  },
  statCard: {
    width: "48%",
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.textMuted,
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  statValueRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statValue: {
    fontSize: 32,
    fontWeight: "900",
    color: colors.textPrimary,
  },
  trendUp: {
    fontSize: 18,
    color: colors.green,
    fontWeight: "700",
  },
  trendDown: {
    fontSize: 18,
    color: colors.red,
    fontWeight: "700",
  },
  statSubtext: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 4,
  },
  
  // Sections
  section: {
    marginBottom: 32,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.gold,
    letterSpacing: 2,
    marginBottom: 16,
  },
  
  // Session rows
  sessionRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sessionDate: {
    width: 80,
  },
  sessionDateText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  sessionStats: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  sessionStat: {
    alignItems: "center",
  },
  sessionStatValue: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  sessionStatLabel: {
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 2,
  },
  evPositive: {
    color: colors.green,
  },
  evNegative: {
    color: colors.red,
  },
  
  // Insight cards
  insightCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 14,
  },
  insightIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.goldDim,
    alignItems: "center",
    justifyContent: "center",
  },
  insightIconText: {
    fontSize: 20,
  },
  insightContent: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 13,
    color: colors.textMuted,
    marginBottom: 2,
  },
  insightText: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  
  // Decorative
  suitDecor: {
    textAlign: "center",
    fontSize: 18,
    color: colors.border,
    letterSpacing: 12,
    marginTop: 16,
  },
});
