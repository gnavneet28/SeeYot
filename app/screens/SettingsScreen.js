import React, { useCallback, useState, useEffect, useRef } from "react";
import { ScaledSheet } from "react-native-size-matters";
import { useIsFocused } from "@react-navigation/native";
import { Linking } from "react-native";
import { showMessage } from "react-native-flash-message";

import Alert from "../components/Alert";
import AppHeader from "../components/AppHeader";
import InfoAlert from "../components/InfoAlert";
import Screen from "../components/Screen";
import SettingsAction from "../components/SettingsAction";
import ScreenSub from "../components/ScreenSub";
import AppText from "../components/AppText";

import storeDetails from "../utilities/storeDetails";
import debounce from "../utilities/debounce";
import apiActivity from "../utilities/apiActivity";

import usersApi from "../api/users";

import defaultStyles from "../config/styles";
import defaultProps from "../utilities/defaultProps";

function SettingsScreen({ navigation }) {
  const { setUser } = useAuth();
  const isFocused = useIsFocused();
  let canShowOnSettingsScreen = useRef(true);
  let isUnmounting = false;
  const { tackleProblem } = apiActivity;

  const [infoAlert, setInfoAlert] = useState({
    infoAlertMessage: "",
    showInfoAlert: false,
  });

  const [contactAlert, setContactAlert] = useState(false);
  const [removingContact, setRemovingContact] = useState(false);
  // const [accountAlert, setAccountAlert] = useState(false);

  // INFO ALERT ACTION
  const handleCloseInfoAlert = useCallback(
    () => setInfoAlert({ ...infoAlert, showInfoAlert: false }),
    []
  );

  useEffect(() => {
    return () => (isUnmounting = true);
  }, []);

  useEffect(() => {
    if (isFocused && !isUnmounting && !canShowOnSettingsScreen.current) {
      canShowOnSettingsScreen.current = true;
    } else if (!isFocused && !isUnmounting) {
      canShowOnSettingsScreen.current = false;
    }
  }, [isFocused]);

  useEffect(() => {
    if (!isFocused && !isUnmounting && infoAlert.showInfoAlert === true) {
      setInfoAlert({
        infoAlertMessage: "",
        showInfoAlert: false,
      });
    }
  }, [isFocused]);

  useEffect(() => {
    if (!isFocused && !isUnmounting && contactAlert === true) {
      setContactAlert(false);
    }
  }, [isFocused]);

  const deletePhoneContacts = async () => {
    setContactAlert(false);
    setRemovingContact(true);

    const { ok, data, problem } = await usersApi.removeUserPhoneContacts();
    if (ok && !isUnmounting) {
      await storeDetails(data.user);
      setUser(data.user);
      setRemovingContact(false);
      return showMessage({
        ...defaultProps.alertMessageConfig,
        type: "success",
        message: "Contacts deleted successfully.",
      });
    }

    setRemovingContact(false);
    if (!isUnmounting && canShowOnSettingsScreen.current) {
      tackleProblem(problem, data, setInfoAlert);
    }
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

  const handleOpenContactsAlert = useCallback(() => {
    setContactAlert(true);
  }, []);

  const handleChangePermission = async () => await Linking.openSettings();

  return (
    <>
      <Screen style={styles.container}>
        <AppHeader
          leftIcon="arrow-back"
          onPressLeft={handleBack}
          title="Settings"
        />
        <ScreenSub style={{ alignItems: "center" }}>
          <SettingsAction
            processing={removingContact}
            title="Remove my Contacts from the server."
            info="We store your contacts available on your device to let you discover people who are on SeeYot, after you give access to your contacts. You can opt to remove your contacts from our server anytime you want. We recommend you disabling the contacts access from your device first before removing the contacts from the server."
            buttonTitle="Remove my Contacts"
            onPress={handleOpenContactsAlert}
            AdditionalActionComponent={() => (
              <AppText
                onPress={handleChangePermission}
                style={styles.permissionChange}
              >
                Change permission from here.
              </AppText>
            )}
          />
          {/* <SettingsAction
          title="Delete my Account."
          info="If you want to delete your account, you can do it here. This action is irreversible and cannot be undone. You will lose every data that are stored against you like your matched thoughts, echoMessages etc."
          buttonTitle="Delete my Account"
          onPress={handleDeleteContacts}
        /> */}
        </ScreenSub>
      </Screen>
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
  permissionChange: {
    color: defaultStyles.colors.blue,
    marginBottom: "10@s",
    textAlign: "left",
    width: "90%",
  },
});

export default SettingsScreen;
