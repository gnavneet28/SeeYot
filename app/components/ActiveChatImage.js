import React, { useState, useCallback, memo } from "react";
import { View, TouchableWithoutFeedback } from "react-native";
import { scale, ScaledSheet } from "react-native-size-matters";
import IonicIcons from "../../node_modules/react-native-vector-icons/Ionicons";

import AppImage from "./AppImage";
import AppModal from "./AppModal";
import ProgressiveImage from "./ProgressiveImage";

import defaultStyles from "../config/styles";

function ActiveChatImage({
  uri,
  canOpen = true,
  containerStyle,
  imageStyle,
  onLongPress,
}) {
  const [isVisible, setIsVisible] = useState(false);

  const handleClose = useCallback(() => {
    setIsVisible(false);
  }, []);

  const handleOpen = useCallback(() => {
    setIsVisible(true);
  }, []);

  return (
    <>
      <TouchableWithoutFeedback onLongPress={onLongPress} onPress={handleOpen}>
        <View style={[styles.container, containerStyle]}>
          <ProgressiveImage
            onLongPress={onLongPress}
            style={imageStyle}
            resizeMode="cover"
            imageUrl={uri}
            onPress={canOpen ? handleOpen : () => null}
          />
        </View>
      </TouchableWithoutFeedback>
      <AppModal visible={isVisible} onRequestClose={handleClose}>
        <AppImage
          resizeMode="contain"
          style={styles.largeImage}
          subStyle={styles.largeImage}
          activeOpacity={1}
          imageUrl={uri}
        />
        <IonicIcons
          color={defaultStyles.colors.dark}
          name="close-circle"
          onPress={handleClose}
          size={scale(45)}
          style={styles.closeIcon}
        />
      </AppModal>
    </>
  );
}
const styles = ScaledSheet.create({
  closeIcon: {
    alignSelf: "center",
    bottom: "50@s",
    position: "absolute",
  },
  container: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.white,
    borderRadius: "5@s",
    height: "100@s",
    justifyContent: "center",
    overflow: "hidden",
    width: "100@s",
  },
  image: {
    height: "100%",
    width: "100%",
  },
  largeImage: {
    backgroundColor: defaultStyles.colors.white,
    borderRadius: 0,
    height: "100%",
    width: "100%",
  },
});

export default memo(ActiveChatImage);
