import React from "react";
import { View } from "react-native";
import AppText from "./AppText";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { ScaledSheet, scale } from "react-native-size-matters";

import defaultStyles from "../config/styles";

function DescriptionItem({ name = "", style, description = "" }) {
  return (
    <View style={[styles.container, style]}>
      <MaterialCommunityIcons
        color={defaultStyles.colors.tomato}
        name={name}
        size={scale(20)}
        style={{ marginHorizontal: scale(8) }}
      />
      <AppText style={styles.description}>{description}</AppText>
    </View>
  );
}
const styles = ScaledSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.white,
    borderRadius: "10@s",
    elevation: 1,
    flexDirection: "row",
    marginVertical: "2@s",
    minHeight: "50@s",
    paddingVertical: "5@s",
    width: "100%",
  },
  description: {
    flexShrink: 1,
    fontSize: "14@s",
    letterSpacing: "0.3@s",
    paddingVertical: 0,
    textAlignVertical: "center",
  },
});

export default DescriptionItem;
