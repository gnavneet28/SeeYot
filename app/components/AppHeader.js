import React, { memo } from "react";
import { View, TouchableHighlight } from "react-native";
import { ScaledSheet, scale } from "react-native-size-matters";
import Tooltip from "react-native-walkthrough-tooltip";

import AppImage from "./AppImage";
import AppText from "./AppText";
import Icon from "./Icon";

import defaultStyles from "../config/styles";

function AppHeader({
  iconLeftCategory,
  iconRightCategory,
  style,
  onPressRight,
  onPressLeft,
  leftIcon,
  leftImageUrl = "",
  rightImageUrl = "",
  rightIcon,
  title,
  titleStyle,
  leftIconColor = defaultStyles.colors.white,
  rightIconColor = defaultStyles.colors.white,
  underlayColor = defaultStyles.colors.primary,
  showTip,
  setShowTip,
  tip = "hi",
  rightOptionContainerStyle,
  leftOptionContainerStyle,
}) {
  return (
    <View style={[styles.container, style]}>
      <TouchableHighlight
        activeOpacity={1}
        onPress={onPressLeft}
        style={[styles.leftOption, leftOptionContainerStyle]}
        underlayColor={underlayColor}
      >
        <>
          {leftIcon ? (
            <Icon
              color={leftIconColor}
              icon={iconLeftCategory}
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
      <AppText numberOfLines={1} style={[styles.headerText, titleStyle]}>
        {title}
      </AppText>
      <TouchableHighlight
        activeOpacity={1}
        onPress={onPressRight}
        style={[styles.rightOption, rightOptionContainerStyle]}
        underlayColor={underlayColor}
      >
        <>
          <Tooltip
            contentStyle={{
              backgroundColor: defaultStyles.colors.white,
              height: "100%",
            }}
            displayInsets={{
              top: scale(24),
              bottom: scale(24),
              right: scale(24),
              left: scale(24),
            }}
            supportedOrientations={["portrait"]}
            showChildInTooltip={false}
            isVisible={showTip}
            content={<AppText style={styles.tip}>{tip}</AppText>}
            placement="left"
            onClose={() => setShowTip(false)}
          >
            {rightIcon ? (
              <Icon
                color={rightIconColor}
                icon={iconRightCategory}
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
          </Tooltip>
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
    fontFamily: "ComicNeue-Bold",
    fontSize: "17@s",
    letterSpacing: "0.3@s",
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
  tip: {
    color: defaultStyles.colors.dark,
    fontSize: "13@s",
  },
});

export default memo(AppHeader);
