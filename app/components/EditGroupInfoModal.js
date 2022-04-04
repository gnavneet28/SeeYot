import React, { memo, useState } from "react";
import {
  View,
  Modal,
  Keyboard,
  TouchableWithoutFeedback,
  TextInput,
} from "react-native";
import { ScaledSheet, scale } from "react-native-size-matters";
import AntDesign from "../../node_modules/react-native-vector-icons/AntDesign";

import defaultStyles from "../config/styles";

import AppText from "./AppText";
import AppButton from "./AppButton";
import Backdrop from "./Backdrop";

function EditGroupInfoModal({
  handleSubmitInfoChange,
  isConnected,
  isLoading,
  openGroupInfo,
  setOpenGroupInfo,
  setGroupInfo,
  groupInfo,
}) {
  const handleDismissKeyboard = () => Keyboard.dismiss();
  const [height, setHeight] = useState(0);

  return (
    <Modal
      animationType="slide"
      onRequestClose={() => setOpenGroupInfo(false)}
      transparent={true}
      visible={openGroupInfo}
    >
      <TouchableWithoutFeedback onPress={handleDismissKeyboard}>
        <View style={styles.groupInfoModal}>
          <Backdrop onPress={() => setOpenGroupInfo(false)} />
          <View style={styles.closeMessageIconContainer}>
            <AntDesign
              onPress={() => setOpenGroupInfo(false)}
              name="downcircle"
              color={defaultStyles.colors.secondary_Variant}
              size={scale(28)}
            />
          </View>
          <View style={styles.optionsContainerReport}>
            <AppText style={styles.reportProblemTitle}>
              Edit Group Information
            </AppText>
            <TextInput
              editable={!isLoading}
              maxLength={500}
              multiline={true}
              onChangeText={setGroupInfo}
              placeholder="Describe your problem..."
              subStyle={styles.inputProblem}
              value={groupInfo}
              style={[
                styles.groupInfoInput,
                { height: Math.min(100, Math.max(60, height)) },
              ]}
              onContentSizeChange={(event) =>
                setHeight(event.nativeEvent.contentSize.height)
              }
            />
            <View style={styles.actionContainer}>
              <AppText style={styles.groupInfoLength}>
                {groupInfo.length}/500
              </AppText>
              <AppButton
                disabled={
                  groupInfo.replace(/\s/g, "").length >= 1 &&
                  isConnected &&
                  !isLoading
                    ? false
                    : true
                }
                onPress={handleSubmitInfoChange}
                style={[
                  styles.submitGroupInfoButton,
                  {
                    backgroundColor:
                      groupInfo.replace(/\s/g, "").length >= 1 &&
                      isConnected &&
                      !isLoading
                        ? defaultStyles.colors.yellow_Variant
                        : defaultStyles.colors.light,
                  },
                ]}
                subStyle={styles.submitGroupInfoButtonSub}
                title="Save"
              />
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
const styles = ScaledSheet.create({
  actionContainer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: "5@s",
    width: "100%",
  },
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
  inputProblem: {
    fontSize: "15@s",
    height: "100%",
    textAlignVertical: "top",
  },
  optionsContainerReport: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.white,
    borderTopLeftRadius: "10@s",
    borderTopRightRadius: "10@s",
    bottom: 0,
    overflow: "hidden",
    paddingHorizontal: "10@s",
    paddingTop: "20@s",
    paddingBottom: "15@s",
    width: "100%",
  },
  groupInfoInput: {
    backgroundColor: defaultStyles.colors.white,
    borderColor: defaultStyles.colors.light,
    borderRadius: "5@s",
    borderWidth: 1,
    color: defaultStyles.colors.dark,
    fontFamily: "ComicNeue-Bold",
    fontSize: "14@s",
    fontStyle: "normal",
    fontWeight: "normal",
    marginBottom: "10@s",
    padding: "5@s",
    width: "95%",
  },
  groupInfoLength: {
    fontSize: "12@s",
  },
  groupInfoModal: {
    flex: 1,
    justifyContent: "space-between",
    overflow: "hidden",
    width: "100%",
  },
  reportProblemTitle: {
    marginBottom: "10@s",
    textAlign: "center",
    width: "100%",
  },
  submitGroupInfoButton: {
    backgroundColor: defaultStyles.colors.yellow_Variant,
    height: "30@s",
    width: "60@s",
  },
  submitGroupInfoButtonSub: {
    color: defaultStyles.colors.secondary,
  },
});

export default memo(EditGroupInfoModal);
