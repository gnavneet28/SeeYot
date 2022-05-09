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

function EditGroupPasswordModal({
  handleSubmitPassword,
  isConnected,
  isLoading,
  openPasswordModal,
  setOpenPasswordModal,
  group = { password: "" },
}) {
  const [password, setPassword] = useState(group.password);
  const handleDismissKeyboard = () => Keyboard.dismiss();

  const onSubmit = () => {
    handleSubmitPassword(password);
  };

  const handleClosePasswordModal = () => setOpenPasswordModal(false);

  return (
    <Modal
      animationType="slide"
      onRequestClose={handleClosePasswordModal}
      transparent={true}
      visible={openPasswordModal}
    >
      <TouchableWithoutFeedback onPress={handleDismissKeyboard}>
        <View style={styles.groupInfoModal}>
          <Backdrop onPress={handleClosePasswordModal} />
          <View style={styles.closeMessageIconContainer}>
            <AntDesign
              onPress={handleClosePasswordModal}
              name="downcircle"
              color={defaultStyles.colors.secondary_Variant}
              size={scale(28)}
            />
          </View>
          <View style={styles.optionsContainerReport}>
            <AppText style={styles.reportProblemTitle}>Edit Password</AppText>
            <TextInput
              editable={!isLoading}
              maxLength={30}
              onChangeText={setPassword}
              placeholder="Set Password"
              value={password}
              style={styles.groupInfoInput}
            />
            <View style={styles.actionContainer}>
              <AppText style={styles.groupInfoLength}>
                {password.length}/30
              </AppText>
              <AppButton
                disabled={
                  password.replace(/\s/g, "").length >= 8 &&
                  isConnected &&
                  !isLoading
                    ? false
                    : true
                }
                onPress={onSubmit}
                style={[
                  styles.submitGroupInfoButton,
                  {
                    backgroundColor:
                      password.replace(/\s/g, "").length >= 1 &&
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
    height: "40@s",
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

export default memo(EditGroupPasswordModal);
