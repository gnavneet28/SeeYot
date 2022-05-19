import React from "react";
import { View, Platform } from "react-native";
import Constants from "expo-constants";
import { ScaledSheet } from "react-native-size-matters";

import AppText from "./AppText";
import useConnection from "../hooks/useConnection";

import defaultStyles from "../config/styles";

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

        <AppText style={styles.retry}>Retry</AppText>
      </View>
    );

  return null;
}
const styles = ScaledSheet.create({
  container: {
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: defaultStyles.colors.primary,
    borderBottomLeftRadius: "15@s",
    borderBottomRightRadius: "15@s",
    elevation: Platform.OS === "android" ? 1 : 0,
    justifyContent: "center",
    paddingVertical: "3@s",
    position: "absolute",
    top: Constants.statusBarHeight,
    width: "100%",
    zIndex: 1,
  },
  retry: {
    backgroundColor: defaultStyles.colors.white,
    borderRadius: "5@s",
    color: defaultStyles.colors.dark,
    marginBottom: "10@s",
    marginTop: "5@s",
    paddingHorizontal: "10@s",
    paddingVertical: "5@s",
  },
  text: {
    color: defaultStyles.colors.white,
    fontSize: "13@s",
    marginTop: "10@s",
    textAlign: "center",
  },
});

export default OfflineNotice;
