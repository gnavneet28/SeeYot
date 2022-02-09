import React, { memo } from "react";
import {
  View,
  Modal,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { ScaledSheet } from "react-native-size-matters";

import AppText from "./AppText";
import AppButton from "./AppButton";

import defaultStyles from "../config/styles";

function FavoriteOptionsModal({
  handleAddOptionalReplyPress,
  handleCloseAddOption,
  optionalMessage,
  recipient,
  setOptionalMessage,
  showAddoption,
}) {
  const handleKeyboardDismiss = () => Keyboard.dismiss();
  return (
    <Modal
      visible={showAddoption}
      onRequestClose={handleCloseAddOption}
      transparent
      animationType="fade"
    >
      <TouchableWithoutFeedback onPress={handleKeyboardDismiss}>
        <View style={styles.addoptionModalFallback}>
          <View style={styles.addOptionContainer}>
            <AppText style={styles.addOptionTitle}>Add Option</AppText>
            <AppText style={styles.addOptionInfo}>
              Add optional replies that you expect {recipient.name} would most
              likely to reply with. You can add a minimum of 2 and a maximum of
              4 options. Options help you to get valid replies.
            </AppText>
            <TextInput
              maxLength={100}
              multiline={true}
              onChangeText={setOptionalMessage}
              placeholder="Add an expected reply..."
              style={styles.addOptionInput}
              value={optionalMessage}
            />
            <AppText style={styles.optionLengthInfo}>
              Option should be minimum 3 characters long.
            </AppText>
            <View style={styles.addOptionActionContainer}>
              <AppButton
                onPress={handleCloseAddOption}
                title="Close"
                style={styles.closeButton}
                subStyle={styles.closeButtonSub}
              />
              <AppButton
                disabled={
                  optionalMessage.replace(/\s/g, "").length >= 3 ? false : true
                }
                onPress={handleAddOptionalReplyPress}
                title="Add"
                style={[
                  styles.addButton,
                  {
                    backgroundColor:
                      optionalMessage.replace(/\s/g, "").length >= 3
                        ? defaultStyles.colors.blue
                        : defaultStyles.colors.lightGrey,
                  },
                ]}
                subStyle={styles.addButtonSub}
              />
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
const styles = ScaledSheet.create({
  addoptionModalFallback: {
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.8)",
    flex: 1,
    justifyContent: "center",
    width: "100%",
  },
  addOptionContainer: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.white,
    borderColor: defaultStyles.colors.dark_Variant,
    borderRadius: "10@s",
    borderWidth: 2,
    elevation: 5,
    overflow: "hidden",
    width: "80%",
  },
  addOptionTitle: {
    backgroundColor: defaultStyles.colors.dark_Variant,
    color: defaultStyles.colors.white,
    height: "40@s",
    textAlign: "center",
    textAlignVertical: "center",
    width: "100%",
  },
  addOptionInfo: {
    color: defaultStyles.colors.secondary,
    fontSize: "12.5@s",
    marginVertical: "5@s",
    textAlign: "left",
    width: "95%",
  },
  addOptionInput: {
    borderColor: defaultStyles.colors.lightGrey,
    borderRadius: "10@s",
    borderWidth: 1,
    fontFamily: "ComicNeue-Bold",
    fontSize: "14@s",
    fontWeight: "normal",
    marginTop: "5@s",
    padding: "5@s",
    paddingHorizontal: "10@s",
    width: "95%",
  },
  addOptionActionContainer: {
    alignItems: "center",
    flexDirection: "row",
    height: "50@s",
    justifyContent: "center",
    marginVertical: "10@s",
    padding: "5@s",
    width: "95%",
  },
  addButton: {
    backgroundColor: defaultStyles.colors.blue,
    borderRadius: "10@s",
    height: "32@s",
    width: "55@s",
  },
  addButtonSub: {
    fontSize: "14@s",
  },
  closeButton: {
    backgroundColor: defaultStyles.colors.yellow_Variant,
    borderRadius: "10@s",
    height: "32@s",
    marginRight: "20@s",
    width: "55@s",
  },
  closeButtonSub: {
    color: defaultStyles.colors.secondary,
    fontSize: 15,
  },
  optionLengthInfo: {
    alignSelf: "flex-start",
    color: defaultStyles.colors.dark_Variant,
    fontSize: "12@s",
    marginBottom: "10@s",
    marginLeft: "10@s",
    marginTop: "5@s",
    paddingBottom: 0,
    paddingTop: 0,
  },
});

export default memo(FavoriteOptionsModal);
