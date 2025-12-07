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
// Slot 0 = Hero (bottom center)
// Slot 1 = Left of hero (bottom left)
// Slot 2 = Far left (top left)
// Slot 3 = Top
// Slot 4 = Far right (top right)  
// Slot 5 = Right of hero (bottom right)
export type SeatSlot = 0 | 1 | 2 | 3 | 4 | 5;

export interface SeatLayout {
  top: string;
  left: string;
}

// Visual positions for each slot
export const SEAT_LAYOUTS: Record<SeatSlot, SeatLayout> = {
  0: { top: "75%", left: "50%" },   // Hero - bottom center (will be rendered separately)
  1: { top: "52%", left: "12%" },   // Bottom left
  2: { top: "20%", left: "12%" },   // Top left
  3: { top: "4%", left: "50%" },    // Top center
  4: { top: "20%", left: "88%" },   // Top right
  5: { top: "52%", left: "88%" },   // Bottom right
};

/**
 * Get the seat slot for a position relative to hero
 * Hero is always slot 0, others rotate around
 */
export function getSeatSlot(position: Position, heroPosition: Position): SeatSlot {
  const heroIdx = POSITION_ORDER.indexOf(heroPosition);
  const posIdx = POSITION_ORDER.indexOf(position);
  
  // Calculate relative position (how many seats clockwise from hero)
  const relativeIdx = (posIdx - heroIdx + 6) % 6;
  
  // Map relative index to visual slot
  // 0 = hero (bottom), 1 = one left of hero, 2 = two left, etc.
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
 * Get all seat layouts for villains (non-hero players)
 */
export function getVillainLayouts(heroPosition: Position): Map<Position, SeatLayout> {
  const layouts = new Map<Position, SeatLayout>();
  
  for (const pos of POSITION_ORDER) {
    if (pos !== heroPosition) {
      layouts.set(pos, getSeatLayout(pos, heroPosition));
    }
  }
  
  return layouts;
}

/**
 * Get chip animation start position for a seat slot
 * Returns offset from pot center
 */
export function getChipStartOffset(slot: SeatSlot): { x: number; y: number } {
  switch (slot) {
    case 0: return { x: 0, y: 80 };    // Hero - below pot
    case 1: return { x: -80, y: 40 };  // Bottom left
    case 2: return { x: -80, y: -40 }; // Top left
    case 3: return { x: 0, y: -80 };   // Top
    case 4: return { x: 80, y: -40 };  // Top right
    case 5: return { x: 80, y: 40 };   // Bottom right
    default: return { x: 0, y: 0 };
  }
}

