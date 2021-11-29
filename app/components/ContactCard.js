import React, { useState, useCallback, memo } from "react";
import { Modal, View, TouchableOpacity, Image } from "react-native";
import Feather from "react-native-vector-icons/Feather";
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

import AppButton from "./AppButton";
import AppImage from "./AppImage";
import AppText from "./AppText";

import defaultStyles from "../config/styles";

const height = defaultStyles.height;
const width = defaultStyles.width;

import echosApi from "../api/echos";

let defaultUser = {
  _id: "",
  picture: "",
  name: "",
  phoneNumber: parseInt(""),
};

function ContactCard({
  onAddEchoPress = () => null,
  onSendThoughtsPress = () => null,
  style,
  user = defaultUser,
  index,
}) {
  const [state, setState] = useState({
    visible: false,
    echoMessage: null,
  });

  const handleImagePress = useCallback(async () => {
    setState({ visible: true, echoMessage: "" });
    const { data, problem, ok } = await echosApi.getEcho(user._id);
    if (ok) {
      return setState({ visible: true, echoMessage: data });
    }

    if (problem) return;
  }, [user, index]);

  const handleCloseModal = useCallback(
    () => setState({ ...state, visible: false }),
    []
  );

  const onSendThoughtPress = useCallback(
    () => onSendThoughtsPress(user),
    [user]
  );

  const onAddEchoButtonPress = useCallback(() => onAddEchoPress(user), [user]);

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

  if (!user.name) return <View style={styles.emptyContacts} />;

  return (
    <>
      <View style={[styles.container, style]}>
        <AppImage
          imageUrl={user.picture}
          onPress={handleImagePress}
          style={styles.image}
          subStyle={styles.imageSub}
        />
        <View style={styles.userDetailsContainer}>
          <AppText numberOfLines={1} style={[styles.infoNameText]}>
            {user.name ? user.name : user.phoneNumber}
          </AppText>

          <AppButton
            onPress={onAddEchoButtonPress}
            style={styles.addEchoButton}
            subStyle={styles.subAddEchoButton}
            title="Add Echo"
          />
        </View>
        <TouchableOpacity
          onPress={onSendThoughtPress}
          style={styles.sendThoughtIconContainer}
        >
          <Feather
            onPress={onSendThoughtPress}
            color={defaultStyles.colors.primary}
            name="send"
            size={scale(18)}
            style={styles.sendThoughtIcon}
          />
        </TouchableOpacity>
      </View>
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

              <AppText style={{ zIndex: 222 }}>{user.name}</AppText>
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
    </>
  );
}
const styles = ScaledSheet.create({
  addEchoButton: {
    backgroundColor: defaultStyles.colors.white,
    borderColor: defaultStyles.colors.yellow_Variant,
    borderRadius: "15@s",
    borderWidth: "0.5@s",
    height: "26@s",
    marginLeft: "5@s",
    width: "40%",
  },
  closeIcon: {
    left: "15@s",
    position: "absolute",
    zIndex: 222,
  },
  container: {
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: defaultStyles.colors.white,
    flexDirection: "row",
    height: "70@s",
    paddingHorizontal: "10@s",
    paddingVertical: "2@s",
    width: "100%",
  },
  contentContainer: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.white,
    borderColor: defaultStyles.colors.dark_Variant,
    borderRadius: "15@s",
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
  emptyContacts: {
    height: "80@s",
    width: "100%",
  },
  image: {
    borderColor: defaultStyles.colors.lightGrey,
    borderRadius: "22.5@s",
    borderWidth: 1,
    height: "45@s",
    marginRight: "2@s",
    marginLeft: "5@s",
    width: "45@s",
  },
  imageSub: {
    borderRadius: "22@s",
    height: "44@s",
    width: "44@s",
  },
  infoNameText: {
    color: defaultStyles.colors.dark,
    fontSize: "15@s",
    marginBottom: "5@s",
    marginLeft: "5@s",
    opacity: 0.9,
    paddingBottom: 0,
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
  sendThoughtIconContainer: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.yellow_Variant,
    borderColor: defaultStyles.colors.yellow,
    borderRadius: "10@s",
    borderWidth: 1,
    elevation: 2,
    height: "35@s",
    justifyContent: "center",
    marginRight: "8@s",
    width: "35@s",
  },
  sendThoughtIcon: {
    opacity: 0.8,
  },
  subAddEchoButton: {
    color: defaultStyles.colors.secondary,
    fontSize: "14@s",
  },
  userDetailsContainer: {
    flex: 1,
    height: "70@s",
    justifyContent: "center",
  },
});

export default memo(ContactCard);
