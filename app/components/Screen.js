import React from "react";
import { View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomSafeAreaView from "./CustomSafeAreaView";

import defaultStyles from "../config/styles";

function Screen({ children, style }) {
  return (
    <CustomSafeAreaView style={[styles.screen]}>
      <View style={[styles.container, style]}>{children}</View>
    </CustomSafeAreaView>
  );
}
const styles = StyleSheet.create({
  screen: {
    backgroundColor: defaultStyles.colors.primary,
    width: "100%",
  },
  container: {
    backgroundColor: defaultStyles.colors.primary,
    flex: 1,
    width: "100%",
  },
});

export default Screen;
