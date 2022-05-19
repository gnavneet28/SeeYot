import React from "react";
import { View, ActivityIndicator } from "react-native";
import { ScaledSheet, scale } from "react-native-size-matters";

import Option from "../components/Option";

import defaultStyles from "../config/styles";

function ApiOption({
  processing,
  onPress,
  title,
  disabled = false,
  indicatorSize = scale(16),
}) {
  return (
    <View style={styles.container}>
      {!processing ? (
        <Option title={title} onPress={onPress} disabled={disabled} />
      ) : (
        <ActivityIndicator
          size={indicatorSize}
          color={defaultStyles.colors.tomato}
        />
      )}
    </View>
  );
}
const styles = ScaledSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: "40@s",
    width: "100%",
  },
});

export default ApiOption;
