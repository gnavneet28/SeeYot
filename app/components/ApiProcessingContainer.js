import React from "react";
import { View, ActivityIndicator } from "react-native";
import { ScaledSheet, scale } from "react-native-size-matters";

import defaultStyles from "../config/styles";

function ApiProcessingContainer({ children, processing, style }) {
  if (processing)
    return (
      <View style={[styles.container, style]}>
        <ActivityIndicator
          size={scale(16)}
          color={defaultStyles.colors.tomato}
        />
      </View>
    );

  return <View style={[styles.container, style]}>{children}</View>;
}
const styles = ScaledSheet.create({
  container: {
    padding: "2@s",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ApiProcessingContainer;
