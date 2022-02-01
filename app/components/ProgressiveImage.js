import React from "react";
import { StyleSheet, Animated, TouchableHighlight } from "react-native";
import FastImage from "react-native-fast-image";

import defaultStyles from "../config/styles";

function ProgressiveImage({
  activeOpacity = 0.8,
  customImage,
  imageUrl = "",
  onPress = () => null,
  style,
  subStyle,
}) {
  const defaultImageAnimated = new Animated.Value(1);
  const imageAnimated = new Animated.Value(0);

  const handleDefaultImageLoad = () => {
    Animated.timing(defaultImageAnimated, {
      toValue: 0,
      useNativeDriver: true,
    }).start();
  };

  const handleImageLoad = () => {
    Animated.timing(imageAnimated, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };
  return (
    <TouchableHighlight
      underlayColor={defaultStyles.colors.white}
      activeOpacity={activeOpacity}
      onPress={onPress}
      style={[styles.container, style]}
    >
      <>
        <Animated.Image
          resizeMode="cover"
          style={[styles.image, { opacity: defaultImageAnimated }, subStyle]}
          source={{ uri: "user" }}
          onLoad={handleDefaultImageLoad}
          blurRadius={2}
        />
        <Animated.Image
          resizeMode="cover"
          style={[
            styles.image,
            { opacity: imageAnimated },
            styles.imageOverlay,
            subStyle,
          ]}
          source={{ uri: imageUrl ? imageUrl : "user" }}
          onLoad={handleImageLoad}
        />
      </>
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
  imageOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

export default ProgressiveImage;
