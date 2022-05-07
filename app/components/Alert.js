import React from "react";
import { View, Modal } from "react-native";
import { ScaledSheet } from "react-native-size-matters";
import * as Animatable from "react-native-animatable";

import defaultStyles from "../config/styles";
import AppText from "./AppText";
import AppButton from "./AppButton";
import ApiProcessingContainer from "./ApiProcessingContainer";

function Alert({
  description = "",
  leftOption = "",
  leftPress = () => null,
  onRequestClose,
  rightOption = "",
  rightPress = () => null,
  title = "",
  visible = false,
  apiProcessing,
}) {
  return (
    <Modal transparent visible={visible} onRequestClose={onRequestClose}>
      <View style={[styles.container]}>
        <Animatable.View
          useNativeDriver={true}
          animation="pulse"
          style={styles.alertContainer}
        >
          <AppText style={styles.title}>{title}</AppText>
          <AppText style={styles.description}>{description}</AppText>
          <View style={styles.actionButtonContainer}>
            <AppButton
              onPress={leftPress}
              style={styles.leftButton}
              subStyle={{ color: defaultStyles.colors.dark }}
              title={leftOption}
            />
            <ApiProcessingContainer
              style={styles.rightButtonContainer}
              processing={apiProcessing}
            >
              <AppButton
                onPress={rightPress}
                style={styles.rightButton}
                subStyle={{ color: defaultStyles.colors.secondary }}
                title={rightOption}
              />
            </ApiProcessingContainer>
          </View>
        </Animatable.View>
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
    borderRadius: "15@s",
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
  rightButtonContainer: {
    backgroundColor: defaultStyles.colors.yellow_Variant,
    borderRadius: "20@s",
    height: "35@s",
    width: "70@s",
  },
  rightButton: {
    backgroundColor: defaultStyles.colors.yellow_Variant,
    borderRadius: "20@s",
    height: "35@s",
    width: "100%",
  },
  title: {
    backgroundColor: defaultStyles.colors.dark_Variant,
    borderColor: defaultStyles.colors.white,
    borderTopLeftRadius: "15@s",
    borderTopRightRadius: "15@s",
    borderWidth: 1,
    color: defaultStyles.colors.white,
    fontSize: "14@s",
    marginBottom: "10@s",
    paddingHorizontal: "10@s",
    paddingVertical: "10@s",
    textAlign: "center",
    width: "100%",
  },
});

export default Alert;
