import React from "react";
import { View, Modal } from "react-native";
import LottieView from "lottie-react-native";
import { ScaledSheet } from "react-native-size-matters";

import AppButton from "./AppButton";
import AppText from "./AppText";

import defaultStyles from "../config/styles";

const load = require("../assets/animations/load.json");
const done = require("../assets/animations/done.json");
const failed = require("../assets/animations/failed.json");

function ApiActivity({
  message,
  onDoneButtonPress,
  processing = true,
  visible,
  success,
  onRequestClose,
}) {
  return (
    <Modal
      animationType="fade"
      onRequestClose={onRequestClose}
      transparent={true}
      visible={visible}
    >
      <View style={styles.container}>
        <View style={styles.contentContainer}>
          <View style={styles.loaderContainer}>
            {processing ? (
              <LottieView autoPlay loop source={load} style={{ flex: 1 }} />
            ) : (
              <>
                <LottieView
                  autoPlay
                  loop
                  source={done}
                  style={{ flex: 1, opacity: success ? 1 : 0 }}
                />
                <LottieView
                  autoPlay
                  loop
                  source={failed}
                  style={{ flex: 1, opacity: success ? 0 : 1 }}
                />
              </>
            )}
          </View>
          <AppText style={styles.message}>{message}</AppText>
          {!processing ? (
            <AppButton
              onPress={onDoneButtonPress}
              style={styles.doneButton}
              subStyle={styles.buttonSub}
              title="Ok"
            />
          ) : null}
        </View>
      </View>
    </Modal>
  );
}
const styles = ScaledSheet.create({
  buttonSub: {
    color: defaultStyles.colors.secondary,
  },
  container: {
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
    flex: 1,
    justifyContent: "center",
    width: "100%",
  },
  contentContainer: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.white,
    borderColor: defaultStyles.colors.dark_Variant,
    borderRadius: "20@s",
    borderWidth: "2@s",
    justifyContent: "center",
    overflow: "hidden",
    padding: "5@s",
    width: "60%",
  },
  doneButton: {
    backgroundColor: defaultStyles.colors.yellow_Variant,
    borderRadius: "20@s",
    height: "35@s",
    marginVertical: "5@s",
    width: "50@s",
  },
  loaderContainer: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.white,
    borderRadius: "10@s",
    height: "50@s",
    justifyContent: "space-between",
    width: "80@s",
  },
  message: {
    marginBottom: "15@s",
    marginHorizontal: "5@s",
    marginTop: "5@s",
    opacity: 0.8,
    textAlign: "center",
    width: "95%",
  },
});

export default ApiActivity;
