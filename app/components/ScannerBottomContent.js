import React, { useState } from "react";
import { View, Pressable } from "react-native";
import { ScaledSheet, scale } from "react-native-size-matters";
import Ionicons from "../../node_modules/react-native-vector-icons/Ionicons";

import defaultStyles from "../config/styles";

function ScannerBottomContent({ handleCameraChange, handleFlashmode, front }) {
  return (
    <View style={styles.cameraActionContainer}>
      <Pressable style={styles.cameraActionIcon} onPress={handleCameraChange}>
        <Ionicons
          name="camera-reverse"
          size={scale(16)}
          color={defaultStyles.colors.secondary}
        />
      </Pressable>
      {!front ? (
        <Pressable style={styles.cameraActionIcon} onPress={handleFlashmode}>
          <Ionicons
            name="flash"
            size={scale(16)}
            color={defaultStyles.colors.secondary}
          />
        </Pressable>
      ) : null}
    </View>
  );
}
const styles = ScaledSheet.create({
  cameraActionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: "10@s",
    paddingHorizontal: "15@s",
    paddingVertical: "10@s",
    width: "90%",
    alignSelf: "center",
  },
  cameraActionIcon: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.light,
    borderRadius: "8@s",
    height: "35@s",
    justifyContent: "center",
    width: "35@s",
  },
});

export default ScannerBottomContent;
