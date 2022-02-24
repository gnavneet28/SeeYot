import React, { memo } from "react";
import { View, Modal } from "react-native";
import { ScaledSheet, scale } from "react-native-size-matters";
import AntDesign from "../../node_modules/react-native-vector-icons/AntDesign";

import defaultStyles from "../config/styles";
import AppText from "./AppText";

const modalHeaderColor = defaultStyles.colors.secondary_Variant;

function SeeThought({ visible = false, setVisible, message = "" }) {
  return (
    <Modal
      animationType="none"
      transparent
      onRequestClose={() => setVisible(false)}
      visible={visible}
    >
      <View style={styles.container}>
        <View style={styles.closeMessageIconContainer}>
          <AntDesign
            onPress={() => setVisible(false)}
            name="downcircle"
            color={defaultStyles.colors.white}
            size={scale(28)}
          />
        </View>
        <View style={styles.mainContainer}>
          <AppText style={styles.title}>Thought</AppText>
          <View style={styles.contentContainer}>
            <AppText style={styles.message}>{message}</AppText>
          </View>
        </View>
      </View>
    </Modal>
  );
}
const styles = ScaledSheet.create({
  closeMessageIconContainer: {
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: modalHeaderColor,
    borderRadius: "25@s",
    bottom: "-25@s",
    height: "40@s",
    justifyContent: "center",
    padding: "5@s",
    width: "40@s",
    zIndex: 222,
  },
  container: {
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    flex: 1,
    justifyContent: "flex-end",
    width: "100%",
  },
  contentContainer: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.white,
    paddingTop: "10@s",
    width: "100%",
  },
  mainContainer: {
    alignItems: "center",
    backgroundColor: modalHeaderColor,
    borderRadius: "5@s",
    borderTopLeftRadius: "10@s",
    borderTopRightRadius: "10@s",
    justifyContent: "center",
    overflow: "hidden",
    paddingTop: "20@s",
    width: "100%",
  },
  message: {
    color: defaultStyles.colors.dark_Variant,
    marginBottom: "15@s",
    textAlign: "center",
    width: "80%",
  },
  title: {
    backgroundColor: modalHeaderColor,
    color: defaultStyles.colors.white,
    marginBottom: "5@s",
    textAlign: "center",
    width: "100%",
  },
});

export default memo(SeeThought);
