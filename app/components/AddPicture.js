import React, { useState, memo, useCallback } from "react";
import { Image, Modal, TouchableHighlight, View } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import ImagePicker from "react-native-image-crop-picker";
import { ScaledSheet, scale } from "react-native-size-matters";
import AntDesign from "react-native-vector-icons/AntDesign";

import defaultStyles from "../config/styles";

import Alert from "./Alert";
import AppImage from "./AppImage";
import AppText from "./AppText";

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
      compressImageQuality: 1,
    })
      .then((image) => {
        onChangeImage(image.path);
      })
      .catch((err) => console.log(err));
  };

  const handleEditPress = () => {
    if (!image) return selectImage();
    setShowImageEdit(true);
  };

  const hanldeRemovePicturePress = useCallback(() => {
    if (!image) return;
    setShowImageEdit(false);
    setShowAlert(true);
  }, []);

  const handleSelectPicture = useCallback(() => {
    setShowImageEdit(false);
    selectImage();
  }, []);

  return (
    <>
      <View style={[styles.container, style]}>
        <Alert
          onRequestClose={() => setShowAlert(false)}
          description="Are you sure you want to remove this picture?"
          leftPress={() => setShowAlert(false)}
          leftOption="Cancel"
          rightOption="Ok"
          rightPress={() => {
            onChangeImage(null);
            setShowAlert(false);
          }}
          setVisible={setShowAlert}
          title="Remove"
          visible={showAlert}
        />
        <TouchableHighlight
          onPress={imageView ? () => setVisible(true) : () => null}
          style={styles.imageContainer}
          underlayColor={defaultStyles.colors.white}
        >
          <Image
            width={scale(108)}
            height={scale(108)}
            style={styles.image}
            source={image ? { uri: image } : require("../assets/user.png")}
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
        onRequestClose={() => setVisible(false)}
        transparent={true}
        visible={visible}
      >
        <View style={styles.contentContainer}>
          <MaterialIcons
            onPress={() => setVisible(false)}
            name="arrow-back"
            size={scale(23)}
            color={defaultStyles.colors.white}
            style={styles.closeIcon}
          />
          <View>
            <AppImage
              activeOpacity={1}
              imageUrl={image}
              style={styles.inlargedImage}
              subStyle={styles.inlargedImage}
            />
          </View>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        onRequestClose={() => setShowImageEdit(false)}
        transparent={true}
        visible={showImageEdit}
      >
        <View style={styles.imageEditContainer}>
          <View style={styles.closeMessageIconContainer}>
            <AntDesign
              onPress={() => setShowImageEdit(false)}
              name="downcircle"
              color={defaultStyles.colors.tomato}
              size={scale(28)}
            />
          </View>
          <View style={styles.imageEditOptionContainer}>
            <AppText
              onPress={hanldeRemovePicturePress}
              style={styles.imageEditButtonRemovePicture}
            >
              Remove Picture
            </AppText>
            <AppText
              onPress={handleSelectPicture}
              style={styles.imageEditButtonSelectPicture}
            >
              Select from Gallery
            </AppText>
          </View>
        </View>
      </Modal>
    </>
  );
}
const styles = ScaledSheet.create({
  closeIcon: {
    position: "absolute",
    top: "13@s",
    left: "19@s",
  },
  contentContainer: {
    backgroundColor: "rgba(0,0,0,1)",
    flex: 1,
    justifyContent: "center",
    width: "100%",
  },
  closeMessageIconContainer: {
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: defaultStyles.colors.white,
    borderRadius: "25@s",
    bottom: "-25@s",
    height: "40@s",
    justifyContent: "center",
    padding: "5@s",
    width: "40@s",
    zIndex: 222,
  },
  container: {
    alignItems: "center",
    height: "120@s",
    justifyContent: "center",
    width: "120@s",
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
  imageEditButtonRemovePicture: {
    backgroundColor: defaultStyles.colors.yellow_Variant,
    borderRadius: "5@s",
    color: defaultStyles.colors.secondary,
    elevation: 2,
    height: "30@s",
    marginVertical: "15@s",
    textAlign: "center",
    textAlignVertical: "center",
    width: "70%",
  },
  imageEditButtonSelectPicture: {
    backgroundColor: defaultStyles.colors.secondary,
    borderRadius: "5@s",
    color: defaultStyles.colors.yellow_Variant,
    elevation: 2,
    height: "30@s",
    textAlign: "center",
    textAlignVertical: "center",
    width: "70%",
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
  imageEditContainer: {
    flex: 1,
    justifyContent: "flex-end",
    overflow: "hidden",
    width: "100%",
  },
  imageEditOptionContainer: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.light,
    borderTopColor: defaultStyles.colors.light,
    borderTopLeftRadius: "10@s",
    borderTopRightRadius: "10@s",
    borderTopWidth: 1,
    bottom: 0,
    height: "140@s",
    overflow: "hidden",
    paddingTop: "20@s",
    width: "100%",
  },

  image: {
    borderRadius: "60@s",
    height: "108@s",
    resizeMode: "cover",
    width: "108@s",
  },
  inlargedImage: {
    borderRadius: 0,
    borderWidth: 0,
    height: width,
    width: width,
  },
});

export default memo(AddPicture);
