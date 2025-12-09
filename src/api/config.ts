/**
 * API Configuration
 * 
 * For local development:
 * - iOS Simulator: use your machine's local IP
 * - Android Emulator: use 10.0.2.2
 * - Physical device: use your machine's local IP (run: ipconfig getifaddr en0)
 */

import { Platform } from "react-native";

// Your local machine IP (update this if it changes)
// Run: ipconfig getifaddr en0
const LOCAL_IP = "192.168.1.5";

const getDevUrl = () => {
  if (Platform.OS === "android") {
    return "http://10.0.2.2:3000";
  }
  // iOS simulator and physical device - use actual IP
  return `http://${LOCAL_IP}:3000`;
};

export const API_BASE = __DEV__ ? getDevUrl() : "https://api.rangelab.app";

// Request timeout in ms
export const REQUEST_TIMEOUT = 10000;

