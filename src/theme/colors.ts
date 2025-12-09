/**
 * RangeLab Color Palette - "Dark Confidence"
 * 
 * A premium dark theme with gold accents
 * Inspired by high-stakes poker aesthetics
 */

export const colors = {
  // Backgrounds
  bg: "#08090D",
  bgElevated: "#0E1015",
  surface: "#12141A",
  surfaceLight: "#1A1D26",
  surfaceHover: "#1E2129",
  
  // Borders
  border: "#2A2D38",
  borderLight: "#363942",
  
  // Primary accent - Gold
  gold: "#D4A84B",
  goldDim: "rgba(212, 168, 75, 0.15)",
  goldBright: "#E8C06A",
  
  // Secondary accents
  blue: "#4A90D9",
  blueDim: "rgba(74, 144, 217, 0.15)",
  
  // Semantic colors
  green: "#4ADE80",
  greenDim: "rgba(74, 222, 128, 0.15)",
  red: "#F87171",
  redDim: "rgba(248, 113, 113, 0.15)",
  
  // Text hierarchy
  textPrimary: "#FFFFFF",
  textSecondary: "#A1A1AA",
  textMuted: "#6B7280",
  textDim: "#4B5563",
  
  // Poker table (unchanged for game UI)
  tableRail: "#1A1D26",
  tableRailBorder: "#2A2D38",
  tableFeltStart: "#4B2D7F",
  tableFeltEnd: "#3D2069",
  
  // Cards
  cardBackground: "#FFFFFF",
  cardText: "#111827",
  suitRed: "#EF4444",
  suitBlack: "#111827",
  
  // Legacy mappings (for compatibility)
  background: "#08090D",
  accentBlue: "#4A90D9",
  accentYellow: "#D4A84B",
  accentGreen: "#4ADE80",
  accentRed: "#F87171",
  accentOrange: "#F59E0B",
  actionFold: "#F87171",
  actionCall: "#4ADE80",
  actionAllIn: "#D4A84B",
} as const;

export type ColorKey = keyof typeof colors;
