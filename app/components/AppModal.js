import React from "react";
import { View, Modal } from "react-native";
import { ScaledSheet } from "react-native-size-matters";

function AppModal({
  animationType = "none",
  children,
  onRequestClose = () => null,
  style,
  transparent = true,
  visible,
}) {
  return (
    <Modal
      transparent={transparent}
      animationType={animationType}
      visible={visible}
      onRequestClose={onRequestClose}
      style={styles.container}
    >
      <View style={[styles.container, style]}>{children}</View>
    </Modal>
  );
}
const styles = ScaledSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.8)",
    flex: 1,
    justifyContent: "center",
    overflow: "hidden",
    width: "100%",
  },
});

export default AppModal;
