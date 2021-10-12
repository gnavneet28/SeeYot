import React from "react";
import { View, StyleSheet, Modal } from "react-native";

import defaultStyles from "../config/styles";
import AppText from "./AppText";
import AppButton from "./AppButton";

function Alert({
  visible = false,
  title = "",
  description = "",
  rightPress = () => null,
  leftPress = () => null,
  rightOption = "",
  leftOption = "",
  onRequestClose,
}) {
  return (
    <Modal transparent visible={visible} onRequestClose={onRequestClose}>
      <View style={styles.container}>
        <View style={styles.alertContainer}>
          <AppText style={styles.title}>{title}</AppText>
          <AppText style={styles.description}>{description}</AppText>
          <View style={styles.actionButtonContainer}>
            <AppButton
              onPress={leftPress}
              style={styles.leftButton}
              subStyle={{ color: defaultStyles.colors.dark, fontSize: 17 }}
              title={leftOption}
            />
            <AppButton
              onPress={rightPress}
              style={styles.rightButton}
              subStyle={{ fontSize: 17 }}
              title={rightOption}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}
const styles = StyleSheet.create({
  actionButtonContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  alertContainer: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.white,
    borderRadius: 10,
    justifyContent: "space-between",
    padding: 10,
    width: "75%",
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
    textAlign: "center",
    textAlignVertical: "center",
  },
  leftButton: {
    backgroundColor: defaultStyles.colors.light,
    borderRadius: 5,
    height: 35,
    marginRight: 30,
    width: "30%",
  },
  rightButton: {
    borderRadius: 5,
    height: 35,
    width: "30%",
  },
  title: {
    color: defaultStyles.colors.blue,
    fontSize: 20,
    height: 30,
  },
});

export default Alert;
