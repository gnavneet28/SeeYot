import React, { useState, useEffect, useCallback, useMemo } from "react";
import { View } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { ScaledSheet } from "react-native-size-matters";

import ApiProcessingContainer from "../components/ApiProcessingContainer";
import AppHeader from "../components/AppHeader";
import AppText from "../components/AppText";
import InfoAlert from "../components/InfoAlert";
import NotificationListPro from "../components/NotificationListPro";
import ReplyModal from "../components/ReplyModal";
import Screen from "../components/Screen";
import SeeThought from "../components/SeeThought";
import VipAdCard from "../components/VipAdCard";

import Constant from "../navigation/NavigationConstants";

import storeDetails from "../utilities/storeDetails";

import debounce from "../utilities/debounce";
import defaultProps from "../utilities/defaultProps";
import ApiContext from "../utilities/apiContext";
import apiActivity from "../utilities/apiActivity";

import defaultStyles from "../config/styles";

import useMountedRef from "../hooks/useMountedRef";
import useConnection from "../hooks/useConnection";

import myApi from "../api/my";

import useAuth from "../auth/useAuth";

function NotificationScreen({ navigation }) {
  const { user, setUser } = useAuth();
  const mounted = useMountedRef().current;
  const isConnected = useConnection();
  const isFocused = useIsFocused();
  const { tackleProblem } = apiActivity;

  // STATES
  const [clearNotification, setClearNotification] = useState(false);
  const [visible, setVisible] = useState(false);
  const [thought, setThought] = useState("");
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

  // INFO ALERT ACTION
  const handleCloseInfoAlert = useCallback(
    () => setInfoAlert({ ...infoAlert, showInfoAlert: false }),
    []
  );

  const updateNotifications = useCallback(async () => {
    const { ok, data, problem } = await myApi.setNotificationSeen();
    if (ok) {
      await storeDetails(data.user);
      setUser(data.user);
      return;
    }

    if (mounted) {
      tackleProblem(problem, data, setInfoAlert);
    }
  }, [user, mounted]);

  useEffect(() => {
    if (
      isFocused &&
      user.notifications.filter((n) => n.seen === false).length
    ) {
      updateNotifications();
    }
  }, [isFocused, user]);

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
    setClearNotification(true);

    const { ok, data, problem } = await myApi.deleteAllNotifications();
    if (ok) {
      await storeDetails(data.user);
      setUser(data.user);
      return setClearNotification(false);
    }
    setClearNotification(false);
    tackleProblem(problem, data, setInfoAlert);
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
    setRefreshing(true);

    const { ok, data, problem } = await myApi.setNotificationSeen();
    setRefreshing(false);
    if (ok) {
      await storeDetails(data.user);
      return setUser(data.user);
    }
    tackleProblem(problem, data, setInfoAlert);
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
        <VipAdCard onPress={handleVipCardPress} style={styles.adCard} />
        {data && data.length >= 1 ? (
          <ApiProcessingContainer
            style={styles.apiProcessingContainer}
            processing={clearNotification}
          >
            <AppText
              style={styles.clearAll}
              onPress={
                isConnected && !clearNotification
                  ? handleClearAllPress
                  : () => null
              }
            >
              Clear all notifications
            </AppText>
          </ApiProcessingContainer>
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
  apiProcessingContainer: {
    alignSelf: "flex-end",
    height: "30@s",
    padding: 0,
    width: "100%",
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
