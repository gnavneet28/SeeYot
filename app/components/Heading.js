import React from "react";
import { View } from "react-native";
import { ScaledSheet, scale } from "react-native-size-matters";

import AppText from "./AppText";
import Icon from "./Icon";

import defaultStyles from "../config/styles";

function Heading({ iconName, title, onPress, style }) {
  return (
    <View style={[styles.container, style]}>
      <Icon
        color={defaultStyles.colors.secondary}
        name={iconName}
        onPress={onPress}
        size={scale(22)}
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
    backgroundColor: defaultStyles.colors.white,
    flexDirection: "row",
    marginVertical: "10@s",
    paddingHorizontal: "5@s",
    width: "100%",
  },
  title: {
    borderBottomColor: defaultStyles.colors.light,
    borderBottomWidth: 1,
    fontSize: "15@s",
    textAlign: "left",
  },
});

export default Heading;
