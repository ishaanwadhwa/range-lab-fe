import { colors } from "../theme/colors";

export type Suit = "♠" | "♣" | "♥" | "♦" | "s" | "c" | "h" | "d";
export type Rank = "A" | "K" | "Q" | "J" | "T" | "9" | "8" | "7" | "6" | "5" | "4" | "3" | "2";

/**
 * Parse a card string like "A♠" or "Kh" into rank and suit
 */
export const parseCard = (card: string): { rank: string; suit: string; color: string } => {
  const normalized = card.trim();
  
  // Handle formats like "A♠", "Kh", "Td"
  let rank = normalized.slice(0, -1);
  let suit = normalized.slice(-1);
  
  // Normalize suit symbols
  const suitMap: Record<string, string> = {
    "s": "♠", "S": "♠", "♠": "♠",
    "c": "♣", "C": "♣", "♣": "♣", 
    "h": "♥", "H": "♥", "♥": "♥",
    "d": "♦", "D": "♦", "♦": "♦",
  };
  
  const normalizedSuit = suitMap[suit] || suit;
  
  // Determine color based on suit
  const isRed = normalizedSuit === "♥" || normalizedSuit === "♦";
  const color = isRed ? colors.cardRed : colors.cardBlack;
  
  return { rank, suit: normalizedSuit, color };
};

/**
 * Get suit symbol from letter
 */
export const getSuitSymbol = (suit: string): string => {
  const map: Record<string, string> = {
    "s": "♠", "S": "♠", "♠": "♠",
    "c": "♣", "C": "♣", "♣": "♣",
    "h": "♥", "H": "♥", "♥": "♥",
    "d": "♦", "D": "♦", "♦": "♦",
  };
  return map[suit] || suit;
};

