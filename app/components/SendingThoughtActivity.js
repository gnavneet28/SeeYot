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
    color: defaultStyles.colors.blue,
  },
  container: {
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    flex: 1,
    justifyContent: "center",
    width: "100%",
  },
  contentContainer: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.white,
    borderRadius: 20,
    justifyContent: "center",
    padding: 5,
    width: 200,
  },
  doneButton: {
    backgroundColor: defaultStyles.colors.light,
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
    marginHorizontal: 5,
    marginVertical: 5,
    textAlign: "center",
    width: "95%",
  },
});

export default SendingThoughtActivity;
