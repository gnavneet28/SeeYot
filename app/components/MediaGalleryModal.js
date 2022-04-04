import React, { useState, useContext, useCallback } from "react";
import {
  TouchableWithoutFeedback,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { ScaledSheet, scale } from "react-native-size-matters";
import ApiProcessingContainer from "./ApiProcessingContainer";
import MaterialIcons from "../../node_modules/react-native-vector-icons/MaterialIcons";
import Ionicons from "../../node_modules/react-native-vector-icons/Ionicons";

import AppModal from "./AppModal";
import GalleryImages from "./GalleryImages";
import Camera from "./Camera";

import defaultStyles from "../config/styles";
import AppText from "./AppText";

import ApiContext from "../utilities/apiContext";
import ImageContext from "../utilities/ImageContext";

function MediaGalleryModal({
  images = [],
  onSelectImageFromGallery,
  visible,
  onRequestClose,
  albums = [],
  handleAlbumChange,
  albumName,
  onCameraImageSelection,
}) {
  const [selected, setSelected] = useState("");
  const { setMediaImage, mediaImage } = useContext(ImageContext);
  const [showCamera, setShowCamera] = useState(false);

  const { sendingMedia } = useContext(ApiContext);

  const handleImageSelection = useCallback(
    (uri) => {
      setMediaImage(uri);
      if (selected == uri) {
        return setSelected("");
      }
      setSelected(uri);
    },
    [selected, mediaImage]
  );

  const doNull = () => null;

  const handleSelectedImage = useCallback(() => {
    onRequestClose();
    onSelectImageFromGallery(selected);

    setSelected("");
  }, [selected, mediaImage]);

  const handleSelectedImageFromCamera = (picture) => {
    onRequestClose();
    onCameraImageSelection(picture);
    setSelected("");
  };

  const handleOpenCamera = () => setShowCamera(true);

  return (
    <AppModal
      animationType="slide"
      style={styles.container}
      visible={visible}
      onRequestClose={onRequestClose}
    >
      <View style={styles.scrollViewContainer}>
        <ScrollView
          horizontal
          contentContainerStyle={styles.contentContainerStyle}
        >
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleOpenCamera}
            style={styles.cameraIcon}
          >
            <Ionicons
              onPress={handleOpenCamera}
              name="camera"
              size={scale(18)}
              color={defaultStyles.colors.secondary}
            />
          </TouchableOpacity>
          {albums.map((a) => (
            <AppText
              style={[
                styles.albumTitle,
                {
                  backgroundColor:
                    albumName == a.title
                      ? defaultStyles.colors.secondary
                      : defaultStyles.colors.white,
                  color:
                    albumName == a.title
                      ? defaultStyles.colors.white
                      : defaultStyles.colors.secondary,
                },
              ]}
              onPress={() => {
                setSelected("");
                handleAlbumChange(a);
              }}
              key={a.title}
            >
              {a.title}
            </AppText>
          ))}
        </ScrollView>
      </View>
      <GalleryImages
        selectedImage={selected}
        data={images}
        onImageSelection={handleImageSelection}
      />
      <Camera
        setVisible={setShowCamera}
        visible={showCamera}
        onPhotoSelect={handleSelectedImageFromCamera}
      />
      {selected ? (
        <ApiProcessingContainer
          processing={sendingMedia}
          style={[
            styles.apiProcessingContainer,
            { backgroundColor: defaultStyles.colors.secondary },
          ]}
        >
          <TouchableWithoutFeedback
            disabled={true}
            onPress={selected ? handleSelectedImage : doNull}
          >
            <MaterialIcons
              size={scale(25)}
              name="send"
              color={defaultStyles.colors.yellow_Variant}
            />
          </TouchableWithoutFeedback>
        </ApiProcessingContainer>
      ) : null}
    </AppModal>
  );
}
const styles = ScaledSheet.create({
  albumTitle: {
    backgroundColor: defaultStyles.colors.white,
    borderRadius: "10@s",
    marginRight: "5@s",
    marginVertical: "6@s",
    paddingHorizontal: "10@s",
    height: "35@s",
    textAlign: "center",
    textAlignVertical: "center",
  },
  apiProcessingContainer: {
    alignItems: "center",
    borderRadius: "25@s",
    bottom: "20@s",
    elevation: 10,
    height: "50@s",
    justifyContent: "center",
    overflow: "hidden",
    padding: "10@s",
    position: "absolute",
    right: "20@s",
    width: "50@s",
  },
  cameraIcon: {
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: defaultStyles.colors.yellow_Variant,
    borderRadius: "20@s",
    height: "40@s",
    justifyContent: "center",
    marginHorizontal: "5@s",
    width: "40@s",
  },
  container: {
    backgroundColor: defaultStyles.colors.primary,
    flex: 1,
    overflow: "hidden",
    width: "100%",
  },
  contentContainerStyle: {
    backgroundColor: defaultStyles.colors.primary,
    height: "48@s",
    paddingLeft: "5@s",
    alignItems: "center",
  },
  scrollViewContainer: {
    width: "100%",
  },
});

export default MediaGalleryModal;
