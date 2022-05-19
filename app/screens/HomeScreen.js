import React, { useState, useCallback, useMemo, useEffect } from "react";
import { View, Linking } from "react-native";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useIsFocused } from "@react-navigation/native";
import { ScaledSheet } from "react-native-size-matters";
import { showMessage } from "react-native-flash-message";

import ContactList from "../components/ContactList";
import HomeAppHeader from "../components/HomeAppHeader";
import HomeMessagesList from "../components/HomeMessagesList";
import InfoAlert from "../components/InfoAlert";
import Screen from "../components/Screen";

import usersData from "../../PeculiarUserData";

import Constant from "../navigation/NavigationConstants";

import useAuth from "../auth/useAuth";

import myApi from "../api/my";
import messagesApi from "../api/messages";
import usersApi from "../api/users";

import useMountedRef from "../hooks/useMountedRef";

import storeDetails from "../utilities/storeDetails";
import debounce from "../utilities/debounce";
import apiActivity from "../utilities/apiActivity";
import authorizeUpdates from "../utilities/authorizeUpdates";

import defaultProps from "../utilities/defaultProps";
import NavigationConstants from "../navigation/NavigationConstants";
import FavoriteMessageReplyModal from "../components/FavoriteMessageReplyModal";

import defaultStyles from "../config/styles";
import ScreenSub from "../components/ScreenSub";

function HomeScreen({ navigation }) {
  // console.log(usersData);

  dayjs.extend(relativeTime);
  const { user, setUser } = useAuth();
  const mounted = useMountedRef().current;
  const isFocused = useIsFocused();
  const { tackleProblem } = apiActivity;

  const [infoAlert, setInfoAlert] = useState({
    showInfoAlert: false,
    infoAlertMessage: "",
  });
  const [selectedMessageId, setSelectedMessageId] = useState("");

  const [isVisible, setIsVisible] = useState(false);
  const [message, setMessage] = useState(
    defaultProps.defaultMessageVisibleToCurrentUserWithoutReplying
  );
  const [messageCreator, setMessageCreator] = useState({
    name: "************",
    picture: "",
    _id: "",
  });
  const [reply, setReply] = useState("");
  const [sendingReply, setSendingReply] = useState(false);

  const clearJunkData = async () => {
    let canUpdate = await authorizeUpdates.authorizeExpiredUpdate();
    if (!canUpdate) return;
    const { ok, data, problem } = await myApi.clearExpiredData();
    if (ok) return await authorizeUpdates.updateExpiredUpdate();
    if (problem) return;
  };

  const updateCurrentUser = useCallback(async () => {
    const { ok, data, problem } = await usersApi.getCurrentUser();
    if (ok) {
      setUser(data);
      return await storeDetails(data);
    }
    if (problem) return;
  }, []);

  useEffect(() => {
    clearJunkData();
    updateCurrentUser();
  }, []);

  const userMessages = useMemo(() => {
    return user.messages ? user.messages : [];
  }, [user]);

  useEffect(() => {
    if (!isFocused && mounted && isVisible) {
      setIsVisible(false);
    }
  }, [isFocused, mounted]);

  useEffect(() => {
    if (!isFocused && mounted && messageCreator.picture) {
      setMessageCreator({
        name: "************",
        picture: "",
        _id: "",
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
    if (mounted && selectedMessageId) {
      setSelectedMessageId("");
    }
  }, [isFocused, mounted]);

  const handleImagePress = useCallback(
    debounce(
      (recipient) => {
        navigation.push(NavigationConstants.ECHO_MODAL_SCREEN, {
          recipient,
        });
      },
      1000,
      true
    ),
    []
  );

  // MESSAGES ACTION

  const handleGetMessageCreator = async (message) => {
    if (!message.replied) return;
    const { data, ok, problem } = await messagesApi.getMessageCreator(
      message._id
    );
    if (ok) {
      return setMessageCreator({
        name: data.name,
        picture: data.picture,
        _id: data._id,
      });
    }

    tackleProblem(problem, data, setInfoAlert);
  };

  const handleMessagePress = useCallback(
    debounce(
      async (message) => {
        setMessage(message);
        setIsVisible(true);
        await handleGetMessageCreator(message);
        if (message.seen === false) {
          const { ok, data, problem } = await messagesApi.markRead(message._id);
          if (ok) {
            await storeDetails(data.user);
            return setUser(data.user);
          }
          return;
        }
        return;
      },
      500,
      true
    ),
    [user.messages, user]
  );

  // HEADER ACTIONS
  const handleRightPress = useCallback(() => {
    navigation.navigate(Constant.PROFILE_NAVIGATOR);
  }, []);

  const handleLeftPress = useCallback(() => {
    Linking.openURL("http://www.seeyot.com/how_it_works");
  }, []);

  // EMPTY FRIENDLIST
  const handleAddFriendPress = useCallback(
    () => navigation.navigate(Constant.ADD_CONTACTS_SCREEN),
    []
  );

  // INFO ALERT ACTIONS
  const handleCloseInfoAlert = useCallback(
    () => setInfoAlert({ ...infoAlert, showInfoAlert: false }),
    []
  );

  // CONTACT CARD OPTIONS
  const handleOnSendThoughtButtonPress = useCallback((user) => {
    if (user) {
      return navigation.navigate(Constant.SEND_THOUGHT_SCREEN, {
        recipient: user,
        from: Constant.HOME_SCREEN,
      });
    }
    setInfoAlert({
      infoAlertMessage: "Something went wrong! Please try again.",
      showInfoAlert: true,
    });
  }, []);

  const handleOnSendThoughtButtonPressFromFavorites = useCallback((user) => {
    if (user) {
      return navigation.navigate(Constant.SEND_THOUGHT_SCREEN, {
        recipient: user,
        from: "Favorite",
      });
    }
    setInfoAlert({
      infoAlertMessage: "Something went wrong! Please try again.",
      showInfoAlert: true,
    });
  }, []);

  const handleAddEchoButtonPress = useCallback((user) => {
    if (user) {
      return navigation.navigate(Constant.ADD_ECHO_SCREEN, {
        recipient: user,
        from: Constant.HOME_SCREEN,
      });
    }
    setInfoAlert({
      infoAlertMessage: "Something went wrong! Please try again.",
      showInfoAlert: true,
    });
  }, []);

  const data = useMemo(
    () =>
      typeof user.contacts !== "undefined"
        ? user.contacts.sort((a, b) => a.name > b.name)
        : [],
    [user, user.contacts]
  );

  const shouldShowMessagesList = useMemo(() => {
    return (
      userMessages.filter(
        (m) => dayjs(new Date()).diff(dayjs(m.createdAt), "hours") < 24
      ).length > 0
    );
  }, [user]);

  //MESSAGE MODAL ACTION

  const handleCloseMessage = useCallback(() => {
    setMessageCreator({ name: "**********", picture: "", _id: "" });
    setMessage(defaultProps.defaultMessageVisibleToCurrentUserWithoutReplying);
    setSelectedMessageId("");
    setIsVisible(false);
  }, []);

  const handleMessageReply = useCallback(
    debounce(
      async () => {
        setSendingReply(true);
        if (selectedMessageId) {
          const { data, ok, problem } = await messagesApi.reply(
            message._id,
            reply.trim(),
            selectedMessageId
          );
          if (ok) {
            setUser(data.user);
            setMessage(data.replied);
            setSendingReply(false);
            setReply("");
            setMessageCreator({
              name: data.name,
              picture: data.picture,
              _id: data._id,
            });
            return showMessage({
              ...defaultProps.alertMessageConfig,
              type: "success",
              message: "Reply Sent!",
            });
          }
          setSendingReply(false);
          return tackleProblem(problem, data, setInfoAlert);
        }

        const { data, ok, problem } = await messagesApi.reply(
          message._id,
          reply
        );
        if (ok) {
          setUser(data.user);
          setSendingReply(false);
          setMessage(data.replied);
          setReply("");
          setMessageCreator({
            name: data.name,
            picture: data.picture,
            _id: data._id,
          });
          return showMessage({
            ...defaultProps.alertMessageConfig,
            type: "success",
            message: "Reply Sent!",
          });
        }
        setSendingReply(false);
        tackleProblem(problem, data, setInfoAlert);
      },
      1000,
      true
    ),
    [message._id, reply, user, selectedMessageId]
  );

  return (
    <>
      <Screen style={styles.container}>
        <HomeAppHeader
          onPressLeft={handleLeftPress}
          onPressRight={handleRightPress}
          rightImageUrl={
            typeof user.picture !== "undefined" ? user.picture : ""
          }
        />
        <ScreenSub>
          {shouldShowMessagesList ? (
            <HomeMessagesList
              messages={userMessages}
              onMessagePress={handleMessagePress}
            />
          ) : null}

          <ContactList
            onAddEchoPress={handleAddEchoButtonPress}
            onAddFriendPress={handleAddFriendPress}
            onImagePress={handleImagePress}
            onSendThoughtsPress={handleOnSendThoughtButtonPress}
            users={data}
          />
        </ScreenSub>
      </Screen>
      {isVisible ? <View style={styles.modalFallback} /> : null}
      <FavoriteMessageReplyModal
        handleCloseMessage={handleCloseMessage}
        handleMessageReply={handleMessageReply}
        isVisible={isVisible}
        message={message}
        messageCreator={messageCreator}
        reply={reply}
        selectedMessageId={selectedMessageId}
        sendingReply={sendingReply}
        setReply={setReply}
        setSelectedMessageId={setSelectedMessageId}
        onSendThoughtPress={handleOnSendThoughtButtonPressFromFavorites}
        user={user}
      />
      <InfoAlert
        description={infoAlert.infoAlertMessage}
        leftPress={handleCloseInfoAlert}
        visible={infoAlert.showInfoAlert}
      />
    </>
  );
}
const styles = ScaledSheet.create({
  contactList: {
    marginTop: "2@s",
  },
  container: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.primary,
  },
  modalFallback: {
    backgroundColor: "rgba(0,0,0,0.7)",
    height: "100%",
    position: "absolute",
    width: "100%",
    zIndex: 22,
  },
});

export default HomeScreen;
