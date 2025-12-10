/**
 * AnimatedDrillScreen - Core training UI
 * "Dark Confidence" design
 */

import React, { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { View, Text, Pressable, StyleSheet, ActivityIndicator } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { TrainStackParamList } from "../navigation/RootNavigator";
import { BottomSheetRef } from "../components/BottomSheet";
import { colors } from "../theme/colors";
import { AnimatedPokerTable, AnimatedPlayerData } from "../components/AnimatedPokerTable";
import { ActionBar, ActionConfig } from "../components/ActionBar";
import { ExplanationSheet } from "../components/ExplanationSheet";
import { parseSpot, formatCards, validateSpot } from "../utils/SpotParser";
import { useTimeline } from "../utils/TimelineEngine";
import { SpotData, ProcessedSpot, Position } from "../types/spot";
import { fetchRandomSpot, SpotFilters } from "../api/spots";

// Fallback local data (for offline/dev)
import spotsData from "../data/spots.json";

type Props = NativeStackScreenProps<TrainStackParamList, "AnimatedDrill">;

// All 6-max positions
const ALL_POSITIONS: Position[] = ["UTG", "MP", "CO", "BTN", "SB", "BB"];

// Explanation state machine
type ExplainState = "hidden" | "sheet" | "chat";

export const AnimatedDrillScreen: React.FC<Props> = ({ navigation }) => {
  // Spot loading state
  const [rawSpot, setRawSpot] = useState<SpotData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [spotCount, setSpotCount] = useState(0);

  // Decision state
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  // Explanation state
  const [explainState, setExplainState] = useState<ExplainState>("hidden");
  const bottomSheetRef = useRef<BottomSheetRef>(null);

  // Default filters
  const filters: SpotFilters = {
    fmt: "6m",
  };

  // Fetch a new spot from API
  const loadSpot = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setSelectedAction(null);
    setShowResult(false);
    setExplainState("hidden");

    try {
      const spot = await fetchRandomSpot(filters);
      setRawSpot(spot as SpotData);
      setSpotCount((c) => c + 1);
    } catch (err) {
      console.error("[Drill] Failed to fetch spot:", err);
      
      // Fall back to local data
      const fallbackIdx = spotCount % spotsData.spots.length;
      const fallback = spotsData.spots[fallbackIdx] as SpotData;
      setRawSpot(fallback);
      setSpotCount((c) => c + 1);
      
      setError("Offline mode");
    } finally {
      setIsLoading(false);
    }
  }, [spotCount, filters]);

  // Load first spot on mount
  useEffect(() => {
    loadSpot();
  }, []);

  // Parse spot
  const spot: ProcessedSpot | null = useMemo(() => {
    if (!rawSpot) return null;
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
    hist: rawSpot?.hist ?? [],
    board: rawSpot?.brd ?? [],
    onComplete: useCallback(() => {
      console.log("Timeline complete - decision time!");
    }, []),
  });

  // Start replay when spot changes
  useEffect(() => {
    if (rawSpot && !isLoading) {
      resetTimeline();
      setTimeout(() => playTimeline(), 200);
    }
  }, [rawSpot, isLoading]);

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
    if (!spot || !rawSpot) return [];

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
        lastBetAmount: timelinePlayer?.lastBetAmount,
      };
    });
  }, [spot, rawSpot, timelineState.playerStates]);

  // Convert options to ActionBar format
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

  // Get selected and correct action labels
  const selectedActionLabel = useMemo(() => {
    if (!spot || !selectedAction) return "";
    return spot.options.find((o) => o.id === selectedAction)?.label || "";
  }, [spot, selectedAction]);

  const correctActionLabel = useMemo(() => {
    if (!spot) return "";
    return spot.options.find((o) => o.isCorrect)?.label || "";
  }, [spot]);

  const handleReplay = () => {
    setSelectedAction(null);
    setShowResult(false);
    setExplainState("hidden");
    resetTimeline();
    setTimeout(() => playTimeline(), 100);
  };

  const handleNextSpot = () => {
    loadSpot();
  };

  const handleActionSelect = (id: string) => {
    setSelectedAction(id);
    setShowResult(true);
  };

  // Explain handlers
  const handleOpenExplain = () => {
    setExplainState("sheet");
    bottomSheetRef.current?.open();
  };

  const handleCloseSheet = () => {
    setExplainState("hidden");
  };

  const handleAskQuestion = () => {
    bottomSheetRef.current?.close();
    
    // Navigate to chat screen after sheet closes
    setTimeout(() => {
      setExplainState("chat");
      if (spot && rawSpot) {
        navigation.navigate("ExplanationChat", {
          meta: rawSpot.meta,
          tags: rawSpot.tags,
          heroPosition: spot.heroPosition,
          street: spot.streetName,
          isCorrect: spot.options.find((o) => o.id === selectedAction)?.isCorrect ?? false,
          selectedAction: selectedActionLabel,
          correctAction: correctActionLabel,
        });
      }
    }, 300);
  };

  // Loading state
  if (isLoading && !rawSpot) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.loadingOrb}>
          <Text style={styles.loadingIcon}>♠</Text>
        </View>
        <Text style={styles.loadingText}>Loading spot...</Text>
      </View>
    );
  }

  if (!spot) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>⚠</Text>
          <Text style={styles.errorText}>Error loading spot</Text>
          <Pressable onPress={loadSpot} style={styles.retryBtn}>
            <Text style={styles.retryText}>TRY AGAIN</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  const isCorrect = spot.options.find((o) => o.id === selectedAction)?.isCorrect;
  const selectedEv = spot.options.find((o) => o.id === selectedAction)?.ev ?? 0;
  const bestEv = spot.options.find((o) => o.isCorrect)?.ev ?? 0;
  const evDiff = selectedEv - bestEv;

  const displayPot = timelineState.currentPot;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </Pressable>
        <View style={styles.headerCenter}>
          <Text style={styles.title}>{spot.streetName.toUpperCase()}</Text>
          <Text style={styles.subtitle}>
            {spot.heroPosition} vs {spot.villainsInHand.join(", ")} • {displayPot.toFixed(0)}BB pot
          </Text>
        </View>
        <Pressable onPress={handleReplay} style={styles.replayBtn}>
          <Text style={styles.replayText}>↻</Text>
        </Pressable>
      </View>

      {/* Offline indicator */}
      {error && (
        <View style={styles.offlineBanner}>
          <Text style={styles.offlineText}>📡 {error}</Text>
        </View>
      )}

      {/* Loading overlay */}
      {isLoading && rawSpot && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="small" color={colors.gold} />
        </View>
      )}

      {/* Animated Table */}
      <View style={styles.tableArea}>
        <AnimatedPokerTable
          key={spot.id}
          heroHand={heroHand}
          heroPosition={spot.heroPosition}
          board={board}
          visibleBoardCards={timelineState.visibleBoardCards}
          pot={displayPot}
          players={players}
          dealerPosition="BTN"
          currentBet={timelineState.currentBet}
        />
      </View>

      {/* Result feedback */}
      {showResult && selectedAction && (
        <View style={[styles.resultBanner, isCorrect ? styles.resultBannerCorrect : styles.resultBannerWrong]}>
          <View style={styles.resultLeft}>
            <Text style={styles.resultText}>
              {isCorrect ? "✓ CORRECT" : "✗ NOT OPTIMAL"}
            </Text>
            {!isCorrect && (
              <Text style={styles.evText}>
                EV loss: {Math.abs(evDiff).toFixed(1)}bb
              </Text>
            )}
          </View>
          
          <View style={styles.resultButtons}>
            {/* Explain button - Now functional */}
            <Pressable style={styles.explainBtn} onPress={handleOpenExplain}>
              <Text style={styles.explainIcon}>💡</Text>
              <Text style={styles.explainText}>Explain</Text>
            </Pressable>
            
            {/* Next button */}
            <Pressable onPress={handleNextSpot} style={styles.nextBtn}>
              <Text style={styles.nextText}>NEXT</Text>
            </Pressable>
          </View>
        </View>
      )}

      {/* Action Bar */}
      <ActionBar
        phase={timelineState.phase === "decision" && !showResult ? "ready" : "replay"}
        actions={showResult ? actionsWithEv : actions}
        onSelectAction={handleActionSelect}
      />

      {/* Explanation Bottom Sheet */}
      <ExplanationSheet
        ref={bottomSheetRef}
        meta={rawSpot?.meta}
        tags={rawSpot?.tags}
        isCorrect={isCorrect ?? false}
        selectedAction={selectedActionLabel}
        correctAction={correctActionLabel}
        onAskQuestion={handleAskQuestion}
        onClose={handleCloseSheet}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  
  // Loading
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingOrb: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: colors.goldDim,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  loadingIcon: {
    fontSize: 28,
    color: colors.gold,
  },
  loadingText: {
    color: colors.textMuted,
    fontSize: 14,
    letterSpacing: 1,
  },
  loadingOverlay: {
    position: "absolute",
    top: 60,
    right: 16,
    zIndex: 100,
  },
  
  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  backText: {
    color: colors.textSecondary,
    fontSize: 18,
  },
  headerCenter: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: 1,
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
  replayBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  replayText: {
    color: colors.textSecondary,
    fontSize: 18,
  },
  
  // Offline
  offlineBanner: {
    backgroundColor: colors.goldDim,
    paddingVertical: 6,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    borderRadius: 8,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: colors.gold,
  },
  offlineText: {
    color: colors.gold,
    fontSize: 12,
    textAlign: "center",
    fontWeight: "600",
  },
  
  // Table
  tableArea: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  
  // Result
  resultBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginHorizontal: 12,
    marginBottom: 8,
    borderRadius: 14,
    borderWidth: 1,
  },
  resultBannerCorrect: {
    backgroundColor: colors.greenDim,
    borderColor: colors.green,
  },
  resultBannerWrong: {
    backgroundColor: colors.redDim,
    borderColor: colors.red,
  },
  resultLeft: {
    flex: 1,
  },
  resultText: {
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 1,
    color: colors.textPrimary,
  },
  evText: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  resultButtons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  explainBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: colors.surface,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 6,
  },
  explainIcon: {
    fontSize: 14,
  },
  explainText: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: "600",
  },
  nextBtn: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    backgroundColor: colors.gold,
    borderRadius: 10,
  },
  nextText: {
    color: "#000",
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 1,
  },
  
  // Error
  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  errorIcon: {
    fontSize: 48,
    color: colors.textMuted,
    marginBottom: 16,
  },
  errorText: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 24,
  },
  retryBtn: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    backgroundColor: colors.gold,
    borderRadius: 12,
  },
  retryText: {
    color: "#000",
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 1,
  },
});
