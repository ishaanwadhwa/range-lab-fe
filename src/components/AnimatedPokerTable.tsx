import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Seat, PositionLabel } from "./Seat";
import { AnimatedBoardCards } from "./AnimatedBoardCards";
import { HeroHand } from "./HeroHand";
import { AnimatedPot } from "./AnimatedPot";
import { BetChip } from "./BetChip";
import { DealerButton } from "./DealerButton";
import { colors } from "../theme/colors";
import { Position } from "../types/spot";
import { getSeatSlot, SEAT_LAYOUTS, getChipStartOffset, SeatSlot } from "../utils/seatRotation";

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
  currentBet?: {
    position: Position;
    amount: number;
  } | null;
}

export const AnimatedPokerTable: React.FC<AnimatedPokerTableProps> = ({
  heroHand,
  heroPosition,
  board,
  visibleBoardCards,
  pot,
  players,
  currentBet,
}) => {
  const hero = players.find((p) => p.isHero);
  const villains = players.filter((p) => !p.isHero);

  // Chip animation state
  const [chipVisible, setChipVisible] = useState(false);
  const [chipStart, setChipStart] = useState({ x: 0, y: 0 });
  const [chipAmount, setChipAmount] = useState(0);

  // Trigger chip animation when bet changes
  useEffect(() => {
    if (currentBet && currentBet.amount > 0) {
      const slot = getSeatSlot(currentBet.position, heroPosition);
      const offset = getChipStartOffset(slot);
      setChipStart(offset);
      setChipAmount(currentBet.amount);
      setChipVisible(true);
    }
  }, [currentBet, heroPosition]);

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
              
              {/* Chip animation - positioned relative to pot */}
              <BetChip
                amount={chipAmount}
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
          const layout = SEAT_LAYOUTS[slot];

          return (
            <View
              key={player.id}
              style={[
                styles.seatSlot,
                {
                  top: layout.top,
                  left: layout.left,
                  transform: [{ translateX: -35 }, { translateY: -30 }],
                },
              ]}
            >
              <Seat
                name={player.position} // Show position as name
                stack={`${player.stack.toFixed(0)}BB`}
                position={player.position as PositionLabel}
                lastAction={player.lastAction}
                isFolded={player.isFolded}
                isActive={!player.isFolded}
              />
            </View>
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
          <DealerButton style={styles.dealerBtn} />
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
});
