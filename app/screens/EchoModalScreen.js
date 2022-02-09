import React, { useState, useEffect } from "react";
import { View, Image, ImageBackground } from "react-native";
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
import { SharedElement } from "react-navigation-shared-element";

import echosApi from "../api/echos";
import usersApi from "../api/users";

import AppText from "../components/AppText";
import EchoMessage from "../components/EchoMessage";
import Screen from "../components/Screen";

import useAuth from "../auth/useAuth";
import useMountedRef from "../hooks/useMountedRef";

import defaultStyles from "../config/styles";
import ScreenSub from "../components/ScreenSub";

const height = defaultStyles.height;
const width = defaultStyles.width;

const GAP = 30;

function EchoModalScreen({ route, navigation }) {
  let { recipient } = route.params;
  const { user } = useAuth();
  const mounted = useMountedRef();

  const [echoMessage, setEchoMessage] = useState({ message: "" });

  const getEchoMessage = async () => {
    const { data, problem, ok } = await echosApi.getEcho(recipient._id);
    if (ok && mounted) {
      setEchoMessage(data);
      if (user._id != recipient._id) {
        usersApi.updatePhotoTapsCount(recipient._id);
      }
    }
  };

  useEffect(() => {
    if (mounted) {
      getEchoMessage();
    }
  }, [mounted]);

  let imageUri = recipient.picture;

  const handleBack = () => navigation.goBack();
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
    <Screen style={styles.container}>
      <ScreenSub>
        <ImageBackground
          blurRadius={4}
          source={imageUri ? { uri: imageUri } : { uri: "user" }}
          style={styles.largeImageModalFallback}
        >
          <View style={styles.contentContainer}>
            <View style={styles.inlargedHeader}>
              <MaterialIcons
                onPress={handleBack}
                name="arrow-back"
                size={scale(23)}
                color={defaultStyles.colors.primary}
                style={styles.closeIcon}
              />

              <AppText style={{ zIndex: 222, fontSize: scale(15) }}>
                {recipient.name}
              </AppText>
            </View>
            <SharedElement id={recipient._id}>
              <GestureHandlerRootView>
                <PinchGestureHandler onGestureEvent={pinchHandler}>
                  <AnimatedImage
                    activeOpacity={1}
                    source={
                      recipient.picture
                        ? { uri: recipient.picture }
                        : { uri: "user" }
                    }
                    style={[styles.inlargedImage, rStyle]}
                  />
                </PinchGestureHandler>
              </GestureHandlerRootView>
            </SharedElement>
            {echoMessage ? (
              <EchoMessage
                id={`echoIcon${recipient._id}`}
                echoMessage={echoMessage.message}
              />
            ) : null}
          </View>
        </ImageBackground>
      </ScreenSub>
    </Screen>
  );
}
const styles = ScaledSheet.create({
  container: {
    alignItems: "center",
  },
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

export default EchoModalScreen;
