import React, { memo } from "react";
import { StyleSheet, Animated, TouchableHighlight } from "react-native";

import defaultStyles from "../config/styles";

function ProgressiveImage({
  activeOpacity = 0.8,
  customImage = "image_placeholder",
  disabled = false,
  imageUrl = "",
  onPress = () => null,
  style,
  subStyle,
  resizeMode = "cover",
  onLongPress,
  ...props
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
      {...props}
      onLongPress={onLongPress}
      disabled={disabled}
      underlayColor={defaultStyles.colors.white}
      activeOpacity={activeOpacity}
      onPress={onPress}
      style={[styles.container, style]}
    >
      <>
        <Animated.Image
          resizeMode={resizeMode}
          style={[styles.image, { opacity: defaultImageAnimated }, subStyle]}
          source={{ uri: customImage }}
          onLoad={handleDefaultImageLoad}
          blurRadius={2}
        />
        <Animated.Image
          resizeMode={resizeMode}
          style={[
            styles.image,
            { opacity: imageAnimated },
            styles.imageOverlay,
            subStyle,
          ]}
          source={{ uri: imageUrl ? imageUrl : customImage }}
          onLoad={handleImageLoad}
        />
      </>
    </TouchableHighlight>
  );
}
const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.white,
    height: "100%",
    justifyContent: "center",
    overflow: "hidden",
    width: "100%",
  },
  image: {
    flex: 1,
    height: "100%",
    width: "100%",
  },
  imageOverlay: {
    backgroundColor: defaultStyles.colors.white,
    bottom: 0,
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
  },
});

export default memo(ProgressiveImage);
