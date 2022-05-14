import React, { useContext, useCallback, useState } from "react";
import { View } from "react-native";
import { ScaledSheet } from "react-native-size-matters";

import AppButton from "./AppButton";
import AppImage from "./AppImage";
import AppText from "./AppText";
import ApiProcessingContainer from "./ApiProcessingContainer";
import InvitedUsersContext from "../utilities/invitedUsersContext";
import InfoAlert from "./InfoAlert";

import groupsApi from "../api/groups";
import apiActivity from "../utilities/apiActivity";
import InvitedUserContext from "../utilities/invitedUserContext";

import defaultStyles from "../config/styles";

function InviteUserCard({ contact, style, groupName }) {
  const { tackleProblem } = apiActivity;

  const { invitedUsers, setInvitedUsers } = useContext(InvitedUsersContext);
  const { invitedUser, setInvitedUser } = useContext(InvitedUserContext);
  const [infoAlert, setInfoAlert] = useState({
    infoAlertMessage: "",
    showInfoAlert: false,
  });

  // INFO ALERT ACTION
  const handleCloseInfoAlert = useCallback(
    () => setInfoAlert({ ...infoAlert, showInfoAlert: false }),
    []
  );

  let invited = invitedUsers.filter((u) => u._id == contact._id).length;

  const handleOnInvitePress = useCallback(async () => {
    setInvitedUser(contact._id);
    const { ok, data, problem } = await groupsApi.inviteUser(
      contact._id,
      groupName
    );
    if (ok) {
      setInvitedUser("");
      let newList = [...invitedUsers, contact];
      return setInvitedUsers(newList);
    }
    setInvitedUser("");
    tackleProblem(problem, data, setInfoAlert);
  }, [invitedUsers, invitedUser, contact]);

  if (!contact.name)
    return (
      <View style={styles.emptyData}>
        <AppText style={styles.emptyDataInfo}>No friends to invite.</AppText>
      </View>
    );

  return (
    <>
      <View style={[styles.container, style]}>
        <AppImage
          activeOpacity={1}
          imageUrl={contact.picture}
          style={styles.image}
          subStyle={styles.imageSub}
        />
        <View style={styles.infoContainer}>
          <AppText numberOfLines={1} style={[styles.infoNameText]}>
            {contact.name}
          </AppText>
        </View>

        <View style={styles.buttonContainer}>
          <ApiProcessingContainer processing={invitedUser === contact._id}>
            <AppButton
              title={invited ? "Invited" : "Invite"}
              disabled={invitedUser === contact._id || invited ? true : false}
              style={[
                styles.inviteButton,
                {
                  backgroundColor: invited
                    ? defaultStyles.colors.green
                    : defaultStyles.colors.secondary,
                },
              ]}
              subStyle={styles.inviteButtonSub}
              onPress={handleOnInvitePress}
            />
          </ApiProcessingContainer>
        </View>
      </View>
      <InfoAlert
        leftPress={handleCloseInfoAlert}
        description={infoAlert.infoAlertMessage}
        visible={infoAlert.showInfoAlert}
      />
    </>
  );
}
const styles = ScaledSheet.create({
  buttonContainer: {
    alignItems: "center",
    borderColor: defaultStyles.colors.light,
    borderRadius: "8@s",
    borderWidth: 1,
    height: "28@s",
    justifyContent: "center",
    marginRight: "4@s",
    overflow: "hidden",
    width: "55@s",
  },
  inviteButton: {
    backgroundColor: defaultStyles.colors.secondary,
    borderRadius: "8@s",
    height: "28@s",
    width: "55@s",
  },
  inviteButtonSub: {
    fontSize: "12.5@s",
    letterSpacing: 0.2,
  },
  container: {
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: "rgba(255,255,255,0.8)",
    borderColor: defaultStyles.colors.light,
    borderRadius: "10@s",
    flexDirection: "row",
    height: "40@s",
    marginVertical: "3@s",
    padding: "2@s",
    paddingHorizontal: "5@s",
    width: "95%",
  },
  emptyData: {
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: "rgba(255,255,255,0.8)",
    borderRadius: "5@s",
    height: "40@s",
    justifyContent: "center",
    width: "95%",
  },
  emptyDataInfo: {
    color: defaultStyles.colors.dark,
    textAlign: "center",
    textAlignVertical: "center",
  },
  image: {
    borderRadius: "15@s",
    elevation: 1,
    height: "30@s",
    marginHorizontal: "5@s",
    width: "30@s",
  },
  imageSub: {
    borderRadius: "15@s",
    height: "30@s",
    width: "30@s",
  },
  infoContainer: {
    flex: 1,
  },
  infoNameText: {
    color: defaultStyles.colors.primary,
    fontSize: "13@s",
    opacity: 0.9,
    paddingBottom: 0,
  },
});

export default InviteUserCard;
