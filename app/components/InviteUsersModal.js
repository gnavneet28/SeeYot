import React, { memo } from "react";
import { View, Modal } from "react-native";
import { ScaledSheet, scale } from "react-native-size-matters";
import AntDesign from "../../node_modules/react-native-vector-icons/AntDesign";

import defaultStyles from "../config/styles";

import AppText from "./AppText";
import Backdrop from "./Backdrop";
import InviteUserList from "./InviteUserList";

import useAuth from "../auth/useAuth";

function InviteUsersModal({ openInviteModal, setOpenInviteModal, groupName }) {
  const { user } = useAuth();

  return (
    <Modal
      animationType="slide"
      onRequestClose={() => setOpenInviteModal(false)}
      transparent={true}
      visible={openInviteModal}
    >
      <View style={styles.inviteModal}>
        <Backdrop onPress={() => setOpenInviteModal(false)} />
        <View style={styles.closeMessageIconContainer}>
          <AntDesign
            onPress={() => setOpenInviteModal(false)}
            name="downcircle"
            color={defaultStyles.colors.secondary_Variant}
            size={scale(28)}
          />
        </View>
        <View style={styles.inviteModalMainContainer}>
          <AppText style={styles.inviteModalTitle}>Invite Friends</AppText>
          <InviteUserList users={user.contacts} groupName={groupName} />
        </View>
      </View>
    </Modal>
  );
}
const styles = ScaledSheet.create({
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
  inviteModalMainContainer: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.light,
    borderTopLeftRadius: "10@s",
    borderTopRightRadius: "10@s",
    bottom: 0,
    overflow: "hidden",
    paddingHorizontal: "10@s",
    paddingTop: "20@s",
    paddingBottom: "15@s",
    width: "100%",
    height: "300@s",
  },
  inviteModal: {
    flex: 1,
    justifyContent: "space-between",
    overflow: "hidden",
    width: "100%",
  },
  inviteModalTitle: {
    color: defaultStyles.colors.dark,
    marginBottom: "10@s",
    marginTop: "5@s",
    textAlign: "center",
    width: "100%",
  },
});

export default memo(InviteUsersModal);
