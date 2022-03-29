import React, { memo } from "react";
import { View, Modal, Keyboard, TouchableWithoutFeedback } from "react-native";
import { ScaledSheet, scale } from "react-native-size-matters";

import defaultStyles from "../config/styles";

import AppText from "./AppText";
import AppTextInput from "./AppTextInput";
import AppButton from "./AppButton";
import ApiProcessingContainer from "./ApiProcessingContainer";
import Backdrop from "./Backdrop";

function EditNameModal({
  savingName,
  setOpenEditName,
  openEditName,
  setName,
  name,
  user,
  isConnected,
  handleNameChange,
}) {
  const handleHideEditName = () => {
    setOpenEditName(false);
  };

  const handleKeyboardDismiss = () => Keyboard.dismiss();

  const doNothing = () => null;
  return (
    <Modal
      onRequestClose={savingName ? doNothing : handleHideEditName}
      transparent={true}
      visible={openEditName}
    >
      <TouchableWithoutFeedback onPress={handleKeyboardDismiss}>
        <View style={styles.modal}>
          <Backdrop onPress={savingName ? doNothing : handleHideEditName} />
          <View style={styles.editContainer}>
            <AppText style={styles.editName}>Edit your name</AppText>
            <View style={styles.inputBoxContainer}>
              <AppTextInput
                editable={!savingName}
                maxLength={30}
                minLength={3}
                onChangeText={(text) => setName(text)}
                placeholder={user.name}
                style={styles.inputBox}
                subStyle={{ opacity: 0.8, paddingHorizontal: scale(5) }}
                value={name}
              />
              <AppText style={styles.nameLength}>{name.length}/30</AppText>
            </View>
            <View style={styles.actionButtonContainer}>
              <AppButton
                disabled={savingName}
                onPress={() => {
                  setOpenEditName(false);
                  setName(user.name);
                }}
                style={[
                  styles.button,
                  { backgroundColor: defaultStyles.colors.light },
                ]}
                subStyle={{ color: defaultStyles.colors.dark, opacity: 0.8 }}
                title="Cancel"
              />
              <ApiProcessingContainer
                processing={savingName}
                style={styles.apiProcessingContainer}
              >
                <AppButton
                  disabled={
                    name &&
                    name.replace(/\s/g, "").length >= 4 &&
                    isConnected &&
                    !savingName &&
                    name !== user.name
                      ? false
                      : true
                  }
                  onPress={handleNameChange}
                  style={[
                    styles.button,
                    {
                      backgroundColor:
                        name &&
                        name.replace(/\s/g, "").length >= 4 &&
                        isConnected &&
                        !savingName &&
                        name !== user.name
                          ? defaultStyles.colors.yellow_Variant
                          : defaultStyles.colors.light,
                    },
                  ]}
                  subStyle={styles.saveButtonSub}
                  title="Save"
                />
              </ApiProcessingContainer>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
const styles = ScaledSheet.create({
  actionButtonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  apiProcessingContainer: {
    backgroundColor: defaultStyles.colors.yellow_Variant,
    borderRadius: "5@s",
    height: "30@s",
    marginHorizontal: "10@s",
    overflow: "hidden",
    width: "60@s",
  },
  button: {
    backgroundColor: defaultStyles.colors.yellow_Variant,
    height: "30@s",
    width: "60@s",
  },
  editName: {
    backgroundColor: defaultStyles.colors.light,
    color: defaultStyles.colors.dark_Variant,
    fontSize: "14@s",
    height: "35@s",
    textAlign: "center",
    textAlignVertical: "center",
  },
  editContainer: {
    backgroundColor: defaultStyles.colors.white,
    borderTopRightRadius: "10@s",
    borderTopStartRadius: "10@s",
    overflow: "hidden",
    paddingBottom: "30@s",
    width: "100%",
  },
  inputBoxContainer: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.white,
    borderBottomWidth: 1,
    borderColor: defaultStyles.colors.light,
    flexDirection: "row",
    height: defaultStyles.dimensionConstants.height,
    justifyContent: "space-between",
    marginBottom: "10@s",
    paddingHorizontal: "5@s",
  },
  inputBox: {
    paddingHorizontal: "5@s",
    width: "85%",
  },
  modal: {
    backgroundColor: "rgba(0,0,0,0.7)",
    flex: 1,
    justifyContent: "space-between",
  },
  nameLength: {
    opacity: 0.7,
    fontSize: "12@s",
  },
  saveButtonSub: {
    color: defaultStyles.colors.secondary,
  },
});

export default memo(EditNameModal);
