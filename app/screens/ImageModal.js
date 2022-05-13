import React from "react";
import { View, Modal, Image } from "react-native";
import { ScaledSheet, scale } from "react-native-size-matters";

import defaultStyles from "../config/styles";
import AppHeader from "../components/AppHeader";

const ImageModal = ({ handleCloseImageModal, visible, image, title }) => {
  return (
    <Modal
      animationType="fade"
      onRequestClose={handleCloseImageModal}
      transparent={true}
      visible={visible}
    >
      <View style={styles.container}>
        <AppHeader
          title={title}
          leftIcon="arrow-back"
          onPressLeft={handleCloseImageModal}
        />
        <View style={styles.contentContainer}>
          <Image
            resizeMode="contain"
            source={{ uri: image ? image : "defaultgroupdp" }}
            style={styles.inlargedImage}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = ScaledSheet.create({
  contentContainer: {
    backgroundColor: defaultStyles.colors.primary,
    flex: 1,
    justifyContent: "center",
    width: "100%",
  },
  container: {
    alignItems: "center",
    flex: 1,
    width: "100%",
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
  inlargedImage: {
    borderRadius: 0,
    borderWidth: 0,
    flex: 1,
    width: defaultStyles.width,
  },
});

export default ImageModal;
