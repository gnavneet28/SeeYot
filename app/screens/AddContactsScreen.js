import React, { useState, useEffect, useCallback } from "react";
import { Share, Linking } from "react-native";
import * as Contacts from "expo-contacts";
import * as SMS from "expo-sms";
import { ScaledSheet } from "react-native-size-matters";
import { useIsFocused } from "@react-navigation/native";

import AddContactList from "../components/AddContactList";
import AppActivityIndicator from "../components/ActivityIndicator";
import Alert from "../components/Alert";
import AppHeader from "../components/AppHeader";
import InfoAlert from "../components/InfoAlert";
import Screen from "../components/Screen";
import useMountedRef from "../hooks/useMountedRef";

import Constant from "../navigation/NavigationConstants";

import usersApi from "../api/users";
import useAuth from "../auth/useAuth";

import storeDetails from "../utilities/storeDetails";
import debounce from "../utilities/debounce";
import ApiContext from "../utilities/apiContext";
import apiActivity from "../utilities/apiActivity";
import authorizeUpdates from "../utilities/authorizeUpdates";
import createShortInviteLink from "../utilities/createDynamicLinks";

function AddContactsScreen({ navigation }) {
  const { user, setUser } = useAuth();
  const isFocused = useIsFocused();
  const mounted = useMountedRef().current;
  const { tackleProblem } = apiActivity;

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

  const [
    contactaAccessDeniedAlertVisibility,
    setContactsAccessDeniedAlertVisibility,
  ] = useState(false);

  const [refreshing, setRefreshing] = useState(false);
  const [apiProcessing, setApiProcessing] = useState(false);

  // Alert Action

  const handleContactsAccessDeniedAlertVisibility = useCallback(() => {
    setContactsAccessDeniedAlertVisibility(false);
  }, []);

  const openPermissionSettings = useCallback(async () => {
    const contactIsAccessible = await permission();

    if (contactIsAccessible == true) {
      return setContactsAccessDeniedAlertVisibility(false);
    }
    setContactsAccessDeniedAlertVisibility(false);
    await Linking.openSettings();
  }, []);

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
        if (!isReady || mounted) {
          setIsReady(true);
        }
      } else {
        if (!isReady || mounted) {
          setIsReady(true);
          return setContactsAccessDeniedAlertVisibility(true);
        }
      }
    } catch (error) {
      if (!isReady || mounted) {
        setIsReady(true);
        return setInfoAlert({
          infoAlertMessage: `${error}`,
          showInfoAlert: true,
        });
      }
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
      await storeDetails(data.user);
      setUser(data.user);
      if (!isReady || mounted) {
        return setUsers(
          data.user.phoneContacts.sort(
            (a, b) => a.isRegistered < b.isRegistered
          )
        );
      }
    }
    if (user.phoneContacts.length) {
      if (!isReady || mounted) {
        setUsers(
          user.phoneContacts.sort((a, b) => a.isRegistered < b.isRegistered)
        );
      }
    }
    if (!isReady || mounted) {
      tackleProblem(problem, data, setInfoAlert);
    }
  };

  const setUpPage = async () => {
    if (user.phoneContacts.length) {
      if (!isReady || mounted) {
        setUsers(
          user.phoneContacts.sort((a, b) => a.isRegistered < b.isRegistered)
        );
        setIsReady(true);
      }
    }
    // let canUpdate = await authorizeUpdates.authorizePhoneContactsUpdate();
    // if (!canUpdate) {
    //   return setIsReady(true);
    // }
    // await authorizeUpdates.updatePhoneContactsUpdate();
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
  const handleRefresh = useCallback(async () => {
    if (!isReady || mounted) {
      setRefreshing(true);
      // let canUpdate = await authorizeUpdates.authorizePhoneContactsUpdate();
      // if (!canUpdate) {
      //   setRefreshing(false);
      //   return setInfoAlert({
      //     infoAlertMessage:
      //       "You can update your contacts only once within 24 hours.",
      //     showInfoAlert: true,
      //   });
      // }
      // await authorizeUpdates.updatePhoneContactsUpdate();
      await requestPermission();
      return setRefreshing(false);
    }
  }, [isReady, mounted]);

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
    setInfoAlert({ infoAlertMessage: "", showInfoAlert: false });
  }, []);

  //INVITE ACTIONS
  const handleUserInvite = useCallback(
    debounce(
      async (userToInvite) => {
        let link = await createShortInviteLink();
        let number = userToInvite.phoneNumber.toString();
        const { result } = await SMS.sendSMSAsync(
          [number],
          `Let's connect in a more interesting way than ever before. ${link}`
        );

        if (result === "unknown") console.log("Unknown");
      },
      5000,
      true
    ),
    []
  );

  const handleInvitePress = useCallback(
    debounce(
      async () => {
        try {
          let link = await createShortInviteLink();
          const result = await Share.share({
            message: `Let's connect in a more interesting way than ever before. ${link}`,
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
      },
      5000,
      true
    ),
    []
  );

  return (
    <Screen style={styles.container}>
      <AppHeader
        leftIcon="arrow-back"
        onPressLeft={handleBack}
        onPressRight={handleRightPress}
        rightIcon="person-search"
        title="Add Contacts"
      />
      <Alert
        visible={contactaAccessDeniedAlertVisibility}
        title="Contacts Access Denied"
        description="Please give access to your contacts to find out your contacts on SeeYot."
        onRequestClose={handleContactsAccessDeniedAlertVisibility}
        leftOption="Cancel"
        rightOption="Ok"
        leftPress={handleContactsAccessDeniedAlertVisibility}
        rightPress={openPermissionSettings}
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
            isFocused={isFocused}
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
