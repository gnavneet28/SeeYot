import React from "react";
import { View, ActivityIndicator } from "react-native";
import { ScaledSheet, scale } from "react-native-size-matters";

import useConnection from "../hooks/useConnection";
import Option from "../components/Option";

import defaultStyles from "../config/styles";

function ApiOption({ processing, onPress, title }) {
  const isConnected = useConnection();
  return (
    <View style={styles.container}>
      {!processing ? (
        <Option title={title} onPress={onPress} disabled={!isConnected} />
      ) : (
        <ActivityIndicator
          size={scale(16)}
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
