import React, { useCallback, useState, useEffect, useContext } from "react";
import { View, StyleSheet } from "react-native";
import { ScaledSheet, scale } from "react-native-size-matters";
import { useIsFocused } from "@react-navigation/native";

import Screen from "../components/Screen";
import ScreenSub from "../components/ScreenSub";
import InfoAlert from "../components/InfoAlert";
import GroupChatHeader from "../components/GroupChatHeader";
import GroupMessageInput from "../components/GroupMessageInput";
import GroupMessagesList from "../components/GroupMessagesList";
import AppActivityIndicator from "../components/ActivityIndicator";

import debounce from "../utilities/debounce";
import apiActivity from "../utilities/apiActivity";
import ApiContext from "../utilities/apiContext";

import { SocketContext } from "../api/socketClient";

import groupsApi from "../api/groups";
import usersApi from "../api/users";

import defaultStyles from "../config/styles";
import useAuth from "../auth/useAuth";
import NavigationConstants from "../navigation/NavigationConstants";

let defaultReply = {
  message: "",
  media: "",
  createdBy: {
    _id: "",
    name: "",
    picture: "",
  },
  createdFor: "",
};

function GroupChatScreen({ navigation, route }) {
  let group = route.params.group;
  const { tackleProblem } = apiActivity;
  let isUnmounting = false;
  const { user } = useAuth();
  const socket = useContext(SocketContext);
  const isFocused = useIsFocused();

  const [isReady, setIsReady] = useState(false);
  const [activeUsers, setActiveUsers] = useState([]);
  const [sendingMedia, setSendingMedia] = useState(false);
  const [message, setMessage] = useState("");
  const [infoAlert, setInfoAlert] = useState({
    infoAlertMessage: "",
    showInfoAlert: false,
  });

  const [groupMessages, setGroupMessages] = useState([]);
  const [reply, setReply] = useState({
    message: "",
    media: "",
    createdBy: {
      _id: "",
      name: "",
      picture: "",
    },
    createdFor: "",
  });

  const getCurrentMessages = async () => {
    const { ok, data, problem } = await groupsApi.getMessages(group._id);
    if (ok && !isUnmounting) {
      setGroupMessages(data.messages);
      return setIsReady(true);
    }
    if (!isUnmounting) {
      setIsReady(true);
      tackleProblem(problem, data, setInfoAlert);
    }
  };

  useEffect(() => {
    const listener = (data) => {
      if (data.newMessage.createdBy != user._id) {
        groupMessages.push(data.newMessage);
        setGroupMessages([...groupMessages]);
      }
    };
    socket.on(`newGroupMessage${group._id}`, listener);

    return () => {
      socket.off(`newGroupMessage${group._id}`, listener);
    };
  }, [groupMessages, group._id]);

  const addMeToActiveList = async () => {
    const { ok, data, problem } = await groupsApi.addActive(
      group._id,
      user._id,
      user.name,
      user.picture
    );
    if (ok) {
      return;
    }
    if (problem) console.log(problem);
  };

  useEffect(() => {
    const listener = (data) => {
      setActiveUsers(data.activeUsers);
    };
    socket.on(group._id, listener);

    return () => {
      socket.off(group._id, listener);
    };
  }, [activeUsers]);

  useEffect(() => {
    addMeToActiveList();
    getCurrentMessages();
    let intervalId = setInterval(() => {
      addMeToActiveList();
    }, 10000);

    return () => {
      isUnmounting = true;
      clearInterval(intervalId);
    };
  }, []);

  const handleSetTyping = useCallback(async () => {
    const { ok, problem } = await groupsApi.setTyping(group._id);
    if (ok) return;
    if (problem) return;
  }, [group._id]);

  // INFO ALERT ACTION
  const handleCloseInfoAlert = useCallback(
    () => setInfoAlert({ ...infoAlert, showInfoAlert: false }),
    []
  );

  // HEADER ACTIONS
  const handleBackPress = useCallback(
    debounce(() => navigation.goBack(), 500, true),
    []
  );

  const handleSendMessage = useCallback(
    async (textMessage, media) => {
      // translateX.value = withSpring(800);
      // listRef.current.scrollToOffset({ offset: -300, animated: true });
      // stopCurrentUserTyping();
      // if (!isRecipientActive && mounted) {
      //   return setShowAlert(true);
      // }
      let newId =
        Date.now().toString(36) + Math.random().toString(36).substring(2);
      let newMessage = media
        ? {
            _id: newId,
            createdBy: {
              _id: user._id,
              name: user.name,
              picture: user.picture,
            },
            createdFor: group._id,
            media: media,
            reply: reply,
          }
        : {
            _id: newId,
            message: textMessage.trim(),
            createdBy: {
              _id: user._id,
              name: user.name,
              picture: user.picture,
            },
            createdFor: group._id,
            reply: reply,
          };
      if (!isUnmounting) {
        groupMessages.push(newMessage);
        setGroupMessages([...groupMessages]);
        if (reply.createdBy) {
          setReply(defaultReply);
        }
      }
      const { ok, data, problem } = await groupsApi.sendNewGroupMessage(
        newMessage
      );
      if (ok) {
        return;
      }
      if (!isUnmounting) {
        tackleProblem(problem, data, setInfoAlert);
      }
    },
    [group._id, groupMessages, reply]
  );

  // MEDIA SEND ACTIVE CHAT

  const handleSendSelectedMedia = useCallback(
    async (uri) => {
      setSendingMedia(true);

      const { ok, data, problem } = await usersApi.getUploadedPhoto(uri);
      if (ok) {
        handleSendMessage("", data);
        return setSendingMedia(false);
      }
      setSendingMedia(false);
      if (problem) tackleProblem(problem, data, setInfoAlert);
    },
    [groupMessages]
  );

  const handleMessageCreatorImagePress = (recipient) => {
    navigation.navigate(NavigationConstants.SEND_THOUGHT_SCREEN, { recipient });
  };
  return (
    <>
      <Screen style={styles.container}>
        <GroupChatHeader
          totalActiveUsers={activeUsers}
          group={group}
          onBackPress={handleBackPress}
        />
        <ScreenSub style={styles.screenSub}>
          {isReady ? (
            <GroupMessagesList
              onImagePress={handleMessageCreatorImagePress}
              group={group}
              groupMessages={groupMessages}
            />
          ) : (
            <AppActivityIndicator color={defaultStyles.colors.secondary} />
          )}
          <ApiContext.Provider value={{ sendingMedia, setSendingMedia }}>
            {isFocused ? (
              <GroupMessageInput
                placeholder="Type your message..."
                // rStyle={rStyle}
                // recipient={recipient}
                // reply={reply}
                // onRemoveReply={handleRemoveReply}
                onSendSelectedMedia={handleSendSelectedMedia}
                // isFocused={isFocused}
                setTyping={handleSetTyping}
                message={message}
                setMessage={setMessage}
                style={styles.inputBox}
                submit={handleSendMessage}
              />
            ) : null}
          </ApiContext.Provider>
        </ScreenSub>
      </Screen>
      <InfoAlert
        leftPress={handleCloseInfoAlert}
        description={infoAlert.infoAlertMessage}
        visible={infoAlert.showInfoAlert}
      />
    </>
  );
}
const styles = ScaledSheet.create({
  container: {},
  inputBox: {
    marginVertical: "5@s",
  },
  screenSub: {
    borderTopRightRadius: 0,
  },
});

export default GroupChatScreen;
