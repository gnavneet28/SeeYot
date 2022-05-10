import React, { memo } from "react";
import { View, Modal } from "react-native";
import { ScaledSheet, scale } from "react-native-size-matters";
import AntDesign from "../../node_modules/react-native-vector-icons/AntDesign";

import defaultStyles from "../config/styles";

import AppText from "./AppText";
import Backdrop from "./Backdrop";
import InviteUserList from "./InviteUserList";
import Selection from "./Selection";

import useAuth from "../auth/useAuth";
import defaultProps from "../utilities/defaultProps";

function InviteUsersModal({
  openInviteModal,
  setOpenInviteModal,
  group = defaultProps.defaultGroup,
  onChangeInvitePermission = () => {},
  changingInvitePermission = false,
}) {
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
          {group.createdBy._id == user._id ? (
            <View style={styles.canInviteOptionContainer}>
              <Selection
                processing={changingInvitePermission}
                opted={group.canInvite}
                onPress={onChangeInvitePermission}
                value={"Allow active members to invite others."}
              />
            </View>
          ) : null}

          <InviteUserList users={user.contacts} groupName={group.name} />
        </View>
      </View>
    </Modal>
  );
}
const styles = ScaledSheet.create({
  canInviteOptionContainer: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.white,
    borderRadius: "8@s",
    justifyContent: "center",
    width: "95%",
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
  inviteModalMainContainer: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.light,
    borderTopLeftRadius: "10@s",
    borderTopRightRadius: "10@s",
    bottom: 0,
    height: "350@s",
    overflow: "hidden",
    paddingBottom: "15@s",
    paddingHorizontal: "10@s",
    paddingTop: "20@s",
    width: "100%",
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
