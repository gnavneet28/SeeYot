import React from "react";
import { TouchableOpacity, StyleSheet, Text } from "react-native";

import defaultStyles from "../config/styles";

const height = defaultStyles.height;

function AppButton({
  onPress = () => null,
  title = "",
  style,
  subStyle,
  ...otherProps
}) {
  return (
    <TouchableOpacity
      {...otherProps}
      activeOpacity={0.6}
      onPress={onPress}
      style={[styles.container, style]}
    >
      <Text style={[styles.text, { fontFamily: "Comic-Bold" }, subStyle]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.secondary,
    borderRadius: 5,
    height: height > 640 ? height * 0.058 : height * 0.07,
    justifyContent: "center",
    width: "100%",
  },
  text: {
    ...defaultStyles.text,
    color: defaultStyles.colors.white,
    fontSize: height * 0.022,
  },
});

export default AppButton;
