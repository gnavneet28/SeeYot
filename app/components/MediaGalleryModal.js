import React, { useState, useContext, useCallback } from "react";
import { TouchableWithoutFeedback, View, ScrollView } from "react-native";
import { ScaledSheet, scale } from "react-native-size-matters";
import ApiProcessingContainer from "./ApiProcessingContainer";
import MaterialIcons from "../../node_modules/react-native-vector-icons/MaterialIcons";

import AppModal from "./AppModal";
import GalleryImages from "./GalleryImages";

import defaultStyles from "../config/styles";
import AppText from "./AppText";

import ApiContext from "../utilities/apiContext";

function MediaGalleryModal({
  images = [],
  onSelectImageFromGallery,
  visible,
  onRequestClose,
  albums = [],
  handleAlbumChange,
  albumName,
}) {
  const [selected, setSelected] = useState("");

  const { sendingMedia } = useContext(ApiContext);

  const handleImageSelection = useCallback(
    (uri) => {
      if (selected == uri) {
        return setSelected("");
      }
      setSelected(uri);
    },
    [selected]
  );

  const doNull = () => null;

  const handleSelectedImage = useCallback(() => {
    onRequestClose();
    onSelectImageFromGallery(selected);
    setSelected("");
  }, [selected]);

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
          {albums.map((a) => (
            <AppText
              style={[
                styles.albumTitle,
                {
                  backgroundColor:
                    albumName == a.title
                      ? defaultStyles.colors.tomato
                      : defaultStyles.colors.white,
                  color:
                    albumName == a.title
                      ? defaultStyles.colors.white
                      : defaultStyles.colors.tomato,
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
  },
  scrollViewContainer: {
    width: "100%",
  },
});

export default MediaGalleryModal;
