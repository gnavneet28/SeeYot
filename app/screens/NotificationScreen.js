import React, { useState, useEffect, useCallback, useMemo } from "react";
import { View } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { ScaledSheet } from "react-native-size-matters";

import AppHeader from "../components/AppHeader";
import AppModal from "../components/AppModal";
import Option from "../components/Option";
import ApiOption from "../components/ApiOption";
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
import authorizeUpdates from "../utilities/authorizeUpdates";

import defaultStyles from "../config/styles";

import useMountedRef from "../hooks/useMountedRef";
import useConnection from "../hooks/useConnection";

import myApi from "../api/my";

import useAuth from "../auth/useAuth";
import ScreenSub from "../components/ScreenSub";

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
  const [showClearAllModal, setShowClearAllModal] = useState(false);

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

  useEffect(() => {
    if (!isFocused && mounted && showClearAllModal === true) {
      setShowClearAllModal(false);
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
  }, [isFocused, user.notifications.length]);

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

  const handleRightHeaderPress = useCallback(() => {
    setShowClearAllModal(true);
  }, []);

  const handleCloseClearAllModal = useCallback(() => {
    setShowClearAllModal(false);
  }, []);

  // NOTIFICATION ACTION
  const handleClearAllPress = useCallback(async () => {
    if (!user.notifications.length) return setShowClearAllModal(false);
    setClearNotification(true);

    const { ok, data, problem } = await myApi.deleteAllNotifications();
    if (ok) {
      setUser(data.user);
      await storeDetails(data.user);
      setShowClearAllModal(false);
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
    setThought(thought.data.message);
    setVisible(true);
  }, []);

  const handleTapToSeeMatchedThought = useCallback((notification) => {
    return navigation.navigate(Constant.SEND_THOUGHT_SCREEN, {
      recipient: notification.createdBy,
      from: "",
    });
  }, []);

  const handleRefresh = useCallback(
    debounce(
      async () => {
        setRefreshing(true);
        const canUpdate = await authorizeUpdates.authorizNotificationsUpdate();
        if (!canUpdate) return setRefreshing(false);

        const { ok, data, problem } = await myApi.setNotificationSeen();
        setRefreshing(false);
        if (ok) {
          await authorizeUpdates.updateNotificationsUpdate();
          await storeDetails(data.user);
          return setUser(data.user);
        }
        tackleProblem(problem, data, setInfoAlert);
      },
      5000,
      true
    ),
    [user]
  );

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
          onPressRight={handleRightHeaderPress}
          rightIcon="more-vert"
          title="Notifications"
        />
        <ScreenSub>
          {user.vip.subscription || (
            <VipAdCard onPress={handleVipCardPress} style={styles.adCard} />
          )}
          <ApiContext.Provider value={{ apiProcessing, setApiProcessing }}>
            <NotificationListPro
              isConnected={isConnected}
              onTapToSendMessage={handleSendMessage}
              onTapToSeeMessage={handleOpenModal}
              onTapToSeePress={handleTapToSeeThought}
              onTapToSeeMatchedThought={handleTapToSeeMatchedThought}
              notifications={data}
              onRefresh={handleRefresh}
              refreshing={refreshing}
            />
          </ApiContext.Provider>
        </ScreenSub>
      </Screen>
      {message.isVisible ? <View style={styles.modalFallback} /> : null}
      <ReplyModal message={message} handleCloseModal={handleCloseModal} />
      <AppModal
        visible={showClearAllModal}
        onRequestClose={handleCloseClearAllModal}
      >
        <View style={styles.clearAllActionContainer}>
          <Option
            title="Close"
            titleStyle={styles.closeOption}
            onPress={handleCloseClearAllModal}
          />
          <ApiOption
            title="Clear all notifications"
            onPress={isConnected ? handleClearAllPress : () => null}
            processing={clearNotification}
          />
        </View>
      </AppModal>
      <SeeThought visible={visible} setVisible={setVisible} message={thought} />
      <InfoAlert
        leftPress={handleCloseInfoAlert}
        description={infoAlert.infoAlertMessage}
        visible={infoAlert.showInfoAlert}
      />
    </>
  );
}
const styles = ScaledSheet.create({
  adCard: {
    marginTop: "5@s",
  },
  container: {
    alignItems: "center",
  },
  clearAllActionContainer: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.white,
    borderColor: defaultStyles.colors.dark_Variant,
    borderRadius: "20@s",
    borderWidth: 1,
    overflow: "hidden",
    width: "60%",
  },
  closeOption: {
    backgroundColor: defaultStyles.colors.dark_Variant,
    color: defaultStyles.colors.white,
    opacity: 1,
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
