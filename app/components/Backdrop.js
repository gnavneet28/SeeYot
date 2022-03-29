import React from "react";
import { View, StyleSheet, TouchableWithoutFeedback } from "react-native";

function Backdrop({ onPress }) {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={styles.container} />
    </TouchableWithoutFeedback>
  );
}
const styles = StyleSheet.create({
  container: {
    flexShrink: 1,
    height: "100%",
    width: "100%",
  },
});

export default Backdrop;
