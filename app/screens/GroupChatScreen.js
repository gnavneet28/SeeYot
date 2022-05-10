import React, {
  useCallback,
  useState,
  useEffect,
  useContext,
  useRef,
} from "react";
import { ScaledSheet } from "react-native-size-matters";
import { useIsFocused } from "@react-navigation/native";
import {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import ReactNativeHapticFeedback from "react-native-haptic-feedback";

import Screen from "../components/Screen";
import ScreenSub from "../components/ScreenSub";
import InfoAlert from "../components/InfoAlert";
import GroupChatHeader from "../components/GroupChatHeader";
import GroupMessageInput from "../components/GroupMessageInput";
import GroupMessagesList from "../components/GroupMessagesList";
import AppActivityIndicator from "../components/ActivityIndicator";
import ChatBackgroundSelector from "../components/ChatBackgroundSelector";

import debounce from "../utilities/debounce";
import apiActivity from "../utilities/apiActivity";
import ApiContext from "../utilities/apiContext";

import { SocketContext } from "../api/socketClient";

import groupsApi from "../api/groups";
import usersApi from "../api/users";

import ImageContext from "../utilities/ImageContext";

import defaultStyles from "../config/styles";
import useAuth from "../auth/useAuth";
import NavigationConstants from "../navigation/NavigationConstants";
import InviteUsersModal from "../components/InviteUsersModal";
import GroupChatUserOptions from "../components/GroupChatUserOptions";
import storeDetails from "../utilities/storeDetails";

const optionsVibrate = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: true,
};

let defaultReply = {
  _id: "",
  message: "",
  media: "",
  createdBy: {
    _id: "",
    name: "",
    picture: "",
  },
  createdFor: "",
};

let defaultUser = { name: "", picture: "", _id: "" };

function GroupChatScreen({ navigation, route }) {
  let incognito = route.params.incognito;
  const { tackleProblem } = apiActivity;
  let isUnmounting = false;
  const { user, setUser } = useAuth();
  const socket = useContext(SocketContext);
  const isFocused = useIsFocused();
  const listRef = useRef(null);

  const [isReady, setIsReady] = useState(false);
  const [group, setGroup] = useState(route.params.group);
  const [mediaImage, setMediaImage] = useState("");
  const [activeUsers, setActiveUsers] = useState([]);
  const [sendingMedia, setSendingMedia] = useState(false);
  const [message, setMessage] = useState("");
  const [infoAlert, setInfoAlert] = useState({
    infoAlertMessage: "",
    showInfoAlert: false,
  });

  const [showInviteModal, setShowInviteModal] = useState(false);

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

  const [blockingFromGroup, setBlockingFromGroup] = useState(false);
  const [blockingPersonally, setBlockingPersonally] = useState(false);
  const [showUserOptions, setShowUserOptions] = useState(false);
  const [interestedUser, setInterestedUser] = useState(defaultUser);
  const [changingInvitePermission, setChangingInvitePermission] =
    useState(false);

  const handleCloseUserOptionsModal = useCallback(() => {
    setInterestedUser(defaultUser);
    setShowUserOptions(false);
  }, []);

  const handleAddEchoOptionPress = useCallback(() => {
    setShowUserOptions(false);
    setInterestedUser(defaultUser);
    navigation.navigate(NavigationConstants.ADD_ECHO_SCREEN, {
      recipient: interestedUser,
    });
  }, [interestedUser]);

  const handleSendThoughtsOptionPress = useCallback(() => {
    setShowUserOptions(false);
    setInterestedUser(defaultUser);
    navigation.navigate(NavigationConstants.SEND_THOUGHT_SCREEN, {
      recipient: interestedUser,
    });
  }, [interestedUser]);

  const handleBlockFromGroupPress = useCallback(async () => {
    if (!isUnmounting) {
      setBlockingFromGroup(true);
    }
    const { ok, data, problem } = await groupsApi.blockUser(
      group._id,
      interestedUser._id
    );
    if (ok && !isUnmounting) {
      setGroup(data);
      return setBlockingFromGroup(false);
    }

    if (!isUnmounting) {
      setBlockingFromGroup(false);
      tackleProblem(problem, data, setInfoAlert);
    }
  }, [interestedUser, group]);

  const handleBlockPersonally = useCallback(async () => {
    if (!isUnmounting) {
      setBlockingPersonally(true);
    }
    const { ok, data, problem } = await usersApi.blockContact(
      interestedUser._id
    );
    if (ok && !isUnmounting) {
      await storeDetails(data.user);
      setUser(data.user);
      return setBlockingPersonally(false);
    }

    if (!isUnmounting) {
      setBlockingPersonally(false);
      tackleProblem(problem, data, setInfoAlert);
    }
  }, [interestedUser, group]);

  const handleOpenReportUserModal = () => {};

  // // REPLY ACTIONS

  const translateX = useSharedValue(800);

  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: translateX.value,
        },
      ],
    };
  }, []);

  const handleRemoveReply = useCallback(() => {
    translateX.value = withTiming(800);
    setReply(defaultReply);
  }, [reply]);

  const handleOnSelectReply = useCallback(
    (data) => {
      translateX.value = withTiming(0);
      setReply(data);
    },
    [reply]
  );

  const getCurrentMessages = useCallback(async () => {
    const { ok, data, problem } = await groupsApi.getMessages(group._id);
    if (ok && !isUnmounting) {
      setGroupMessages(data.messages);
      return setIsReady(true);
    }
    if (!isUnmounting) {
      setIsReady(true);
      tackleProblem(problem, data, setInfoAlert);
    }
  }, [groupMessages, isUnmounting]);

  useEffect(() => {
    const listener1 = (data) => {
      if (data.newMessage.createdBy._id != user._id) {
        if (!isUnmounting) {
          setGroupMessages([...groupMessages, data.newMessage]);
        }
      }
    };
    socket.on(`newGroupMessage${group._id}`, listener1);

    const listener2 = (data) => {
      if (activeUsers.filter((u) => u._id == data.activeUser._id).length < 1) {
        if (!isUnmounting) {
          setActiveUsers([...activeUsers, data.activeUser]);
        }
      }
    };

    socket.on(`addActive${group._id}`, listener2);

    const listener3 = (data) => {
      if (activeUsers.filter((u) => u._id == data.activeUser._id).length) {
        let newActiveUsers = activeUsers.filter(
          (u) => u._id != data.activeUser
        );
        if (!isUnmounting) {
          setActiveUsers(newActiveUsers);
        }
      }
    };

    socket.on(`removeActive${group._id}`, listener3);

    return () => {
      socket.off(`newGroupMessage${group._id}`, listener1);
      socket.off(`addActive${group._id}`, listener2);
      socket.off(`removeActive${group._id}`, listener3);
    };
  }, [groupMessages, group._id, activeUsers]);

  useEffect(() => {
    if (!isFocused) {
      removeMeFromActiveList();
    }

    return () => removeMeFromActiveList();
  }, [isFocused]);

  const addMeToActiveList = useCallback(async () => {
    const { ok, data, problem } = await groupsApi.addActive(
      group._id,
      user._id,
      user.name,
      user.picture
    );
    if (ok) {
      return;
    }
    if (problem) return;
  }, [group._id]);

  const removeMeFromActiveList = useCallback(async () => {
    const { ok, data, problem } = await groupsApi.removeActive(
      group._id,
      user._id,
      user.name,
      user.picture
    );
    if (ok) {
      return;
    }
    if (problem) return;
  }, [group._id]);

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
    const { ok, problem } = await groupsApi.setTyping(group._id, user._id);
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
      translateX.value = withTiming(800);
      listRef.current.scrollToOffset({ offset: -300, animated: true });
      // stopCurrentUserTyping();

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

  const handleMessageCreatorImagePress = useCallback((recipient) => {
    navigation.navigate(NavigationConstants.SEND_THOUGHT_SCREEN, { recipient });
  }, []);

  const handleMessageCreatorImageLongPress = useCallback(
    (recipient) => {
      ReactNativeHapticFeedback.trigger("impactMedium", optionsVibrate);
      setInterestedUser(recipient);
      setShowUserOptions(true);
    },
    [interestedUser]
  );

  const handleAddEchoPress = useCallback((user) => {
    navigation.navigate(NavigationConstants.ADD_ECHO_SCREEN, {
      recipient: user,
    });
  }, []);

  const handleSendThoughtsPress = useCallback((user) => {
    navigation.navigate(NavigationConstants.SEND_THOUGHT_SCREEN, {
      recipient: user,
    });
  }, []);

  // OPTION ACTIONS
  const handleOpenInviteModal = useCallback(() => {
    setShowInviteModal(true);
  }, []);

  const handleChangeInvitePermission = useCallback(async () => {
    if (!isUnmounting) {
      setChangingInvitePermission(true);
    }

    const { ok, data, problem } = await groupsApi.modifyInvitePermission(
      group._id
    );

    if (ok && !isUnmounting) {
      setGroup(data);
      return setChangingInvitePermission(false);
    }

    if (!isUnmounting) {
      setChangingInvitePermission(false);
      tackleProblem(problem, data, setInfoAlert);
    }
  }, [group]);

  return (
    <>
      <Screen style={styles.container}>
        <GroupChatHeader
          onAddEchoPress={handleAddEchoPress}
          onSendThoughtsPress={handleSendThoughtsPress}
          totalActiveUsers={activeUsers}
          group={group}
          onBackPress={handleBackPress}
          onOptionPress={handleOpenInviteModal}
        />
        <ScreenSub style={styles.screenSub}>
          <ChatBackgroundSelector>
            {isReady ? (
              <GroupMessagesList
                onImagePress={handleMessageCreatorImagePress}
                group={group}
                groupMessages={groupMessages}
                onSelectReply={handleOnSelectReply}
                listRef={listRef}
                onImageLongPress={handleMessageCreatorImageLongPress}
              />
            ) : (
              <AppActivityIndicator color={defaultStyles.colors.secondary} />
            )}
            {isFocused ? (
              <ApiContext.Provider value={{ sendingMedia, setSendingMedia }}>
                <ImageContext.Provider value={{ mediaImage, setMediaImage }}>
                  <GroupMessageInput
                    placeholder="Type your message..."
                    rStyle={rStyle}
                    reply={reply}
                    onRemoveReply={handleRemoveReply}
                    onSendSelectedMedia={handleSendSelectedMedia}
                    setTyping={handleSetTyping}
                    message={message}
                    setMessage={setMessage}
                    style={styles.inputBox}
                    submit={handleSendMessage}
                    onCameraImageSelection={handleSendSelectedMedia}
                  />
                </ImageContext.Provider>
              </ApiContext.Provider>
            ) : null}
          </ChatBackgroundSelector>
        </ScreenSub>
      </Screen>
      <InfoAlert
        leftPress={handleCloseInfoAlert}
        description={infoAlert.infoAlertMessage}
        visible={infoAlert.showInfoAlert}
      />
      <InviteUsersModal
        openInviteModal={showInviteModal}
        setOpenInviteModal={setShowInviteModal}
        group={group}
        onChangeInvitePermission={handleChangeInvitePermission}
        changingInvitePermission={changingInvitePermission}
      />
      <GroupChatUserOptions
        blockingFromGroup={blockingFromGroup}
        blockingPersonally={blockingPersonally}
        handleCloseModal={handleCloseUserOptionsModal}
        isVisible={showUserOptions}
        onAddEchoPress={handleAddEchoOptionPress}
        onSendThoughtsPress={handleSendThoughtsOptionPress}
        onBlockFromGroupPress={handleBlockFromGroupPress}
        onBlockFromPersonalAccountPress={handleBlockPersonally}
        onReportUserPress={handleOpenReportUserModal}
        group={group}
        interestedUser={interestedUser}
        user={user}
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
