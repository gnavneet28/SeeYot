import React from "react";
import { View, StyleSheet } from "react-native";

import AppText from "./AppText";
import Icon from "./Icon";

import defaultStyles from "../config/styles";

function Heading({ iconName, title, onPress }) {
  return (
    <View style={styles.container}>
      <Icon
        color={defaultStyles.colors.tomato}
        name={iconName}
        onPress={onPress}
        size={25}
      />
      <AppText onPress={onPress} style={styles.title}>
        {title}
      </AppText>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.white,
    flexDirection: "row",
    marginVertical: 10,
    paddingHorizontal: 5,
    width: "100%",
  },
  title: {
    borderBottomColor: defaultStyles.colors.light,
    borderBottomWidth: 1,
    fontSize: 17,
    textAlign: "left",
  },
});

export default Heading;
