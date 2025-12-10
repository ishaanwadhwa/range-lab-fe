/**
 * Spot JSON Types - v1
 * See UPDATED_CONTEXT.MD for full specification
 * 
 * Action format: [position, actionCode, sizingRef?, exactAmount?]
 */

// Card format: Rank + Suit (e.g., "Ah", "Ks", "Td")
export type Card = string;

// Position codes
export type Position = "BTN" | "SB" | "BB" | "UTG" | "MP" | "CO" | "HJ";

// Table format
export type TableFormat = "6m" | "9m" | "hu";

// Street codes
export type Street = "p" | "f" | "t" | "r";

// Action codes used in hist
export type ActionCode = "r" | "c" | "x" | "b" | "f" | "a";

// Sizing reference for bets/raises
// Can be: percentage (33, 50, 75, 100), "pot", "3x", "AI", or null
export type SizingRef = number | "pot" | "2x" | "3x" | "4x" | "AI" | null;

/**
 * Single action in history
 * Format: [position, actionCode, sizingRef?, exactAmount?]
 * 
 * Examples:
 * - ["BB", "x"]                    → BB checks
 * - ["BTN", "f"]                   → BTN folds
 * - ["BTN", "c", null, 4.7]        → BTN calls 4.7bb
 * - ["BTN", "b", 33, 5.94]         → BTN bets 33% pot (5.94bb)
 * - ["BTN", "b", "pot", 18.22]     → pot-sized bet
 * - ["BB", "r", "3x", 22.5]        → raise 3x to 22.5bb
 * - ["BTN", "a", "AI", 82.1]       → all-in jam
 * - ["-", "f"]                     → street marker: flop
 */
export type HistoryAction =
  | [Position, "x"]                              // Check
  | [Position, "f"]                              // Fold
  | [Position, "c", SizingRef, number]           // Call with amount
  | [Position, "c"]                              // Call (legacy, no amount)
  | [Position, "b", SizingRef, number]           // Bet with sizing
  | [Position, "r", SizingRef, number]           // Raise with sizing
  | [Position, "a", SizingRef, number]           // All-in with amount
  | ["-", Street];                               // Street marker

/**
 * Option available to hero
 * Format: [action, sizingRef?, exactAmount?]
 * 
 * Examples:
 * - ["x"]                → Check
 * - ["f"]                → Fold
 * - ["c", null, 4.7]     → Call 4.7bb
 * - ["b", 33, 5.94]      → Bet 33% (5.94bb)
 * - ["b", "pot", 18.22]  → Pot bet
 * - ["r", "3x", 22.5]    → Raise 3x
 * - ["a", "AI", 82.1]    → All-in
 */
export type ActionOption =
  | ["x"]
  | ["f"]
  | ["c", SizingRef?, number?]
  | ["b", SizingRef, number]
  | ["r", SizingRef, number]
  | ["a", SizingRef?, number?];

/**
 * Hero data
 */
export interface SpotHero {
  pos: Position;
  hand: [Card, Card];
}

/**
 * Solver solution
 */
export interface SpotSolution {
  b: number; // Best action index (into opts array)
  ev: number[]; // EV for each option
}

/**
 * Spot metadata for explanations
 */
export interface SpotMeta {
  concept: string[];           // Concepts this spot teaches (e.g., ["value betting", "thin value"])
  summary?: string;            // 1-2 sentence explanation
  solverNotes?: string[];      // Key strategic points from solver
  freq?: number[];             // Solver frequencies for each option
}

/**
 * Complete Spot JSON structure
 */
export interface SpotData {
  id: string;
  st: number; // Effective stack in BB
  fmt: TableFormat;
  str: Street; // Current street at decision
  hero: SpotHero;
  v: Position[]; // Villain(s) still in hand
  brd: Card[]; // Board cards (0-5)
  pot: number; // Pot size at decision in BB
  hist: HistoryAction[];
  opts: ActionOption[];
  sol: SpotSolution;
  meta?: SpotMeta; // Explanation metadata
  tags?: string[]; // Spot tags for categorization
}

/**
 * Processed player state for UI rendering
 */
export interface PlayerState {
  position: Position;
  stack: number;
  isHero: boolean;
  isInHand: boolean;
  isFolded: boolean;
  lastAction?: string;
  cards?: [Card, Card];
}

/**
 * Processed action option for UI
 */
export interface ProcessedOption {
  id: string;
  label: string;           // e.g., "Bet 33% (6bb)"
  action: ActionOption;
  sizingRef: SizingRef;
  exactAmount?: number;
  roundedAmount?: number;  // For display
  isCorrect: boolean;
  ev: number;
}

/**
 * Processed history action for UI
 */
export interface ProcessedHistoryAction {
  position: Position | "-";
  actionCode: ActionCode | Street;
  actionLabel: string;     // e.g., "Bet 33% (6bb)"
  sizingRef?: SizingRef;
  exactAmount?: number;
  roundedAmount?: number;
  isStreetMarker: boolean;
  street?: Street;
}

/**
 * Processed spot data ready for UI
 */
export interface ProcessedSpot {
  id: string;
  street: Street;
  streetName: string;
  heroPosition: Position;
  heroHand: [Card, Card];
  board: Card[];
  pot: number;
  effectiveStack: number;
  players: PlayerState[];
  villainsInHand: Position[];
  options: ProcessedOption[];
  history: ProcessedHistoryAction[];
  dealerPosition: Position;
  meta?: SpotMeta;
  tags?: string[];
}
