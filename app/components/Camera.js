import React, { useEffect, useRef, useState, useContext, memo } from "react";
import { View, TouchableOpacity, Pressable, Image } from "react-native";
import { RNCamera } from "react-native-camera";
import { ScaledSheet, scale } from "react-native-size-matters";
import Ionicons from "../../node_modules/react-native-vector-icons/Ionicons";
import Feather from "../../node_modules/react-native-vector-icons/Feather";
import RNFS from "react-native-fs";
import CameraRoll from "@react-native-community/cameraroll";
import ReactNativeHapticFeedback from "react-native-haptic-feedback";
import ImageResizer from "react-native-image-resizer";

import debounce from "../utilities/debounce";

import AppModal from "./AppModal";

import defaultStyles from "../config/styles";
import useAuth from "../auth/useAuth";
import ImageContext from "../utilities/ImageContext";

const optionsVibrate = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: true,
};

function Camera({ visible, setVisible, onPhotoSelect }) {
  const { setMediaImage } = useContext(ImageContext);
  const { user } = useAuth();
  let cameraRef = useRef(null);
  const [frontCamera, setFrontCamera] = useState(false);
  const [flashMode, setFlashMode] = useState(false);
  const [picture, setPicture] = useState("");

  let isUnmounting = false;

  useEffect(() => {
    return () => (isUnmounting = true);
  });

  const handleCameraChange = () => {
    if (!isUnmounting) {
      setFrontCamera(!frontCamera);
    }
  };

  const handleFlashmode = () => {
    if (!isUnmounting) {
      setFlashMode(!flashMode);
    }
  };

  const handleCaptureImage = debounce(
    async () => {
      if (cameraRef) {
        ReactNativeHapticFeedback.trigger("impactMedium", optionsVibrate);
        const options = { quality: 0.3, base64: true };
        const data = await cameraRef.takePictureAsync(options);
        setMediaImage(data.uri);
        return setPicture(data.uri);
        RNFS.writeFile(
          RNFS.CachesDirectoryPath + `/${user.name}.png`,
          data.base64,
          "base64"
        ).then(() => {
          CameraRoll.save(
            RNFS.CachesDirectoryPath + `/${user.name}.png`,
            "photo"
          ).then((picture) => {
            ImageResizer.createResizedImage(picture, 700, 2100, "JPEG", 80)
              .then((res) => {
                setMediaImage(res.uri);
                setPicture(res.uri);
              })
              .catch((err) => console.log(err));
          });
        });
      }
    },
    4000,
    true
  );

  const handleSelctionOk = () => {
    if (picture) {
      setPicture("");
      setVisible(false);
      onPhotoSelect(picture);
    }
  };
  const handleSelctionNotOk = () => setPicture("");

  return (
    <AppModal
      style={styles.modal}
      visible={visible}
      onRequestClose={() => setVisible(false)}
    >
      <View style={styles.container}>
        {picture ? (
          <>
            <Image style={styles.image} source={{ uri: picture }} />
            <View style={styles.confirmPictureActionContainer}>
              <Pressable
                style={styles.confirmActionIcon}
                onPress={handleSelctionNotOk}
              >
                <Ionicons
                  name="close"
                  size={scale(16)}
                  color={defaultStyles.colors.white}
                />
              </Pressable>
              <Pressable
                style={styles.confirmActionIcon}
                onPress={handleSelctionOk}
              >
                <Feather
                  name="check"
                  size={scale(16)}
                  color={defaultStyles.colors.white}
                />
              </Pressable>
            </View>
          </>
        ) : (
          <>
            <RNCamera
              playSoundOnCapture={true}
              autoFocus={"on"}
              style={styles.preview}
              ref={(ref) => (cameraRef = ref)}
              type={
                frontCamera
                  ? RNCamera.Constants.Type.front
                  : RNCamera.Constants.Type.back
              }
              flashMode={
                flashMode
                  ? RNCamera.Constants.FlashMode.torch
                  : RNCamera.Constants.FlashMode.off
              }
            ></RNCamera>
            <Pressable
              style={styles.cameraActionIconLeft}
              onPress={handleCameraChange}
            >
              <Ionicons
                name="camera-reverse"
                size={scale(16)}
                color={defaultStyles.colors.white}
              />
            </Pressable>
            {!frontCamera ? (
              <Pressable
                style={styles.cameraActionIconRight}
                onPress={handleFlashmode}
              >
                <Ionicons
                  name="flash"
                  size={scale(16)}
                  color={defaultStyles.colors.white}
                />
              </Pressable>
            ) : null}
            <TouchableOpacity
              onPress={handleCaptureImage}
              activeOpacity={0.7}
              style={styles.cameraActionContainer}
            >
              <Ionicons
                name="camera"
                size={scale(40)}
                color={defaultStyles.colors.white}
              />
            </TouchableOpacity>
          </>
        )}
      </View>
    </AppModal>
  );
}
const styles = ScaledSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    width: "100%",
  },
  cameraActionContainer: {
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
    borderRadius: "40@s",
    bottom: "10@s",
    flexDirection: "row",
    height: "80@s",
    justifyContent: "center",
    padding: "8@s",
    position: "absolute",
    width: "80@s",
  },
  cameraActionIconLeft: {
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
    borderRadius: "8@s",
    height: "35@s",
    justifyContent: "center",
    left: "20@s",
    position: "absolute",
    top: "20@s",
    width: "35@s",
  },
  cameraActionIconRight: {
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
    borderRadius: "8@s",
    height: "35@s",
    justifyContent: "center",
    position: "absolute",
    right: "20@s",
    top: "20@s",
    width: "35@s",
  },
  confirmPictureActionContainer: {
    alignItems: "center",
    bottom: "20@s",
    flexDirection: "row",
    justifyContent: "space-around",
    padding: "8@s",
    position: "absolute",
    width: "50%",
  },
  confirmActionIcon: {
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
    borderRadius: "8@s",
    height: "35@s",
    justifyContent: "center",
    width: "35@s",
  },
  image: {
    height: "100%",
    width: "100%",
  },
  modal: {
    backgroundColor: defaultStyles.colors.dark_Variant,
  },
  preview: {
    height: defaultStyles.height,
    width: defaultStyles.width,
  },
});

export default memo(Camera);
