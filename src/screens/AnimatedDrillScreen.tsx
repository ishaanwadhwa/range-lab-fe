import React, { useEffect, useState, useMemo, useCallback } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { TrainStackParamList } from "../navigation/RootNavigator";
import { colors } from "../theme/colors";
import { AnimatedPokerTable, AnimatedPlayerData } from "../components/AnimatedPokerTable";
import { ActionBar, ActionConfig } from "../components/ActionBar";
import { parseSpot, formatCards, validateSpot } from "../utils/SpotParser";
import { useTimeline } from "../utils/TimelineEngine";
import { SpotData, ProcessedSpot, Position } from "../types/spot";

// Import spots data
import spotsData from "../data/spots.json";

type Props = NativeStackScreenProps<TrainStackParamList, "AnimatedDrill">;

// All 6-max positions
const ALL_POSITIONS: Position[] = ["UTG", "MP", "CO", "BTN", "SB", "BB"];

export const AnimatedDrillScreen: React.FC<Props> = ({ navigation }) => {
  const [spotIndex, setSpotIndex] = useState(0);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  // Load current spot
  const rawSpot = spotsData.spots[spotIndex] as SpotData;

  // Parse spot
  const spot: ProcessedSpot | null = useMemo(() => {
    if (!validateSpot(rawSpot)) {
      console.error("Invalid spot data:", rawSpot);
      return null;
    }
    return parseSpot(rawSpot);
  }, [rawSpot]);

  // Timeline for animation
  const {
    state: timelineState,
    play: playTimeline,
    reset: resetTimeline,
  } = useTimeline({
    hist: rawSpot.hist,
    board: rawSpot.brd,
    initialPot: 0,
    onComplete: useCallback(() => {
      console.log("Timeline complete - decision time!");
    }, []),
  });

  // Convert to display format
  const heroHand = useMemo(() => {
    if (!spot) return ["??", "??"];
    return formatCards(spot.heroHand);
  }, [spot]);

  const board = useMemo(() => {
    if (!spot) return [];
    return spot.board;
  }, [spot]);

  // Build players for table with timeline state
  const players: AnimatedPlayerData[] = useMemo(() => {
    if (!spot) return [];

    return ALL_POSITIONS.map((pos) => {
      const spotPlayer = spot.players.find((p) => p.position === pos);
      const timelinePlayer = timelineState.playerStates.get(pos);

      return {
        id: pos,
        name: pos,
        position: pos,
        stack: spotPlayer?.stack ?? rawSpot.st,
        isHero: pos === spot.heroPosition,
        isFolded: timelinePlayer?.folded ?? false,
        lastAction: timelinePlayer?.lastAction,
      };
    });
  }, [spot, timelineState.playerStates, rawSpot.st]);

  // Convert options to ActionBar format - NO EV shown before decision
  const actions: ActionConfig[] = useMemo(() => {
    if (!spot) return [];

    return spot.options.map((opt) => ({
      id: opt.id,
      label: opt.label,
      subLabel: undefined,
      variant: "default" as const,
    }));
  }, [spot]);

  // Actions with EV revealed (after decision)
  const actionsWithEv: ActionConfig[] = useMemo(() => {
    if (!spot) return [];

    return spot.options.map((opt) => ({
      id: opt.id,
      label: opt.label,
      subLabel: opt.ev >= 0 ? `+${opt.ev.toFixed(1)}bb` : `${opt.ev.toFixed(1)}bb`,
      variant: opt.isCorrect ? "highlight" : (selectedAction === opt.id && !opt.isCorrect ? "danger" : "default"),
    }));
  }, [spot, selectedAction]);

  // Start replay on mount and spot change
  useEffect(() => {
    resetTimeline();
    setSelectedAction(null);
    setShowResult(false);
    setTimeout(() => playTimeline(), 200);
  }, [spotIndex]);

  const handleReplay = () => {
    setSelectedAction(null);
    setShowResult(false);
    resetTimeline();
    setTimeout(() => playTimeline(), 100);
  };

  const handleNextSpot = () => {
    const nextIdx = (spotIndex + 1) % spotsData.spots.length;
    setSpotIndex(nextIdx);
  };

  const handleActionSelect = (id: string) => {
    setSelectedAction(id);
    setShowResult(true);
  };

  if (!spot) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error loading spot</Text>
      </View>
    );
  }

  const isCorrect = spot.options.find((o) => o.id === selectedAction)?.isCorrect;
  const selectedEv = spot.options.find((o) => o.id === selectedAction)?.ev ?? 0;
  const bestEv = spot.options.find((o) => o.isCorrect)?.ev ?? 0;
  const evDiff = selectedEv - bestEv;

  // Use current pot from timeline, fallback to spot pot
  const displayPot = timelineState.currentPot > 0 ? timelineState.currentPot : spot.pot;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>‹</Text>
        </Pressable>
        <View style={styles.headerCenter}>
          <Text style={styles.title}>{spot.streetName} Decision</Text>
          <Text style={styles.subtitle}>
            {spot.heroPosition} vs {spot.villainsInHand.join(", ")} • Pot {displayPot.toFixed(0)}BB
          </Text>
        </View>
        <Pressable onPress={handleReplay} style={styles.replayBtn}>
          <Text style={styles.replayText}>↻</Text>
        </Pressable>
      </View>

      {/* Animated Table */}
      <View style={styles.tableArea}>
        <AnimatedPokerTable
          heroHand={heroHand}
          heroPosition={spot.heroPosition}
          board={board}
          visibleBoardCards={timelineState.visibleBoardCards}
          pot={displayPot}
          players={players}
          currentBet={timelineState.currentBet}
        />
      </View>

      {/* Result feedback */}
      {showResult && selectedAction && (
        <View style={styles.resultBanner}>
          <View>
            <Text
              style={[
                styles.resultText,
                isCorrect ? styles.resultCorrect : styles.resultWrong,
              ]}
            >
              {isCorrect ? "✓ Correct!" : "✗ Not optimal"}
            </Text>
            {!isCorrect && (
              <Text style={styles.evText}>
                EV loss: {Math.abs(evDiff).toFixed(1)}bb
              </Text>
            )}
          </View>
          <Pressable onPress={handleNextSpot} style={styles.nextBtn}>
            <Text style={styles.nextText}>Next →</Text>
          </Pressable>
        </View>
      )}

      {/* Action Bar - show EV only after decision */}
      <ActionBar
        phase={timelineState.phase === "decision" && !showResult ? "ready" : "replay"}
        actions={showResult ? actionsWithEv : actions}
        onSelectAction={handleActionSelect}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#333",
    alignItems: "center",
    justifyContent: "center",
  },
  backText: {
    color: "#fff",
    fontSize: 22,
    marginTop: -2,
  },
  headerCenter: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
  },
  subtitle: {
    color: "#888",
    fontSize: 12,
    marginTop: 2,
  },
  replayBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  replayText: {
    color: "#ccc",
    fontSize: 18,
  },
  tableArea: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  resultBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: "rgba(0,0,0,0.5)",
    marginHorizontal: 12,
    marginBottom: 8,
    borderRadius: 12,
  },
  resultText: {
    fontSize: 16,
    fontWeight: "700",
  },
  resultCorrect: {
    color: colors.accentGreen,
  },
  resultWrong: {
    color: colors.accentRed,
  },
  evText: {
    color: "#888",
    fontSize: 12,
    marginTop: 2,
  },
  nextBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: colors.accentBlue,
    borderRadius: 20,
  },
  nextText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  errorText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    marginTop: 100,
  },
});
