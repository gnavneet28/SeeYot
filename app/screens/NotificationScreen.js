import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { View } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { scale, ScaledSheet } from "react-native-size-matters";
import * as Animatable from "react-native-animatable";

import AppHeader from "../components/AppHeader";
import AppModal from "../components/AppModal";
import Option from "../components/Option";
import ApiOption from "../components/ApiOption";
import InfoAlert from "../components/InfoAlert";
import NotificationListPro from "../components/NotificationListPro";
import NotificationCategorySelector from "../components/NotificationCategorySelector";
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
import ModalBackDrop from "../components/ModalBackDrop";

function NotificationScreen({ navigation }) {
  const { user, setUser } = useAuth();
  const mounted = useMountedRef().current;
  const isConnected = useConnection();
  const isFocused = useIsFocused();
  const { tackleProblem } = apiActivity;

  const modalRef = useRef(null);

  // STATES
  const [clearNotification, setClearNotification] = useState(false);
  const [visible, setVisible] = useState(false);
  const [thought, setThought] = useState({ message: "", hint: "" });
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

  // NOTIFICATION FILTER

  const [notificationCategory, setNotificationCategory] = useState("All");

  const handleNotificationCategoryChange = (notification) => {
    setNotificationCategory(notification.alias);
  };

  const filterNotifications = (category, user) => {
    if (category == "All") {
      return user.notifications;
    } else if (category == "Matched Thoughts") {
      return user.notifications.filter((n) => n.type == "Matched");
    } else if (category == "Active Chat") {
      return user.notifications.filter((n) => n.type == "ActiveChat");
    } else if (category == "Add") {
      return user.notifications.filter((n) => n.type == "Add");
    } else if (category == "Replies") {
      return user.notifications.filter((n) => n.type == "Replied");
    } else if (category == "Group Invites") {
      return user.notifications.filter((n) => n.type == "GroupChatInvite");
    }
  };

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
  }, [user]);

  const handleSendMessage = (notification) => {
    return navigation.navigate(Constant.SEND_THOUGHT_SCREEN, {
      recipient: notification.data,
      from: Constant.NOTIFICATION_SCREEN,
    });
  };

  const handleTapToSeeThought = useCallback((thought) => {
    setThought(thought.data);
    setVisible(true);
  }, []);

  const handleNotificationTapToVisitGroup = useCallback((notification) => {
    navigation.navigate(Constant.GROUP_NAVIGATOR, {
      screen: Constant.FIND_GROUP_SCREEN,
      params: {
        name: notification.data.name,
        password: notification.data.password ? notification.data.password : "",
      },
    });
  }, []);

  const handleCloseThoughtModal = useCallback(() => {
    setThought({ message: "", hint: "" });
    setVisible(false);
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
        ? filterNotifications(notificationCategory, user).sort(
            (a, b) => a.createdAt < b.createdAt
          )
        : [],

    [user.notifications, notificationCategory]
  );

  const onCloseClearAllModal = () => {
    if (clearNotification) return;
    setShowClearAllModal(false);
  };

  return (
    <>
      <Screen style={styles.container}>
        <AppHeader
          leftIcon="arrow-back"
          onPressLeft={handleBack}
          onPressRight={handleRightHeaderPress}
          rightIcon={data.length ? "more-vert" : ""}
          title="Notifications"
        />
        <ScreenSub>
          {user.vip.subscription || (
            <VipAdCard onPress={handleVipCardPress} style={styles.adCard} />
          )}
          <NotificationCategorySelector
            style={{ marginBottom: scale(15) }}
            selected={notificationCategory}
            onPress={handleNotificationCategoryChange}
          />
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
              tapToVisitGroup={handleNotificationTapToVisitGroup}
              //style={styles.list}
            />
          </ApiContext.Provider>
        </ScreenSub>
      </Screen>
      {message.isVisible ? <View style={styles.modalFallback} /> : null}
      <ReplyModal message={message} handleCloseModal={handleCloseModal} />
      <AppModal
        animationType="none"
        visible={showClearAllModal}
        onRequestClose={onCloseClearAllModal}
      >
        <ModalBackDrop onPress={onCloseClearAllModal}>
          <View style={styles.clearAllActionContainerMain}>
            <Animatable.View
              animation="pulse"
              useNativeDriver={true}
              ref={modalRef}
              style={[styles.clearAllActionContainer]}
            >
              <Option
                title="Close"
                titleStyle={styles.closeOption}
                onPress={onCloseClearAllModal}
              />
              <ApiOption
                title="Clear all notifications"
                onPress={isConnected ? handleClearAllPress : () => null}
                processing={clearNotification}
              />
            </Animatable.View>
          </View>
        </ModalBackDrop>
      </AppModal>
      <SeeThought
        visible={visible}
        onClose={handleCloseThoughtModal}
        thought={thought}
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
  adCard: {
    marginTop: "5@s",
  },
  container: {
    alignItems: "center",
  },
  clearAllActionContainerMain: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    width: "100%",
  },
  clearAllActionContainer: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.white,
    borderColor: defaultStyles.colors.dark_Variant,
    borderRadius: "15@s",
    borderWidth: 1,
    overflow: "hidden",
    width: "60%",
  },
  closeOption: {
    ...defaultStyles.closeIcon,
  },
  modalFallback: {
    backgroundColor: "rgba(0,0,0,0.7)",
    height: "100%",
    position: "absolute",
    width: "100%",
    zIndex: 22,
  },
  list: {
    paddingBottom: "10@s",
  },
});

export default NotificationScreen;
