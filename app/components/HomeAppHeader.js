import React, { memo } from "react";
import { View, TouchableHighlight } from "react-native";
import LottieView from "lottie-react-native";
import { ScaledSheet } from "react-native-size-matters";

import AppImage from "./AppImage";
import AppText from "./AppText";

import defaultStyles from "../config/styles";

function AppHeader({
  customImage,
  style,
  onPressRight = () => null,
  onPressLeft = () => null,
  leftImageUrl = "",
  rightImageUrl = "",
}) {
  return (
    <View style={[styles.container, style]}>
      <TouchableHighlight onPress={onPressLeft} style={styles.leftOption}>
        <LottieView
          autoPlay
          loop
          source={require("../assets/animations/seet.json")}
        />
      </TouchableHighlight>
      <AppText style={styles.title}>SeeYot</AppText>
      <TouchableHighlight onPress={onPressRight} style={styles.rightOption}>
        <AppImage
          imageUrl={rightImageUrl}
          onPress={onPressRight}
          style={styles.image}
          subStyle={styles.imageSub}
        />
      </TouchableHighlight>
    </View>
  );
}
const styles = ScaledSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.primary,
    flexDirection: "row",
    height: "50@s",
    justifyContent: "center",
    padding: "2@s",
    width: "100%",
  },
  image: {
    borderRadius: "20@s",
    borderWidth: 1,
    borderColor: defaultStyles.colors.lightGrey,
    height: "38@s",
    width: "38@s",
  },
  imageSub: {
    borderRadius: "19@s",
    height: "37@s",
    width: "37@s",
  },
  leftOption: {
    alignItems: "center",
    bottom: 0,
    borderRadius: "20@s",
    backgroundColor: defaultStyles.colors.primary,
    height: "50@s",
    justifyContent: "center",
    left: "10@s",
    position: "absolute",
    width: "50@s",
  },
  rightOption: {
    alignItems: "center",
    justifyContent: "center",
    height: "50@s",
    position: "absolute",
    right: "10@s",
    width: "50@s",
  },
  title: {
    color: defaultStyles.colors.white,
    fontFamily: "Comic-Bold",
    fontSize: "18@s",
    textAlign: "center",
    width: "60%",
  },
});

export default memo(AppHeader);
