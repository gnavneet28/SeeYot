import React, { memo, useEffect } from "react";
import { View, Modal } from "react-native";
import { ScaledSheet } from "react-native-size-matters";

import ApiOption from "./ApiOption";
import Option from "./Option";

import defaultStyles from "../config/styles";
import ModalBackDrop from "./ModalBackDrop";

function VipScreenOptions({
  apiProcessing,
  handleCloseOptionModal,
  handlePopUpAddEchoButtonPress,
  handlePopUpOnSendThoughtButtonPress,
  hanldeRemoveFromSearchHistory,
  isVisible,
}) {
  const onCloseModal = () => {
    if (apiProcessing) return;
    handleCloseOptionModal();
  };
  return (
    <Modal
      animationType="fade"
      onRequestClose={onCloseModal}
      transparent={true}
      visible={isVisible}
    >
      <ModalBackDrop onPress={onCloseModal}>
        <View style={styles.searchHistoryMainContainer}>
          <View style={styles.optionsContainer}>
            <Option
              onPress={onCloseModal}
              title="Close"
              titleStyle={styles.optionClose}
            />
            <ApiOption
              processing={apiProcessing}
              title="Remove"
              onPress={hanldeRemoveFromSearchHistory}
            />

            <Option title="Add Echo" onPress={handlePopUpAddEchoButtonPress} />
            <Option
              title="Send Thoughts"
              onPress={handlePopUpOnSendThoughtButtonPress}
            />
          </View>
        </View>
      </ModalBackDrop>
    </Modal>
  );
}
const styles = ScaledSheet.create({
  optionsContainer: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.white,
    borderColor: defaultStyles.colors.dark_Variant,
    borderRadius: "15@s",
    borderWidth: 1,
    overflow: "hidden",
    width: "60%",
  },
  optionClose: {
    ...defaultStyles.closeIcon,
  },
  searchHistoryMainContainer: {
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.8)",
    flex: 1,
    justifyContent: "center",
    width: "100%",
  },
});

export default memo(VipScreenOptions);
