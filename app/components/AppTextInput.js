import React from "react";
import { View, TextInput } from "react-native";
import MaterialCommunityIcons from "../../node_modules/react-native-vector-icons/MaterialCommunityIcons";
import { ScaledSheet, scale } from "react-native-size-matters";

import defaultStyles from "../config/styles";

function AppTextInput({
  iconColor = defaultStyles.colors.dark,
  iconName = "",
  iconSize = scale(30),
  multiline = false,
  numberOfLines = 1,
  style,
  subStyle,
  value,
  ...otherProps
}) {
  return (
    <View style={[styles.container, style]}>
      {iconName ? (
        <MaterialCommunityIcons
          color={iconColor}
          name={iconName}
          size={iconSize}
          style={{ marginHorizontal: scale(5) }}
        />
      ) : null}
      <TextInput
        value={value}
        {...otherProps}
        multiline={multiline}
        numberOfLines={numberOfLines}
        placeholderTextColor="grey"
        style={[
          {
            ...defaultStyles.text,
            fontFamily: "ComicNeue-Bold",
            fontSize: scale(15),
            flex: 1,
            fontWeight: "normal",
          },
          subStyle,
        ]}
      />
    </View>
  );
}
const styles = ScaledSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.white,
    borderRadius: "5@s",
    flexDirection: "row",
    height: defaultStyles.dimensionConstants.height,
    width: "100%",
    overflow: "hidden",
    padding: "5@s",
  },
});

export default AppTextInput;
