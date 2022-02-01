import React from "react";
import { View, Modal } from "react-native";
import MaterialIcons from "../../node_modules/react-native-vector-icons/MaterialIcons";
import { ScaledSheet, scale } from "react-native-size-matters";

import AppText from "./AppText";

import defaultStyles from "../config/styles";

function HelpDialogueBox({ visible, information, onPress, style, iconStyle }) {
  return (
    <Modal transparent={true} visible={visible} onRequestClose={onPress}>
      <View style={styles.mainContainer}>
        <View style={[styles.container, style]}>
          <MaterialIcons
            color={defaultStyles.colors.light}
            name="play-arrow"
            size={scale(25)}
            style={[styles.icon, iconStyle]}
          />
          <MaterialIcons
            color={defaultStyles.colors.dark}
            name="close"
            onPress={onPress}
            size={scale(20)}
            style={styles.closeIcon}
          />
          <AppText style={styles.info}>{information}</AppText>
        </View>
      </View>
    </Modal>
  );
}
const styles = ScaledSheet.create({
  mainContainer: {
    backgroundColor: "rgba(0,0,0,0.7)",
    flex: 1,
    width: "100%",
  },
  container: {
    backgroundColor: defaultStyles.colors.white,
    borderRadius: "5@s",
    padding: "5@s",
    position: "absolute",
    right: "12@s",
    top: "48@s",
    width: "300@s",
  },
  closeIcon: {
    backgroundColor: defaultStyles.colors.light,
    borderRadius: "5@s",
    width: "20@s",
  },
  icon: {
    position: "absolute",
    right: "10@s",
    top: "-15@s",
    transform: [{ rotate: "34deg" }],
  },
  info: {
    color: defaultStyles.colors.dark_Variant,
    fontSize: "12@s",
    letterSpacing: "0.2@s",
    textAlign: "left",
  },
});

export default HelpDialogueBox;
