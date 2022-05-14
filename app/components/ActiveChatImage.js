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
  delayLongPress,
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
            delayLongPress={delayLongPress}
            onLongPress={onLongPress}
            subStyle={[styles.image, imageStyle]}
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
        <View style={styles.closeIcon}>
          <IonicIcons
            color={defaultStyles.colors.dark}
            name="close"
            onPress={handleClose}
            size={scale(25)}
          />
        </View>
      </AppModal>
    </>
  );
}
const styles = ScaledSheet.create({
  closeIcon: {
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: defaultStyles.colors.yellow_Variant,
    borderRadius: "20@s",
    bottom: "40@s",
    justifyContent: "center",
    position: "absolute",
    padding: "5@s",
    height: "40@s",
    width: "40@s",
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
