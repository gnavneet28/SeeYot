import React, { useState, useEffect, memo } from "react";
import { View, Platform } from "react-native";
import Constants from "expo-constants";
import { ScaledSheet } from "react-native-size-matters";
import NetInfo from "@react-native-community/netinfo";

import AppText from "./AppText";

import defaultStyles from "../config/styles";

function OfflineNotice(props) {
  const [isConnected, setIsConnected] = useState(true);

  let timeIntervalId;

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (state.isConnected && state.isInternetReachable === true) {
        setIsConnected(true);
      } else {
        setIsConnected(false);
      }
    });

    // Unsubscribe
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!isConnected) {
      timeIntervalId = setInterval(() => {
        handleRefresh();
      }, 2000);
    }

    return () => clearInterval(timeIntervalId);
  }, [isConnected]);

  const handleRefresh = () =>
    NetInfo.fetch().then((state) => {
      if (state.isConnected && state.isInternetReachable === true) {
        setIsConnected(true);
      } else {
        setIsConnected(false);
      }
    });

  const handleHideAlert = () => setIsConnected(true);

  if (!isConnected)
    return (
      <View style={styles.container}>
        <AppText style={styles.text}>
          Internet connection is either not available or not reachable! Try the
          following:
        </AppText>

        <AppText style={styles.info}>
          {`1. Reconnect to your Network.
2. Switch between connections if connected to wifi.`}
        </AppText>

        <AppText onPress={handleHideAlert} style={styles.retry}>
          Hide
        </AppText>
      </View>
    );

  return null;
}
const styles = ScaledSheet.create({
  container: {
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: "rgba(0,0,0,0.9)",
    borderBottomLeftRadius: "5@s",
    borderBottomRightRadius: "5@s",
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
    height: "25@s",
    marginBottom: "10@s",
    marginTop: "5@s",
    textAlign: "center",
    width: "70@s",
  },
  text: {
    color: defaultStyles.colors.white,
    fontSize: "13@s",
    marginTop: "10@s",
    textAlign: "center",
    width: "80%",
  },
  info: {
    color: defaultStyles.colors.white,
    fontSize: "13@s",
    textAlign: "left",
    width: "70%",
  },
});

export default memo(OfflineNotice);
