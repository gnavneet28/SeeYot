import React from "react";
import { View } from "react-native";
import { ScaledSheet } from "react-native-size-matters";

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
const styles = ScaledSheet.create({
  container: {
    alignItems: "center",
    flexDirection: "row",
    height: "40@s",
    justifyContent: "space-between",
    paddingHorizontal: "10@s",
    paddingVertical: "4@s",
    width: "100%",
  },
  name: {
    flexShrink: 1,
    fontSize: "14@s",
    width: "70%",
  },
  code: {
    color: defaultStyles.colors.blue,
    marginHorizontal: "10@s",
    textAlign: "center",
    width: "60@s",
  },
});

export default CountrySelectionCard;
