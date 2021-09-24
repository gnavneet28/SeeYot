import React from "react";
import { View, StyleSheet } from "react-native";
import AppText from "./AppText";
import defaultStyles from "../config/styles";

function CountrySelectionCard({ country, onPress }) {
  return (
    <View style={styles.container}>
      <AppText onPress={onPress} style={styles.name}>
        {country.name}
      </AppText>
      <AppText onPress={onPress} style={styles.code}>
        {country.code}
      </AppText>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flexDirection: "row",
    height: 45,
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingVertical: 4,
    width: "100%",
  },
  name: {
    width: "70%",
    flexShrink: 1,
  },
  code: {
    width: 60,
    marginHorizontal: 10,
    color: defaultStyles.colors.blue,
    textAlign: "center",
  },
});

export default CountrySelectionCard;
