import React from "react";
import { View, StyleSheet } from "react-native";

import AppTextInput from "./AppTextInput";

import defaultStyles from "../config/styles";

function PhoneInput({ number, onChangeNumber = () => null, style }) {
  return (
    <View style={[styles.container, style]}>
      <AppTextInput
        defaultValue="+91"
        editable={false}
        style={styles.countryCode}
        textAlign="center"
      />
      <AppTextInput
        subStyle={{
          height: "100%",
          letterSpacing: 2,
          textAlign: "left",
        }}
        autoCompleteType="tel"
        keyboardType="phone-pad"
        textContentType="telephoneNumber"
        maxLength={10}
        onChangeText={(number) => onChangeNumber(number)}
        placeholder="Enter mobile number"
        style={styles.number}
        value={number}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.white,
    borderRadius: 4,
    flexDirection: "row",
    height: defaultStyles.dimensionConstants.height,
    justifyContent: "space-between",
    overflow: "hidden",
    width: "100%",
  },
  countryCode: {
    borderColor: defaultStyles.colors.primary,
    borderRadius: 0,
    borderRightWidth: 2,
    height: "100%",
    width: "20%",
  },
  number: {
    borderRadius: 25,
    height: "100%",
    width: "65%",
  },
});

export default PhoneInput;
