import React, { memo, useCallback, useContext } from "react";
import { View, Modal } from "react-native";
import { ScaledSheet, scale } from "react-native-size-matters";

import defaultStyles from "../config/styles";

import InviteUserList from "./InviteUserList";
import Selection from "./Selection";

import useAuth from "../auth/useAuth";
import defaultProps from "../utilities/defaultProps";
import AppHeader from "./AppHeader";
import InvitedUsersContext from "../utilities/invitedUsersContext";

function InviteUsersModal({
  openInviteModal,
  setOpenInviteModal,
  group = defaultProps.defaultGroup,
  onChangeInvitePermission = () => {},
  changingInvitePermission = false,
}) {
  const { user } = useAuth();
  const { setInvitedUsers } = useContext(InvitedUsersContext);

  const handleCloseModal = useCallback(() => {
    setInvitedUsers([]);
    setOpenInviteModal(false);
  }, []);

  return (
    <Modal
      animationType="slide"
      onRequestClose={handleCloseModal}
      transparent={true}
      visible={openInviteModal}
    >
      <View style={styles.inviteModal}>
        <View style={styles.inviteModalMainContainer}>
          <AppHeader
            title="Invite Friends"
            leftIcon="arrow-back"
            onPressLeft={handleCloseModal}
          />
          {group.createdBy._id == user._id ? (
            <View style={styles.canInviteOptionContainer}>
              <Selection
                processing={changingInvitePermission}
                opted={group.canInvite}
                onPress={onChangeInvitePermission}
                value={"Allow active members to invite others."}
                containerStyle={styles.selectionCheckBoxStyle}
                iconSize={scale(12)}
                loadingIndicatorSize={scale(10)}
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
    borderColor: defaultStyles.colors.secondary,
    borderRadius: "8@s",
    borderWidth: 1,
    justifyContent: "center",
    marginTop: "5@s",
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
    flex: 1,
    overflow: "hidden",
    paddingBottom: "5@s",
    width: "100%",
  },
  inviteModal: {
    flex: 1,
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
  selectionCheckBoxStyle: {
    alignItems: "center",
    borderRadius: "5@s",
    height: "18@s",
    justifyContent: "center",
    width: "18@s",
  },
});

export default memo(InviteUsersModal);
