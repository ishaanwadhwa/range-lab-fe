import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { colors } from "../theme/colors";

interface StatCard {
  id: string;
  label: string;
  value: string;
  subtext?: string;
  color: string;
}

const MOCK_STATS: StatCard[] = [
  {
    id: "accuracy",
    label: "Accuracy",
    value: "73%",
    subtext: "Last 7 days",
    color: "#10B981" // green
  },
  {
    id: "streak",
    label: "Current Streak",
    value: "4",
    subtext: "days",
    color: "#F59E0B" // amber
  },
  {
    id: "spots_today",
    label: "Spots Today",
    value: "12",
    color: "#3B82F6" // blue
  },
  {
    id: "ev_loss",
    label: "Avg EV Loss",
    value: "0.8bb",
    subtext: "Per mistake",
    color: "#EF4444" // red
  }
];

export const StatsScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Your Progress</Text>
        <Text style={styles.headerSubtitle}>Keep grinding 💪</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Stats grid */}
        <View style={styles.statsGrid}>
          {MOCK_STATS.map((stat) => (
            <View key={stat.id} style={styles.statCardWrapper}>
              <View style={styles.statCard}>
                <Text style={styles.statLabel}>{stat.label}</Text>
                <Text style={[styles.statValue, { color: stat.color }]}>
                  {stat.value}
                </Text>
                {stat.subtext && (
                  <Text style={styles.statSubtext}>{stat.subtext}</Text>
                )}
              </View>
            </View>
          ))}
        </View>

        {/* Recent activity placeholder */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Sessions</Text>
          <View style={styles.placeholder}>
            <Text style={styles.placeholderEmoji}>📊</Text>
            <Text style={styles.placeholderText}>
              Session history coming soon
            </Text>
            <Text style={styles.placeholderSubtext}>
              Complete more drills to see your progress over time
            </Text>
          </View>
        </View>

        {/* Insights placeholder */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Insights</Text>
          <View style={styles.insightCard}>
            <Text style={styles.insightEmoji}>💡</Text>
            <View style={styles.insightContent}>
              <Text style={styles.insightTitle}>Most common leak</Text>
              <Text style={styles.insightText}>
                Overfolding river vs small bets
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#ffffff",
    marginBottom: 4
  },
  headerSubtitle: {
    fontSize: 15,
    color: "#9CA3AF",
    fontWeight: "400"
  },
  scrollView: {
    flex: 1
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 32
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -6,
    marginBottom: 24
  },
  statCardWrapper: {
    width: "50%",
    padding: 6
  },
  statCard: {
    backgroundColor: "#111827",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#1F2937"
  },
  statLabel: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5
  },
  statValue: {
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 2
  },
  statSubtext: {
    fontSize: 12,
    color: "#4B5563"
  },
  section: {
    marginBottom: 24
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: 12
  },
  placeholder: {
    backgroundColor: "#111827",
    borderRadius: 16,
    padding: 32,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#1F2937"
  },
  placeholderEmoji: {
    fontSize: 40,
    marginBottom: 12
  },
  placeholderText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#9CA3AF",
    marginBottom: 4
  },
  placeholderSubtext: {
    fontSize: 13,
    color: "#4B5563",
    textAlign: "center",
    lineHeight: 18
  },
  insightCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#111827",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#1F2937"
  },
  insightEmoji: {
    fontSize: 28,
    marginRight: 14
  },
  insightContent: {
    flex: 1
  },
  insightTitle: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 2
  },
  insightText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff"
  }
});

