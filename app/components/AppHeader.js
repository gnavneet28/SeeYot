import React, { memo } from "react";
import { View, StyleSheet, TouchableHighlight } from "react-native";

import AppImage from "./AppImage";
import AppText from "./AppText";
import Icon from "./Icon";

import defaultStyles from "../config/styles";

const height = defaultStyles.height;

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
              size={height * 0.03}
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
              size={height * 0.03}
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
  headerText: {
    color: defaultStyles.colors.white,
    fontFamily: "Comic-Bold",
    fontSize: 20,
    textAlign: "center",
    width: "60%",
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
    height: 50,
    justifyContent: "center",
    left: 10,
    position: "absolute",
    width: 50,
  },
  rightOption: {
    alignItems: "center",
    height: 50,
    justifyContent: "center",
    position: "absolute",
    right: 10,
    width: 50,
  },
});

export default memo(AppHeader);
