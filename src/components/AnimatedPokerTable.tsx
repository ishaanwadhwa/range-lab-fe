import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Seat, PositionLabel } from "./Seat";
import { AnimatedBoardCards } from "./AnimatedBoardCards";
import { HeroHand } from "./HeroHand";
import { AnimatedPot } from "./AnimatedPot";
import { PlayerBetChips } from "./PlayerBetChips";
import { BetChip, BetAction } from "./BetChip";
import { DealerButton } from "./DealerButton";
import { colors } from "../theme/colors";
import { Position } from "../types/spot";
import { getSeatSlot, SEAT_LAYOUTS, CHIP_LAYOUTS, getChipStartOffset } from "../utils/seatRotation";

export interface AnimatedPlayerData {
  id: string;
  name: string;
  stack: number;
  position: Position;
  isHero: boolean;
  isFolded: boolean;
  lastAction?: string;
  lastBetAmount?: number;
}

export interface AnimatedPokerTableProps {
  heroHand: string[];
  heroPosition: Position;
  board: string[];
  visibleBoardCards: number;
  pot: number;
  players: AnimatedPlayerData[];
  dealerPosition?: Position;  // Who has the dealer button
  currentBet?: {
    position: Position;
    exactAmount: number;
    roundedAmount: number;  // For visual chip animation
    action: string;
  } | null;
}

export const AnimatedPokerTable: React.FC<AnimatedPokerTableProps> = ({
  heroHand,
  heroPosition,
  board,
  visibleBoardCards,
  pot,
  players,
  dealerPosition = "BTN",  // Default to BTN
  currentBet,
}) => {
  const hero = players.find((p) => p.isHero);
  const villains = players.filter((p) => !p.isHero);
  
  // Is hero the dealer?
  const heroIsDealer = heroPosition === dealerPosition;

  // Chip animation state for sliding to pot
  const [chipVisible, setChipVisible] = useState(false);
  const [chipStart, setChipStart] = useState({ x: 0, y: 0 });
  const [chipAmount, setChipAmount] = useState(0);
  const [chipAction, setChipAction] = useState<BetAction>("b");
  const [chipKey, setChipKey] = useState(0); // Unique key to force re-render

  // Trigger chip slide animation when bet changes
  // Uses roundedAmount for visual display per UPDATED_CONTEXT.MD
  useEffect(() => {
    if (currentBet && currentBet.roundedAmount > 0) {
      // First hide any existing chip
      setChipVisible(false);
      
      // Use timeout to ensure state reset before showing new chip
      const timer = setTimeout(() => {
        const slot = getSeatSlot(currentBet.position, heroPosition);
        const offset = getChipStartOffset(slot);
        setChipStart(offset);
        setChipAmount(currentBet.roundedAmount);  // Use rounded for visual
        setChipAction((currentBet.action as BetAction) || "b");
        setChipKey(prev => prev + 1); // Increment key to force re-mount
        setChipVisible(true);
      }, 50);
      
      return () => clearTimeout(timer);
    } else {
      setChipVisible(false);
    }
  }, [currentBet?.position, currentBet?.roundedAmount, currentBet?.action, heroPosition]);

  const handleChipAnimationComplete = () => {
    setChipVisible(false);
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.tableContainer}>
        {/* Table felt */}
        <View style={styles.rail}>
          <LinearGradient
            colors={[colors.tableFeltStart, colors.tableFeltEnd]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={styles.felt}
          >
            {/* Animated board cards */}
            <View style={styles.boardArea}>
              <AnimatedBoardCards cards={board} visibleCount={visibleBoardCards} />
            </View>

            {/* Animated pot */}
            <View style={styles.potArea}>
              <AnimatedPot amount={pot} />
              
              {/* Chip sliding animation - positioned relative to pot */}
              <BetChip
                key={`bet-chip-${chipKey}`}
                amount={chipAmount}
                action={chipAction}
                startX={chipStart.x}
                startY={chipStart.y}
                visible={chipVisible}
                onAnimationComplete={handleChipAnimationComplete}
              />
            </View>
          </LinearGradient>
        </View>

        {/* Villain seats - rotated based on hero position */}
        {villains.map((player) => {
          const slot = getSeatSlot(player.position, heroPosition);
          const seatLayout = SEAT_LAYOUTS[slot];
          const chipLayout = CHIP_LAYOUTS[slot];
          const hasBet = player.lastBetAmount && player.lastBetAmount > 0;
          const isDealer = player.position === dealerPosition;

          return (
            <React.Fragment key={player.id}>
              {/* Seat */}
              <View
                style={[
                  styles.seatSlot,
                  {
                    top: seatLayout.top,
                    left: seatLayout.left,
                    transform: [{ translateX: -35 }, { translateY: -30 }],
                  },
                ]}
              >
                <Seat
                  name={player.position}
                  stack={`${player.stack.toFixed(0)}BB`}
                  position={player.position as PositionLabel}
                  lastAction={player.lastAction}
                  lastBetAmount={player.lastBetAmount}
                  isFolded={player.isFolded}
                  isActive={!player.isFolded}
                />
                {/* Dealer button on villain */}
                {isDealer && (
                  <DealerButton style={styles.villainDealerBtn} />
                )}
              </View>

              {/* Bet chips in front of player */}
              {hasBet && (
                <View
                  style={[
                    styles.chipSlot,
                    {
                      top: chipLayout.top,
                      left: chipLayout.left,
                      transform: [{ translateX: -20 }, { translateY: -10 }],
                    },
                  ]}
                >
                  <PlayerBetChips
                    amount={player.lastBetAmount || 0}
                    visible={true}
                  />
                </View>
              )}
            </React.Fragment>
          );
        })}

        {/* Hero section - always at bottom */}
        <View style={styles.heroArea}>
          <HeroHand cards={heroHand} />
          <View style={styles.heroInfo}>
            <View style={styles.heroPosTag}>
              <Text style={styles.heroPosText}>{heroPosition}</Text>
            </View>
            <Text style={styles.heroName}>{hero?.name || "Hero"}</Text>
            <Text style={styles.heroStack}>{hero?.stack.toFixed(0) || "100"}BB</Text>
          </View>
          {/* Only show dealer button if hero is BTN */}
          {heroIsDealer && <DealerButton style={styles.dealerBtn} />}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
  },
  tableContainer: {
    width: "100%",
    aspectRatio: 0.58,
    position: "relative",
  },
  rail: {
    position: "absolute",
    top: "5%",
    left: "14%",
    right: "14%",
    bottom: "14%",
    borderRadius: 999,
    backgroundColor: colors.tableRail,
    borderWidth: 4,
    borderColor: colors.tableRailBorder,
    padding: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
  },
  felt: {
    flex: 1,
    borderRadius: 999,
    justifyContent: "center",
    alignItems: "center",
  },
  boardArea: {
    marginBottom: 8,
  },
  potArea: {
    marginTop: 4,
    position: "relative",
  },
  seatSlot: {
    position: "absolute",
    zIndex: 10,
  },
  chipSlot: {
    position: "absolute",
    zIndex: 15,
  },
  heroArea: {
    position: "absolute",
    bottom: "10%",
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 20,
  },
  heroInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    gap: 6,
  },
  heroPosTag: {
    backgroundColor: colors.accentBlue,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  heroPosText: {
    color: "#FFF",
    fontSize: 10,
    fontWeight: "700",
  },
  heroName: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  heroStack: {
    color: colors.accentYellow,
    fontSize: 12,
    fontWeight: "700",
  },
  dealerBtn: {
    position: "absolute",
    top: -10,
    right: "30%",
  },
  villainDealerBtn: {
    position: "absolute",
    top: -8,
    right: -8,
  },
});
