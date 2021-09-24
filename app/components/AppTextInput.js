import React from "react";
import { View, StyleSheet, TextInput } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import defaultStyles from "../config/styles";

function AppTextInput({
  iconColor = defaultStyles.colors.dark,
  iconName = "",
  iconSize = 30,
  multiline = false,
  numberOfLines = 1,
  style,
  subStyle,
  ...otherProps
}) {
  return (
    <View style={[styles.container, style]}>
      {iconName ? (
        <MaterialCommunityIcons
          color={iconColor}
          name={iconName}
          size={iconSize}
          style={{ marginHorizontal: 5 }}
        />
      ) : null}
      <TextInput
        {...otherProps}
        multiline={multiline}
        numberOfLines={numberOfLines}
        placeholderTextColor="grey"
        style={[
          {
            ...defaultStyles.text,
            fontFamily: "Comic-Bold",
            fontWeight: "normal",
            fontSize: 19,
            flex: 1,
          },
          subStyle,
        ]}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.white,
    borderRadius: 5,
    flexDirection: "row",
    height: defaultStyles.dimensionConstants.height,
    width: "100%",
  },
  textContent: {
    ...defaultStyles.text,
  },
});

export default AppTextInput;
