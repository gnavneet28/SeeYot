import React from "react";
import { View, StyleSheet } from "react-native";

function ModalFallback(props) {
  return <View style={styles.modalFallback} />;
}
const styles = StyleSheet.create({
  modalFallback: {
    backgroundColor: "rgba(0,0,0,0.7)",
    height: "100%",
    position: "absolute",
    width: "100%",
    zIndex: 22,
  },
});

export default ModalFallback;
