import React from "react";
import { View, StyleSheet, Modal } from "react-native";

import defaultStyles from "../config/styles";
import AppButton from "./AppButton";
import AppText from "./AppText";

function SeeThought({ visible = false, setVisible, message = "" }) {
  return (
    <Modal
      transparent
      onRequestClose={() => setVisible(false)}
      visible={visible}
    >
      <View style={styles.container}>
        <View style={styles.mainContainer}>
          <AppText style={styles.title}>Thought</AppText>
          <AppText style={styles.message}>{message}</AppText>
          <AppButton
            subStyle={styles.buttonSub}
            style={styles.button}
            title="Close"
            onPress={() => setVisible(false)}
          />
        </View>
      </View>
    </Modal>
  );
}
const styles = StyleSheet.create({
  button: {
    backgroundColor: defaultStyles.colors.light,
    height: 30,
    marginBottom: 5,
    width: "40%",
  },
  buttonSub: {
    color: defaultStyles.colors.secondary,
  },
  container: {
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    flex: 1,
    justifyContent: "center",
    width: "100%",
  },
  mainContainer: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.white,
    borderRadius: 5,
    justifyContent: "center",
    padding: 5,
    width: "50%",
  },
  message: {
    marginBottom: 15,
    opacity: 0.7,
    textAlign: "center",
  },
  title: {
    color: defaultStyles.colors.blue,
    fontSize: 18,
    marginBottom: 10,
    textAlign: "center",
    width: "100%",
  },
});

export default SeeThought;
