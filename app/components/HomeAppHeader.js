import React, { memo } from "react";
import { View, StyleSheet, TouchableHighlight } from "react-native";
import LottieView from "lottie-react-native";

import AppImage from "./AppImage";
import AppText from "./AppText";

import defaultStyles from "../config/styles";

const height = defaultStyles.height;

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
const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.primary,
    flexDirection: "row",
    height: 55,
    justifyContent: "center",
    padding: 2,
    width: "100%",
  },
  image: {
    borderRadius: 20,
    borderWidth: 2,
    borderColor: defaultStyles.colors.yellow_Variant,
    height: 40,
    width: 40,
  },
  imageSub: {
    borderRadius: 19,
    height: 38,
    width: 38,
  },
  leftOption: {
    alignItems: "center",
    bottom: 0,
    borderRadius: 20,
    backgroundColor: defaultStyles.colors.primary,
    height: 55,
    justifyContent: "center",
    left: 10,
    position: "absolute",
    width: 55,
  },
  rightOption: {
    alignItems: "center",
    justifyContent: "center",
    height: 50,
    position: "absolute",
    right: 10,
    width: 50,
  },
  title: {
    color: defaultStyles.colors.white,
    fontFamily: "Comic-Bold",
    fontSize: 22,
    textAlign: "center",
    width: "60%",
  },
});

export default memo(AppHeader);
