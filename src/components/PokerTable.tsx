import React from "react";
import { View, Text, StyleSheet, DimensionValue } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Seat, SeatStatus, PositionLabel } from "./Seat";
import { BoardCards } from "./BoardCards";
import { HeroHand } from "./HeroHand";
import { PotDisplay } from "./PotDisplay";
import { DealerButton } from "./DealerButton";
import { colors } from "../theme/colors";

export interface PlayerData {
  id: string;
  name: string;
  stack: string;
  status?: SeatStatus;
  position?: PositionLabel;
  isHero?: boolean;
  cards?: string[];
  equity?: number;
}

export interface PokerTableProps {
  heroHand: string[];
  board: string[];
  pot: string;
  players?: PlayerData[];
  dealerSeat?: number;
}

interface SeatPosition {
  top: DimensionValue;
  left: DimensionValue;
  alignItems: "flex-start" | "center" | "flex-end";
}

// 6-max positions adjusted for vertical ellipse
const SEAT_POSITIONS: SeatPosition[] = [
  { top: "6%", left: "50%", alignItems: "center" },      // 0: Top - moved down
  { top: "22%", left: "85%", alignItems: "flex-start" }, // 1: Top-right
  { top: "52%", left: "85%", alignItems: "flex-start" }, // 2: Bottom-right
  { top: "72%", left: "50%", alignItems: "center" },     // 3: Hero (bottom)
  { top: "52%", left: "15%", alignItems: "flex-end" },   // 4: Bottom-left
  { top: "22%", left: "15%", alignItems: "flex-end" },   // 5: Top-left
];

const DEFAULT_PLAYERS: PlayerData[] = [
  { id: "1", name: "keva123", stack: "37.23", status: "sit_out" },
  { id: "2", name: "zeus01", stack: "21.71", status: "fold" },
  { id: "3", name: "karth", stack: "32.38", status: "fold" },
  { id: "4", name: "ishaanw", stack: "166", position: "SB", isHero: true },
  { id: "5", name: "VIKAS", stack: "40.70", position: "BB" },
  { id: "6", name: "Jyoti", stack: "35.90", equity: 3.23 },
];

export const PokerTable: React.FC<PokerTableProps> = ({
  heroHand,
  board,
  pot,
  players = DEFAULT_PLAYERS,
}) => {
  const hero = players.find((p) => p.isHero);
  const villains = players.filter((p) => !p.isHero);

  return (
    <View style={styles.wrapper}>
      {/* The table felt */}
      <View style={styles.tableContainer}>
        <View style={styles.rail}>
          <LinearGradient
            colors={[colors.tableFeltStart, colors.tableFeltEnd]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={styles.felt}
          >
            {/* Board cards */}
            <View style={styles.boardArea}>
              <BoardCards cards={board} />
            </View>

            {/* Pot */}
            <View style={styles.potArea}>
              <PotDisplay pot={pot} />
            </View>
          </LinearGradient>
        </View>

        {/* Villain seats - positioned around table */}
        {villains.map((player, idx) => {
          const posIdx = idx < 3 ? idx : idx + 1;
          if (posIdx > 5) return null;
          const pos = SEAT_POSITIONS[posIdx];

          return (
            <View
              key={player.id}
              style={[
                styles.seatSlot,
                {
                  top: pos.top,
                  left: pos.left,
                  transform: [{ translateX: -35 }, { translateY: -20 }],
                },
              ]}
            >
              <Seat
                name={player.name}
                stack={`${player.stack}BB`}
                isFolded={player.status === "fold"}
                position={player.position}
              />
            </View>
          );
        })}

        {/* Hero section at bottom of table */}
        <View style={styles.heroArea}>
          <HeroHand cards={heroHand} />
          <View style={styles.heroInfo}>
            {hero?.position && (
              <View style={styles.heroPosTag}>
                <Text style={styles.heroPosText}>{hero.position}</Text>
              </View>
            )}
            <Text style={styles.heroName}>{hero?.name || "Hero"}</Text>
            <Text style={styles.heroStack}>{hero?.stack || "100"}BB</Text>
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
    aspectRatio: 0.58, // Taller container for vertical ellipse
    position: "relative",
  },
  rail: {
    position: "absolute",
    top: "5%",
    left: "14%",    // More horizontal padding = narrower
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
