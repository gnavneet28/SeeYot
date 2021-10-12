import React from "react";
import { View, StyleSheet } from "react-native";
import AppText from "./AppText";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import defaultStyles from "../config/styles";

function DescriptionItem({ name = "", style, description = "" }) {
  return (
    <View style={[styles.container, style]}>
      <MaterialCommunityIcons
        color={defaultStyles.colors.tomato}
        name={name}
        size={20}
        style={{ marginHorizontal: 8 }}
      />
      <AppText style={styles.description}>{description}</AppText>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.white,
    borderRadius: 10,
    elevation: 1,
    flexDirection: "row",
    height: 50,
    marginVertical: 5,
    width: "100%",
  },
  description: {
    flexShrink: 1,
    letterSpacing: 0.3,
    textAlignVertical: "center",
  },
});

export default DescriptionItem;
