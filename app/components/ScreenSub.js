import React from "react";
import { View } from "react-native";
import { ScaledSheet } from "react-native-size-matters";

import defaultStyles from "../config/styles";

function ScreenSub({ children, style }) {
  return <View style={[styles.container, style]}>{children}</View>;
}
const styles = ScaledSheet.create({
  container: {
    backgroundColor: defaultStyles.colors.white,
    borderTopLeftRadius: "5@s",
    borderTopRightRadius: "5@s",
    flex: 1,
    overflow: "hidden",
    width: "100%",
  },
});

export default ScreenSub;
