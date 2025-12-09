/**
 * SpotsScreen - Spot Library
 * "Dark Confidence" design
 */

import React from "react";
import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { colors } from "../theme/colors";

interface SpotPack {
  id: string;
  title: string;
  subtitle: string;
  count: number;
  icon: string;
  difficulty: "easy" | "medium" | "hard";
}

const MOCK_PACKS: SpotPack[] = [
  {
    id: "btn_bb_turn",
    title: "BTN vs BB",
    subtitle: "Turn SRP",
    count: 24,
    icon: "♠",
    difficulty: "medium",
  },
  {
    id: "co_bb_river",
    title: "CO vs BB",
    subtitle: "River spots",
    count: 18,
    icon: "♥",
    difficulty: "hard",
  },
  {
    id: "3bet_pots",
    title: "3-Bet Pots",
    subtitle: "IP as PFR",
    count: 32,
    icon: "♦",
    difficulty: "hard",
  },
  {
    id: "bb_defense",
    title: "BB Defense",
    subtitle: "vs BTN open",
    count: 28,
    icon: "♣",
    difficulty: "medium",
  },
  {
    id: "squeeze_spots",
    title: "Squeeze Pots",
    subtitle: "Multiway",
    count: 12,
    icon: "♠",
    difficulty: "hard",
  },
];

const getDifficultyColor = (diff: SpotPack["difficulty"]) => {
  switch (diff) {
    case "easy": return colors.green;
    case "medium": return colors.gold;
    case "hard": return colors.red;
  }
};

export const SpotsScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerLabel}>LIBRARY</Text>
        <Text style={styles.headerTitle}>Spot Packs</Text>
        <Text style={styles.headerDesc}>
          Choose what you want to train
        </Text>
      </View>

      {/* Filter chips */}
      <View style={styles.filters}>
        <Pressable style={[styles.filterChip, styles.filterChipActive]}>
          <Text style={[styles.filterText, styles.filterTextActive]}>All</Text>
        </Pressable>
        <Pressable style={styles.filterChip}>
          <Text style={styles.filterText}>IP</Text>
        </Pressable>
        <Pressable style={styles.filterChip}>
          <Text style={styles.filterText}>OOP</Text>
        </Pressable>
        <Pressable style={styles.filterChip}>
          <Text style={styles.filterText}>3-Bet</Text>
        </Pressable>
      </View>

      {/* Pack list */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {MOCK_PACKS.map((pack) => (
          <Pressable
            key={pack.id}
            style={({ pressed }) => [
              styles.packCard,
              pressed && styles.packCardPressed,
            ]}
          >
            {/* Icon */}
            <View style={styles.packIcon}>
              <Text style={styles.packIconText}>{pack.icon}</Text>
            </View>
            
            {/* Content */}
            <View style={styles.packContent}>
              <Text style={styles.packTitle}>{pack.title}</Text>
              <Text style={styles.packSubtitle}>{pack.subtitle}</Text>
            </View>
            
            {/* Meta */}
            <View style={styles.packMeta}>
              <View style={[styles.diffDot, { backgroundColor: getDifficultyColor(pack.difficulty) }]} />
              <Text style={styles.packCount}>{pack.count}</Text>
            </View>
          </Pressable>
        ))}

        {/* Coming soon hint */}
        <View style={styles.comingSoon}>
          <Text style={styles.suitDecor}>♠ ♥ ♦ ♣</Text>
          <Text style={styles.comingSoonText}>More packs coming soon</Text>
        </View>
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
    paddingBottom: 20,
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
  headerDesc: {
    fontSize: 14,
    color: colors.textMuted,
    marginTop: 4,
  },
  
  // Filters
  filters: {
    flexDirection: "row",
    paddingHorizontal: 24,
    gap: 10,
    marginBottom: 20,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: colors.surface,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterChipActive: {
    backgroundColor: colors.goldDim,
    borderColor: colors.gold,
  },
  filterText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  filterTextActive: {
    color: colors.gold,
  },
  
  // Scroll
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 120,
  },
  
  // Pack card
  packCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 14,
  },
  packCardPressed: {
    backgroundColor: colors.surfaceLight,
    transform: [{ scale: 0.99 }],
  },
  packIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.goldDim,
    alignItems: "center",
    justifyContent: "center",
  },
  packIconText: {
    fontSize: 22,
    color: colors.gold,
  },
  packContent: {
    flex: 1,
  },
  packTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  packSubtitle: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 2,
  },
  packMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  diffDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  packCount: {
    fontSize: 20,
    fontWeight: "900",
    color: colors.textSecondary,
  },
  
  // Coming soon
  comingSoon: {
    alignItems: "center",
    paddingVertical: 32,
  },
  suitDecor: {
    fontSize: 18,
    color: colors.border,
    letterSpacing: 12,
    marginBottom: 12,
  },
  comingSoonText: {
    fontSize: 13,
    color: colors.textMuted,
  },
});
