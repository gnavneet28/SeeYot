import React, { useState, memo } from "react";
import {
  Image,
  Modal,
  StyleSheet,
  TouchableHighlight,
  View,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import ImagePicker from "react-native-image-crop-picker";

import defaultStyles from "../config/styles";

import Alert from "./Alert";
import AppImage from "./AppImage";

const height = defaultStyles.height;
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

  const selectImage = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      cropping: true,
      mediaType: "photo",
      compressImageQuality: 0.9,
    })
      .then((image) => {
        onChangeImage(image.path);
      })
      .catch((err) => console.log(err));
  };

  const handleEditPress = () => {
    if (!image) selectImage();
    else {
      setShowAlert(true);
    }
  };

  return (
    <>
      <View style={[styles.container, style]}>
        <Alert
          onRequestClose={() => setShowAlert(false)}
          description="Are you sure you want to remove this picture."
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
            size={height * 0.022}
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
            size={26}
            color={defaultStyles.colors.white}
            style={styles.closeIcon}
          />
          <View>
            <AppImage
              imageUrl={image}
              style={styles.inlargedImage}
              subStyle={styles.inlargedImage}
            />
          </View>
        </View>
      </Modal>
    </>
  );
}
const styles = StyleSheet.create({
  closeIcon: {
    position: "absolute",
    top: 15,
    left: 22,
  },
  contentContainer: {
    backgroundColor: "rgba(0,0,0,1)",
    flex: 1,
    justifyContent: "center",
    width: "100%",
  },
  container: {
    alignItems: "center",
    height: height > 640 ? height * 0.173 : height * 0.19,
    justifyContent: "center",
    width: height > 640 ? height * 0.173 : height * 0.19,
  },
  icon: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.white,
    borderRadius: 20,
    bottom: height * 0.01,
    height: height * 0.04,
    justifyContent: "center",
    position: "absolute",
    right: height * 0.01,
    width: height * 0.04,
  },
  imageContainer: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.white,
    borderRadius: 65,
    height: height > 640 ? height * 0.15 : height * 0.18,
    justifyContent: "center",
    width: height > 640 ? height * 0.15 : height * 0.18,
  },
  image: {
    borderRadius: 60,
    height: height > 640 ? height * 0.138 : height * 0.17,
    resizeMode: "cover",
    width: height > 640 ? height * 0.138 : height * 0.17,
  },
  inlargedImage: {
    borderRadius: 0,
    borderWidth: 0,
    height: width,
    width: width,
  },
});

export default memo(AddPicture);
