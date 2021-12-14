import React, { useState, useEffect, useCallback } from "react";
import { Share, Linking } from "react-native";
import * as Contacts from "expo-contacts";
import * as SMS from "expo-sms";
import { ScaledSheet } from "react-native-size-matters";
import { useIsFocused } from "@react-navigation/native";

import AddContactList from "../components/AddContactList";
import AppActivityIndicator from "../components/ActivityIndicator";
import AppHeader from "../components/AppHeader";
import InfoAlert from "../components/InfoAlert";
import Screen from "../components/Screen";
import useMountedRef from "../hooks/useMountedRef";

import Constant from "../navigation/NavigationConstants";
import DataConstants from "../utilities/DataConstants";

import usersApi from "../api/users";
import useAuth from "../auth/useAuth";

import asyncStorage from "../utilities/cache";
import debounce from "../utilities/debounce";
import ApiContext from "../utilities/apiContext";

function AddContactsScreen({ navigation }) {
  const { user } = useAuth();
  const isFocused = useIsFocused();
  const mounted = useMountedRef().current;

  const permission = async () => {
    const { granted } = await Contacts.getPermissionsAsync();
    return granted;
  };

  // STATES
  const [isReady, setIsReady] = useState(false);
  const [users, setUsers] = useState([]);
  const [infoAlert, setInfoAlert] = useState({
    infoAlertMessage: "",
    showInfoAlert: false,
  });

  const [refreshing, setRefreshing] = useState(false);
  const [apiProcessing, setApiProcessing] = useState(false);

  // ON PAGE FOCUS ACTION
  const requestPermission = async () => {
    try {
      const { status } = await Contacts.requestPermissionsAsync();
      let contacts = [];
      if (status === "granted") {
        const { data } = await Contacts.getContactsAsync();
        if (data.length > 0) {
          data.forEach((c) => {
            let contact = {
              id: c.id,
              name: c.name,
              phoneNumber: c.phoneNumbers
                ? c.phoneNumbers[0].number
                : 1212121212,
            };

            if (contact.phoneNumber.length >= 10) {
              contacts.push(contact);
            }
          });
        }
        await syncContacts(contacts);
        setIsReady(true);
      } else {
        setIsReady(true);
        return setInfoAlert({
          infoAlertMessage:
            "Please allow contacts access to add them as friends!",
          showInfoAlert: true,
        });
      }
    } catch (error) {
      setIsReady(true);
      return setInfoAlert({
        infoAlertMessage: error.message,
        showInfoAlert: true,
      });
    }
  };

  const syncContacts = async (users) => {
    let newListToSync = [];

    for (let contact of users) {
      let modifiedContact = {
        name: contact.name,
        phoneNumber: parseInt(
          "91" + contact.phoneNumber.toString().replace(/[^\d]/g, "").slice(-10)
        ),
      };

      newListToSync.push(modifiedContact);
    }

    const { ok, data, problem } = await usersApi.syncContacts(newListToSync);
    if (ok) {
      await asyncStorage.store(DataConstants.PHONE_CONTACTS, data);
      return setUsers(data.sort((a, b) => a.isRegistered < b.isRegistered));
    }

    if (user.phoneContacts) {
      setUsers(
        user.phoneContacts.sort((a, b) => a.isRegistered < b.isRegistered)
      );
    }

    if (data) {
      return setInfoAlert({
        infoAlertMessage: "Something went wrong! Please try again.",
        showInfoAlert: true,
      });
    }

    setInfoAlert({
      infoAlertMessage: "Something went wrong! Please try again.",
      showInfoAlert: true,
    });
  };

  const setUpPage = () => {
    if (user.phoneContacts.length) {
      setUsers(
        user.phoneContacts.sort((a, b) => a.isRegistered < b.isRegistered)
      );
      setIsReady(true);
    }
    return requestPermission();
  };

  useEffect(() => {
    setUpPage();
  }, []);

  useEffect(() => {
    if (!isFocused && mounted && infoAlert.showInfoAlert === true) {
      setInfoAlert({
        infoAlertMessage: "",
        showInfoAlert: false,
      });
    }
  }, [isFocused, mounted]);

  // REFRESH ACTION
  const handleRefresh = useCallback(() => {
    requestPermission();
  }, []);

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

  const handleRightPress = useCallback(() => {
    navigation.navigate(Constant.VIP_NAVIGATOR);
  }, []);

  // INFO ALERT ACTIONS
  const handleCloseInfoAlert = useCallback(async () => {
    const contactIsAccessible = await permission();

    if (contactIsAccessible == true) {
      return setInfoAlert({ showInfoAlert: false });
    }
    setInfoAlert({ showInfoAlert: false });
    await Linking.openSettings();
  }, []);

  //INVITE ACTIONS
  const handleUserInvite = useCallback(async (userToInvite) => {
    let number = userToInvite.phoneNumber.toString();
    const { result } = await SMS.sendSMSAsync(
      [number],
      "Hi there please join this platform"
    );

    console.log(result);
  }, []);

  const handleInvitePress = useCallback(async () => {
    try {
      const result = await Share.share({
        message:
          "Join this awesome place and not hold anything back. Just say it",
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  }, []);

  return (
    <Screen style={styles.container}>
      <AppHeader
        leftIcon="arrow-back"
        onPressLeft={handleBack}
        onPressRight={handleRightPress}
        rightIcon="person-search"
        title="Add Contacts"
      />
      <InfoAlert
        leftPress={handleCloseInfoAlert}
        description={infoAlert.infoAlertMessage}
        visible={infoAlert.showInfoAlert}
      />
      {!isReady ? (
        <AppActivityIndicator />
      ) : (
        <ApiContext.Provider value={{ apiProcessing, setApiProcessing }}>
          <AddContactList
            onRefresh={handleRefresh}
            refreshing={refreshing}
            onInvitePress={
              SMS.isAvailableAsync() ? handleUserInvite : handleInvitePress
            }
            users={users}
          />
        </ApiContext.Provider>
      )}
    </Screen>
  );
}
const styles = ScaledSheet.create({
  container: {
    alignItems: "center",
  },
});

export default AddContactsScreen;
