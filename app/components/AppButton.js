import React from "react";
import { TouchableOpacity, Text } from "react-native";
import { ScaledSheet } from "react-native-size-matters";

import defaultStyles from "../config/styles";

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
const styles = ScaledSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.secondary,
    borderRadius: "5@s",
    height: "50@s",
    justifyContent: "center",
    width: "100%",
  },
  text: {
    ...defaultStyles.text,
    color: defaultStyles.colors.white,
    fontSize: "14.5@s",
  },
});

export default AppButton;
