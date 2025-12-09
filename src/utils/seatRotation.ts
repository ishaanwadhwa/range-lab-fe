/**
 * Seat rotation utility
 * 
 * In poker apps, hero is always at the bottom of the screen.
 * This utility rotates seat positions so hero's position maps to bottom.
 */

import { Position } from "../types/spot";

// Standard 6-max position order (clockwise from UTG)
const POSITION_ORDER: Position[] = ["UTG", "MP", "CO", "BTN", "SB", "BB"];

// Visual seat slots (clockwise from hero at bottom)
export type SeatSlot = 0 | 1 | 2 | 3 | 4 | 5;

export interface SeatLayout {
  top: string;
  left: string;
}

export interface ChipLayout {
  top: string;
  left: string;
}

// Visual positions for each slot
export const SEAT_LAYOUTS: Record<SeatSlot, SeatLayout> = {
  0: { top: "75%", left: "50%" },   // Hero - bottom center
  1: { top: "52%", left: "12%" },   // Bottom left
  2: { top: "20%", left: "12%" },   // Top left
  3: { top: "4%", left: "50%" },    // Top center
  4: { top: "20%", left: "88%" },   // Top right
  5: { top: "52%", left: "88%" },   // Bottom right
};

// Chip positions in front of each seat (between seat and pot)
export const CHIP_LAYOUTS: Record<SeatSlot, ChipLayout> = {
  0: { top: "62%", left: "50%" },   // Hero - above hero cards
  1: { top: "48%", left: "25%" },   // Bottom left - to the right
  2: { top: "28%", left: "25%" },   // Top left - to the right
  3: { top: "18%", left: "50%" },   // Top center - below
  4: { top: "28%", left: "75%" },   // Top right - to the left
  5: { top: "48%", left: "75%" },   // Bottom right - to the left
};

/**
 * Get the seat slot for a position relative to hero
 */
export function getSeatSlot(position: Position, heroPosition: Position): SeatSlot {
  const heroIdx = POSITION_ORDER.indexOf(heroPosition);
  const posIdx = POSITION_ORDER.indexOf(position);
  
  const relativeIdx = (posIdx - heroIdx + 6) % 6;
  
  return relativeIdx as SeatSlot;
}

/**
 * Get visual layout for a position given hero's position
 */
export function getSeatLayout(position: Position, heroPosition: Position): SeatLayout {
  const slot = getSeatSlot(position, heroPosition);
  return SEAT_LAYOUTS[slot];
}

/**
 * Get chip layout for a position given hero's position
 */
export function getChipLayout(position: Position, heroPosition: Position): ChipLayout {
  const slot = getSeatSlot(position, heroPosition);
  return CHIP_LAYOUTS[slot];
}

/**
 * Get chip animation start position for a seat slot
 */
export function getChipStartOffset(slot: SeatSlot): { x: number; y: number } {
  switch (slot) {
    case 0: return { x: 0, y: 80 };
    case 1: return { x: -80, y: 40 };
    case 2: return { x: -80, y: -40 };
    case 3: return { x: 0, y: -80 };
    case 4: return { x: 80, y: -40 };
    case 5: return { x: 80, y: 40 };
    default: return { x: 0, y: 0 };
  }
}
