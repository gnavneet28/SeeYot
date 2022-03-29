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

import usersApi from "../api/users";
import useAuth from "../auth/useAuth";

import defaultStyles from "../config/styles";

import storeDetails from "../utilities/storeDetails";
import debounce from "../utilities/debounce";
import ApiContext from "../utilities/apiContext";
import apiActivity from "../utilities/apiActivity";
import authorizeUpdates from "../utilities/authorizeUpdates";
import createShortInviteLink from "../utilities/createDynamicLinks";
import ScreenSub from "../components/ScreenSub";
import useConnection from "../hooks/useConnection";
import NavigationConstants from "../navigation/NavigationConstants";

function AddContactsScreen({ navigation }) {
  const { user, setUser } = useAuth();
  const isFocused = useIsFocused();
  const mounted = useMountedRef().current;
  const { tackleProblem } = apiActivity;
  const isConnected = useConnection();

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
    setIsReady(false);
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
      await authorizeUpdates.updatePhoneContactsUpdate();
      await storeDetails(data.user);
      setUser(data.user);
      if (!isReady || mounted) {
        return setUsers(
          data.user.phoneContacts
            .sort((a, b) => a.name < b.name)
            .sort((a, b) => a.isRegistered < b.isRegistered)
        );
      }
    }
    if (!isReady || mounted) {
      tackleProblem(problem, data, setInfoAlert);
    }
  };

  const setUpPage = async () => {
    if (await permission()) {
      if (user.phoneContacts.length) {
        if (!isReady || mounted) {
          setUsers(
            user.phoneContacts
              .sort((a, b) => a.name < b.name)
              .sort((a, b) => a.isRegistered < b.isRegistered)
          );
        }
      } else if (!user.phoneContacts.length) {
        return requestPermission();
      }
      let canUpdate = await authorizeUpdates.authorizePhoneContactsUpdate();
      if (!canUpdate) {
        return setIsReady(true);
      }
    }
    return requestPermission();
  };

  useEffect(() => {
    if (isFocused) {
      setUpPage();
    }
  }, [isFocused]);

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
    if (mounted) {
      setRefreshing(true);
      await requestPermission();
      return setRefreshing(false);
    }
  }, [mounted]);

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

  const handleHeaderRightPress = () => {
    navigation.navigate(NavigationConstants.VIP_NAVIGATOR);
  };

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

        if (result === "unknown") return;
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
    <>
      <Screen style={styles.container}>
        <AppHeader
          leftIcon="arrow-back"
          onPressLeft={handleBack}
          title={`Add Contacts (${user.contacts.length})`}
          iconLeftCategory="MaterialIcons"
          iconRightCategory="MaterialCommunityIcons"
          rightIcon="crown-outline"
          onPressRight={handleHeaderRightPress}
          //rightOptionContainerStyle={styles.headerRightOptionStyle}
          // rightIconColor={defaultStyles.colors.secondary}
        />
        <ScreenSub>
          {!isReady ? (
            <AppActivityIndicator info="Syncing contacts. Please wait..." />
          ) : (
            <ApiContext.Provider value={{ apiProcessing, setApiProcessing }}>
              <AddContactList
                isConnected={isConnected}
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
        </ScreenSub>
      </Screen>
      <Alert
        visible={contactaAccessDeniedAlertVisibility}
        title="Contacts Access Denied"
        description="Please give access to your contacts to find them on SeeYot."
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
    </>
  );
}
const styles = ScaledSheet.create({
  container: {
    alignItems: "center",
  },
  headerRightOptionStyle: {
    backgroundColor: defaultStyles.colors.yellow_Variant,
    width: "35@s",
    height: "35@s",
    borderRadius: "18@s",
  },
});

export default AddContactsScreen;
