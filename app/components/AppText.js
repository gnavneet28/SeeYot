import React from "react";
import { StyleSheet, Text } from "react-native";

import defaultStyles from "../config/styles";

function AppText({ children, style, onPress, ...otherProps }) {
  return (
    <Text
      {...otherProps}
      onPress={onPress}
      style={[
        styles.text,
        { fontFamily: "Comic-Bold" ? "Comic-Bold" : "Normal" },
        style,
      ]}
    >
      {children}
    </Text>
  );
}
const styles = StyleSheet.create({
  text: {
    ...defaultStyles.text,
    padding: 5,
  },
});

export default AppText;
