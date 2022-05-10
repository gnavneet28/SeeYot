import React from "react";
import { StyleSheet, TouchableHighlight, Image } from "react-native";

import defaultStyles from "../config/styles";

function AppImage({
  activeOpacity = 0.8,
  customImage,
  imageUrl = "",
  onPress = () => null,
  style,
  subStyle,
  onLongPress = () => null,
  delayLongPress = 500,
  ...props
}) {
  return (
    <TouchableHighlight
      delayLongPress={delayLongPress}
      onLongPress={onLongPress}
      underlayColor={defaultStyles.colors.white}
      activeOpacity={activeOpacity}
      onPress={onPress}
      style={[styles.container, style]}
    >
      <Image
        {...props}
        style={[styles.image, subStyle]}
        source={
          imageUrl
            ? { uri: imageUrl }
            : customImage
            ? customImage
            : { uri: "user" }
        }
      />
    </TouchableHighlight>
  );
}
const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.light,
    borderRadius: 30,
    height: 60,
    justifyContent: "center",
    overflow: "hidden",
    width: 60,
  },
  image: {
    borderRadius: 30,
    flex: 1,
    height: 60,
    width: 60,
  },
});

export default AppImage;
