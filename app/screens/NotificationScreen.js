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
import GroupReplyModal from "../components/GroupReplyModal";
import ScreenSub from "../components/ScreenSub";
import ModalBackDrop from "../components/ModalBackDrop";
import ModalFallBack from "../components/ModalFallback";

import Constant from "../navigation/NavigationConstants";

import storeDetails from "../utilities/storeDetails";

import debounce from "../utilities/debounce";
import defaultProps from "../utilities/defaultProps";
import ApiContext from "../utilities/apiContext";
import apiActivity from "../utilities/apiActivity";
import authorizeUpdates from "../utilities/authorizeUpdates";

import defaultStyles from "../config/styles";

import myApi from "../api/my";

import useAuth from "../auth/useAuth";

let defaultGroupReply = {
  createdBy: { _id: "", name: "", picture: "" },
  data: {
    groupName: "",
    messageMedia: "",
    messageText: "",
    replyMedia: "",
    replyText: "",
    groupPassword: "",
  },
  isVisible: false,
};

function NotificationScreen({ navigation }) {
  const { user, setUser } = useAuth();
  let isUnmounting = false;
  let canShowOnNotificationScreen = useRef(true);
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
  const [apiProcessing, setApiProcessing] = useState("");
  const [showClearAllModal, setShowClearAllModal] = useState(false);
  const [showGroupReplyModal, setShowGroupReplyModal] =
    useState(defaultGroupReply);

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

  // OnUnmount
  useEffect(() => {
    return () => (isUnmounting = true);
  }, []);

  useEffect(() => {
    if (isFocused && !isUnmounting && !canShowOnNotificationScreen.current) {
      canShowOnNotificationScreen.current = true;
    } else if (!isFocused && !isUnmounting) {
      canShowOnNotificationScreen.current = false;
    }
  }, [isFocused]);

  useEffect(() => {
    if (!isFocused && !isUnmounting && infoAlert.showInfoAlert === true) {
      setInfoAlert({
        infoAlertMessage: "",
        showInfoAlert: false,
      });
    }
  }, [isFocused]);

  useEffect(() => {
    if (!isFocused && !isUnmounting && message.isVisible === true) {
      setMessage({
        message: "",
        isVisible: false,
      });
    }
  }, [isFocused]);

  useEffect(() => {
    if (!isFocused && !isUnmounting && visible === true) {
      setVisible(false);
    }
  }, [isFocused]);

  useEffect(() => {
    if (!isFocused && !isUnmounting && showClearAllModal === true) {
      setShowClearAllModal(false);
    }
  }, [isFocused]);

  useEffect(() => {
    if (!isFocused && !isUnmounting && showGroupReplyModal.isVisible) {
      setShowGroupReplyModal({
        createdBy: { _id: "", name: "", picture: "" },
        data: { groupName: "", message: "", reply: "" },
        isVisible: false,
      });
    }
  }, [isFocused]);

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

    if (!isUnmounting && canShowOnNotificationScreen.current) {
      tackleProblem(problem, data, setInfoAlert);
    }
  }, [user]);

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
    if (canShowOnNotificationScreen.current) {
      tackleProblem(problem, data, setInfoAlert);
    }
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
    setShowGroupReplyModal({});
    navigation.navigate(Constant.GROUP_NAVIGATOR, {
      screen: Constant.FIND_GROUP_SCREEN,
      params: {
        name: notification.data.name,
        password: notification.data.password ? notification.data.password : "",
      },
    });
  }, []);

  const handleVisitGroup = useCallback((name, password) => {
    setShowGroupReplyModal(defaultGroupReply);
    navigation.navigate(Constant.GROUP_NAVIGATOR, {
      screen: Constant.FIND_GROUP_SCREEN,
      params: {
        name: name,
        password: password,
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

  const handleTapToSeeGroupReply = useCallback((notification) => {
    setShowGroupReplyModal({
      isVisible: true,
      data: notification.data,
      createdBy: notification.createdBy,
    });
  }, []);

  const handleTapToSeePostReply = useCallback((notification) => {
    navigation.navigate(Constant.POST_DETAILS, { id: notification.data._id });
  }, []);

  const handleTapToSeeReaction = useCallback((notification) => {
    navigation.navigate(Constant.REACTION_DETAILS_SCREEN, {
      post: notification.data.post,
      reaction: notification.data.reaction,
    });
  }, []);

  const handleSendThoughtsPress = useCallback((user) => {
    setShowGroupReplyModal(defaultGroupReply);
    navigation.navigate(Constant.SEND_THOUGHT_SCREEN, {
      recipient: user,
      from: "Notification",
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
        if (canShowOnNotificationScreen.current) {
          tackleProblem(problem, data, setInfoAlert);
        }
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

  const handleCloseGroupReplyModal = useCallback(() => {
    setShowGroupReplyModal(defaultGroupReply);
  }, []);

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
              onTapToSendMessage={handleSendMessage}
              onTapToSeeMessage={handleOpenModal}
              onTapToSeePress={handleTapToSeeThought}
              onTapToSeeMatchedThought={handleTapToSeeMatchedThought}
              notifications={data}
              onRefresh={handleRefresh}
              refreshing={refreshing}
              tapToVisitGroup={handleNotificationTapToVisitGroup}
              tapToSeeGroupReply={handleTapToSeeGroupReply}
              tapToSeePostReply={handleTapToSeePostReply}
              tapToSeeReaction={handleTapToSeeReaction}
            />
          </ApiContext.Provider>
        </ScreenSub>
      </Screen>
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
                onPress={handleClearAllPress}
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
      <GroupReplyModal
        onVisitGroup={handleVisitGroup}
        onClose={handleCloseGroupReplyModal}
        data={showGroupReplyModal.data}
        visible={showGroupReplyModal.isVisible}
        createdBy={showGroupReplyModal.createdBy}
        onSendThoughtPress={handleSendThoughtsPress}
      />
      {visible || showGroupReplyModal.isVisible || message.isVisible ? (
        <ModalFallBack />
      ) : null}
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
