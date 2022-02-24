import React, { memo } from "react";
import { View, Modal } from "react-native";
import LottieView from "lottie-react-native";
import { scale, ScaledSheet } from "react-native-size-matters";
import Feather from "../../node_modules/react-native-vector-icons/Feather";

import AppButton from "./AppButton";
import AppText from "./AppText";
import EchoMessage from "./EchoMessage";

import defaultStyles from "../config/styles";

const sendingThought = "sendingThought.json";
const messageSent = "messagesent.json";
const failed = "failed.json";

function SendingThoughtActivity({
  echoMessage,
  message,
  onDoneButtonPress,
  onRequestClose,
  processing = true,
  success,
  visible,
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
                source={sendingThought}
                style={{ flex: 1 }}
              />
            ) : (
              <>
                <Feather
                  name="check"
                  size={scale(35)}
                  color={defaultStyles.colors.green}
                  style={{
                    borderRadius: 10,
                    opacity: success ? 1 : 0,
                  }}
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
          {echoMessage ? (
            <EchoMessage
              echoMessage={echoMessage.message}
              style={styles.echoMessageContainer}
            />
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
    borderWidth: 2,
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
  echoMessageContainer: {
    borderLeftColor: defaultStyles.colors.yellow_Variant,
    borderLeftWidth: 2,
    borderRadius: "5@s",
    marginBottom: "5@s",
    paddingBottom: "5@s",
    paddingHorizontal: "10@s",
    width: "90%",
  },
  loaderContainer: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.white,
    borderRadius: "10@s",
    height: "50@s",
    justifyContent: "center",
    width: "80@s",
  },
  message: {
    marginBottom: "10@s",
    marginHorizontal: "5@s",
    // marginTop: "5@s",
    opacity: 0.8,
    textAlign: "center",
    width: "95%",
  },
});

export default memo(SendingThoughtActivity);
