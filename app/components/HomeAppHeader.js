import React, { memo } from "react";
import { View, TouchableHighlight } from "react-native";
import LottieView from "lottie-react-native";
import { ScaledSheet } from "react-native-size-matters";

import AppImage from "./AppImage";
import AppText from "./AppText";

import defaultStyles from "../config/styles";

function AppHeader({
  style,
  onPressRight = () => null,
  onPressLeft = () => null,
  rightImageUrl = "",
}) {
  return (
    <View style={[styles.container, style]}>
      <AppText onPress={onPressLeft} style={styles.title}>
        SeeYot
      </AppText>
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
    justifyContent: "space-between",
    padding: "2@s",
    width: "100%",
  },
  image: {
    borderRadius: "20@s",
    height: "35@s",
    width: "35@s",
  },
  imageSub: {
    borderRadius: "19@s",
    height: "35@s",
    width: "35@s",
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
    width: "50@s",
  },
  title: {
    color: defaultStyles.colors.white,
    flexShrink: 1,
    fontFamily: "ComicNeue-Bold",
    fontSize: "22@s",
    letterSpacing: "0.3@s",
    paddingHorizontal: "20@s",
    textAlign: "left",
    width: "100%",
  },
});

export default memo(AppHeader);
