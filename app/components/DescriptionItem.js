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
        size={scale(18)}
        style={{ marginHorizontal: scale(8) }}
      />
      <AppText style={styles.description}>{description}</AppText>
    </View>
  );
}
const styles = ScaledSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.light,
    borderRadius: "10@s",
    flexDirection: "row",
    marginVertical: "4@s",
    minHeight: "40@s",
    paddingVertical: "5@s",
    width: "100%",
  },
  description: {
    flexShrink: 1,
    fontSize: "13@s",
    letterSpacing: "0.3@s",
    paddingVertical: 0,
    textAlignVertical: "center",
  },
});

export default DescriptionItem;
