export const colors = {
  // App background
  background: "#0D0D0D",
  
  // Table colors (PokerBaazi purple style)
  tableRail: "#1A1A1A",
  tableRailBorder: "#2D2D2D",
  tableFeltStart: "#4B2D7F",
  tableFeltEnd: "#2D1B4E",
  
  // Accent colors
  accentBlue: "#3B82F6",
  accentOrange: "#F97316",
  accentYellow: "#FBBF24",
  accentGreen: "#10B981",
  accentRed: "#EF4444",
  
  // Card colors
  cardRed: "#DC2626",
  cardBlack: "#1F2937",
  cardBackground: "#FFFFFF",
  
  // Action bar colors (muted dark style)
  actionBackground: "#1F1F1F",
  actionBorder: "#333333",
  actionFold: "#374151",
  actionCall: "#374151",
  actionRaise: "#374151",
  
  // Status colors
  statusFold: "#EF4444",
  statusCall: "#10B981",
  statusRaise: "#F59E0B",
  statusCheck: "#6B7280",
  
  // Text colors
  textPrimary: "#FFFFFF",
  textSecondary: "#9CA3AF",
  textMuted: "#6B7280",
  
  // Dealer button
  dealerButton: "#DC2626",
} as const;

export type AppColorKey = keyof typeof colors;
