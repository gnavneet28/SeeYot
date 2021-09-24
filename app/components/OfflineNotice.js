import React from "react";
import { View, StyleSheet, Platform } from "react-native";
import Constants from "expo-constants";

import AppText from "./AppText";
import useConnection from "../hooks/useConnection";

import colors from "../config/colors";

function OfflineNotice(props) {
  const isConnected = useConnection();

  if (isConnected)
    return (
      <View style={styles.container}>
        <AppText style={styles.text}>No internet connection available!</AppText>
      </View>
    );

  return null;
}
const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: colors.yellow,
    elevation: Platform.OS === "android" ? 1 : 0,
    height: 60,
    justifyContent: "center",
    position: "absolute",
    top: Constants.statusBarHeight,
    width: "100%",
    zIndex: 1,
  },
  text: {
    color: colors.primary,
  },
});

export default OfflineNotice;
