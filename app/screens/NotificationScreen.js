import React, { useState, useEffect, useCallback, useMemo } from "react";
import { View } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { ScaledSheet } from "react-native-size-matters";

import ApiActivity from "../components/ApiActivity";
import AppActivityIndicator from "../components/ActivityIndicator";
import AppHeader from "../components/AppHeader";
import AppText from "../components/AppText";
import InfoAlert from "../components/InfoAlert";
import NotificationListPro from "../components/NotificationListPro";
import Screen from "../components/Screen";
import SeeThought from "../components/SeeThought";
import VipAdCard from "../components/VipAdCard";

import ReplyModal from "../components/ReplyModal";

import Constant from "../navigation/NavigationConstants";
import DataConstants from "../utilities/DataConstants";

import asyncStorage from "../utilities/cache";
import apiFlow from "../utilities/ApiActivityStatus";
import debounce from "../utilities/debounce";
import defaultProps from "../utilities/defaultProps";

import defaultStyles from "../config/styles";

import useMountedRef from "../hooks/useMountedRef";

import myApi from "../api/my";

import useAuth from "../auth/useAuth";
import ApiContext from "../utilities/apiContext";

function NotificationScreen({ navigation }) {
  const { user, setUser } = useAuth();
  const mounted = useMountedRef().current;
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
  const [apiProcessing, setApiProcessing] = useState(false);

  const [message, setMessage] = useState({
    isVisible: false,
    message: defaultProps.defaultMessage,
  });
  const [apiActivity, setApiActivity] = useState({
    message: "",
    processing: true,
    visible: false,
    success: false,
  });

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
    if (!isFocused && mounted && infoAlert.showInfoAlert === true) {
      setInfoAlert({
        infoAlertMessage: "",
        showInfoAlert: false,
      });
    }
  }, [isFocused, mounted]);

  useEffect(() => {
    if (!isFocused && mounted && message.isVisible === true) {
      setMessage({
        message: "",
        isVisible: false,
      });
    }
  }, [isFocused, mounted]);

  useEffect(() => {
    if (!isFocused && mounted && visible === true) {
      setVisible(false);
    }
  }, [isFocused, mounted]);

  // MODAL MESSAGE ACTION

  const handleCloseModal = useCallback(() => {
    setMessage({ message: defaultProps.defaultMessage, isVisible: false });
  }, []);

  const handleOpenModal = useCallback((notification) => {
    setMessage({ message: notification.data, isVisible: true });
  }, []);

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

  const handleSendMessage = (notification) => {
    return navigation.navigate(Constant.SEND_THOUGHT_SCREEN, {
      recipient: notification.data,
      from: Constant.NOTIFICATION_SCREEN,
    });
  };

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
    navigation.navigate(Constant.SUBSCRIPTION_NAVIGATOR_FROM_NOTIFICATION);
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
    <>
      <Screen style={styles.container}>
        <AppHeader
          leftIcon="arrow-back"
          onPressLeft={handleBack}
          title="Notifications"
        />
        <SeeThought
          visible={visible}
          setVisible={setVisible}
          message={thought}
        />
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
                Clear all notifications
              </AppText>
            ) : null}
            <ApiContext.Provider value={{ apiProcessing, setApiProcessing }}>
              <NotificationListPro
                onTapToSendMessage={handleSendMessage}
                onTapToSeeMessage={handleOpenModal}
                onTapToSeePress={handleTapToSeeThought}
                notifications={data}
                onRefresh={handleRefresh}
                refreshing={refreshing}
              />
            </ApiContext.Provider>
          </>
        )}
      </Screen>
      {message.isVisible ? <View style={styles.modalFallback} /> : null}
      <ReplyModal message={message} handleCloseModal={handleCloseModal} />
    </>
  );
}
const styles = ScaledSheet.create({
  adCard: {
    marginVertical: "5@s",
  },
  container: {
    alignItems: "center",
  },
  clearAll: {
    alignSelf: "flex-end",
    backgroundColor: defaultStyles.colors.yellow_Variant,
    borderBottomLeftRadius: "20@s",
    borderTopLeftRadius: "20@s",
    color: defaultStyles.colors.secondary,
    fontSize: "14@s",
    height: "30@s",
    paddingHorizontal: "10@s",
    textAlign: "right",
    textAlignVertical: "center",
  },
  modalFallback: {
    backgroundColor: "rgba(0,0,0,0.7)",
    height: "100%",
    position: "absolute",
    width: "100%",
    zIndex: 22,
  },
});

export default NotificationScreen;
