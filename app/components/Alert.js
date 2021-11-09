import React from "react";
import { View, StyleSheet, Modal } from "react-native";

import defaultStyles from "../config/styles";
import AppText from "./AppText";
import AppButton from "./AppButton";

function Alert({
  description = "",
  leftOption = "",
  leftPress = () => null,
  onRequestClose,
  rightOption = "",
  rightPress = () => null,
  title = "",
  visible = false,
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
              subStyle={{ fontSize: 17, color: defaultStyles.colors.secondary }}
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
    marginBottom: 20,
  },
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
  leftButton: {
    backgroundColor: defaultStyles.colors.light,
    borderRadius: 20,
    height: 35,
    marginRight: 30,
    width: 70,
  },
  rightButton: {
    backgroundColor: defaultStyles.colors.yellow_Variant,
    borderRadius: 20,
    height: 35,
    width: 70,
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

export default Alert;
