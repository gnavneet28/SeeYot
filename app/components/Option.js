import React from "react";
import { StyleSheet, TouchableHighlight } from "react-native";

import defaultStyles from "../config/styles";

import AppText from "./AppText";

function Option({ onPress, title, titleStyle, containerStyle }) {
  return (
    <TouchableHighlight
      underlayColor={defaultStyles.colors.light}
      onPress={onPress}
      style={[styles.container, containerStyle]}
    >
      <AppText style={[styles.option, titleStyle]}>{title}</AppText>
    </TouchableHighlight>
  );
}
const styles = StyleSheet.create({
  container: {
    borderBottomColor: defaultStyles.colors.light,
    borderBottomWidth: 1,
    height: defaultStyles.dimensionConstants.height,
    width: "100%",
  },
  option: {
    fontSize: 18,
    height: defaultStyles.dimensionConstants.height,
    opacity: 0.9,
    textAlign: "center",
    textAlignVertical: "center",
    width: "100%",
  },
});

export default Option;
