/**
 * TimelineEngine - Steps through spot history and emits animation events
 * 
 * Updated for new action format: [position, actionCode, sizingRef?, exactAmount?]
 */

import { useCallback, useRef, useState } from "react";
import { HistoryAction, Position, Street, Card, SizingRef, ActionCode } from "../types/spot";
import { roundToNearestHalf } from "./SpotParser";

// Timing constants (ms)
export const TIMINGS = {
  ACTION_DELAY: 700,
  STREET_PAUSE: 600,
  CARD_DEAL_DELAY: 200,
  CARD_FLIP_DURATION: 300,
  BET_ANIMATION_DURATION: 600,
} as const;

export interface PlayerTimelineState {
  folded: boolean;
  lastAction?: string;
  lastBetAmount?: number;      // Exact amount for calculations
  lastBetRounded?: number;     // Rounded amount for display/animation
}

export interface TimelineState {
  phase: "idle" | "playing" | "decision";
  currentStreet: Street;
  visibleBoardCards: number;
  currentPot: number;          // Exact pot for calculations
  lastAction: {
    position: Position;
    action: string;
    exactAmount?: number;
    roundedAmount?: number;
  } | null;
  currentBet: {
    position: Position;
    exactAmount: number;
    roundedAmount: number;     // For chip animation
    action: string;
  } | null;
  playerStates: Map<Position, PlayerTimelineState>;
}

export interface TimelineEvent {
  type: "action" | "street" | "decision";
  position?: Position;
  action?: string;
  exactAmount?: number;
  roundedAmount?: number;
  street?: Street;
  cardsToReveal?: number;
}

interface UseTimelineOptions {
  hist: HistoryAction[];
  board: Card[];
  onEvent?: (event: TimelineEvent) => void;
  onComplete?: () => void;
}

/**
 * Extract exactAmount from action based on new format
 * Format: [position, actionCode, sizingRef?, exactAmount?]
 */
function extractExactAmount(action: HistoryAction): number | undefined {
  if (action[0] === "-") return undefined;
  
  // New format: exactAmount is at index 3
  const exactAmount = action[3] as number | undefined;
  if (exactAmount !== undefined) return exactAmount;
  
  // Legacy fallback: amount might be at index 2 if no sizingRef
  const possibleAmount = action[2];
  if (typeof possibleAmount === "number") return possibleAmount;
  
  return undefined;
}

export function useTimeline({
  hist,
  board,
  onEvent,
  onComplete,
}: UseTimelineOptions) {
  const [state, setState] = useState<TimelineState>({
    phase: "idle",
    currentStreet: "p",
    visibleBoardCards: 0,
    currentPot: 0,
    lastAction: null,
    currentBet: null,
    playerStates: new Map(),
  });

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const stepIndexRef = useRef(0);

  const clearTimeouts = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const reset = useCallback(() => {
    clearTimeouts();
    stepIndexRef.current = 0;
    setState({
      phase: "idle",
      currentStreet: "p",
      visibleBoardCards: 0,
      currentPot: 0,
      lastAction: null,
      currentBet: null,
      playerStates: new Map(),
    });
  }, [clearTimeouts]);

  const processStep = useCallback(() => {
    const idx = stepIndexRef.current;
    
    if (idx >= hist.length) {
      // Timeline complete - unlock decision
      setState((prev) => ({ 
        ...prev, 
        phase: "decision", 
        lastAction: null,
        currentBet: null,
      }));
      onEvent?.({ type: "decision" });
      onComplete?.();
      return;
    }

    const action = hist[idx];
    stepIndexRef.current = idx + 1;

    // Handle street marker: ["-", street]
    if (action[0] === "-") {
      const street = action[1] as Street;
      const cardsToReveal = street === "f" ? 3 : street === "t" ? 4 : street === "r" ? 5 : 0;

      setState((prev) => ({
        ...prev,
        currentStreet: street,
        visibleBoardCards: cardsToReveal,
        lastAction: null,
        currentBet: null,
        // Clear last actions on new street
        playerStates: new Map(
          Array.from(prev.playerStates.entries()).map(([pos, state]) => [
            pos,
            { ...state, lastAction: undefined, lastBetAmount: undefined, lastBetRounded: undefined },
          ])
        ),
      }));

      onEvent?.({ type: "street", street, cardsToReveal });

      // Wait for cards to deal
      const cardDelay = street === "f" 
        ? TIMINGS.CARD_DEAL_DELAY * 3 + TIMINGS.CARD_FLIP_DURATION
        : TIMINGS.CARD_DEAL_DELAY + TIMINGS.CARD_FLIP_DURATION;

      timeoutRef.current = setTimeout(processStep, TIMINGS.STREET_PAUSE + cardDelay);
      return;
    }

    // Handle player action: [position, actionCode, sizingRef?, exactAmount?]
    const pos = action[0] as Position;
    const act = action[1] as ActionCode;
    const exactAmount = extractExactAmount(action);

    // Update player state
    setState((prev) => {
      const newPlayerStates = new Map(prev.playerStates);
      const playerState = newPlayerStates.get(pos) || { folded: false };
      
      if (act === "f") {
        playerState.folded = true;
      }
      playerState.lastAction = act;
      
      // For calls without explicit amount, use the last bet amount on the table
      let betAmount = exactAmount;
      if (act === "c" && !betAmount) {
        const otherBets = Array.from(prev.playerStates.values())
          .map(s => s.lastBetAmount)
          .filter((a): a is number => a !== undefined && a > 0);
        if (otherBets.length > 0) {
          betAmount = Math.max(...otherBets);
        }
      }
      
      // Store bet amounts
      if (betAmount && (act === "b" || act === "r" || act === "c" || act === "a")) {
        playerState.lastBetAmount = betAmount;
        playerState.lastBetRounded = roundToNearestHalf(betAmount);
      }
      
      newPlayerStates.set(pos, playerState);

      // Update pot (use exact amount for math accuracy)
      let newPot = prev.currentPot;
      const isBettingAction = act === "b" || act === "r" || act === "c" || act === "a";
      
      if (betAmount && isBettingAction) {
        newPot += betAmount;
      }

      // Set current bet for chip animation (use rounded for visual)
      const roundedAmount = betAmount ? roundToNearestHalf(betAmount) : 0;
      const newCurrentBet = (isBettingAction && betAmount) 
        ? { position: pos, exactAmount: betAmount, roundedAmount, action: act } 
        : null;

      return {
        ...prev,
        currentPot: newPot,
        lastAction: { 
          position: pos, 
          action: act, 
          exactAmount: betAmount,
          roundedAmount,
        },
        currentBet: newCurrentBet,
        playerStates: newPlayerStates,
      };
    });

    const roundedForEvent = exactAmount ? roundToNearestHalf(exactAmount) : undefined;
    onEvent?.({ type: "action", position: pos, action: act, exactAmount, roundedAmount: roundedForEvent });

    // Longer delay for betting actions to allow chip animation
    const delay = (act === "b" || act === "r" || act === "c") 
      ? TIMINGS.ACTION_DELAY + TIMINGS.BET_ANIMATION_DURATION
      : TIMINGS.ACTION_DELAY;

    timeoutRef.current = setTimeout(processStep, delay);
  }, [hist, onEvent, onComplete]);

  const play = useCallback(() => {
    reset();
    setState((prev) => ({ ...prev, phase: "playing", currentPot: 0 }));
    
    timeoutRef.current = setTimeout(processStep, 300);
  }, [reset, processStep]);

  const pause = useCallback(() => {
    clearTimeouts();
    setState((prev) => ({ ...prev, phase: "idle" }));
  }, [clearTimeouts]);

  return {
    state,
    play,
    pause,
    reset,
  };
}

/**
 * Get action display text with rounded amount
 */
export function getActionText(action: string, exactAmount?: number): string {
  const rounded = exactAmount ? roundToNearestHalf(exactAmount) : undefined;
  
  switch (action) {
    case "r": return rounded ? `Raises ${rounded}bb` : "Raises";
    case "b": return rounded ? `Bets ${rounded}bb` : "Bets";
    case "c": return rounded ? `Calls ${rounded}bb` : "Calls";
    case "x": return "Checks";
    case "f": return "Folds";
    case "a": return rounded ? `All-in ${rounded}bb` : "All-in";
    default: return action;
  }
}
