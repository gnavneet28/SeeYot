import React from "react";
import { StyleSheet } from "react-native";
import Toast, { DURATION } from "react-native-easy-toast";

import defaultStyles from "../config/styles";

function ToastMessage({
  fadeInDuration = 250,
  fadeOutDuration = 1000,
  position = "center",
  reference,
}) {
  return (
    <Toast
      ref={reference}
      style={styles.toastMessage}
      position={position}
      positionValue={200}
      fadeInDuration={fadeInDuration}
      fadeOutDuration={fadeOutDuration}
      opacity={1}
      textStyle={[styles.toastText, { fontFamily: "Comic-Bold" }]}
    />
  );
}
const styles = StyleSheet.create({
  toastMessage: {
    backgroundColor: defaultStyles.colors.yellow,
    borderRadius: 10,
    maxWidth: "50%",
    paddingHorizontal: 10,
  },
  toastText: {
    color: defaultStyles.colors.dark,
    fontSize: 16,
    textAlign: "center",
  },
});

export default ToastMessage;
