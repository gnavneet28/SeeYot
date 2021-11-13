import React from "react";
import { View } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { ScaledSheet, scale } from "react-native-size-matters";

import AppText from "./AppText";

import defaultStyles from "../config/styles";

function ProfileOption({
  icon = "",
  iconColor = defaultStyles.colors.yellow_Variant,
  onPress,
  style,
  title = "",
}) {
  return (
    <View style={[styles.container, style]}>
      <MaterialIcons
        color={iconColor}
        name={icon}
        onPress={onPress}
        size={scale(20)}
        style={styles.icon}
      />
      <AppText onPress={onPress} style={styles.title}>
        {title}
      </AppText>
    </View>
  );
}
const styles = ScaledSheet.create({
  container: {
    alignItems: "center",
    flexDirection: "row",
    height: "32@s",
    marginVertical: "2@s",
    paddingHorizontal: "10@s",
    width: "100%",
  },
  icon: {
    marginLeft: "5@s",
  },
  title: {
    flex: 1,
    marginLeft: "8@s",
    opacity: 0.8,
  },
});

export default ProfileOption;
