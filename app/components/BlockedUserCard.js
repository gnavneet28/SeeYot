import React, { useState, useEffect, useContext, useCallback } from "react";
import { View } from "react-native";
import { ScaledSheet } from "react-native-size-matters";

import ApiProcessingContainer from "./ApiProcessingContainer";
import AppButton from "./AppButton";
import AppImage from "./AppImage";
import AppText from "./AppText";
import InfoAlert from "./InfoAlert";

import useAuth from "../auth/useAuth";

import defaultStyles from "../config/styles";

import defaultProps from "../utilities/defaultProps";
import ApiContext from "../utilities/apiContext";
import debounce from "../utilities/debounce";
import storeDetails from "../utilities/storeDetails";
import apiActivity from "../utilities/apiActivity";

import useConnection from "../hooks/useConnection";

import usersApi from "../api/users";

function AddContactCard({
  style,
  blockedUser = defaultProps.defaultBlockedUser,
}) {
  const { user, setUser } = useAuth();
  const { apiProcessing, setApiProcessing } = useContext(ApiContext);
  const isConnected = useConnection();
  const [processing, setProcessing] = useState(false);
  const [infoAlert, setInfoAlert] = useState({
    infoAlertMessage: "",
    showInfoAlert: false,
  });
  const { tackleProblem } = apiActivity;

  const blockedUsers = user.blocked;

  useEffect(() => {
    setProcessing(false);

    return () => setProcessing(false);
  }, [blockedUser._id]);

  // INFO ALERT ACTIONS
  const handleCloseInfoAlert = useCallback(async () => {
    setInfoAlert({ showInfoAlert: false });
  }, []);

  const handleUnBlockPress = useCallback(
    debounce(
      async () => {
        setApiProcessing(true);
        setProcessing(true);

        const { ok, data, problem } = await usersApi.unBlockContact(
          blockedUser._id
        );

        if (ok) {
          setProcessing(false);
          await storeDetails(data.user);
          setUser(data.user);
          return setApiProcessing(false);
        }

        setProcessing(false);
        setApiProcessing(false);
        tackleProblem(problem, data, setInfoAlert);
      },
      5000,
      true
    ),
    [blockedUser._id, user]
  );

  const isBlocked = blockedUsers.filter((b) => b._id == blockedUser._id)[0];

  return (
    <View style={[styles.container, style]}>
      <AppImage
        activeOpacity={1}
        imageUrl={blockedUser.picture}
        style={styles.image}
        subStyle={styles.imageSub}
      />
      <View style={styles.infoContainer}>
        <AppText numberOfLines={1} style={styles.infoNameText}>
          {blockedUser.name}
        </AppText>
      </View>
      <ApiProcessingContainer
        style={styles.apiProcessingContainer}
        processing={processing}
      >
        <AppButton
          disabled={isBlocked && isConnected && !apiProcessing ? false : true}
          onPress={handleUnBlockPress}
          style={styles.blockedButton}
          subStyle={styles.blockButtonSub}
          title={isBlocked ? "Unblock" : "Unblocked"}
        />
      </ApiProcessingContainer>
      <InfoAlert
        leftPress={handleCloseInfoAlert}
        description={infoAlert.infoAlertMessage}
        visible={infoAlert.showInfoAlert}
      />
    </View>
  );
}
const styles = ScaledSheet.create({
  apiProcessingContainer: {
    borderColor: defaultStyles.colors.light,
    borderRadius: "10@s",
    borderWidth: 1,
    height: "32@s",
    width: "65@s",
  },
  blockedButton: {
    backgroundColor: defaultStyles.colors.light,
    borderRadius: "10@s",
    height: "32@s",
    width: "65@s",
  },
  blockButtonSub: {
    color: defaultStyles.colors.dark,
    fontSize: "14@s",
    letterSpacing: 0.2,
  },
  container: {
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: defaultStyles.colors.white,
    borderColor: defaultStyles.colors.light,
    borderRadius: "10@s",
    flexDirection: "row",
    height: "50@s",
    marginVertical: "3@s",
    padding: "2@s",
    paddingHorizontal: "5@s",
    width: "95%",
  },
  image: {
    backgroundColor: defaultStyles.colors.white,
    borderRadius: "19@s",
    height: "38@s",
    marginRight: "5@s",
    width: "38@s",
  },
  imageSub: {
    borderWidth: 0,
    height: "38@s",
    width: "38@s",
  },
  infoContainer: {
    flex: 1,
  },
  infoNameText: {
    color: defaultStyles.colors.primary,
    fontSize: "15@s",
    paddingBottom: 0,
  },
  infoNumberText: {
    color: defaultStyles.colors.secondary,
    fontSize: "10@s",
    paddingTop: 0,
  },
});

export default AddContactCard;
