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
              subStyle={{ color: defaultStyles.colors.secondary }}
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
    borderColor: defaultStyles.colors.dark_Variant,
    borderRadius: 20,
    borderWidth: 2,
    justifyContent: "space-between",
    overflow: "hidden",
    width: "65%",
  },
  actionButtonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 15,
  },
  container: {
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
    flex: 1,
    justifyContent: "center",
    width: "100%",
  },
  description: {
    fontSize: 18,
    marginBottom: 15,
    marginTop: 2,
    opacity: 0.8,
    paddingHorizontal: 10,
    textAlign: "center",
    textAlignVertical: "center",
    width: "95%",
  },
  okButton: {
    backgroundColor: defaultStyles.colors.yellow_Variant,
    borderRadius: 20,
    height: 40,
    marginVertical: 5,
    width: 60,
  },
  title: {
    backgroundColor: defaultStyles.colors.dark_Variant,
    color: defaultStyles.colors.white,
    fontSize: 18,
    marginBottom: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
    textAlign: "center",
    width: "100%",
  },
});

export default memo(InfoAlert);
