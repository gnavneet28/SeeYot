import React from "react";
import { View } from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { ScaledSheet, scale } from "react-native-size-matters";

import defaultStyles from "../config/styles";

// fw = fontAwesome

function Icon({
  color = defaultStyles.colors.dark,
  fw,
  name = "",
  size = scale(30),
  style,
}) {
  return (
    <View style={[styles.container, style]}>
      {fw ? (
        <FontAwesome name={name} color={color} size={size} />
      ) : (
        <MaterialIcons name={name} color={color} size={size} />
      )}
    </View>
  );
}
const styles = ScaledSheet.create({
  container: {
    alignItems: "center",
    height: "40@s",
    justifyContent: "center",
    width: "40@s",
  },
});

export default Icon;
