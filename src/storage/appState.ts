/**
 * App State Storage
 * 
 * Persistent storage for app-level state using AsyncStorage.
 * Compatible with Expo Go for development.
 * 
 * Current keys:
 * - onboardingCompleted: boolean
 * - userProfile: UserProfile (all onboarding data)
 */

import AsyncStorage from "@react-native-async-storage/async-storage";

// Key prefix to namespace our storage
const PREFIX = "@rangelab:";

const KEYS = {
  ONBOARDING_COMPLETED: `${PREFIX}onboardingCompleted`,
  USER_PROFILE: `${PREFIX}userProfile`,
} as const;

// ============================================
// User Profile Types (from Onboarding)
// ============================================

export type PlayerType = "casual" | "improver" | "competitive" | "serious";
export type SkillLevel = "beginner" | "intermediate" | "advanced" | "semi_pro";
export type GameType = "cash_online" | "cash_live" | "mtt" | "zoom" | "not_sure";
export type Stakes = "micro" | "low" | "mid" | "high" | "not_sure";
export type WeakArea = 
  | "preflop" 
  | "cbetting" 
  | "bluffing" 
  | "defending_bb" 
  | "hand_reading" 
  | "river_play" 
  | "confidence";
export type TrainingStyle = "quick" | "focused" | "deep";

export interface UserProfile {
  // From onboarding
  playerType?: PlayerType;
  skillLevel?: SkillLevel;
  gameTypes?: GameType[];
  stakes?: Stakes;
  weakAreas?: WeakArea[];
  sessionLengthMinutes?: number;  // 5, 10, 20
  trainingStyle?: TrainingStyle;
  
  // Metadata
  onboardedAt?: string;  // ISO timestamp
}

// ============================================
// Onboarding State
// ============================================

/**
 * Check if user has completed onboarding
 */
export async function getOnboardingStatus(): Promise<boolean> {
  try {
    const value = await AsyncStorage.getItem(KEYS.ONBOARDING_COMPLETED);
    return value === "true";
  } catch (error) {
    console.error("[Storage] Error getting onboarding status:", error);
    return false;
  }
}

/**
 * Mark onboarding as completed
 */
export async function setOnboardingCompleted(): Promise<void> {
  try {
    await AsyncStorage.setItem(KEYS.ONBOARDING_COMPLETED, "true");
    console.log("[Storage] Onboarding marked as completed");
  } catch (error) {
    console.error("[Storage] Error setting onboarding status:", error);
  }
}

/**
 * Reset onboarding status (for testing/debugging only)
 */
export async function resetOnboarding(): Promise<void> {
  try {
    await AsyncStorage.removeItem(KEYS.ONBOARDING_COMPLETED);
    await AsyncStorage.removeItem(KEYS.USER_PROFILE);
    console.log("[Storage] Onboarding reset");
  } catch (error) {
    console.error("[Storage] Error resetting onboarding:", error);
  }
}

// ============================================
// User Profile
// ============================================

/**
 * Get user profile
 */
export async function getUserProfile(): Promise<UserProfile | null> {
  try {
    const json = await AsyncStorage.getItem(KEYS.USER_PROFILE);
    if (!json) return null;
    return JSON.parse(json) as UserProfile;
  } catch (error) {
    console.error("[Storage] Error getting user profile:", error);
    return null;
  }
}

/**
 * Save user profile
 */
export async function setUserProfile(profile: UserProfile): Promise<void> {
  try {
    await AsyncStorage.setItem(KEYS.USER_PROFILE, JSON.stringify(profile));
    console.log("[Storage] User profile saved");
  } catch (error) {
    console.error("[Storage] Error saving user profile:", error);
  }
}

/**
 * Update user profile (merge with existing)
 */
export async function updateUserProfile(updates: Partial<UserProfile>): Promise<void> {
  try {
    const existing = await getUserProfile();
    const merged = { ...existing, ...updates };
    await setUserProfile(merged);
  } catch (error) {
    console.error("[Storage] Error updating user profile:", error);
  }
}

/**
 * Clear all app state (for logout/reset)
 */
export async function clearAllState(): Promise<void> {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const appKeys = keys.filter((k) => k.startsWith(PREFIX));
    await AsyncStorage.multiRemove(appKeys);
    console.log("[Storage] All app state cleared");
  } catch (error) {
    console.error("[Storage] Error clearing state:", error);
  }
}
