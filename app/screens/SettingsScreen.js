import React, { useCallback, useState, useEffect, useContext } from "react";
import { ScaledSheet } from "react-native-size-matters";
import { useIsFocused } from "@react-navigation/native";

import Alert from "../components/Alert";
import AppHeader from "../components/AppHeader";
import InfoAlert from "../components/InfoAlert";
import Screen from "../components/Screen";
import SettingsAction from "../components/SettingsAction";

import SuccessMessageContext from "../utilities/successMessageContext";
import storeDetails from "../utilities/storeDetails";
import debounce from "../utilities/debounce";
import apiActivity from "../utilities/apiActivity";

import usersApi from "../api/users";

import useMountedRef from "../hooks/useMountedRef";
import useConnection from "../hooks/useConnection";
import ScreenSub from "../components/ScreenSub";

function SettingsScreen({ navigation }) {
  const { setUser } = useAuth();
  const isFocused = useIsFocused();
  const mounted = useMountedRef().current;
  const isConnected = useConnection();
  const { setSuccess } = useContext(SuccessMessageContext);
  const { tackleProblem, showSucessMessage, updateUserDate } = apiActivity;

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
    if (!isFocused && mounted && infoAlert.showInfoAlert === true) {
      setInfoAlert({
        infoAlertMessage: "",
        showInfoAlert: false,
      });
    }
  }, [isFocused, mounted]);

  useEffect(() => {
    if (!isFocused && mounted && contactAlert === true) {
      setContactAlert(false);
    }
  }, [isFocused, mounted]);

  const deletePhoneContacts = async () => {
    setContactAlert(false);
    setRemovingContact(true);

    const { ok, data, problem } = await usersApi.removeUserPhoneContacts();
    if (ok) {
      await storeDetails(data.user);
      setUser(data.user);
      setRemovingContact(false);
      return showSucessMessage(setSuccess, "Contacts deleted successfully.");
    }

    setRemovingContact(false);
    tackleProblem(problem, data, setInfoAlert);
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
            info="We store your contacts available on your device to let you discover people who are on SeeYot, if you give access to your contacts. You can opt to remove your contacts from our server anytime you want. We recommend you disabling the contacts access from your device first before removing the contacts from the server."
            buttonTitle="Remove my Contacts"
            onPress={handleOpenContactsAlert}
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
        rightPress={isConnected ? deletePhoneContacts : null}
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
