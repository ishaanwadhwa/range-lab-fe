/**
 * TimelineEngine - Steps through spot history and emits animation events
 */

import { useCallback, useRef, useState } from "react";
import { HistoryAction, Position, Street, Card } from "../types/spot";

// Timing constants (ms)
export const TIMINGS = {
  ACTION_DELAY: 700,
  STREET_PAUSE: 600,
  CARD_DEAL_DELAY: 200,
  CARD_FLIP_DURATION: 300,
  BET_ANIMATION_DURATION: 600,
} as const;

export interface TimelineState {
  phase: "idle" | "playing" | "decision";
  currentStreet: Street;
  visibleBoardCards: number;
  currentPot: number;
  lastAction: {
    position: Position;
    action: string;
    amount?: number;
  } | null;
  currentBet: {
    position: Position;
    amount: number;
  } | null;
  playerStates: Map<Position, { folded: boolean; lastAction?: string }>;
}

export interface TimelineEvent {
  type: "action" | "street" | "decision";
  position?: Position;
  action?: string;
  amount?: number;
  street?: Street;
  cardsToReveal?: number;
}

interface UseTimelineOptions {
  hist: HistoryAction[];
  board: Card[];
  initialPot: number;
  onEvent?: (event: TimelineEvent) => void;
  onComplete?: () => void;
}

export function useTimeline({
  hist,
  board,
  initialPot,
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

    // Handle street marker
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
            { ...state, lastAction: undefined },
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

    // Handle player action
    const [pos, act, amount] = action as [Position, string, number?];

    // Update player state
    setState((prev) => {
      const newPlayerStates = new Map(prev.playerStates);
      const playerState = newPlayerStates.get(pos) || { folded: false };
      
      if (act === "f") {
        playerState.folded = true;
      }
      playerState.lastAction = act;
      newPlayerStates.set(pos, playerState);

      // Update pot for bets/calls/raises
      let newPot = prev.currentPot;
      const isBettingAction = act === "b" || act === "r" || act === "c" || act === "a";
      
      if (amount && isBettingAction) {
        newPot += amount;
      }

      // Set current bet for chip animation
      const newCurrentBet = (isBettingAction && amount) 
        ? { position: pos, amount } 
        : null;

      return {
        ...prev,
        currentPot: newPot,
        lastAction: { position: pos, action: act, amount },
        currentBet: newCurrentBet,
        playerStates: newPlayerStates,
      };
    });

    onEvent?.({ type: "action", position: pos, action: act, amount });

    // Longer delay for betting actions to allow chip animation
    const delay = (act === "b" || act === "r" || act === "c") 
      ? TIMINGS.ACTION_DELAY + TIMINGS.BET_ANIMATION_DURATION
      : TIMINGS.ACTION_DELAY;

    timeoutRef.current = setTimeout(processStep, delay);
  }, [hist, onEvent, onComplete]);

  const play = useCallback(() => {
    reset();
    setState((prev) => ({ ...prev, phase: "playing", currentPot: initialPot }));
    
    timeoutRef.current = setTimeout(processStep, 300);
  }, [reset, initialPot, processStep]);

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
 * Get action display text
 */
export function getActionText(action: string, amount?: number): string {
  switch (action) {
    case "r": return amount ? `Raises ${amount}bb` : "Raises";
    case "b": return amount ? `Bets ${amount}bb` : "Bets";
    case "c": return "Calls";
    case "x": return "Checks";
    case "f": return "Folds";
    case "a": return "All-in";
    default: return action;
  }
}
