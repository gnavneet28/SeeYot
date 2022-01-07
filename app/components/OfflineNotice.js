import React from "react";
import { View, Platform } from "react-native";
import Constants from "expo-constants";
import { ScaledSheet } from "react-native-size-matters";

import AppText from "./AppText";
import useConnection from "../hooks/useConnection";

import colors from "../config/colors";

function OfflineNotice(props) {
  const isConnected = useConnection();

  if (!isConnected)
    return (
      <View style={styles.container}>
        <AppText style={styles.text}>No internet connection available!</AppText>
      </View>
    );

  return null;
}
const styles = ScaledSheet.create({
  container: {
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: colors.danger,
    elevation: Platform.OS === "android" ? 1 : 0,
    height: "25@s",
    justifyContent: "center",
    position: "absolute",
    top: Constants.statusBarHeight,
    width: "100%",
    zIndex: 1,
  },
  text: {
    color: colors.white,
    fontSize: "13@s",
  },
});

export default OfflineNotice;
