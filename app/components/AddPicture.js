import React, { useState, memo, useCallback } from "react";
import { Image, Modal, TouchableHighlight, View } from "react-native";
import MaterialIcons from "../../node_modules/react-native-vector-icons/MaterialIcons";
import ImagePicker from "react-native-image-crop-picker";
import { ScaledSheet, scale } from "react-native-size-matters";
import * as Animatable from "react-native-animatable";

import defaultStyles from "../config/styles";

import Alert from "./Alert";
import AppImage from "./AppImage";
import EditImageOptionSelecter from "./EditImageOptionSelecter";

const width = defaultStyles.width;

function AddPicture({
  image = "",
  onChangeImage = () => null,
  style,
  imageView = false,
  icon = "camera-alt",
}) {
  const [showAlert, setShowAlert] = useState(false);
  const [visible, setVisible] = useState(false);
  const [showImageEdit, setShowImageEdit] = useState(false);

  const selectImage = () => {
    ImagePicker.openPicker({
      width: 700,
      height: 700,
      cropping: true,
      mediaType: "photo",
      compressImageQuality: 0.7,
    })
      .then((image) => {
        onChangeImage(image.path);
      })
      .catch((err) => null);
  };

  const handleEditPress = () => {
    if (!image) return selectImage();
    setShowImageEdit(true);
  };

  const hanldeRemovePicturePress = useCallback(() => {
    if (!image) return;
    if (visible) {
      setVisible(false);
    }
    setShowImageEdit(false);
    setShowAlert(true);
  }, [visible]);

  const handleSelectPicture = useCallback(() => {
    if (visible) {
      setVisible(false);
    }
    setShowImageEdit(false);
    selectImage();
  }, [visible]);

  const handleHideAlert = () => {
    setShowAlert(false);
  };

  const handleAlertRightOptionPress = () => {
    onChangeImage(null);
    setShowAlert(false);
  };

  const handleShowInlargedImage = () => {
    setVisible(true);
  };

  const handleHideInlargedImage = () => {
    setVisible(false);
  };

  const handleHideImageEditOptions = () => {
    setShowImageEdit(false);
  };

  return (
    <>
      <View style={[styles.container, style]}>
        <TouchableHighlight
          onPress={imageView ? handleShowInlargedImage : () => null}
          style={styles.imageContainer}
          underlayColor={defaultStyles.colors.white}
        >
          <Image
            width={scale(108)}
            height={scale(108)}
            style={styles.image}
            subStyle={styles.imageSub}
            source={image ? { uri: image } : { uri: "user" }}
          />
        </TouchableHighlight>
        <TouchableHighlight
          onPress={handleEditPress}
          style={styles.icon}
          underlayColor={defaultStyles.colors.white}
        >
          <MaterialIcons
            color={defaultStyles.colors.secondary}
            name={icon}
            size={scale(14)}
          />
        </TouchableHighlight>
      </View>
      <Modal
        animationType="fade"
        onRequestClose={handleHideInlargedImage}
        transparent={true}
        visible={visible}
      >
        <View style={styles.contentContainer}>
          <View style={styles.header}>
            <MaterialIcons
              onPress={handleHideInlargedImage}
              name="arrow-back"
              size={scale(23)}
              color={defaultStyles.colors.white}
            />
            <TouchableHighlight
              onPress={handleEditPress}
              style={styles.editIconContainer}
              underlayColor={defaultStyles.colors.primary}
            >
              <MaterialIcons
                color={defaultStyles.colors.white}
                name={icon}
                size={scale(20)}
              />
            </TouchableHighlight>
          </View>
          <Animatable.View
            duration={400}
            animation="zoomIn"
            useNativeDriver={true}
          >
            <AppImage
              activeOpacity={1}
              imageUrl={image}
              style={styles.inlargedImage}
              subStyle={styles.inlargedImage}
            />
          </Animatable.View>
        </View>
      </Modal>
      <Alert
        onRequestClose={handleHideAlert}
        description="Are you sure you want to remove this picture?"
        leftPress={handleHideAlert}
        leftOption="Cancel"
        rightOption="Ok"
        rightPress={handleAlertRightOptionPress}
        setVisible={setShowAlert}
        title="Remove"
        visible={showAlert}
      />
      <EditImageOptionSelecter
        showImageEdit={showImageEdit}
        handleHideImageEditOptions={handleHideImageEditOptions}
        handleSelectPicture={handleSelectPicture}
        hanldeRemovePicturePress={hanldeRemovePicturePress}
        setShowImageEdit={setShowImageEdit}
      />
    </>
  );
}
const styles = ScaledSheet.create({
  contentContainer: {
    backgroundColor: defaultStyles.colors.primary,
    flex: 1,
    justifyContent: "center",
    width: "100%",
  },
  container: {
    alignItems: "center",
    height: "120@s",
    justifyContent: "center",
    width: "120@s",
  },
  editIconContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: "15@s",
    paddingVertical: "10@s",
    position: "absolute",
    top: 0,
    width: "100%",
  },
  icon: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.white,
    borderWidth: 2,
    borderColor: defaultStyles.colors.yellow_Variant,
    borderRadius: "20@s",
    bottom: "8@s",
    height: "25@s",
    justifyContent: "center",
    position: "absolute",
    right: "8@s",
    width: "25@s",
  },
  imageContainer: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.white,
    borderColor: defaultStyles.colors.yellow_Variant,
    borderRadius: "65@s",
    borderWidth: 2,
    height: "115@s",
    justifyContent: "center",
    width: "115@s",
  },
  image: {
    borderRadius: "60@s",
    height: "108@s",
    resizeMode: "cover",
    width: "108@s",
  },
  imageSub: {
    height: "106@s",
    width: "106@s",
    borderRadius: "53@s",
  },
  inlargedImage: {
    borderRadius: 0,
    borderWidth: 0,
    height: width,
    width: width,
  },
});

export default memo(AddPicture);
