/**
 * Spots API Service
 * 
 * Endpoints:
 * - GET /health - Health check
 * - GET /spots/random - Get random spot with filters
 * - GET /spots/:id - Get specific spot by ID
 */

import { API_BASE, REQUEST_TIMEOUT } from "./config";
import { SpotData } from "../types/spot";

/**
 * Filter options for fetching random spots
 */
export interface SpotFilters {
  /** Format: 6-max, 9-max, heads-up */
  fmt?: "6m" | "9m" | "hu";
  
  /** Street: preflop, flop, turn, river */
  str?: "p" | "f" | "t" | "r";
  
  /** Exact difficulty match (1-10) */
  difficulty?: number;
  
  /** Minimum difficulty (1-10) */
  minDiff?: number;
  
  /** Maximum difficulty (1-10) */
  maxDiff?: number;
  
  /** Tags to filter by (matches ANY) - e.g., ["river", "bluff"] */
  tags?: string[];
}

/**
 * Health check response
 */
export interface HealthResponse {
  status: "ok" | "error";
  timestamp: string;
}

/**
 * API Error response
 */
export interface ApiError {
  error: string;
}

/**
 * Fetch with timeout wrapper
 */
async function fetchWithTimeout(url: string, options: RequestInit = {}): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Check API health
 * GET /health
 */
export async function checkHealth(): Promise<HealthResponse> {
  const url = `${API_BASE}/health`;
  
  console.log("[API] Health check:", url);

  try {
    const res = await fetchWithTimeout(url);
    
    if (!res.ok) {
      return { status: "error", timestamp: new Date().toISOString() };
    }

    return res.json();
  } catch (error) {
    console.warn("[API] Health check failed:", error);
    return { status: "error", timestamp: new Date().toISOString() };
  }
}

/**
 * Fetch a random spot from the API
 * GET /spots/random
 * 
 * @param filters - Optional filters for spot selection
 * @returns Random spot matching filters
 * @throws Error if no matching spot found (404)
 * 
 * @example
 * // Get any random spot
 * const spot = await fetchRandomSpot();
 * 
 * @example
 * // Get 6-max turn spot
 * const spot = await fetchRandomSpot({ fmt: "6m", str: "t" });
 * 
 * @example
 * // Get spot with difficulty 3-7 and bluff tag
 * const spot = await fetchRandomSpot({ 
 *   minDiff: 3, 
 *   maxDiff: 7, 
 *   tags: ["bluff"] 
 * });
 */
export async function fetchRandomSpot(filters?: SpotFilters): Promise<SpotData> {
  const params = new URLSearchParams();
  
  if (filters?.fmt) params.append("fmt", filters.fmt);
  if (filters?.str) params.append("str", filters.str);
  if (filters?.difficulty !== undefined) params.append("difficulty", String(filters.difficulty));
  if (filters?.minDiff !== undefined) params.append("minDiff", String(filters.minDiff));
  if (filters?.maxDiff !== undefined) params.append("maxDiff", String(filters.maxDiff));
  if (filters?.tags?.length) params.append("tags", filters.tags.join(","));

  const queryString = params.toString();
  const url = `${API_BASE}/spots/random${queryString ? `?${queryString}` : ""}`;

  console.log("[API] Fetching random spot:", url);

  const res = await fetchWithTimeout(url);
  
  if (!res.ok) {
    if (res.status === 404) {
      throw new Error("No matching spot found");
    }
    const errorText = await res.text().catch(() => "Unknown error");
    throw new Error(`Failed to fetch spot: ${res.status} - ${errorText}`);
  }

  const data = await res.json();
  console.log("[API] Received spot:", data.id);
  
  return data as SpotData;
}

/**
 * Fetch a specific spot by ID
 * GET /spots/:id
 * 
 * @param id - Spot ID (e.g., "s201")
 * @returns Spot data
 * @throws Error if spot not found (404)
 * 
 * @example
 * const spot = await fetchSpotById("s201");
 */
export async function fetchSpotById(id: string): Promise<SpotData> {
  const url = `${API_BASE}/spots/${id}`;
  
  console.log("[API] Fetching spot by ID:", id);

  const res = await fetchWithTimeout(url);
  
  if (!res.ok) {
    if (res.status === 404) {
      throw new Error(`Spot not found: ${id}`);
    }
    throw new Error(`Failed to fetch spot: ${res.status}`);
  }

  return res.json();
}

/**
 * Submit a training result (for future analytics)
 * POST /results
 * 
 * @param data - Training result data
 * 
 * Note: This endpoint may not exist yet on backend.
 * Failures are logged but don't throw.
 */
export async function submitResult(data: {
  spotId: string;
  selectedAction: string;
  isCorrect: boolean;
  responseTimeMs: number;
  evLoss?: number;
}): Promise<void> {
  const url = `${API_BASE}/results`;

  console.log("[API] Submitting result for spot:", data.spotId);

  try {
    const res = await fetchWithTimeout(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      console.warn("[API] Failed to submit result:", res.status);
    }
  } catch (error) {
    console.warn("[API] Error submitting result:", error);
    // Don't throw - results are non-critical
  }
}

/**
 * Check if API is available
 * Useful for showing online/offline status
 */
export async function isApiAvailable(): Promise<boolean> {
  try {
    const health = await checkHealth();
    return health.status === "ok";
  } catch {
    return false;
  }
}
