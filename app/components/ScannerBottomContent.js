import React, { useState } from "react";
import { View, Pressable } from "react-native";
import { ScaledSheet, scale } from "react-native-size-matters";
import Ionicons from "../../node_modules/react-native-vector-icons/Ionicons";

import defaultStyles from "../config/styles";
import AppText from "./AppText";

function ScannerBottomContent({
  handleCameraChange,
  handleFlashmode,
  front,
  onExplorePress = () => {},
  permitted,
}) {
  return (
    <View
      style={[
        styles.cameraActionContainer,
        { justifyContent: permitted ? "space-between" : "center" },
      ]}
    >
      {permitted ? (
        <Pressable style={styles.cameraActionIcon} onPress={handleCameraChange}>
          <Ionicons
            name="camera-reverse"
            size={scale(16)}
            color={defaultStyles.colors.white}
          />
        </Pressable>
      ) : null}
      <Pressable onPress={onExplorePress} style={styles.exploreContainer}>
        <Ionicons
          name="ios-search-sharp"
          color={defaultStyles.colors.secondary}
          size={scale(15)}
        />
        <AppText style={styles.exploreText}>Explore</AppText>
      </Pressable>

      {permitted ? (
        <Pressable style={styles.cameraActionIcon} onPress={handleFlashmode}>
          <Ionicons
            name="flash"
            size={scale(16)}
            color={defaultStyles.colors.white}
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
    backgroundColor: "rgba(255,255,255,0.5)",
    borderRadius: "8@s",
    height: "35@s",
    justifyContent: "center",
    width: "35@s",
  },
  exploreContainer: {
    flexDirection: "row",
    backgroundColor: defaultStyles.colors.yellow_Variant,
    borderRadius: "20@s",
    paddingHorizontal: "15@s",
    paddingVertical: "5@s",
    justifyContent: "center",
    alignItems: "center",
  },
  exploreText: {
    fontSize: "12@s",
    color: defaultStyles.colors.secondary,
  },
});

export default ScannerBottomContent;
