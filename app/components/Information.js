import React from "react";
import { View } from "react-native";
import { ScaledSheet } from "react-native-size-matters";

import AppText from "./AppText";

import defaultStyles from "../config/styles";

function Information({
  containerStyle,
  data,
  IconCategory,
  iconColor = defaultStyles.colors.blue,
  iconName,
  iconSize,
  infoDetails,
  information,
}) {
  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.iconContainer}>
        <IconCategory name={iconName} size={iconSize} color={iconColor} />
      </View>
      <View style={styles.infoContainer}>
        <AppText style={styles.information}>{information}</AppText>
        <AppText style={styles.informationDetails}>{infoDetails}</AppText>
      </View>

      <View style={styles.dataContainer}>
        <AppText style={styles.data}>{data}</AppText>
      </View>
    </View>
  );
}
const styles = ScaledSheet.create({
  container: {
    alignItems: "center",
    borderColor: defaultStyles.colors.lightGrey,
    borderRadius: "20@s",
    borderWidth: 1,
    flexDirection: "row",
    marginTop: "10@s",
    minHeight: "50@s",
    overflow: "hidden",
    width: "95%",
  },
  dataContainer: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: "50@s",
    width: "20%",
  },
  data: {
    color: defaultStyles.colors.tomato,
    fontSize: "18@s",
  },
  infoContainer: {
    borderColor: defaultStyles.colors.light,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    flexShrink: 1,
    justifyContent: "center",
    width: "100%",
  },
  iconContainer: {
    alignItems: "center",
    height: "50@s",
    justifyContent: "center",
    width: "20%",
  },

  information: {
    fontSize: "13@s",
  },
  informationDetails: {
    color: defaultStyles.colors.dark_Variant,
    fontSize: "12@s",
    paddingTop: 0,
  },
});

export default Information;
