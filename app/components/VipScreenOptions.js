import React, { memo } from "react";
import { View, Modal } from "react-native";
import { ScaledSheet } from "react-native-size-matters";

import ApiOption from "./ApiOption";
import Option from "./Option";

import defaultStyles from "../config/styles";

function VipScreenOptions({
  apiProcessing,
  handleCloseOptionModal,
  handlePopUpAddEchoButtonPress,
  handlePopUpOnSendThoughtButtonPress,
  hanldeRemoveFromSearchHistory,
  isVisible,
}) {
  return (
    <Modal
      animationType="fade"
      onRequestClose={handleCloseOptionModal}
      transparent={true}
      visible={isVisible}
    >
      <View style={styles.searchHistoryMainContainer}>
        <View style={styles.optionsContainer}>
          <Option
            onPress={handleCloseOptionModal}
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
    </Modal>
  );
}
const styles = ScaledSheet.create({
  optionsContainer: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.white,
    borderColor: defaultStyles.colors.dark_Variant,
    borderRadius: "20@s",
    borderWidth: 1,
    overflow: "hidden",
    width: "60%",
  },
  optionClose: {
    backgroundColor: defaultStyles.colors.dark_Variant,
    color: defaultStyles.colors.white,
    opacity: 1,
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
