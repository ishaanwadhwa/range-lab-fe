/**
 * Storage exports
 */

export {
  // Onboarding
  getOnboardingStatus,
  setOnboardingCompleted,
  resetOnboarding,
  
  // User Profile
  getUserProfile,
  setUserProfile,
  updateUserProfile,
  clearAllState,
  
  // Types
  type UserProfile,
  type PlayerType,
  type SkillLevel,
  type GameType,
  type Stakes,
  type WeakArea,
  type TrainingStyle,
} from "./appState";
