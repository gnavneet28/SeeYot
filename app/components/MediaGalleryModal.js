import React, { useState, useContext, useCallback } from "react";
import { TouchableWithoutFeedback, View, TouchableOpacity } from "react-native";
import { ScaledSheet, scale } from "react-native-size-matters";
import ApiProcessingContainer from "./ApiProcessingContainer";
import MaterialIcons from "../../node_modules/react-native-vector-icons/MaterialIcons";
import Ionicons from "../../node_modules/react-native-vector-icons/Ionicons";

import AppModal from "./AppModal";
import GalleryImages from "./GalleryImages";
import Camera from "./Camera";
import DropdownAlbumSelect from "./DropdownAlbumSelect";

import defaultStyles from "../config/styles";

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

  const handleOptionSelection = (a) => {
    setSelected("");
    handleAlbumChange(a);
  };

  return (
    <AppModal
      animationType="slide"
      style={styles.container}
      visible={visible}
      onRequestClose={onRequestClose}
    >
      <View style={styles.scrollViewContainer}>
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
        <View style={styles.dropDownContainerMain}>
          <DropdownAlbumSelect
            containerStyle={styles.dropDown}
            selected={albumName}
            data={albums}
            onOptionSelection={handleOptionSelection}
          />
          <Ionicons
            name="caret-down-outline"
            size={scale(14)}
            color={defaultStyles.colors.dark_Variant}
          />
        </View>
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
    height: "35@s",
    marginRight: "5@s",
    marginVertical: "6@s",
    paddingHorizontal: "10@s",
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
    backgroundColor: defaultStyles.colors.white,
    borderRadius: "5@s",
    height: "30@s",
    justifyContent: "center",
    marginHorizontal: "5@s",
    width: "30@s",
  },
  container: {
    backgroundColor: defaultStyles.colors.primary,
    flex: 1,
    overflow: "hidden",
    width: "100%",
  },
  contentContainerStyle: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.primary,
    height: "48@s",
    paddingLeft: "5@s",
  },
  scrollViewContainer: {
    alignItems: "center",
    flexDirection: "row",
    marginBottom: "5@s",
    paddingLeft: "15@s",
    width: "100%",
  },
  dropDownContainerMain: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.white,
    borderRadius: "5@s",
    flex: 1,
    flexDirection: "row",
    marginLeft: "5@s",
    marginRight: "15@s",
    paddingHorizontal: "10@s",
  },
  dropDown: {
    borderColor: defaultStyles.colors.white,
    borderWidth: 0,
  },
});

export default MediaGalleryModal;
