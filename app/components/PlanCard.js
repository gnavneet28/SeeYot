import React from "react";
import { StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import AppButton from "./AppButton";
import AppText from "./AppText";

import defaultStyles from "../config/styles";

const height = defaultStyles.height;

function PlanCard({ planName, planDuration, planRate, onProcess, style }) {
  return (
    <LinearGradient
      colors={["#FC5C7D", "#6A82FB"]}
      style={[styles.container, style]}
    >
      <AppText style={styles.planName}>{planName}</AppText>
      <AppText style={styles.planRate}>
        {"\u20B9"} {planRate}
      </AppText>
      <AppText style={styles.planDuration}>{planDuration}</AppText>
      <AppButton
        style={styles.button}
        subStyle={{ color: defaultStyles.colors.dark }}
        title="Select"
        onPress={onProcess}
      />
    </LinearGradient>
  );
}
const styles = StyleSheet.create({
  button: {
    backgroundColor: defaultStyles.colors.white,
    borderRadius: 20,
    height: 30,
    width: "70%",
  },
  container: {
    alignItems: "center",
    borderRadius: 10,
    elevation: 5,
    height: 150,
    marginHorizontal: 5,
    marginVertical: 10,
    padding: 5,
    width: 150,
  },
  planDuration: {
    color: defaultStyles.colors.yellow,
    marginBottom: 5,
  },
  planName: {
    fontSize: 20,
    marginBottom: 2,
  },
  planRate: {
    color: defaultStyles.colors.white,
    fontSize: 22,
    marginBottom: 5,
  },
});

export default PlanCard;
