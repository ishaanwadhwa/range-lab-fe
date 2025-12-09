/**
 * API exports
 */

export { API_BASE, REQUEST_TIMEOUT } from "./config";

export {
  // Types
  type SpotFilters,
  type HealthResponse,
  type ApiError,
  
  // Functions
  checkHealth,
  fetchRandomSpot,
  fetchSpotById,
  submitResult,
  isApiAvailable,
} from "./spots";
