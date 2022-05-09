import React, { memo } from "react";
import { View, Modal } from "react-native";
import { ScaledSheet } from "react-native-size-matters";
import * as Animatable from "react-native-animatable";

import Option from "./Option";
import ApiOption from "./ApiOption";

import defaultStyles from "../config/styles";

function SendThoughtsOptionsModal({
  handleModalClose,
  isBlocked,
  handleBlockPress,
  handleUnblockPress,
  isVisible,
  handleUnfriendPress,
  unfriendProcessing,
  handleAddFavoritePress,
  blockProcessing,
  favoriteProcessing,
  handleRemoveFavoritePress,
  inFavorites,
  inContacts,
}) {
  return (
    <Modal
      animationType="none"
      onRequestClose={handleModalClose}
      transparent={true}
      visible={isVisible}
    >
      <View style={[styles.modalMainContainer]}>
        <Animatable.View
          useNativeDriver={true}
          animation="pulse"
          style={styles.optionsContainer}
        >
          <Option
            title="Close"
            titleStyle={styles.closeOption}
            onPress={handleModalClose}
          />

          {inContacts ? (
            <ApiOption
              title="Unfriend"
              onPress={handleUnfriendPress}
              processing={unfriendProcessing}
            />
          ) : null}

          <ApiOption
            title={inFavorites ? "Remove from Favorites" : "Add to Favorites"}
            onPress={
              !inFavorites ? handleAddFavoritePress : handleRemoveFavoritePress
            }
            processing={favoriteProcessing}
          />
          <ApiOption
            title={isBlocked ? "Unblock" : "Block"}
            onPress={!isBlocked ? handleBlockPress : handleUnblockPress}
            processing={blockProcessing}
          />
        </Animatable.View>
      </View>
    </Modal>
  );
}
const styles = ScaledSheet.create({
  closeOption: {
    backgroundColor: defaultStyles.colors.dark_Variant,
    borderColor: defaultStyles.colors.white,
    borderTopLeftRadius: "15@s",
    borderTopRightRadius: "15@s",
    borderWidth: 1,
    color: defaultStyles.colors.white,
    opacity: 1,
  },
  modalMainContainer: {
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.8)",
    flex: 1,
    justifyContent: "center",
    width: "100%",
  },
  optionsContainer: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.white,
    borderRadius: "15@s",
    overflow: "hidden",
    width: "60%",
  },
});

export default memo(SendThoughtsOptionsModal);
