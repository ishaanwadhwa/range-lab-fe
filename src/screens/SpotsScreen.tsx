import React from "react";
import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { colors } from "../theme/colors";

interface SpotPack {
  id: string;
  title: string;
  subtitle: string;
  count: number;
  emoji: string;
}

const MOCK_PACKS: SpotPack[] = [
  {
    id: "btn_bb_turn",
    title: "BTN vs BB",
    subtitle: "Turn SRP",
    count: 24,
    emoji: "🎯"
  },
  {
    id: "co_bb_river",
    title: "CO vs BB",
    subtitle: "River spots",
    count: 18,
    emoji: "🌊"
  },
  {
    id: "3bet_pots",
    title: "3-Bet Pots",
    subtitle: "IP as PFR",
    count: 32,
    emoji: "🔥"
  },
  {
    id: "squeeze_spots",
    title: "Squeeze Pots",
    subtitle: "Advanced",
    count: 12,
    emoji: "💎"
  }
];

export const SpotsScreen: React.FC = () => {
  const handlePackPress = (pack: SpotPack) => {
    console.log("Selected pack:", pack.id);
    // TODO: Navigate to drill with this pack
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Spot Library</Text>
        <Text style={styles.headerSubtitle}>
          Choose what you want to train
        </Text>
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
            onPress={() => handlePackPress(pack)}
            style={({ pressed }) => [
              styles.packCard,
              pressed && styles.packCardPressed
            ]}
          >
            <View style={styles.packEmoji}>
              <Text style={styles.packEmojiText}>{pack.emoji}</Text>
            </View>
            <View style={styles.packInfo}>
              <Text style={styles.packTitle}>{pack.title}</Text>
              <Text style={styles.packSubtitle}>{pack.subtitle}</Text>
            </View>
            <View style={styles.packCount}>
              <Text style={styles.packCountText}>{pack.count}</Text>
              <Text style={styles.packCountLabel}>spots</Text>
            </View>
          </Pressable>
        ))}

        {/* Coming soon hint */}
        <View style={styles.comingSoon}>
          <Text style={styles.comingSoonText}>More packs coming soon</Text>
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
  packCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#111827",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#1F2937"
  },
  packCardPressed: {
    backgroundColor: "#1F2937",
    transform: [{ scale: 0.98 }]
  },
  packEmoji: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#1F2937",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14
  },
  packEmojiText: {
    fontSize: 22
  },
  packInfo: {
    flex: 1
  },
  packTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: 2
  },
  packSubtitle: {
    fontSize: 14,
    color: "#6B7280"
  },
  packCount: {
    alignItems: "center",
    paddingLeft: 12
  },
  packCountText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#3B82F6"
  },
  packCountLabel: {
    fontSize: 11,
    color: "#6B7280",
    textTransform: "uppercase",
    letterSpacing: 0.5
  },
  comingSoon: {
    alignItems: "center",
    paddingVertical: 24
  },
  comingSoonText: {
    fontSize: 13,
    color: "#4B5563",
    fontStyle: "italic"
  }
});

