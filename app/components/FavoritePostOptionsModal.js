import React, { memo } from "react";
import { View, Modal } from "react-native";
import { ScaledSheet } from "react-native-size-matters";
import * as Animatable from "react-native-animatable";

import Option from "./Option";
import ApiOption from "./ApiOption";

import defaultStyles from "../config/styles";
import ModalBackDrop from "./ModalBackDrop";

function FavoritePostOptionsModal({
  handleCloseModal = () => {},
  isVisible,
  onDeletePress = () => {},
  onDisablePress = () => {},
  onEnableReplyPress = () => {},
  deleting,
  disabling,
  post = { open: true },
}) {
  const checkActionBeforeClosingModal = () => {
    if (deleting || disabling) return;
    handleCloseModal();
  };
  return (
    <Modal
      animationType="none"
      onRequestClose={checkActionBeforeClosingModal}
      transparent={true}
      visible={isVisible}
    >
      <ModalBackDrop onPress={checkActionBeforeClosingModal}>
        <View style={[styles.groupOptionMainContainer]}>
          <Animatable.View
            useNativeDriver={true}
            animation="pulse"
            style={styles.optionsContainer}
          >
            <Option
              onPress={checkActionBeforeClosingModal}
              title="Close"
              titleStyle={styles.optionClose}
            />

            <ApiOption
              onPress={onDeletePress}
              title="Delete"
              processing={deleting}
            />
            <ApiOption
              onPress={post.open ? onDisablePress : onEnableReplyPress}
              title={post.open ? "Disable replies" : "Enable Replies"}
              processing={disabling}
            />
          </Animatable.View>
        </View>
      </ModalBackDrop>
    </Modal>
  );
}
const styles = ScaledSheet.create({
  groupOptionMainContainer: {
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.8)",
    flex: 1,
    justifyContent: "center",
    width: "100%",
  },
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
});

export default memo(FavoritePostOptionsModal);
