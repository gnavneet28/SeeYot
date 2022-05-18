import React, { memo } from "react";
import { View, Modal } from "react-native";
import { ScaledSheet } from "react-native-size-matters";
import * as Animatable from "react-native-animatable";

import Option from "./Option";
import ApiOption from "./ApiOption";

import defaultStyles from "../config/styles";
import ModalBackDrop from "./ModalBackDrop";

function EchoScreenOptions({
  echoMessageOption,
  handleCloseModal,
  handleDeleteEchoPress,
  handleUseThisEchoPress,
  isVisible,
  recipient,
  removingEcho,
}) {
  const onCloseModal = () => {
    if (removingEcho) return;
    handleCloseModal();
  };
  return (
    <Modal
      animationType="none"
      onRequestClose={onCloseModal}
      transparent={true}
      visible={isVisible}
    >
      <ModalBackDrop onPress={onCloseModal}>
        <View style={[styles.echoOptionMainContainer]}>
          <Animatable.View
            useNativeDriver={true}
            animation="pulse"
            style={styles.optionsContainer}
          >
            <Option
              onPress={onCloseModal}
              title="Close"
              titleStyle={styles.optionClose}
            />

            <ApiOption
              onPress={handleDeleteEchoPress}
              processing={removingEcho}
              title="Delete"
            />
            {recipient._id == echoMessageOption.messageFor ? null : (
              <Option title="Use this echo" onPress={handleUseThisEchoPress} />
            )}
          </Animatable.View>
        </View>
      </ModalBackDrop>
    </Modal>
  );
}
const styles = ScaledSheet.create({
  echoOptionMainContainer: {
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

export default memo(EchoScreenOptions);
