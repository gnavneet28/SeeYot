import React from "react";
import { View, Modal } from "react-native";
import { ScaledSheet } from "react-native-size-matters";

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
              subStyle={{ color: defaultStyles.colors.dark }}
              title={leftOption}
            />
            <AppButton
              onPress={rightPress}
              style={styles.rightButton}
              subStyle={{ color: defaultStyles.colors.secondary }}
              title={rightOption}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}
const styles = ScaledSheet.create({
  actionButtonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: "10@s",
  },
  alertContainer: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.white,
    borderColor: defaultStyles.colors.dark_Variant,
    borderRadius: "20@s",
    borderWidth: "2@s",
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
    color: defaultStyles.colors.dark_Variant,
    fontSize: "14@s",
    marginBottom: "15@s",
    marginTop: "2@s",
    opacity: 0.8,
    paddingHorizontal: "10@s",
    textAlign: "center",
    textAlignVertical: "center",
    width: "95%",
  },
  leftButton: {
    backgroundColor: defaultStyles.colors.light,
    borderRadius: "20@s",
    height: "35@s",
    marginRight: "20@s",
    width: "70@s",
  },
  rightButton: {
    backgroundColor: defaultStyles.colors.yellow_Variant,
    borderRadius: "20@s",
    height: "35@s",
    width: "70@s",
  },
  title: {
    backgroundColor: defaultStyles.colors.dark_Variant,
    color: defaultStyles.colors.white,
    fontSize: "16@s",
    marginBottom: "10@s",
    paddingHorizontal: "10@s",
    paddingVertical: "10@s",
    textAlign: "center",
    width: "100%",
  },
});

export default Alert;
