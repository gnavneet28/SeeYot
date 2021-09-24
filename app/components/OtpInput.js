import React from "react";
import { View, StyleSheet, TextInput } from "react-native";
import defaultStyles from "../config/styles";

function OtpInput({ onFocus, onChangeText, ref, value }) {
  return (
    <TextInput
      value={value}
      onFocus={onFocus}
      keyboardType="numeric"
      onChangeText={onChangeText}
      ref={ref}
      placeholder="0"
      maxLength={1}
      style={styles.container}
    />
  );
}
const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.white,
    borderRadius: 5,
    fontSize: 18,
    height: "100%",
    justifyContent: "center",
    textAlign: "center",
    width: "14%",
  },
});

export default OtpInput;
