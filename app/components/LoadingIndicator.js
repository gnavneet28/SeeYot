import React from "react";
import { View, Modal } from "react-native";
import LottieView from "lottie-react-native";
import { ScaledSheet } from "react-native-size-matters";

import defaultStyles from "../config/styles";

function LoadingIndicator({ visible = false, cancelable = false }) {
  return (
    <Modal animationType="fade" transparent visible={visible}>
      <View style={styles.container}>
        <View style={styles.loaderContainer}>
          <LottieView autoPlay loop source={"load.json"} style={{ flex: 1 }} />
        </View>
      </View>
    </Modal>
  );
}
const styles = ScaledSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
    flex: 1,
    justifyContent: "center",
    overflow: "hidden",
    width: "100%",
  },
  loaderContainer: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.white,
    borderRadius: "10@s",
    height: "40@s",
    justifyContent: "space-between",
    width: "60@s",
  },
});

export default LoadingIndicator;
