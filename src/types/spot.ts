/**
 * Spot JSON Types
 * See CONTEXT.MD for full specification
 */

// Card format: Rank + Suit (e.g., "Ah", "Ks", "Td")
export type Card = string;

// Position codes
export type Position = "BTN" | "SB" | "BB" | "UTG" | "MP" | "CO";

// Table format
export type TableFormat = "6m" | "9m" | "hu";

// Street codes
export type Street = "p" | "f" | "t" | "r";

// Action codes used in hist
export type ActionCode = "r" | "c" | "x" | "b" | "f" | "a" | "-";

/**
 * Single action in history
 * Format: [position, action, amount?]
 * Street marker: ["-", street]
 */
export type HistoryAction =
  | [Position, ActionCode]
  | [Position, ActionCode, number]
  | ["-", Street];

/**
 * Option available to hero
 * Format: [action] or [action, amount]
 */
export type ActionOption =
  | ["x"]
  | ["c"]
  | ["c", number]
  | ["b", number]
  | ["r", number]
  | ["a"]
  | ["f"];

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
  players: PlayerState[];
  villainsInHand: Position[];
  options: {
    id: string;
    label: string;
    action: ActionOption;
    isCorrect: boolean;
    ev: number;
  }[];
  history: {
    position: Position | "-";
    action: string;
    amount?: number;
    isStreetMarker: boolean;
    street?: Street;
  }[];
}

