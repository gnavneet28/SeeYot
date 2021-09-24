import React from "react";
import { View, StyleSheet } from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import defaultStyles from "../config/styles";

// fw = fontAwesome

function Icon({
  color = defaultStyles.colors.dark,
  fw,
  name = "",
  size = 30,
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
const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    height: 50,
    justifyContent: "center",
    width: 50,
  },
});

export default Icon;
