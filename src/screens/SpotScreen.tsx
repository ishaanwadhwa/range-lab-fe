import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { TrainStackParamList } from "../navigation/RootNavigator";
import { PokerTable } from "../components/PokerTable";
import { ActionBar } from "../components/ActionBar";
import { colors } from "../theme/colors";

type Props = NativeStackScreenProps<TrainStackParamList, "Spot">;

export const SpotScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>‹</Text>
        </Pressable>
        <Text style={styles.title}>Turn Decision</Text>
      </View>

      {/* Table */}
      <View style={styles.tableArea}>
        <PokerTable
          heroHand={["Q♠", "A♥"]}
          board={["9♣", "T♠", "2♦", "5♥"]}
          pot="17.23"
        />
      </View>

      {/* Actions */}
      <ActionBar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#333",
    alignItems: "center",
    justifyContent: "center",
  },
  backText: {
    color: "#fff",
    fontSize: 22,
    marginTop: -2,
  },
  title: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
    marginLeft: 12,
  },
  tableArea: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 8,
  },
});
