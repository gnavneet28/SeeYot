import React from "react";
import LinearGradient from "react-native-linear-gradient";
import { ScaledSheet } from "react-native-size-matters";

import AppButton from "./AppButton";
import AppText from "./AppText";

import defaultStyles from "../config/styles";
import ApiProcessingContainer from "./ApiProcessingContainer";

function PlanCard({
  _id,
  planName,
  planDuration,
  planRate,
  onProcess,
  style,
  processing,
}) {
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
      <ApiProcessingContainer
        processing={processing == _id}
        style={styles.apiProcessingContainer}
      >
        <AppButton
          style={styles.button}
          subStyle={{ color: defaultStyles.colors.dark }}
          title="Select"
          onPress={() => onProcess(_id)}
        />
      </ApiProcessingContainer>
    </LinearGradient>
  );
}
const styles = ScaledSheet.create({
  apiProcessingContainer: {
    backgroundColor: defaultStyles.colors.white,
    borderRadius: "20@s",
    height: "30@s",
    marginBottom: "5@s",
    width: "70%",
  },
  button: {
    backgroundColor: defaultStyles.colors.white,
    borderRadius: "20@s",
    height: "30@s",
    // marginBottom: "5@s",
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
