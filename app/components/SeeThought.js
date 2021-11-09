import React from "react";
import { View, StyleSheet, Modal } from "react-native";

import defaultStyles from "../config/styles";
import AppText from "./AppText";

function SeeThought({
  visible = false,
  setVisible,
  message = "Hi man how are you! Its nice to meet you.",
}) {
  return (
    <Modal
      animationType="none"
      transparent
      onRequestClose={() => setVisible(false)}
      visible={visible}
    >
      <View style={styles.container}>
        <View style={styles.mainContainer}>
          <AppText style={styles.close} onPress={() => setVisible(false)}>
            Close
          </AppText>
          <AppText style={styles.title}>Thought</AppText>
          <AppText style={styles.message}>{message}</AppText>
        </View>
      </View>
    </Modal>
  );
}
const styles = StyleSheet.create({
  close: {
    backgroundColor: defaultStyles.colors.white,
    color: defaultStyles.colors.tomato,
    height: 30,
    marginBottom: 5,
    textAlign: "center",
    width: "100%",
  },
  container: {
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    flex: 1,
    justifyContent: "flex-end",
    width: "100%",
  },
  mainContainer: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.white,
    borderRadius: 5,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    justifyContent: "center",
    overflow: "hidden",
    width: "100%",
  },
  message: {
    color: defaultStyles.colors.dark_Variant,
    marginBottom: 15,
    textAlign: "center",
    width: "80%",
  },
  title: {
    borderBottomColor: defaultStyles.colors.light,
    borderBottomWidth: 1,
    color: defaultStyles.colors.blue,
    fontSize: 20,
    marginBottom: 10,
    textAlign: "center",
    width: "50%",
  },
});

export default SeeThought;
