import React from "react";
import { View, Modal } from "react-native";
import { ScaledSheet } from "react-native-size-matters";

import defaultStyles from "../config/styles";
import AppText from "./AppText";

function SeeThought({ visible = false, setVisible, message = "" }) {
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
const styles = ScaledSheet.create({
  close: {
    backgroundColor: defaultStyles.colors.white,
    color: defaultStyles.colors.danger,
    fontSize: "14@s",
    height: "30@s",
    marginBottom: "5@s",
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
    borderRadius: "5@s",
    borderTopLeftRadius: "20@s",
    borderTopRightRadius: "20@s",
    justifyContent: "center",
    overflow: "hidden",
    width: "100%",
  },
  message: {
    color: defaultStyles.colors.dark_Variant,
    marginBottom: "15@s",
    textAlign: "center",
    width: "80%",
  },
  title: {
    borderBottomColor: defaultStyles.colors.light,
    borderBottomWidth: 1,
    color: defaultStyles.colors.blue,
    fontSize: "16@s",
    marginBottom: "10@s",
    textAlign: "center",
    width: "50%",
  },
});

export default SeeThought;
