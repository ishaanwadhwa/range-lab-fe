/**
 * App Entry Point
 * "Dark Confidence" design
 */

import React, { useState, useEffect, useCallback } from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaView, View, Text, StyleSheet } from "react-native";
import { RootNavigator } from "./src/navigation/RootNavigator";
import { OnboardingNavigator } from "./src/navigation/OnboardingNavigator";
import { getOnboardingStatus, setOnboardingCompleted } from "./src/storage";
import { colors } from "./src/theme/colors";

export default function App() {
  const [isReady, setIsReady] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        const hasCompletedOnboarding = await getOnboardingStatus();
        setShowOnboarding(!hasCompletedOnboarding);
        console.log("[App] Onboarding status:", hasCompletedOnboarding ? "completed" : "needed");
      } catch (error) {
        console.error("[App] Error checking onboarding status:", error);
        setShowOnboarding(false);
      } finally {
        setIsReady(true);
      }
    };

    checkOnboarding();
  }, []);

  const handleOnboardingComplete = useCallback(async () => {
    await setOnboardingCompleted();
    setShowOnboarding(false);
  }, []);

  // Loading state
  if (!isReady) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar style="light" />
        <View style={styles.loadingOrb}>
          <Text style={styles.loadingIcon}>♠</Text>
        </View>
      </View>
    );
  }

  // Onboarding for first-time users
  if (showOnboarding) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="light" />
        <OnboardingNavigator onComplete={handleOnboardingComplete} />
      </SafeAreaView>
    );
  }

  // Main app
  return (
    <NavigationContainer>
      <SafeAreaView style={styles.container}>
        <StatusBar style="light" />
        <RootNavigator />
      </SafeAreaView>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingOrb: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: colors.goldDim,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingIcon: {
    fontSize: 36,
    color: colors.gold,
  },
});
