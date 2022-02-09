import React from "react";
import { View } from "react-native";
import { ScaledSheet } from "react-native-size-matters";
import Constants from "expo-constants";

import AppText from "./AppText";
import defaultStyles from "../config/styles";

function SuccessMessage({ message = "This is a success message." }) {
  return (
    <View style={styles.container}>
      <View style={styles.containerSub}>
        <AppText style={styles.message}>{message}</AppText>
      </View>
    </View>
  );
}
const styles = ScaledSheet.create({
  container: {
    paddingTop: Constants.statusBarHeight,
    alignItems: "center",
    backgroundColor: defaultStyles.colors.green,
    borderBottomLeftRadius: "20@s",
    borderBottomRightRadius: "20@s",
    elevation: Platform.OS === "android" ? 1 : 0,
    justifyContent: "center",
    paddingHorizontal: "10@s",
    paddingVertical: "5@s",
    position: "absolute",
    top: 0,
    width: "100%",
    zIndex: 122,
  },
  containerSub: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.green,
    justifyContent: "center",
    height: "35@s",
    width: "100%",
  },
  message: {
    color: defaultStyles.colors.white,
    fontSize: "14@s",
    textAlign: "center",
    textAlignVertical: "center",
  },
});

export default SuccessMessage;
