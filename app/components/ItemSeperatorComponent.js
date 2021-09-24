import React from "react";
import { View, StyleSheet } from "react-native";

import defaultStyles from "../config/styles";

function ItemSeperatorComponent({ style }) {
  return <View style={[styles.container, style]} />;
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: defaultStyles.colors.white,
    height: 2,
    width: "100%",
  },
});

export default ItemSeperatorComponent;
