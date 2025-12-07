/**
 * SpotParser - Transforms compact spot JSON into UI-ready data
 * See CONTEXT.MD for JSON specification
 */

import {
  SpotData,
  ProcessedSpot,
  PlayerState,
  Position,
  ActionOption,
  HistoryAction,
  Street,
} from "../types/spot";

// All positions in 6-max order
const POSITIONS_6MAX: Position[] = ["UTG", "MP", "CO", "BTN", "SB", "BB"];

// Street display names
const STREET_NAMES: Record<Street, string> = {
  p: "Preflop",
  f: "Flop",
  t: "Turn",
  r: "River",
};

// Action display labels
const ACTION_LABELS: Record<string, string> = {
  x: "Check",
  c: "Call",
  b: "Bet",
  r: "Raise",
  f: "Fold",
  a: "All-in",
};

/**
 * Generate a readable ID for an action option
 */
function getOptionId(opt: ActionOption): string {
  const [action, amount] = opt;
  if (action === "x") return "x";
  if (action === "c") return amount ? `c${amount}` : "c";
  if (action === "b") return `b${amount}`;
  if (action === "r") return `r${amount}`;
  if (action === "a") return "a";
  if (action === "f") return "f";
  return "unknown";
}

/**
 * Generate a display label for an action option
 */
function getOptionLabel(opt: ActionOption, pot: number): string {
  const [action, amount] = opt;
  switch (action) {
    case "x":
      return "CHECK";
    case "c":
      return amount ? `CALL ${amount}BB` : "CALL";
    case "b":
      return `BET ${amount}%`;
    case "r":
      return `RAISE ${amount}x`;
    case "a":
      return "ALL-IN";
    case "f":
      return "FOLD";
    default:
      return "???";
  }
}

/**
 * Calculate player states from history
 */
function calculatePlayerStates(
  spot: SpotData
): Map<Position, { stack: number; inHand: boolean; lastAction?: string }> {
  const states = new Map<Position, { stack: number; inHand: boolean; lastAction?: string }>();

  // Initialize all players with starting stack
  for (const pos of POSITIONS_6MAX) {
    states.set(pos, { stack: spot.st, inHand: true });
  }

  // Walk through history to update states
  for (const action of spot.hist) {
    // Skip street markers
    if (action[0] === "-") continue;

    const [pos, act, amount] = action as [Position, string, number?];
    const state = states.get(pos);
    if (!state) continue;

    // Update last action
    state.lastAction = act;

    // Handle folds
    if (act === "f") {
      state.inHand = false;
    }

    // Deduct amounts for bets/raises/calls
    if (amount && (act === "b" || act === "r" || act === "c")) {
      state.stack -= amount;
    }
  }

  return states;
}

/**
 * Parse history into readable format
 */
function parseHistory(hist: HistoryAction[]) {
  return hist.map((action) => {
    if (action[0] === "-") {
      return {
        position: "-" as const,
        action: "street",
        isStreetMarker: true,
        street: action[1] as Street,
      };
    }

    const [pos, act, amount] = action as [Position, string, number?];
    return {
      position: pos,
      action: ACTION_LABELS[act] || act,
      amount,
      isStreetMarker: false,
    };
  });
}

/**
 * Main parser function - transforms SpotData into ProcessedSpot
 */
export function parseSpot(spot: SpotData): ProcessedSpot {
  // Calculate player states from history
  const playerStates = calculatePlayerStates(spot);

  // Build players array
  const players: PlayerState[] = POSITIONS_6MAX.map((pos) => {
    const state = playerStates.get(pos)!;
    const isHero = pos === spot.hero.pos;

    return {
      position: pos,
      stack: state.stack,
      isHero,
      isInHand: state.inHand,
      isFolded: !state.inHand,
      lastAction: state.lastAction,
      cards: isHero ? spot.hero.hand : undefined,
    };
  });

  // Build options with labels and EV
  const options = spot.opts.map((opt, idx) => ({
    id: getOptionId(opt),
    label: getOptionLabel(opt, spot.pot),
    action: opt,
    isCorrect: idx === spot.sol.b,
    ev: spot.sol.ev[idx],
  }));

  // Parse history
  const history = parseHistory(spot.hist);

  return {
    id: spot.id,
    street: spot.str,
    streetName: STREET_NAMES[spot.str],
    heroPosition: spot.hero.pos,
    heroHand: spot.hero.hand,
    board: spot.brd,
    pot: spot.pot,
    players,
    villainsInHand: spot.v,
    options,
    history,
  };
}

/**
 * Validate spot JSON structure
 */
export function validateSpot(data: unknown): data is SpotData {
  if (!data || typeof data !== "object") return false;

  const spot = data as Record<string, unknown>;

  // Required fields
  if (typeof spot.id !== "string") return false;
  if (typeof spot.st !== "number") return false;
  if (typeof spot.fmt !== "string") return false;
  if (typeof spot.str !== "string") return false;
  if (!spot.hero || typeof spot.hero !== "object") return false;
  if (!Array.isArray(spot.v)) return false;
  if (!Array.isArray(spot.brd)) return false;
  if (typeof spot.pot !== "number") return false;
  if (!Array.isArray(spot.hist)) return false;
  if (!Array.isArray(spot.opts)) return false;
  if (!spot.sol || typeof spot.sol !== "object") return false;

  return true;
}

/**
 * Convert short card format to display format
 * "Ah" → "A♥"
 */
export function formatCard(card: string): string {
  if (card.length < 2) return card;

  const rank = card[0];
  const suit = card[1].toLowerCase();

  const suitSymbols: Record<string, string> = {
    s: "♠",
    h: "♥",
    d: "♦",
    c: "♣",
  };

  return `${rank}${suitSymbols[suit] || suit}`;
}

/**
 * Convert array of cards to display format
 */
export function formatCards(cards: string[]): string[] {
  return cards.map(formatCard);
}

