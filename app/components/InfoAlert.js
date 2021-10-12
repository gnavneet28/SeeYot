import React, { memo } from "react";
import { View, StyleSheet, Modal } from "react-native";

import defaultStyles from "../config/styles";
import AppText from "./AppText";
import AppButton from "./AppButton";

function InfoAlert({ description = "", leftPress, visible = false }) {
  return (
    <Modal animationType="fade" transparent visible={visible}>
      <View style={styles.container}>
        <View style={styles.alertContainer}>
          <AppText style={styles.title}>Message</AppText>
          <AppText style={styles.description}>{description}</AppText>
          <View style={styles.actionButtonContainer}>
            <AppButton
              onPress={leftPress}
              style={styles.okButton}
              subStyle={{ color: defaultStyles.colors.dark }}
              title="Ok"
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}
const styles = StyleSheet.create({
  alertContainer: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.white,
    borderRadius: 10,
    justifyContent: "space-between",
    padding: 10,
    width: "75%",
  },
  actionButtonContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
    flex: 1,
    justifyContent: "center",
    width: "100%",
  },
  description: {
    fontSize: 18,
    marginBottom: 10,
    marginTop: 2,
    opacity: 0.8,
    textAlign: "center",
    textAlignVertical: "center",
  },
  okButton: {
    backgroundColor: defaultStyles.colors.light,
    borderRadius: 5,
    height: 35,
    marginVertical: 5,
    width: 90,
  },
  title: {
    color: defaultStyles.colors.blue,
    fontSize: 20,
    height: 30,
  },
});

export default memo(InfoAlert);
