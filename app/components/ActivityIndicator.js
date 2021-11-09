import React from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import defaultStyles from "../config/styles";

function AppActivityIndicator(props) {
  return (
    <View style={styles.overlay}>
      <ActivityIndicator
        size={30}
        color={defaultStyles.colors.secondary}
        style={{ flex: 1 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    width: "100%",
  },
});

export default AppActivityIndicator;
