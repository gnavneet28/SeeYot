import React from "react";
import { View, StyleSheet } from "react-native";

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
const styles = StyleSheet.create({
  descriptionContainer: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.light,
    borderColor: defaultStyles.colors.lightGrey,
    borderRadius: 5,
    borderWidth: 1,
    flexDirection: "row",
    height: 40,
    justifyContent: "space-between",
    marginVertical: 10,
    paddingHorizontal: 20,
    width: "85%",
  },
  descriptionTitle: {
    color: defaultStyles.colors.secondary,
  },
  value: {
    color: defaultStyles.colors.blue,
  },
});

export default Details;
