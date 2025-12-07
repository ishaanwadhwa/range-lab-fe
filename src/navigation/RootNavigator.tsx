import React from "react";
import { Platform, StyleSheet } from "react-native";
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
        headerShown: false
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
        tabBarActiveTintColor: "#ffffff",
        tabBarInactiveTintColor: "#6B7280",
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarStyle: styles.tabBar,
        tabBarBackground: () =>
          Platform.OS === "ios" ? (
            <BlurView
              intensity={80}
              tint="dark"
              style={StyleSheet.absoluteFill}
            />
          ) : null
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
    backgroundColor:
      Platform.OS === "ios" ? "transparent" : "rgba(5, 8, 20, 0.95)",
    borderTopWidth: 0,
    elevation: 0,
    height: 88,
    paddingTop: 8,
    paddingBottom: Platform.OS === "ios" ? 28 : 12
  },
  tabBarLabel: {
    fontSize: 11,
    fontWeight: "600",
    marginTop: 4
  }
});
