import React, {
  useCallback,
  useState,
  useEffect,
  useContext,
  useRef,
} from "react";
import { scale, ScaledSheet } from "react-native-size-matters";
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
import EchoMessageModal from "../components/EchoMessageModal";
import InviteUsersModal from "../components/InviteUsersModal";
import GroupChatUserOptions from "../components/GroupChatUserOptions";
import LoadingIndicator from "../components/LoadingIndicator";
import ReportUserModal from "../components/ReportUserModal";

import apiActivity from "../utilities/apiActivity";
import ApiContext from "../utilities/apiContext";
import debounce from "../utilities/debounce";
import defaultProps from "../utilities/defaultProps";
import ImageContext from "../utilities/ImageContext";
import InvitedUserContext from "../utilities/invitedUserContext";
import InvitedUsersContext from "../utilities/invitedUsersContext";
import storeDetails from "../utilities/storeDetails";

import { SocketContext } from "../api/socketClient";
import groupsApi from "../api/groups";
import usersApi from "../api/users";

import defaultStyles from "../config/styles";
import useAuth from "../auth/useAuth";
import NavigationConstants from "../navigation/NavigationConstants";
import echosApi from "../api/echos";
import useAppState from "../hooks/useAppState";

const notifyMessageCreatorIfNotActive = (
  id,
  groupName,
  groupPassword,
  messageMedia,
  messageText,
  replyMedia,
  replyText,
  activeUsers,
  messageCreator
) => {
  if (!activeUsers.filter((u) => u._id == messageCreator._id).length) {
    return groupsApi.replyMessageCreator(
      id,
      groupName,
      groupPassword,
      messageMedia,
      messageText,
      replyMedia,
      replyText
    );
  }
};

const optionsVibrate = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: true,
};

// Some default values

// for reply
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

// for user
let defaultUser = { name: "", picture: "", _id: "" };

// for echo Message Modal
let defaultEchoState = {
  visible: false,
  recipient: defaultProps.defaultEchoMessageRecipient,
  echoMessage: { message: "" },
};

function GroupChatScreen({ navigation, route }) {
  let incognito = route.params.incognito;

  // hooks used
  const { user, setUser } = useAuth();
  const socket = useContext(SocketContext);
  const appStateVisible = useAppState();
  const isFocused = useIsFocused();
  const listRef = useRef(null);

  const { tackleProblem } = apiActivity;

  let isUnmounting = false;
  let canUpdate = useRef(true);

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

  // States
  const [deletingMessage, setDeletingMessage] = useState("");
  const [echoState, setEchoState] = useState(defaultEchoState);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [groupMessages, setGroupMessages] = useState([]);
  const [reply, setReply] = useState(defaultReply);
  const [blockingFromGroup, setBlockingFromGroup] = useState(false);
  const [blockingPersonally, setBlockingPersonally] = useState(false);
  const [showUserOptions, setShowUserOptions] = useState(false);
  const [interestedUser, setInterestedUser] = useState(defaultUser);
  const [changingInvitePermission, setChangingInvitePermission] =
    useState(false);
  const [openUserReport, setOpenUserReport] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Inviting users
  const [invitedUsers, setInvitedUsers] = useState([]);
  const [invitedUser, setInvitedUser] = useState("");
  const [canShowTyping, setCanShowTyping] = useState(false);

  // Close All modal on mount or if focused if open

  //OnUnmount;
  useEffect(() => {
    return () => {
      isUnmounting = true;
    };
  }, []);

  useEffect(() => {
    if (!isFocused) {
      canUpdate.current = false;
    } else if (isFocused) {
      canUpdate.current = true;
    }
  }, [isFocused]);

  useEffect(() => {
    if (!isFocused && !isUnmounting) {
      if (infoAlert.showInfoAlert) {
        setInfoAlert({ ...infoAlert, showInfoAlert: false });
      }

      if (openUserReport) {
        setOpenUserReport(false);
      }

      if (showInviteModal) {
        setShowInviteModal(false);
      }

      if (echoState.visible) {
        setEchoState(defaultEchoState);
      }
      if (showUserOptions) {
        setShowUserOptions(false);
      }
      if (isLoading) {
        setIsLoading(false);
      }
    }
  }, [isFocused]);

  const handleSubmitUserReport = useCallback(
    async (report) => {
      if (!isUnmounting) {
        setIsLoading(true);
      }

      const { ok, data, problem } = await usersApi.reportUser(
        interestedUser._id,
        report
      );
      if (ok && !isUnmounting) {
        setIsLoading(false);
        setOpenUserReport(false);

        if (canUpdate.current) {
          setInfoAlert({
            infoAlertMessage:
              "Thank you for reporting the profile. We will look into this as soon as possible.",
            showInfoAlert: true,
          });
        }

        return;
      }

      if (!isUnmounting) {
        setIsLoading(false);
      }
      if (!isUnmounting && canUpdate.current) {
        tackleProblem(problem, data, setInfoAlert);
      }
    },
    [interestedUser._id]
  );

  let showEchoMessage = false;

  const handleCloseEchoModal = useCallback(() => {
    showEchoMessage = false;
    setEchoState({ ...defaultEchoState, visible: false });
  }, []);

  const handleCloseUserOptionsModal = useCallback(() => {
    setInterestedUser(defaultUser);
    setShowUserOptions(false);
  }, []);

  // Chat message creator, user actions

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
    }
    if (!isUnmounting && canUpdate.current) {
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
    }
    if (!isUnmounting && canUpdate.current) {
      tackleProblem(problem, data, setInfoAlert);
    }
  }, [interestedUser, group]);

  const handleOpenReportUserModal = useCallback(() => {
    setOpenUserReport(true);
    setShowUserOptions(false);
  }, []);

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
    if (!isUnmounting) {
      translateX.value = withTiming(800);
      setReply(defaultReply);
    }
  }, [reply]);

  const handleOnSelectReply = useCallback(
    (data) => {
      if (!isUnmounting) {
        translateX.value = withTiming(0);
        setReply(data);
      }
    },
    [reply]
  );

  const deleteMessage = useCallback(async () => {
    if (!isUnmounting) {
      setDeletingMessage(reply._id);
    }
    const { ok, problem, data } = await groupsApi.deleteMessage(
      group._id,
      reply._id
    );
    if (ok && !isUnmounting) {
      translateX.value = withTiming(800);
      getCurrentMessages();
      setReply(defaultReply);
      return setDeletingMessage("");
    }

    if (!isUnmounting) {
      setDeletingMessage("");
    }
    if (!isUnmounting && canUpdate.current) {
      tackleProblem(problem, data, setInfoAlert);
    }
  }, [reply]);

  const getCurrentMessages = async () => {
    const { ok, data, problem } = await groupsApi.getMessages(group._id);
    if (ok) {
      if (!isUnmounting && canUpdate.current) {
        setGroupMessages(data.messages);
      }
      if (!isUnmounting && canUpdate.current) {
        return setIsReady(true);
      }
    }
    if (!isUnmounting) {
      setIsReady(true);
    }
    if (!isUnmounting && canUpdate.current) {
      tackleProblem(problem, data, setInfoAlert);
    }
  };

  const stopCurrentUserTyping = useCallback(async () => {
    groupsApi.stopTyping(group._id, user._id);
  }, [group._id, isFocused]);

  useEffect(() => {
    const listener1 = (data) => {
      if (data.newMessage.createdBy._id != user._id) {
        if (!isUnmounting) {
          setGroupMessages([...groupMessages, data.newMessage]);
        }
      }
    };
    socket.on(`newGroupMessage${group._id}`, listener1);

    return () => {
      socket.off(`newGroupMessage${group._id}`, listener1);
    };
  }, [groupMessages, group._id]);

  useEffect(() => {
    const listener2 = (data) => {
      if (activeUsers.filter((u) => u._id == data.activeUser._id).length < 1) {
        if (!isUnmounting) {
          setActiveUsers([...activeUsers, data.activeUser]);
        }
      }
    };

    socket.on(`addActive${group._id}`, listener2);

    return () => {
      socket.off(`addActive${group._id}`, listener2);
    };
  }, [activeUsers, group._id]);

  useEffect(() => {
    const listener3 = (data) => {
      let newActiveUsers = activeUsers.filter(
        (u) => u._id != data.activeUser._id
      );
      if (!isUnmounting) {
        setActiveUsers(newActiveUsers);
      }
    };

    socket.on(`removeActive${group._id}`, listener3);

    return () => {
      socket.off(`removeActive${group._id}`, listener3);
    };
  }, [activeUsers, group._id]);

  // Update group messages when someone deletes any message
  useEffect(() => {
    const listener = (data) => {
      if (data.updatedBy != user._id) {
        getCurrentMessages();
      }
    };

    socket.on(`updateGroupMessages${group._id}`, listener);

    return () => {
      socket.off(`updateGroupMessages${group._id}`, listener);
    };
  }, [group._id]);

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
  }, [group._id, user]);

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
  }, [group._id, user]);

  // On page mount, focused, unfocused and unmount actions
  useEffect(() => {
    let intervalId;
    if (!isUnmounting && isFocused) {
      setReply(defaultReply);
      getCurrentMessages();
      if (!incognito) {
        addMeToActiveList();
        intervalId = setInterval(() => {
          addMeToActiveList();
        }, 15000);
      }
    }

    if (!isFocused || appStateVisible !== "active") {
      if (!isUnmounting && !incognito) {
        removeMeFromActiveList();
      }
    }

    return () => {
      removeMeFromActiveList();
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isFocused, appStateVisible]);

  // When somone from explore page or my groups page make a request
  // to get total Active users

  const sendTotalActiveUsers = (requestedBy) => {
    if (activeUsers.length) {
      if (activeUsers[0]._id == user._id && !isUnmounting) {
        return groupsApi.sendActiveUser(group._id, activeUsers, requestedBy);
      }
    }
  };

  useEffect(() => {
    const listener = (data) => {
      if (!isUnmounting) {
        sendTotalActiveUsers(data.requestedBy);
      }
    };

    socket.on(`requestTotalActiveUsers${group._id}`, listener);

    return () => {
      socket.off(`requestTotalActiveUsers${group._id}`, listener);
    };
  }, [group._id, activeUsers]);

  const resetTypeTime = () => {
    if (!isUnmounting) {
      setCanShowTyping(false);
    }
  };

  const handleSetTyping = useCallback(async () => {
    if (canShowTyping) return;

    setCanShowTyping(true);
    setTimeout(() => {
      resetTypeTime();
    }, 2000);

    const { ok, problem } = await groupsApi.setTyping(group._id, user._id);
    if (ok) return;
    if (problem) return;
  }, [group._id, canShowTyping]);

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

  const handleSendMessage = useCallback(
    async (textMessage, media) => {
      if (!isUnmounting && listRef.current) {
        translateX.value = withTiming(800);
        listRef.current.scrollToOffset({ offset: -300, animated: true });
      }
      stopCurrentUserTyping();
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
        if (reply._id) {
          notifyMessageCreatorIfNotActive(
            reply.createdBy._id,
            group.name,
            group.password,
            reply.media ? reply.media : "",
            reply.message ? reply.message : "",
            newMessage.media ? newMessage.media : "",
            newMessage.message ? newMessage.message : "",
            activeUsers,
            reply.createdBy
          );
        }
        return;
      }
      if (!isUnmounting && canUpdate.current) {
        tackleProblem(problem, data, setInfoAlert);
      }
    },
    [group._id, groupMessages, reply, activeUsers]
  );

  const handleOpenInviteModal = useCallback(() => {
    setShowInviteModal(true);
  }, []);

  // MEDIA SEND ACTIVE CHAT
  const handleSendSelectedMedia = useCallback(
    async (uri) => {
      if (!isUnmounting) {
        setSendingMedia(true);
      }

      const { ok, data, problem } = await usersApi.getUploadedPhoto(uri);
      if (ok && !isUnmounting) {
        handleSendMessage("", data);
        return setSendingMedia(false);
      }
      if (!isUnmounting) {
        setSendingMedia(false);
      }
      if (!isUnmounting && canUpdate.current) {
        tackleProblem(problem, data, setInfoAlert);
      }
    },
    [groupMessages]
  );

  const getEchoMessage = useCallback(
    async (recipient) => {
      showEchoMessage = true;
      if (user._id != recipient._id) {
        usersApi.updatePhotoTapsCount(recipient._id);
      }
      setEchoState({ ...defaultEchoState, visible: true, recipient });
      const { data, problem, ok } = await echosApi.getEcho(recipient._id);
      if (ok && showEchoMessage === true) {
        setEchoState({ recipient, visible: true, echoMessage: data });
      }
    },
    [interestedUser, echoState]
  );

  const handleMessageCreatorImageLongPress = useCallback(
    (recipient) => {
      ReactNativeHapticFeedback.trigger("impactMedium", optionsVibrate);
      setInterestedUser(recipient);
      setShowUserOptions(true);
    },
    [interestedUser]
  );

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
    }
    if (!isUnmounting && canUpdate.current) {
      tackleProblem(problem, data, setInfoAlert);
    }
  }, [group]);

  return (
    <>
      <Screen style={styles.container}>
        <GroupChatHeader
          isFocused={isFocused}
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
                onImagePress={getEchoMessage}
                group={group}
                groupMessages={groupMessages}
                onSelectReply={handleOnSelectReply}
                listRef={listRef}
                onImageLongPress={handleMessageCreatorImageLongPress}
              />
            ) : (
              <AppActivityIndicator
                size={scale(35)}
                color={defaultStyles.colors.white}
              />
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
                    group={group}
                    user={user}
                    deleting={deletingMessage}
                    onDeletePress={deleteMessage}
                    messageLoading={!isReady}
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
      <InvitedUsersContext.Provider value={{ invitedUsers, setInvitedUsers }}>
        <InvitedUserContext.Provider value={{ invitedUser, setInvitedUser }}>
          <InviteUsersModal
            openInviteModal={showInviteModal}
            setOpenInviteModal={setShowInviteModal}
            onChangeInvitePermission={handleChangeInvitePermission}
            changingInvitePermission={changingInvitePermission}
            group={group}
          />
        </InvitedUserContext.Provider>
      </InvitedUsersContext.Provider>
      <LoadingIndicator visible={isLoading} />
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
      <EchoMessageModal
        handleCloseModal={handleCloseEchoModal}
        state={echoState}
      />
      <ReportUserModal
        handleSubmitUserReport={handleSubmitUserReport}
        isLoading={isLoading}
        openUserReport={openUserReport}
        setOpenUserReport={setOpenUserReport}
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
    borderTopLeftRadius: 0,
  },
});

export default GroupChatScreen;
