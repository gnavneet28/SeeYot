import React, { useState, useEffect, useCallback, useMemo } from "react";
import { StyleSheet } from "react-native";
import { useIsFocused } from "@react-navigation/native";

import ApiActivity from "../components/ApiActivity";
import AppActivityIndicator from "../components/ActivityIndicator";
import AppHeader from "../components/AppHeader";
import AppText from "../components/AppText";
import InfoAlert from "../components/InfoAlert";
import NotificationList from "../components/NotificationList";
import Screen from "../components/Screen";
import SeeThought from "../components/SeeThought";
import VipAdCard from "../components/VipAdCard";

import Constant from "../navigation/NavigationConstants";
import DataConstants from "../utilities/DataConstants";

import asyncStorage from "../utilities/cache";
import apiFlow from "../utilities/ApiActivityStatus";
import debounce from "../utilities/debounce";

import defaultStyles from "../config/styles";

import myApi from "../api/my";

import useAuth from "../auth/useAuth";

function NotificationScreen({ navigation }) {
  console.log("Notification screen rendered");
  const { user, setUser } = useAuth();
  const isFocused = useIsFocused();
  const { apiActivityStatus, initialApiActivity } = apiFlow;

  // STATES
  const [visible, setVisible] = useState(false);
  const [thought, setThought] = useState("");
  const [isReady, setIsReady] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [infoAlert, setInfoAlert] = useState({
    infoAlertMessage: "",
    showInfoAlert: false,
  });
  const [apiActivity, setApiActivity] = useState({
    message: "",
    processing: true,
    visible: false,
    success: false,
  });

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

  const updateNotifications = useCallback(async () => {
    const { ok, data, problem } = await myApi.setNotificationSeen();
    if (ok) {
      let modifiedUser = { ...user };
      modifiedUser.notifications = data;
      setUser(modifiedUser);
      await asyncStorage.store(DataConstants.NOTIFICATIONS, data);
      return setIsReady(true);
    }
    setIsReady(true);
    return setInfoAlert({
      infoAlertMessage: "Something went wrong! Please try again.",
      showInfoAlert: true,
    });
  }, [user]);

  useEffect(() => {
    if (isFocused) {
      updateNotifications();
    }
  }, [isFocused]);

  // HEADER ACTION
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

  // NOTIFICATION ACTION
  const handleClearAllPress = useCallback(async () => {
    initialApiActivity(setApiActivity, `Deleting all notifications...`);

    let modifiedUser = { ...user };
    const response = await myApi.deleteAllNotifications();
    if (response.ok) {
      await asyncStorage.store(
        DataConstants.NOTIFICATIONS,
        response.data.notifications
      );
      modifiedUser.notifications = response.data.notifications;
      setUser(modifiedUser);
    }
    apiActivityStatus(response, setApiActivity);
  }, []);

  const handleDelete = useCallback(
    async (item) => {
      initialApiActivity(setApiActivity, "Deleting notification...");
      let modifiedUser = { ...user };

      const response = await myApi.deleteNotification(item._id);

      if (response.ok) {
        modifiedUser.notifications = response.data.notifications;
        setUser(modifiedUser);
        await asyncStorage.store(
          DataConstants.NOTIFICATIONS,
          response.data.notifications
        );
      }
      return apiActivityStatus(response, setApiActivity);
    },
    [user.notifications, user]
  );

  const handleTapToSeeThought = useCallback((thought) => {
    setThought(thought.message);
    setVisible(true);
  }, []);

  const handleRefresh = useCallback(async () => {
    setRefreshing(false);
    let modifiedUser = { ...user };

    const { ok, data, problem } = await myApi.setNotificationSeen();
    if (ok) {
      if (modifiedUser.notifications.length == data.length) return;
      modifiedUser.notifications = data;
      setUser(modifiedUser);
      return await asyncStorage.store(DataConstants.NOTIFICATIONS, data);
    }
    if (problem) return;
  }, [user]);

  // VIP CARD ACTION
  const handleVipCardPress = useCallback(() => {
    navigation.navigate(Constant.PROFILE_NAVIGATOR, {
      screen: Constant.SUBSCRIPTION_NAVIGATOR,
    });
  }, []);

  // NOTIFICATION DATA
  const data = useMemo(
    () =>
      typeof user.notifications !== "undefined"
        ? user.notifications.sort((a, b) => a.createdAt < b.createdAt)
        : [],
    [user.notifications]
  );

  return (
    <Screen style={styles.container}>
      <AppHeader
        leftIcon="arrow-back"
        onPressLeft={handleBack}
        title="Notifications"
      />
      <SeeThought visible={visible} setVisible={setVisible} message={thought} />
      <InfoAlert
        leftPress={handleCloseInfoAlert}
        description={infoAlert.infoAlertMessage}
        visible={infoAlert.showInfoAlert}
      />
      <ApiActivity
        message={apiActivity.message}
        onDoneButtonPress={handleApiActivityClose}
        onRequestClose={handleApiActivityClose}
        processing={apiActivity.processing}
        success={apiActivity.success}
        visible={apiActivity.visible}
      />

      {!isReady ? (
        <AppActivityIndicator />
      ) : (
        <>
          <VipAdCard onPress={handleVipCardPress} style={styles.adCard} />
          {data && data.length >= 1 ? (
            <AppText style={styles.clearAll} onPress={handleClearAllPress}>
              Clear all notifications.
            </AppText>
          ) : null}
          <NotificationList
            onTapToSeePress={handleTapToSeeThought}
            onDeleteIconPress={handleDelete}
            notifications={data}
            onRefresh={handleRefresh}
            refreshing={refreshing}
          />
        </>
      )}
    </Screen>
  );
}
const styles = StyleSheet.create({
  adCard: {
    marginVertical: 5,
  },
  container: {
    alignItems: "center",
  },
  clearAll: {
    alignSelf: "flex-end",
    color: defaultStyles.colors.blue,
    fontSize: 18,
    paddingHorizontal: 10,
    textAlign: "right",
  },
});

export default NotificationScreen;
