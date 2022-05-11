import React, { memo } from "react";
import {
  View,
  Modal,
  Image,
  ImageBackground,
  TouchableWithoutFeedback,
} from "react-native";
import MaterialIcons from "../../node_modules/react-native-vector-icons/MaterialIcons";
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
import * as Animatable from "react-native-animatable";

import AppText from "./AppText";
import EchoMessage from "./EchoMessage";

import defaultStyles from "../config/styles";
import defaultProps from "../utilities/defaultProps";

const height = defaultStyles.height;
const width = defaultStyles.width;

const GAP = 30;

function EchoMessageModal({
  handleCloseModal,
  state = {
    visible: false,
    recipient: defaultProps.defaultEchoMessageRecipient,
    echoMessage: { message: "" },
  },
}) {
  let imageUri = state.recipient.picture;
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
      <TouchableWithoutFeedback onPress={handleCloseModal}>
        <ImageBackground
          blurRadius={4}
          source={imageUri ? { uri: imageUri } : { uri: "user" }}
          style={styles.largeImageModalFallback}
        >
          <Animatable.View animation="zoomIn">
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
                  {state.recipient.name}
                </AppText>
              </View>
              <GestureHandlerRootView>
                <PinchGestureHandler onGestureEvent={pinchHandler}>
                  <AnimatedImage
                    activeOpacity={1}
                    source={
                      state.recipient.picture
                        ? { uri: state.recipient.picture }
                        : { uri: "user" }
                    }
                    style={[styles.inlargedImage, rStyle]}
                  />
                </PinchGestureHandler>
              </GestureHandlerRootView>
              <EchoMessage
                style={styles.echoMessage}
                echoMessage={state.echoMessage.message}
              />
            </View>
          </Animatable.View>
        </ImageBackground>
      </TouchableWithoutFeedback>
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
    borderRadius: "15@s",
    elevation: 5,
    overflow: "hidden",
    width: width < height ? width - GAP : height - GAP,
  },
  echoMessage: { marginTop: "5@s", marginBottom: "10@s" },
  inlargedImage: {
    height: width < height ? width - GAP : height - GAP,
    width: width < height ? width - GAP : height - GAP,
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
    flex: 1,
    justifyContent: "center",
    width: "100%",
  },
});

export default memo(EchoMessageModal);
