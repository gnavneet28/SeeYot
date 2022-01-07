import React from "react";
import { View, Modal, Image } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { ScaledSheet, scale } from "react-native-size-matters";
import {
  PinchGestureHandler,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import AppText from "./AppText";

import defaultStyles from "../config/styles";

const height = defaultStyles.height;
const width = defaultStyles.width;

function EchoMessageModal({
  user,
  handleCloseModal,
  state = { echoMessage: { message: "" }, visible: false },
}) {
  // PinchGesture Image Zoom

  const AnimatedImage = Animated.createAnimatedComponent(Image);

  const scaleImage = useSharedValue(1);
  const focalX = useSharedValue(0);
  const focalY = useSharedValue(0);

  const pinchHandler = useAnimatedGestureHandler({
    onActive: (event) => {
      scaleImage.value = event.scale;
      focalX.value = event.focalX;
      focalY.value = event.focalY;
    },
    onEnd: () => {
      scaleImage.value = withTiming(1);
    },
  });

  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: focalX.value },
        { translateY: focalY.value },
        { translateX: width < height ? -width / 2 : -height / 2 },
        { translateY: width < height ? -width / 2 : -height / 2 },
        { scale: scaleImage.value },
        { translateX: -focalX.value },
        { translateY: -focalY.value },
        { translateX: width < height ? width / 2 : height / 2 },
        { translateY: width < height ? width / 2 : height / 2 },
      ],
    };
  });
  return (
    <Modal
      onRequestClose={handleCloseModal}
      transparent={true}
      visible={state.visible}
      animationType="fade"
    >
      <View style={styles.largeImageModalFallback}>
        <View style={styles.contentContainer}>
          <View style={styles.inlargedHeader}>
            <MaterialIcons
              onPress={handleCloseModal}
              name="arrow-back"
              size={scale(23)}
              color={defaultStyles.colors.secondary}
              style={styles.closeIcon}
            />

            <AppText style={{ zIndex: 222, fontSize: scale(15) }}>
              {user.name}
            </AppText>
          </View>
          <GestureHandlerRootView>
            <PinchGestureHandler onGestureEvent={pinchHandler}>
              <AnimatedImage
                activeOpacity={1}
                source={
                  user.picture
                    ? { uri: user.picture }
                    : require("../assets/user.png")
                }
                style={[styles.inlargedImage, rStyle]}
              />
            </PinchGestureHandler>
          </GestureHandlerRootView>
          {state.echoMessage ? (
            <AppText style={styles.echoMessage}>
              {state.echoMessage.message}
            </AppText>
          ) : null}
        </View>
      </View>
    </Modal>
  );
}
const styles = ScaledSheet.create({
  closeIcon: {
    left: "15@s",
    position: "absolute",
    zIndex: 222,
  },
  contentContainer: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.white,
    borderRadius: "10@s",
    borderWidth: 1,
    elevation: 10,
    overflow: "hidden",
    width: "100%",
  },
  echoMessage: {
    alignSelf: "center",
    marginVertical: "10@s",
    textAlign: "center",
    textAlignVertical: "center",
    width: "95%",
  },
  inlargedImage: {
    borderRadius: 0,
    height: width < height ? width : height,
    width: width < height ? width : height,
  },
  inlargedHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    padding: "10@s",
    width: "100%",
  },
  largeImageModalFallback: {
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.9)",
    flex: 1,
    justifyContent: "center",
    width: "100%",
  },
});

export default EchoMessageModal;
