import React from "react";
import { View, StyleSheet } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import AppText from "./AppText";

import defaultStyles from "../config/styles";

function ProfileOption({
  icon = "",
  title = "",
  onPress,
  style,
  iconColor = defaultStyles.colors.yellow_Variant,
}) {
  return (
    <View style={[styles.container, style]}>
      <MaterialIcons
        style={styles.icon}
        color={iconColor}
        name={icon}
        onPress={onPress}
        size={25}
      />
      <AppText
        onPress={onPress}
        style={{
          flex: 1,
          marginLeft: 10,
          opacity: 0.8,
        }}
      >
        {title}
      </AppText>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flexDirection: "row",
    height: 40,
    marginVertical: 2,
    paddingHorizontal: 10,
    width: "100%",
  },
  icon: {
    marginLeft: 5,
  },
  title: {
    flex: 1,
    marginLeft: 10,
  },
});

export default ProfileOption;
