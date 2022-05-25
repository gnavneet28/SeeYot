import React from "react";
import { View, Pressable } from "react-native";
import { ScaledSheet, scale } from "react-native-size-matters";
import Ionicons from "../../node_modules/react-native-vector-icons/Ionicons";

import defaultStyles from "../config/styles";
import AppText from "./AppText";
import AppButton from "./AppButton";

function ScannerBottomContent({
  handleCameraChange,
  handleFlashmode,
  front,
  onExplorePress = () => {},
  permitted,
  onMyGroupsButtonPress = () => {},
}) {
  return (
    <View
      style={[
        styles.container,
        { justifyContent: permitted ? "space-between" : "center" },
      ]}
    >
      {permitted ? (
        <Pressable style={styles.cameraActionIcon} onPress={handleCameraChange}>
          <Ionicons
            name="camera-reverse"
            size={scale(15)}
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

      <AppButton
        title="My Groups"
        style={styles.myGroupButton}
        subStyle={styles.myGroupButtonSub}
        onPress={onMyGroupsButtonPress}
      />

      {permitted ? (
        <Pressable style={styles.cameraActionIcon} onPress={handleFlashmode}>
          <Ionicons
            name="flash"
            size={scale(15)}
            color={defaultStyles.colors.white}
          />
        </Pressable>
      ) : null}
    </View>
  );
}
const styles = ScaledSheet.create({
  container: {
    alignSelf: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: "15@s",
    paddingVertical: "10@s",
    width: "90%",
  },
  cameraActionIcon: {
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.5)",
    borderRadius: "8@s",
    height: "30@s",
    justifyContent: "center",
    width: "30@s",
  },
  exploreContainer: {
    flexDirection: "row",
    backgroundColor: defaultStyles.colors.yellow_Variant,
    borderRadius: "20@s",
    paddingHorizontal: "15@s",
    paddingVertical: "5@s",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    flexShrink: 1,
    marginLeft: "10@s",
  },
  exploreText: {
    fontSize: "12@s",
    color: defaultStyles.colors.secondary,
  },
  myGroupButton: {
    alignSelf: "flex-start",
    backgroundColor: defaultStyles.colors.yellow_Variant,
    borderRadius: "20@s",
    flexShrink: 1,
    height: "30@s",
    marginHorizontal: "10@s",
    width: "100%",
  },
  myGroupButtonSub: {
    color: defaultStyles.colors.secondary,
    fontSize: "13@s",
  },
});

export default ScannerBottomContent;
