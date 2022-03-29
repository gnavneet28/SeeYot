import React from "react";
import { View, Modal } from "react-native";
import { ScaledSheet, scale } from "react-native-size-matters";
import AntDesign from "../../node_modules/react-native-vector-icons/AntDesign";

import AppText from "../components/AppText";
import Backdrop from "../components/Backdrop";

import defaultStyles from "../config/styles";

function EditImageOptionSelecter({
  showImageEdit,
  setShowImageEdit,
  handleHideImageEditOptions,
  handleSelectPicture,
  hanldeRemovePicturePress,
  style,
}) {
  return (
    <Modal
      animationType="slide"
      onRequestClose={handleHideImageEditOptions}
      transparent={true}
      visible={showImageEdit}
    >
      <View style={styles.imageEditContainer}>
        <Backdrop onPress={() => setShowImageEdit(false)} />
        <View style={styles.closeMessageIconContainer}>
          <AntDesign
            onPress={handleHideImageEditOptions}
            name="downcircle"
            color={defaultStyles.colors.tomato}
            size={scale(28)}
          />
        </View>
        <View style={[styles.imageEditOptionContainer, style]}>
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
  );
}
const styles = ScaledSheet.create({
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
  imageEditContainer: {
    flex: 1,
    justifyContent: "space-between",
    overflow: "hidden",
    width: "100%",
  },
  imageEditOptionContainer: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.primary,
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
});

export default EditImageOptionSelecter;
