import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { ScaledSheet } from "react-native-size-matters";

import AppButton from "./AppButton";
import AppText from "./AppText";

import defaultStyles from "../config/styles";

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
const styles = ScaledSheet.create({
  button: {
    backgroundColor: defaultStyles.colors.white,
    borderRadius: "20@s",
    height: "30@s",
    marginBottom: "5@s",
    width: "70%",
  },
  container: {
    alignItems: "center",
    borderRadius: "10@s",
    elevation: 5,
    marginHorizontal: "5@s",
    marginVertical: "10@s",
    padding: "5@s",
    width: "140@s",
  },
  planDuration: {
    color: defaultStyles.colors.yellow,
    marginBottom: "5@s",
  },
  planName: {
    fontSize: "16@s",
    marginBottom: "2@s",
  },
  planRate: {
    color: defaultStyles.colors.white,
    fontSize: "18@s",
    marginBottom: "5@s",
  },
});

export default PlanCard;
