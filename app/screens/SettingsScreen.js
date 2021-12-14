import React, { useCallback, useState, useEffect } from "react";
import { View } from "react-native";
import { ScaledSheet, scale } from "react-native-size-matters";
import { useIsFocused } from "@react-navigation/native";

import Screen from "../components/Screen";
import AppHeader from "../components/AppHeader";
import AppText from "../components/AppText";
import AppButton from "../components/AppButton";
import SettingsAction from "../components/SettingsAction";
import ApiActivity from "../components/ApiActivity";
import apiFlow from "../utilities/ApiActivityStatus";
import Alert from "../components/Alert";
import InfoAlert from "../components/InfoAlert";

import usersApi from "../api/users";

import asyncStorage from "../utilities/cache";

import DataConstants from "../utilities/DataConstants";
import useMountedRef from "../hooks/useMountedRef";

import defaultStyles from "../config/styles";

import debounce from "../utilities/debounce";

function SettingsScreen({ navigation }) {
  const { apiActivityStatus, initialApiActivity } = apiFlow;

  const { user, setUser } = useAuth();
  const isFocused = useIsFocused();
  const mounted = useMountedRef().current;

  const [apiActivity, setApiActivity] = useState({
    message: "",
    processing: true,
    visible: false,
    success: false,
  });
  const [infoAlert, setInfoAlert] = useState({
    infoAlertMessage: "",
    showInfoAlert: false,
  });

  const [contactAlert, setContactAlert] = useState(false);
  const [accountAlert, setAccountAlert] = useState(false);

  // API ACTIVITY ACTIONS
  const handleApiActivityClose = useCallback(
    () => setApiActivity({ ...apiActivity, visible: false }),
    []
  );

  // INFO ALERT ACTION
  const handleCloseInfoAlert = useCallback(
    () => setInfoAlert({ ...infoAlert, showInfoAlert: false }),
    []
  );

  useEffect(() => {
    if (!isFocused && mounted && infoAlert.showInfoAlert === true) {
      setInfoAlert({
        infoAlertMessage: "",
        showInfoAlert: false,
      });
    }
  }, [isFocused, mounted]);

  useEffect(() => {
    if (!isFocused && mounted && apiActivity.visible === true) {
      setApiActivity({
        message: "",
        processing: true,
        visible: false,
        success: false,
      });
    }
  }, [isFocused, mounted]);

  useEffect(() => {
    if (!isFocused && mounted && contactAlert === true) {
      setContactAlert(false);
    }
  }, [isFocused, mounted]);

  const deletePhoneContacts = async () => {
    initialApiActivity(setApiActivity, "Removing contacts from server...");
    let modifiedUser = { ...user };

    const response = await usersApi.removeUserPhoneContacts();
    if (response.ok) {
      modifiedUser.echoMessage = response.data.echoMessage;
      await asyncStorage.store(
        DataConstants.PHONE_CONTACTS,
        response.data.phoneContacts
      );
      setUser(modifiedUser);
    }

    return apiActivityStatus(response, setApiActivity);
  };
  // HEADER ACTIONS
  const handleBack = useCallback(
    debounce(
      () => {
        navigation.goBack();
      },
      500,
      true
    ),
    []
  );

  const handleDeleteContacts = () => console.log("Contacts deleted!");

  const handleOpenContactsAlert = useCallback(() => {
    setContactAlert(true);
  }, []);

  return (
    <>
      <Screen style={styles.container}>
        <AppHeader
          leftIcon="arrow-back"
          onPressLeft={handleBack}
          title="Settings"
        />
        <SettingsAction
          title="Remove my Contacts from the server."
          info="We store your contacts available on your device to let you discover people who are on SeeYot, if you give access to your contacts. You can opt to remove your contacts from our server anytime you want. We recommend you disabling the contacts access from your device first before removing the contacts from the server."
          buttonTitle="Remove my Contacts"
          onPress={handleOpenContactsAlert}
        />
        <SettingsAction
          title="Delete my Account."
          info="If you want to delete your account, you can do it here. This action is irreversible and cannot be undone. You will lose every data that are stored against you like your matched thoughts, echoMessages etc."
          buttonTitle="Delete my Account"
          onPress={handleDeleteContacts}
        />
      </Screen>
      <ApiActivity
        message={apiActivity.message}
        onDoneButtonPress={handleApiActivityClose}
        onRequestClose={handleApiActivityClose}
        processing={apiActivity.processing}
        success={apiActivity.success}
        visible={apiActivity.visible}
      />
      <InfoAlert
        leftPress={handleCloseInfoAlert}
        description={infoAlert.infoAlertMessage}
        visible={infoAlert.showInfoAlert}
      />
      <Alert
        onRequestClose={() => setContactAlert(false)}
        description="Are you sure you want to remove your contacts from the server?"
        leftPress={() => setContactAlert(false)}
        leftOption="Cancel"
        rightOption="Ok"
        rightPress={deletePhoneContacts}
        setVisible={setContactAlert}
        title="Delete this Message"
        visible={contactAlert}
      />
    </>
  );
}
const styles = ScaledSheet.create({
  container: {
    alignItems: "center",
  },
});

export default SettingsScreen;
