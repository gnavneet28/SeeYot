import React, { memo } from "react";
import { View, TouchableHighlight } from "react-native";
import { ScaledSheet, scale } from "react-native-size-matters";

import AppImage from "./AppImage";
import AppText from "./AppText";
import Icon from "./Icon";

import defaultStyles from "../config/styles";

function AppHeader({
  fwl,
  fwr,
  style,
  onPressRight,
  onPressLeft,
  leftIcon,
  leftImageUrl = "",
  rightImageUrl = "",
  rightIcon,
  title,
}) {
  return (
    <View style={[styles.container, style]}>
      <TouchableHighlight
        activeOpacity={1}
        onPress={onPressLeft}
        style={styles.leftOption}
        underlayColor={defaultStyles.colors.primary}
      >
        <>
          {leftIcon ? (
            <Icon
              color={defaultStyles.colors.white}
              fw={fwl}
              name={leftIcon}
              size={scale(23)}
            />
          ) : null}

          {leftImageUrl ? (
            <AppImage
              imageUrl={leftImageUrl}
              onPress={onPressLeft}
              style={styles.image}
              subStyle={styles.imageSub}
            />
          ) : null}
        </>
      </TouchableHighlight>
      <AppText numberOfLines={1} style={styles.headerText}>
        {title}
      </AppText>
      <TouchableHighlight
        activeOpacity={1}
        onPress={onPressRight}
        style={styles.rightOption}
        underlayColor={defaultStyles.colors.primary}
      >
        <>
          {rightIcon ? (
            <Icon
              color={defaultStyles.colors.white}
              fw={fwr}
              name={rightIcon}
              size={scale(23)}
            />
          ) : null}

          {rightImageUrl ? (
            <AppImage
              imageUrl={rightImageUrl}
              onPress={onPressRight}
              style={styles.image}
              subStyle={styles.imageSub}
            />
          ) : null}
        </>
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
  headerText: {
    color: defaultStyles.colors.white,
    fontFamily: "Comic-Bold",
    fontSize: "18@s",
    textAlign: "center",
    width: "60%",
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
    height: "50@s",
    justifyContent: "center",
    left: "5@s",
    position: "absolute",
    width: "50@s",
  },
  rightOption: {
    alignItems: "center",
    height: "50@s",
    justifyContent: "center",
    position: "absolute",
    right: "5@s",
    width: "50@s",
  },
});

export default memo(AppHeader);
