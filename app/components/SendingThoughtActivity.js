import React from "react";
import { View, StyleSheet, Modal } from "react-native";
import LottieView from "lottie-react-native";

import AppButton from "./AppButton";
import AppText from "./AppText";

import defaultStyles from "../config/styles";

function SendingThoughtActivity({
  message,
  onDoneButtonPress,
  processing = true,
  visible,
  success,
  echoMessage,
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
              <LottieView
                autoPlay
                loop
                source={require("../assets/animations/sendingThought.json")}
                style={{ flex: 1 }}
              />
            ) : (
              <>
                <LottieView
                  autoPlay
                  loop
                  source={require("../assets/animations/messagesent.json")}
                  style={{ flex: 1, opacity: success ? 1 : 0 }}
                />
                <LottieView
                  autoPlay
                  loop
                  source={require("../assets/animations/failed.json")}
                  style={{ flex: 1, opacity: success ? 0 : 1 }}
                />
              </>
            )}
          </View>
          <AppText style={styles.message}>{message}</AppText>
          {echoMessage ? (
            <AppText style={styles.echoMessage}>{echoMessage.message}</AppText>
          ) : null}
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
const styles = StyleSheet.create({
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
    borderRadius: 20,
    borderWidth: 2,
    justifyContent: "center",
    overflow: "hidden",
    padding: 5,
    width: "60%",
  },
  doneButton: {
    backgroundColor: defaultStyles.colors.yellow_Variant,
    borderRadius: 20,
    height: 35,
    marginBottom: 10,
    width: 60,
  },
  echoMessage: {
    backgroundColor: defaultStyles.colors.yellow,
    borderRadius: 10,
    color: defaultStyles.colors.secondary,
    marginBottom: 5,
    marginHorizontal: 5,
    textAlign: "center",
    width: "95%",
  },
  loaderContainer: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.white,
    borderRadius: 10,
    height: 50,
    justifyContent: "space-between",
    width: 80,
  },
  message: {
    marginBottom: 15,
    marginHorizontal: 5,
    marginTop: 5,
    opacity: 0.8,
    opacity: 0.8,
    textAlign: "center",
    width: "95%",
  },
});

export default SendingThoughtActivity;
