/**
 * SpotParser - Transforms compact spot JSON into UI-ready data
 * See UPDATED_CONTEXT.MD for JSON specification
 * 
 * Action format: [position, actionCode, sizingRef?, exactAmount?]
 */

import {
  SpotData,
  ProcessedSpot,
  ProcessedOption,
  ProcessedHistoryAction,
  PlayerState,
  Position,
  ActionOption,
  HistoryAction,
  Street,
  SizingRef,
  ActionCode,
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

// Base action labels (without sizing)
const BASE_ACTION_LABELS: Record<ActionCode, string> = {
  x: "Check",
  c: "Call",
  b: "Bet",
  r: "Raise",
  f: "Fold",
  a: "All-In",
};

/**
 * Round to nearest 0.5bb for display
 * Required by UPDATED_CONTEXT.MD
 */
export function roundToNearestHalf(n: number): number {
  return Math.round(n * 2) / 2;
}

/**
 * Format sizing reference for display
 */
function formatSizingRef(sizingRef: SizingRef): string {
  if (sizingRef === null || sizingRef === undefined) return "";
  if (sizingRef === "pot") return "Pot";
  if (sizingRef === "AI") return "";  // All-in doesn't need sizing label
  if (typeof sizingRef === "string" && sizingRef.endsWith("x")) {
    return sizingRef;  // "3x", "2x", etc.
  }
  if (typeof sizingRef === "number") {
    return `${sizingRef}%`;
  }
  return String(sizingRef);
}

/**
 * Generate display label for an action
 * Format: "{sizingRef label} ({roundedAmount}bb)" or simple label
 */
function getActionLabel(
  actionCode: ActionCode,
  sizingRef?: SizingRef,
  exactAmount?: number
): string {
  const baseLabel = BASE_ACTION_LABELS[actionCode];
  
  // Simple actions without amounts
  if (actionCode === "x" || actionCode === "f") {
    return baseLabel;
  }
  
  // All-in
  if (actionCode === "a") {
    if (exactAmount) {
      const rounded = roundToNearestHalf(exactAmount);
      return `All-In (${rounded}bb)`;
    }
    return "All-In";
  }
  
  // Call
  if (actionCode === "c") {
    if (exactAmount) {
      const rounded = roundToNearestHalf(exactAmount);
      return `Call (${rounded}bb)`;
    }
    return "Call";
  }
  
  // Bet/Raise with sizing
  if (exactAmount !== undefined && sizingRef !== undefined && sizingRef !== null) {
    const rounded = roundToNearestHalf(exactAmount);
    const sizingLabel = formatSizingRef(sizingRef);
    
    if (sizingRef === "pot") {
      return `${baseLabel} Pot (${rounded}bb)`;
    }
    
    return `${baseLabel} ${sizingLabel} (${rounded}bb)`;
  }
  
  // Fallback with just amount
  if (exactAmount !== undefined) {
    const rounded = roundToNearestHalf(exactAmount);
    return `${baseLabel} (${rounded}bb)`;
  }
  
  return baseLabel;
}

/**
 * Generate short label for action buttons
 * Uppercase for ActionBar
 */
function getShortActionLabel(
  actionCode: ActionCode,
  sizingRef?: SizingRef,
  exactAmount?: number
): string {
  // Simple actions
  if (actionCode === "x") return "CHECK";
  if (actionCode === "f") return "FOLD";
  if (actionCode === "a") return "ALL-IN";
  
  // Call
  if (actionCode === "c") {
    if (exactAmount) {
      const rounded = roundToNearestHalf(exactAmount);
      return `CALL ${rounded}`;
    }
    return "CALL";
  }
  
  // Bet/Raise with sizing
  if (sizingRef !== undefined && sizingRef !== null) {
    if (sizingRef === "pot") {
      return actionCode === "b" ? "BET POT" : "RAISE POT";
    }
    if (typeof sizingRef === "number") {
      return actionCode === "b" ? `BET ${sizingRef}%` : `RAISE ${sizingRef}%`;
    }
    if (typeof sizingRef === "string" && sizingRef.endsWith("x")) {
      return `RAISE ${sizingRef}`;
    }
  }
  
  // Fallback
  return actionCode === "b" ? "BET" : "RAISE";
}

/**
 * Generate a unique ID for an action option
 */
function getOptionId(opt: ActionOption): string {
  const [action, sizingRef, exactAmount] = opt as [ActionCode, SizingRef?, number?];
  
  if (action === "x") return "x";
  if (action === "f") return "f";
  if (action === "a") return "a";
  
  if (action === "c") {
    return exactAmount ? `c_${exactAmount}` : "c";
  }
  
  // Bet/Raise - use sizing ref for ID
  if (sizingRef !== null && sizingRef !== undefined) {
    return `${action}_${sizingRef}`;
  }
  
  return exactAmount ? `${action}_${exactAmount}` : action;
}

/**
 * Parse a single action option
 */
function parseOption(opt: ActionOption, idx: number, solution: { b: number; ev: number[] }): ProcessedOption {
  const [action, sizingRef, exactAmount] = opt as [ActionCode, SizingRef?, number?];
  
  const rounded = exactAmount !== undefined ? roundToNearestHalf(exactAmount) : undefined;
  
  return {
    id: getOptionId(opt),
    label: getShortActionLabel(action, sizingRef, exactAmount),
    action: opt,
    sizingRef: sizingRef ?? null,
    exactAmount,
    roundedAmount: rounded,
    isCorrect: idx === solution.b,
    ev: solution.ev[idx],
  };
}

/**
 * Parse a single history action
 */
function parseHistoryAction(action: HistoryAction): ProcessedHistoryAction {
  // Street marker
  if (action[0] === "-") {
    const street = action[1] as Street;
    return {
      position: "-",
      actionCode: street,
      actionLabel: STREET_NAMES[street],
      isStreetMarker: true,
      street,
    };
  }
  
  // Player action - new format: [position, actionCode, sizingRef?, exactAmount?]
  const [pos, actionCode, sizingRef, exactAmount] = action as [Position, ActionCode, SizingRef?, number?];
  
  const rounded = exactAmount !== undefined ? roundToNearestHalf(exactAmount) : undefined;
  
  return {
    position: pos,
    actionCode,
    actionLabel: getActionLabel(actionCode, sizingRef, exactAmount),
    sizingRef,
    exactAmount,
    roundedAmount: rounded,
    isStreetMarker: false,
  };
}

/**
 * Calculate player states from history
 * Uses exactAmount for accurate stack calculations
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

    const [pos, act, , exactAmount] = action as [Position, ActionCode, SizingRef?, number?];
    const state = states.get(pos);
    if (!state) continue;

    // Update last action
    state.lastAction = act;

    // Handle folds
    if (act === "f") {
      state.inHand = false;
    }

    // Deduct exact amounts for bets/raises/calls/all-ins
    if (exactAmount && (act === "b" || act === "r" || act === "c" || act === "a")) {
      state.stack -= exactAmount;
    }
  }

  return states;
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

  // Parse options with labels and EV
  const options = spot.opts.map((opt, idx) => parseOption(opt, idx, spot.sol));

  // Parse history
  const history = spot.hist.map(parseHistoryAction);

  return {
    id: spot.id,
    street: spot.str,
    streetName: STREET_NAMES[spot.str],
    heroPosition: spot.hero.pos,
    heroHand: spot.hero.hand,
    board: spot.brd,
    pot: spot.pot,
    effectiveStack: spot.st,
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

/**
 * Get rounded amount for animation (visual chips)
 */
export function getRoundedAmount(exactAmount: number): number {
  return roundToNearestHalf(exactAmount);
}
