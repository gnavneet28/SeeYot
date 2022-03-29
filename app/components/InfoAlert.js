import React, { memo } from "react";
import { View, Modal } from "react-native";
import { ScaledSheet } from "react-native-size-matters";
import * as Animatable from "react-native-animatable";

import defaultStyles from "../config/styles";
import AppText from "./AppText";
import AppButton from "./AppButton";

function InfoAlert({ description = "", leftPress, visible = false }) {
  return (
    <Modal animationType="none" transparent visible={visible}>
      <View style={[styles.container]}>
        <Animatable.View
          useNativeDriver={true}
          animation="shake"
          style={styles.alertContainer}
        >
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
        </Animatable.View>
      </View>
    </Modal>
  );
}
const styles = ScaledSheet.create({
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
  actionButtonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: "5@s",
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
  okButton: {
    backgroundColor: defaultStyles.colors.yellow_Variant,
    borderRadius: "20@s",
    height: "35@s",
    marginVertical: "5@s",
    width: "50@s",
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

export default memo(InfoAlert);
