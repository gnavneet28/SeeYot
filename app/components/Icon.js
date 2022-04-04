import React from "react";
import { View, TouchableWithoutFeedback } from "react-native";
import FontAwesome from "../../node_modules/react-native-vector-icons/FontAwesome";
import MaterialIcons from "../../node_modules/react-native-vector-icons/MaterialIcons";
import AntDesign from "../../node_modules/react-native-vector-icons/AntDesign";
import MaterialCommunityIcons from "../../node_modules/react-native-vector-icons/MaterialCommunityIcons";
import Feather from "../../node_modules/react-native-vector-icons/Feather";

import { ScaledSheet, scale } from "react-native-size-matters";

import defaultStyles from "../config/styles";

function Icon({
  color = defaultStyles.colors.dark,
  name = "",
  size = scale(30),
  style,
  icon = "MaterialIcons",
}) {
  return (
    <View style={[styles.container, style]}>
      {icon == "FontAwesome" ? (
        <FontAwesome name={name} color={color} size={size} />
      ) : null}
      {icon == "MaterialIcons" ? (
        <MaterialIcons name={name} color={color} size={size} />
      ) : null}
      {icon == "Feather" ? (
        <Feather name={name} color={color} size={size} />
      ) : null}
      {icon == "MaterialCommunityIcons" ? (
        <MaterialCommunityIcons name={name} color={color} size={size} />
      ) : null}
      {icon == "AntDesign" ? (
        <AntDesign name={name} color={color} size={size} />
      ) : null}
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
