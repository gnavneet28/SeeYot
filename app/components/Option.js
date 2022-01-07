import React from "react";
import { StyleSheet, TouchableHighlight } from "react-native";
import { ScaledSheet } from "react-native-size-matters";

import defaultStyles from "../config/styles";

import AppText from "./AppText";

function Option({ onPress, title, titleStyle, containerStyle, disabled }) {
  return (
    <TouchableHighlight
      disabled={disabled}
      underlayColor={defaultStyles.colors.light}
      onPress={onPress}
      style={[styles.container, containerStyle]}
    >
      <AppText style={[styles.option, titleStyle]}>{title}</AppText>
    </TouchableHighlight>
  );
}
const styles = ScaledSheet.create({
  container: {
    borderBottomColor: defaultStyles.colors.light,
    borderBottomWidth: 1,
    height: "40@s",
    width: "100%",
  },
  option: {
    fontSize: "14.5@s",
    height: "40@s",
    opacity: 0.9,
    textAlign: "center",
    textAlignVertical: "center",
    width: "100%",
  },
});

export default Option;
