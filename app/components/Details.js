import React from "react";
import { View } from "react-native";
import { ScaledSheet } from "react-native-size-matters";

import AppText from "./AppText";

import defaultStyles from "../config/styles";

function Details({ title, value, style }) {
  return (
    <View style={[styles.descriptionContainer, style]}>
      <AppText style={styles.descriptionTitle}>{title}</AppText>
      <AppText style={styles.value}>{value}</AppText>
    </View>
  );
}
const styles = ScaledSheet.create({
  descriptionContainer: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.light,
    borderColor: defaultStyles.colors.lightGrey,
    borderRadius: "5@s",
    borderWidth: 1,
    flexDirection: "row",
    height: "30@s",
    justifyContent: "space-between",
    marginVertical: "5@s",
    paddingHorizontal: "10@s",
    width: "85%",
  },
  descriptionTitle: {
    color: defaultStyles.colors.secondary,
    fontSize: "13@s",
  },
  value: {
    color: defaultStyles.colors.blue,
    fontSize: "13@s",
  },
});

export default Details;
