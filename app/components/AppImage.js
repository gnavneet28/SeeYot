import React from "react";
import { StyleSheet, Image, TouchableHighlight } from "react-native";

import defaultStyles from "../config/styles";

function AppImage({
  imageUrl = "",
  style,
  subStyle,
  onPress = () => null,
  customImage,
}) {
  return (
    <TouchableHighlight onPress={onPress} style={[styles.container, style]}>
      <Image
        style={[styles.image, subStyle]}
        source={
          imageUrl
            ? { uri: imageUrl }
            : customImage
            ? customImage
            : require("../assets/user.png")
        }
      />
    </TouchableHighlight>
  );
}
const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    borderColor: defaultStyles.colors.primary,
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
