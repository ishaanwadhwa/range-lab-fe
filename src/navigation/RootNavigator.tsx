/**
 * RootNavigator - Main app navigation
 * "Dark Confidence" design
 */

import React from "react";
import { Platform, StyleSheet, View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { BlurView } from "expo-blur";
import { HomeScreen } from "../screens/HomeScreen";
import { SpotScreen } from "../screens/SpotScreen";
import { SpotsScreen } from "../screens/SpotsScreen";
import { StatsScreen } from "../screens/StatsScreen";
import { AnimatedDrillScreen } from "../screens/AnimatedDrillScreen";
import { TabBarIcon, TabIconName } from "../components/TabBarIcon";
import { colors } from "../theme/colors";

export type TrainStackParamList = {
  Home: undefined;
  AnimatedDrill: undefined;
  Spot: undefined;
};

export type RootTabParamList = {
  Train: undefined;
  Spots: undefined;
  Stats: undefined;
};

const TrainStack = createNativeStackNavigator<TrainStackParamList>();
const Tab = createBottomTabNavigator<RootTabParamList>();

const TrainStackNavigator: React.FC = () => {
  return (
    <TrainStack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.bg },
      }}
    >
      <TrainStack.Screen name="Home" component={HomeScreen} />
      <TrainStack.Screen name="AnimatedDrill" component={AnimatedDrillScreen} />
      <TrainStack.Screen name="Spot" component={SpotScreen} />
    </TrainStack.Navigator>
  );
};

export const RootNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      initialRouteName="Train"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color }) => (
          <TabBarIcon
            name={route.name.toLowerCase() as TabIconName}
            focused={focused}
            color={color}
          />
        ),
        tabBarActiveTintColor: colors.gold,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarStyle: styles.tabBar,
        tabBarBackground: () =>
          Platform.OS === "ios" ? (
            <BlurView
              intensity={60}
              tint="dark"
              style={[StyleSheet.absoluteFill, styles.blurBg]}
            />
          ) : (
            <View style={[StyleSheet.absoluteFill, styles.androidBg]} />
          ),
      })}
    >
      <Tab.Screen
        name="Train"
        component={TrainStackNavigator}
        options={{ title: "Train" }}
      />
      <Tab.Screen
        name="Spots"
        component={SpotsScreen}
        options={{ title: "Spots" }}
      />
      <Tab.Screen
        name="Stats"
        component={StatsScreen}
        options={{ title: "Stats" }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    backgroundColor: "transparent",
    borderTopWidth: 0,
    borderTopColor: colors.border,
    elevation: 0,
    height: 88,
    paddingTop: 8,
    paddingBottom: Platform.OS === "ios" ? 28 : 12,
  },
  blurBg: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  androidBg: {
    backgroundColor: "rgba(8, 9, 13, 0.98)",
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  tabBarLabel: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.5,
    marginTop: 4,
  },
});
