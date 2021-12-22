import React from "react";
import { View } from "react-native";
import { ScaledSheet } from "react-native-size-matters";

import defaultStyles from "../config/styles";

import AppText from "./AppText";

function InfoText({ information, style }) {
  return (
    <View style={[styles.container, style]}>
      <AppText style={styles.information}>{information}</AppText>
    </View>
  );
}
const styles = ScaledSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    padding: "2@s",
    width: "95%",
  },
  information: {
    color: defaultStyles.colors.dark_Variant,
    fontSize: "13@s",
    paddingHorizontal: "10@s",
    paddingVertical: 0,
    textAlign: "left",
    textAlignVertical: "center",
    width: "100%",
  },
});

export default InfoText;
