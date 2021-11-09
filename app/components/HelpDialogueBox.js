import React from "react";
import { View, StyleSheet, Modal } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

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
            size={25}
            style={[styles.icon, iconStyle]}
          />
          <MaterialIcons
            color={defaultStyles.colors.dark}
            name="close"
            onPress={onPress}
            size={25}
            style={styles.closeIcon}
          />
          <AppText style={styles.info}>{information}</AppText>
        </View>
      </View>
    </Modal>
  );
}
const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: "rgba(0,0,0,0.7)",
    flex: 1,
    width: "100%",
  },
  container: {
    backgroundColor: defaultStyles.colors.white,
    borderRadius: 5,
    padding: 5,
    position: "absolute",
    right: 12,
    top: 48,
    width: 300,
  },
  closeIcon: {
    backgroundColor: defaultStyles.colors.light,
    borderRadius: 5,
    width: 25,
  },
  icon: {
    position: "absolute",
    right: 10,
    top: -15,
    transform: [{ rotate: "34deg" }],
  },
  info: {
    color: defaultStyles.colors.dark_Variant,
    fontSize: 14,
    letterSpacing: 0.2,
    textAlign: "left",
  },
});

export default HelpDialogueBox;
