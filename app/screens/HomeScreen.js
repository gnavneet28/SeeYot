import React, { useState, useCallback, useMemo } from "react";
import { StyleSheet } from "react-native";

import ApiActivity from "../components/ApiActivity";
import ContactList from "../components/ConatctList";
import HomeAppHeader from "../components/HomeAppHeader";
import InfoAlert from "../components/InfoAlert";
import Screen from "../components/Screen";

import useAuth from "../auth/useAuth";

import usersApi from "../api/users";

import storeDetails from "../utilities/storeDetails";

function HomeScreen({ navigation }) {
  const { user, setUser } = useAuth();

  const [state, setState] = useState({
    showInfoAlert: false,
    infoAlertMessage: "",
  });
  const [apiActivity, setApiActivity] = useState({
    message: "",
    processing: true,
    visible: false,
    success: false,
  });

  // APIACTIVITY ACTIONS
  const handleApiActivityClose = useCallback(
    () => setApiActivity({ ...apiActivity, visible: false }),
    []
  );

  // HEADER ACTIONS
  const handleRightPress = useCallback(() => {
    if (
      typeof user.picture !== "undefined" &&
      typeof user.echoWhen !== "undefined" &&
      typeof user.name !== "undefined" &&
      typeof user.phoneNumber !== "undefined"
    ) {
      return navigation.navigate("ProfileScreen");
    }

    setState({
      infoAlertMessage: "Something went wrong! Please try again.",
      showInfoAlert: true,
    });
  }, []);

  // EMPTY FRIENDLIST
  const handleAddFriendPress = useCallback(
    () => navigation.navigate("AddContact"),
    []
  );

  // INFO ALERT ACTIONS
  const handleCloseInfoAlert = useCallback(
    () => setState({ ...state, showInfoAlert: false }),
    []
  );

  // REFRESH ACTION
  const handleRefresh = useCallback(async () => {
    setApiActivity({
      processing: true,
      message: "Refreshing...",
      visible: true,
      success: false,
    });

    const { data, ok } = await usersApi.getCurrentUser();
    if (ok) {
      await storeDetails(data);
      setUser(data);
      return setApiActivity({
        processing: true,
        visible: false,
        message: "",
        success: true,
      });
    }
    setApiActivity({
      message: "Something failed! Please try again.",
      success: false,
      processing: false,
      visible: true,
    });
  }, []);

  // CONTACT CARD OPTIONS
  const handleOnSendThoughtButtonPress = useCallback(
    (user) => {
      if (user) {
        return navigation.navigate("SendThought", {
          recipient: user,
          from: "HomeScreen",
        });
      }
      setState({
        ...state,
        infoAlertMessage: "Something went wrong! Please try again.",
        showInfoAlert: true,
      });
    },
    [state.infoAlertMessage, state.showInfoAlert]
  );

  const handleAddEchoButtonPress = useCallback(
    (user) => {
      if (user) {
        return navigation.navigate("AddEcho", {
          recipient: user,
          from: "HomeScreen",
        });
      }
      setState({
        ...state,
        infoAlertMessage: "Something went wrong! Please try again.",
        showInfoAlert: true,
      });
    },
    [state.infoAlertMessage, state.showInfoAlert]
  );

  const data = useMemo(
    () =>
      typeof user.contacts !== "undefined"
        ? user.contacts.sort((a, b) => a.name > b.name)
        : [],
    [user.contacts.length, user.contacts]
  );

  return (
    <Screen style={styles.container}>
      <HomeAppHeader
        onPressRight={handleRightPress}
        rightImageUrl={typeof user.picture !== "undefined" ? user.picture : ""}
      />
      <ApiActivity
        message={apiActivity.message}
        onDoneButtonPress={handleApiActivityClose}
        processing={apiActivity.processing}
        success={apiActivity.success}
        visible={apiActivity.visible}
      />
      <InfoAlert
        description={state.infoAlertMessage}
        leftPress={handleCloseInfoAlert}
        visible={state.showInfoAlert}
      />
      <ContactList
        onAddEchoPress={handleAddEchoButtonPress}
        onAddFriendPress={handleAddFriendPress}
        onRefresh={handleRefresh}
        onSendThoughtsPress={handleOnSendThoughtButtonPress}
        refreshing={false}
        style={styles.contactList}
        users={data}
      />
    </Screen>
  );
}
const styles = StyleSheet.create({
  contactList: {
    marginTop: 2,
  },
  container: {
    alignItems: "center",
  },
});

export default HomeScreen;
