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
        <AppText style={styles.text}>
          Internet connection is either not available or not reachable! Try
          switching on and off your internet connection if you think you have
          active internet connection.
        </AppText>
      </View>
    );

  return null;
}
const styles = ScaledSheet.create({
  container: {
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: colors.danger,
    borderBottomLeftRadius: "20@s",
    borderBottomRightRadius: "20@s",
    elevation: Platform.OS === "android" ? 1 : 0,
    justifyContent: "center",
    paddingVertical: "3@s",
    position: "absolute",
    top: Constants.statusBarHeight,
    width: "100%",
    zIndex: 1,
  },
  text: {
    color: colors.white,
    fontSize: "13@s",
    textAlign: "center",
  },
});

export default OfflineNotice;
