import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useRef,
} from "react";
import {
  Keyboard,
  TouchableWithoutFeedback,
  View,
  TextInput,
} from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { ScaledSheet } from "react-native-size-matters";
import { showMessage } from "react-native-flash-message";
import {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import onBoarding from "../utilities/onBoarding";

import ChatBackgroundSelector from "../components/ChatBackgroundSelector";

import Alert from "../components/Alert";
import AppText from "../components/AppText";
import Screen from "../components/Screen";
import SendingThoughtActivity from "../components/SendingThoughtActivity";
import SendThoughtsInput from "../components/SendThoughtsInput";
import SendThoughtsOptionsModal from "../components/SendThoughtsOptionsModal";
import ThoughtsScreenHeader from "../components/ThoughtsScreenHeader";
import ThoughtsList from "../components/ThoughtsList";
import InfoAlert from "../components/InfoAlert";
import ScreenSub from "../components/ScreenSub";

import Constant from "../navigation/NavigationConstants";

import ActiveForContext from "../utilities/activeForContext";
import apiActivity from "../utilities/apiActivity";
import ApiContext from "../utilities/apiContext";
import debounce from "../utilities/debounce";
import defaultProps from "../utilities/defaultProps";
import localThoughts from "../utilities/localThoughts";
import storeDetails from "../utilities/storeDetails";
import filterMessages from "../utilities/filterThoughts";
import ImageContext from "../utilities/ImageContext";

import defaultStyles from "../config/styles";

import useAuth from "../auth/useAuth";

import thoughtsApi from "../api/thoughts";
import usersApi from "../api/users";

import { SocketContext } from "../api/socketClient";

import useAppState from "../hooks/useAppState";

const defaultReply = {
  message: "",
  media: "",
  createdBy: "",
};

function SendThoughtsScreen({ navigation, route }) {
  const { user, setUser } = useAuth();
  const { recipient, from } = route.params;
  let isUnmounting = false;

  let canShowOnThoughtsScreen = useRef(true);

  const { activeFor, setActiveFor } = useContext(ActiveForContext);
  const isFocused = useIsFocused();
  const { tackleProblem } = apiActivity;
  const appStateVisible = useAppState();
  const listRef = useRef(null);
  const socket = useContext(SocketContext);
  const { onboardingKeys, isInfoSeen, updateInfoSeen } = onBoarding;

  // STATES
  const [showHelp, setShowHelp] = useState(false);
  const [sendingMedia, setSendingMedia] = useState(false);
  const [mediaImage, setMediaImage] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [unfriendProcessing, setUnfriendProcessing] = useState(false);
  const [favoriteProcessing, setFavoriteProcessing] = useState(false);
  const [blockProcessing, setBlockProcessing] = useState(false);
  const [messageActivity, setMessageActivity] = useState({
    message: "",
    processing: true,
    visible: false,
    success: false,
    echoMessage: null,
  });
  const [activeChat, setActiveChat] = useState(false);
  const [activeMessages, setActiveMessages] = useState([]);

  const [infoAlert, setInfoAlert] = useState({
    infoAlertMessage: "",
    showInfoAlert: false,
  });
  const [showAlert, setShowAlert] = useState(false);
  const [deleteMessageOption, setDeleteMessageOption] = useState({
    isVisible: false,
    messageToDelete: null,
    deletingMessage: false,
  });
  const [reply, setReply] = useState({
    message: "",
    media: "",
    createdBy: "",
  });
  const [message, setMessage] = useState("");
  const [hint, setHint] = useState("");
  const [canShowTyping, setCanShowTyping] = useState(false);

  let isRecipientActive = activeFor.filter((u) => u == recipient._id).length;

  useEffect(() => {
    const listener = async (data) => {
      let modifiedMessage = { ...data.newMessage, seen: true };
      activeMessages.push(modifiedMessage);
      setActiveMessages([...activeMessages]);
      await usersApi.setSeen(data.newMessage.secondaryId);
    };
    socket.on(`newActiveMessage${user._id}`, listener);

    return () => {
      socket.off(`newActiveMessage${user._id}`, listener);
    };
  }, [activeMessages]);

  // REPLY ACTIONS

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

  // ALERT ACTION
  const handleCloseAlert = useCallback(() => setShowAlert(false), []);

  const handleSendNewMessageNotification = debounce(
    async () => {
      setShowAlert(false);
      const { ok, data, problem } = await usersApi.notifyUserForActiveChat(
        recipient._id
      );
      if (ok) {
        return showMessage({
          ...defaultProps.alertMessageConfig,
          message: "Request Sent!",
          type: "success",
        });
      }

      if (canShowOnThoughtsScreen.current && !isUnmounting) {
        setShowAlert(false);
        tackleProblem(problem, data, setInfoAlert);
      }
    },
    5000,
    true
  );

  const stopCurrentUserTyping = useCallback(async () => {
    usersApi.stopTyping(recipient._id);
  }, [recipient._id, isFocused]);

  // ON FOCUS CHECK ADD RECIPIENT TO ACTIVE USERSLIST IF RECIPIENT ACTIVE FOR CURRENT USER AND USER HAS COME FROM NOTIFICATION

  const addRecipientToActiveList = async () => {
    const { ok, data, problem } = await usersApi.getUserActiveForMe(
      recipient._id
    );
    if (ok && !isRecipientActive) {
      return setActiveFor([...activeFor, recipient._id]);
    }
    if (problem) return;
  };

  //OnUnmount;

  useEffect(() => {
    return () => {
      isUnmounting = true;
    };
  }, []);

  useEffect(() => {
    if (isFocused && !isUnmounting && !canShowOnThoughtsScreen.current) {
      canShowOnThoughtsScreen.current = true;
    } else if (!isFocused && !isUnmounting) {
      canShowOnThoughtsScreen.current = false;
    }
  }, [isFocused]);

  // SETTING ACTIVECHATMESSAGES, ACTIVE CHAT TO NULL AND REMOVING THE ACTIVECHAT FOR USER
  useEffect(() => {
    if (!isUnmounting) {
      setReply(defaultReply);
      if (activeMessages.length) {
        setActiveMessages([]);
      }

      if (activeChat) {
        setActiveChat(false);
        stopCurrentUserTyping();
      }
    }

    if (!isFocused || appStateVisible !== "active") {
      if (!isUnmounting) {
        handleSetChatInActive();
        if (activeMessages.length) {
          setActiveMessages([]);
        }

        if (activeChat === true) {
          setActiveChat(false);
        }
      }
    }
  }, [isFocused, appStateVisible]);

  useEffect(() => {
    if (!isFocused && !isUnmounting && infoAlert.showInfoAlert === true) {
      setInfoAlert({
        infoAlertMessage: "",
        showInfoAlert: true,
      });
    }
  }, [isFocused]);

  useEffect(() => {
    if (!isFocused && !isUnmounting && isVisible === true) {
      setIsVisible(false);
    }
  }, [isFocused]);

  useEffect(() => {
    if (!isFocused && !isUnmounting && showAlert === true) {
      setShowAlert(false);
    }
  }, [isFocused]);

  useEffect(() => {
    if (!isFocused && !isUnmounting && messageActivity.visible === true) {
      setMessageActivity({
        message: "",
        processing: true,
        visible: false,
        success: false,
        echoMessage: null,
      });
    }
  }, [isFocused]);

  useEffect(() => {
    if (!isUnmounting && isRecipientActive) {
      setShowAlert(false);
    }
  }, [isRecipientActive, isFocused]);
  // HEADER ACTIONS
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

  const handleOptionsPress = useCallback(() => {
    setIsVisible(true);
  }, []);

  // SENDING ACTIVITY ACTIONS
  const handleSendingActivityClose = useCallback(
    () => setMessageActivity({ ...messageActivity, visible: false }),
    []
  );

  // INFO ALERT ACTION
  const handleCloseInfoAlert = useCallback(
    () => setInfoAlert({ ...infoAlert, showInfoAlert: false }),
    []
  );

  // INFORMATION IN NEED

  let isBlocked = useMemo(
    () => user.blocked.filter((b) => b._id == recipient._id).length,
    [recipient._id, user, isFocused]
  );

  let inFavorites = useMemo(
    () => user.favorites.filter((f) => f._id == recipient._id).length,
    [recipient._id, user, isFocused]
  );

  let inContacts = useMemo(
    () => user.contacts.filter((c) => c._id == recipient._id).length,
    [recipient._id, user, isFocused]
  );

  // THOUGHTS LIST ACTION
  let thoughts = useMemo(
    () => filterMessages.filterThoughts(user.thoughts, recipient, user),
    [isFocused, user, recipient._id, user]
  );

  const activeMessagesList = useMemo(
    () => filterMessages.filterActiveMessages(activeMessages, recipient, user),
    [activeMessages.length, activeMessages, recipient._id]
  );

  //TODO
  // SENDING THOUGHTS ACTION
  const handleSendThought = useCallback(
    debounce(
      async (textMessage) => {
        setMessageActivity({
          echoMessage: null,
          message: "Sending your thought...",
          processing: true,
          success: false,
          visible: true,
        });

        setHint("");

        const message = textMessage.trim();
        const messageFor = recipient._id;
        const isVip = user.vip.subscription;
        const hintProvided = hint.trim();

        const { data, problem, ok } = await thoughtsApi.sendThought(
          message,
          messageFor,
          isVip,
          hintProvided
        );
        if (ok && !isUnmounting && canShowOnThoughtsScreen.current) {
          if (recipient._id != user._id) {
            usersApi.updateReceivedThoughtsCount(recipient._id);
          }
          if (!data.matched) {
            await localThoughts.storeLoacalThoughts(
              data.thoughtData.thought,
              recipient,
              data.thoughtData.key
            );
          }
          if (!(await isInfoSeen(onboardingKeys.THOUGHT_HISTORY))) {
            setShowHelp(true);
            updateInfoSeen(onboardingKeys.THOUGHT_HISTORY);
          }

          return setMessageActivity({
            message: data.matched
              ? "Congrats! Your thoughts matched"
              : "Thought sent!",
            processing: false,
            success: true,
            visible: true,
            echoMessage: data.echoMessage ? data.echoMessage : null,
          });
        }

        if (data && !isUnmounting && canShowOnThoughtsScreen.current) {
          return setMessageActivity({
            message: data.message,
            processing: false,
            success: false,
            echoMessage: null,
            visible: true,
          });
        }
        if (!isUnmounting && canShowOnThoughtsScreen.current) {
          return setMessageActivity({
            message: problem,
            processing: false,
            success: false,
            echoMessage: null,
            visible: true,
          });
        }
      },
      1000,
      true
    ),
    [recipient._id, user, hint]
  );

  const handleSendActiveMessage = useCallback(
    async (textMessage, media) => {
      if (!isUnmounting && listRef.current) {
        translateX.value = withTiming(800);
        listRef.current.scrollToOffset({ offset: -300, animated: true });
      }
      stopCurrentUserTyping();
      if (
        !isRecipientActive &&
        !isUnmounting &&
        canShowOnThoughtsScreen.current
      ) {
        return setShowAlert(true);
      }
      let newId =
        Date.now().toString(36) + Math.random().toString(36).substring(2);
      let newMessage = media
        ? {
            _id: newId,
            secondaryId: newId,
            createdAt: new Date(),
            createdBy: user._id,
            createdFor: recipient._id,
            media: media,
            reply: reply,
            seen: false,
          }
        : {
            _id: newId,
            secondaryId: newId,
            message: textMessage.trim(),
            createdAt: new Date(),
            createdBy: user._id,
            createdFor: recipient._id,
            seen: false,
            reply: reply,
          };
      if (!isUnmounting) {
        activeMessages.push(newMessage);
        setActiveMessages([...activeMessages]);
        if (reply.createdBy) {
          setReply({
            message: "",
            media: "",
            createdBy: "",
          });
        }
      }
      const { ok, data, problem } = await usersApi.sendNewActiveMessage(
        newMessage
      );
      if (ok && !isUnmounting) {
        if (!data.isRecipientActive) {
          let newActiveList = activeFor.filter((u) => u != recipient._id);
          return setActiveFor(newActiveList);
        }
      }
      if (!isUnmounting && canShowOnThoughtsScreen) {
        tackleProblem(problem, data, setInfoAlert);
      }
    },
    [
      recipient._id,
      activeMessages,
      activeFor,
      isRecipientActive,
      reply,
      mediaImage,
    ]
  );

  const handleThoughtLongPress = useCallback((thought) => {
    setDeleteMessageOption({
      isVisible: true,
      messageToDelete: thought,
      deletingMessage: false,
    });
  }, []);

  const handleDeleteMessage = useCallback(async () => {
    setDeleteMessageOption({
      ...deleteMessageOption,
      deletingMessage: true,
    });

    const { data, ok, problem } = await thoughtsApi.deleteThought(
      deleteMessageOption.messageToDelete._id
    );
    if (ok) {
      await storeDetails(data.user);
      setUser(data.user);
      return setDeleteMessageOption({
        isVisible: false,
        messageToDelete: null,
        deletingMessage: false,
      });
    }

    setDeleteMessageOption({
      messageToDelete: null,
      isVisible: false,
      deletingMessage: false,
    });
    if (canShowOnThoughtsScreen.current) {
      tackleProblem(problem, data, setInfoAlert);
    }
  }, [user, recipient._id, deleteMessageOption.messageToDelete]);

  //ON FOCUS PAGE ACTION

  useEffect(() => {
    if (isFocused) {
      if (isRecipientActive) {
        handleSetChatActive();
      } else if (from == Constant.NOTIFICATION_SCREEN) {
        addRecipientToActiveList();
      } else if (from == "Favorite") {
        handleSetChatActive();
      }
    }
  }, [isFocused, isRecipientActive]);

  // OPTIONS MODAL ACTIONS
  const handleModalClose = useCallback(() => setIsVisible(false), []);

  const handleUnfriendPress = useCallback(
    debounce(
      async () => {
        setUnfriendProcessing(true);

        const { ok, data, problem } = await usersApi.removeContact(
          recipient._id
        );

        if (ok) {
          await storeDetails(data.user);
          setUser(data.user);
          return setUnfriendProcessing(false);
        }

        setUnfriendProcessing(false);
        if (canShowOnThoughtsScreen.current) {
          tackleProblem(problem, data, setInfoAlert);
        }
      },
      1000,
      true
    ),
    [recipient._id, user.contacts.length, user.blocked.length, isFocused, user]
  );

  const handleBlockPress = useCallback(
    debounce(
      async () => {
        setBlockProcessing(true);

        const { ok, data, problem } = await usersApi.blockContact(
          recipient._id
        );

        if (ok) {
          await storeDetails(data.user);
          setUser(data.user);
          return setBlockProcessing(false);
        }
        setBlockProcessing(false);
        if (canShowOnThoughtsScreen.current) {
          tackleProblem(problem, data, setInfoAlert);
        }
      },
      1000,
      true
    ),
    [recipient._id, user.blocked.length, user.contacts.length, isFocused, user]
  );

  const handleUnblockPress = useCallback(
    debounce(
      async () => {
        setBlockProcessing(true);

        const { ok, data, problem } = await usersApi.unBlockContact(
          recipient._id
        );

        if (ok) {
          await storeDetails(data.user);
          setUser(data.user);
          return setBlockProcessing(false);
        }

        setBlockProcessing(false);
        if (canShowOnThoughtsScreen.current) {
          tackleProblem(problem, data, setInfoAlert);
        }
      },
      1000,
      true
    ),
    [recipient._id, user.blocked.length, user.contacts.length, isFocused, user]
  );

  const handleAddFavoritePress = useCallback(
    debounce(
      async () => {
        setFavoriteProcessing(true);

        const { data, ok, problem } = await usersApi.addFavorite(recipient._id);

        if (ok) {
          await storeDetails(data.user);
          setUser(data.user);
          return setFavoriteProcessing(false);
        }

        setFavoriteProcessing(false);
        if (canShowOnThoughtsScreen.current) {
          tackleProblem(problem, data, setInfoAlert);
        }
      },
      1000,
      true
    ),
    [user, recipient._id, user.favorites.length]
  );

  const handleRemoveFavoritePress = useCallback(
    debounce(
      async () => {
        setFavoriteProcessing(true);

        const { ok, data, problem } = await usersApi.removeFavorite(
          recipient._id
        );

        if (ok) {
          await storeDetails(data.user);
          setUser(data.user);
          return setFavoriteProcessing(false);
        }

        setFavoriteProcessing(false);
        if (canShowOnThoughtsScreen.current) {
          tackleProblem(problem, data, setInfoAlert);
        }
      },
      1000,
      true
    ),
    [user]
  );

  const handleCloseDeleteMessageModal = useCallback(() => {
    setDeleteMessageOption({
      isVisible: false,
      messageToDelete: "",
      deletingMessage: false,
    });
  }, []);

  // CHANGING THE CHAT ACTIVE STATUS

  const handleSetChatActive = useCallback(async () => {
    if (activeChat && isRecipientActive) return;
    setActiveChat(true);
    if (!isRecipientActive && !isUnmounting) {
      setShowAlert(true);
    }
    const { ok } = await usersApi.makeCurrentUserActiveFor(
      recipient._id,
      user._id
    );

    if (ok) return;
    return;
  }, [activeChat, recipient._id, isFocused, isRecipientActive]);

  const handleSetChatInActive = async () => {
    if (!activeChat) return;
    if (!isUnmounting) {
      setActiveChat(false);
    }

    const { ok } = await usersApi.makeCurrentUserInActiveFor(
      recipient._id,
      user._id
    );

    if (ok) return;
    return;
  };

  const resetTypeTime = () => {
    if (!isUnmounting) {
      setCanShowTyping(false);
    }
  };

  const handleSetTyping = useCallback(async () => {
    if (!isRecipientActive && !activeChat) return;
    if (canShowTyping) return;

    setCanShowTyping(true);

    // This will not work when the page actually unmounts
    setTimeout(() => {
      resetTypeTime();
    }, 2000);

    const { ok, problem } = await usersApi.setTyping(recipient._id);
    if (ok) return;
    if (problem) return;
  }, [recipient._id, isFocused, isRecipientActive, canShowTyping]);

  const placeholder = useMemo(() => {
    return activeChat ? `Send direct messages...` : `Send your thoughts...`;
  }, [activeChat, recipient._id]);

  const doNullFunction = useCallback(() => {
    return null;
  }, []);

  // MEDIA SEND ACTIVE CHAT

  const handleSendSelectedMedia = useCallback(
    async (uri) => {
      if (!isUnmounting) {
        setSendingMedia(true);
      }

      const { ok, data, problem } = await usersApi.getUploadedPhoto(uri);
      if (ok && !isUnmounting) {
        handleSendActiveMessage("", data);
        return setSendingMedia(false);
      }
      setSendingMedia(false);
      if (problem && canShowOnThoughtsScreen.current)
        tackleProblem(problem, data, setInfoAlert);
    },
    [activeMessages, mediaImage, isUnmounting]
  );

  return (
    <>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <Screen style={styles.container}>
          <ThoughtsScreenHeader
            activeChat={activeChat}
            imageUrl={recipient.picture}
            isRecipientActive={isRecipientActive}
            name={recipient.name}
            onActiveChatModePress={handleSetChatActive}
            onOptionPress={handleOptionsPress}
            onPress={handleBack}
            onThoughtsModePress={handleSetChatInActive}
          />
          <ScreenSub style={styles.screenSub}>
            <ChatBackgroundSelector activeChat={activeChat}>
              <ThoughtsList
                listRef={listRef}
                onLongPress={
                  activeChat ? doNullFunction : handleThoughtLongPress
                }
                activeChat={activeChat}
                thoughts={activeChat ? activeMessagesList : thoughts}
                recipient={recipient}
                onSelectReply={handleOnSelectReply}
              />
              {activeChat && !activeMessagesList.length ? (
                <AppText style={styles.activeChatInfoText}>
                  Send direct messages to{" "}
                  {recipient.savedName ? recipient.savedName : recipient.name}{" "}
                  and have an active conversation. These are temporary messages
                  and are not stored anywhere, except your device until you
                  refresh this chat, visit another one, leave this screen or the
                  app becomes inactive.
                </AppText>
              ) : null}
              {!activeChat && thoughts.length < 5 ? (
                <AppText style={styles.thoughtInfoText}>
                  Send your thoughts to{" "}
                  {recipient.savedName ? recipient.savedName : recipient.name},
                  and within 10 minutes if{" "}
                  {recipient.savedName ? recipient.savedName : recipient.name}{" "}
                  does the same for you, your thoughts will match. You can see
                  all your matched thoughts here. You can send only one Thought
                  within 10 minutes to a single person.
                </AppText>
              ) : null}
              {!activeChat && message.replace(/\s/g, "").length >= 1 ? (
                <View style={styles.hintContainer}>
                  <TextInput
                    maxLength={100}
                    onChangeText={setHint}
                    placeholder="Add a hint..."
                    placeholderTextColor={defaultStyles.colors.white}
                    style={styles.hintInput}
                    value={hint}
                  />
                </View>
              ) : null}
              {isFocused ? (
                <ApiContext.Provider value={{ sendingMedia, setSendingMedia }}>
                  <ImageContext.Provider value={{ mediaImage, setMediaImage }}>
                    <SendThoughtsInput
                      rStyle={rStyle}
                      recipient={recipient}
                      reply={reply}
                      onRemoveReply={handleRemoveReply}
                      onSendSelectedMedia={handleSendSelectedMedia}
                      isFocused={isFocused}
                      setTyping={handleSetTyping}
                      message={message}
                      setMessage={setMessage}
                      placeholder={placeholder}
                      activeChat={activeChat}
                      isRecipientActive={isRecipientActive}
                      onActiveChatSelection={
                        activeChat ? handleSetChatInActive : handleSetChatActive
                      }
                      style={[styles.inputBox]}
                      submit={
                        activeChat ? handleSendActiveMessage : handleSendThought
                      }
                      historyTip="See sent thoughts that did not match or delete before getting matched."
                      showTip={showHelp}
                      setShowTip={setShowHelp}
                      onCameraImageSelection={handleSendSelectedMedia}
                    />
                  </ImageContext.Provider>
                </ApiContext.Provider>
              ) : null}
            </ChatBackgroundSelector>
          </ScreenSub>
        </Screen>
      </TouchableWithoutFeedback>
      <SendingThoughtActivity
        echoMessage={messageActivity.echoMessage}
        message={messageActivity.message}
        onDoneButtonPress={handleSendingActivityClose}
        onRequestClose={handleSendingActivityClose}
        processing={messageActivity.processing}
        success={messageActivity.success}
        visible={messageActivity.visible}
      />
      <Alert
        visible={showAlert}
        title="Not Active"
        description={`${
          recipient.savedName ? recipient.savedName : recipient.name
        } is not active for you right now. Send a notification requesting to come online.`}
        onRequestClose={handleCloseAlert}
        leftOption="Cancel"
        rightOption="Yes"
        leftPress={handleCloseAlert}
        rightPress={handleSendNewMessageNotification}
      />
      <Alert
        apiProcessing={deleteMessageOption.deletingMessage}
        description="Delete this thought. This action will delete the thought only from your side."
        leftOption="Cancel"
        leftPress={handleCloseDeleteMessageModal}
        onRequestClose={handleCloseDeleteMessageModal}
        rightOption="Yes"
        rightPress={handleDeleteMessage}
        title="Delete"
        visible={deleteMessageOption.isVisible}
      />

      <InfoAlert
        description={infoAlert.infoAlertMessage}
        leftPress={handleCloseInfoAlert}
        visible={infoAlert.showInfoAlert}
      />
      <SendThoughtsOptionsModal
        blockProcessing={blockProcessing}
        favoriteProcessing={favoriteProcessing}
        handleAddFavoritePress={handleAddFavoritePress}
        handleBlockPress={handleBlockPress}
        handleModalClose={handleModalClose}
        handleRemoveFavoritePress={handleRemoveFavoritePress}
        handleUnblockPress={handleUnblockPress}
        handleUnfriendPress={handleUnfriendPress}
        inContacts={inContacts}
        inFavorites={inFavorites}
        isBlocked={isBlocked}
        isVisible={isVisible}
        unfriendProcessing={unfriendProcessing}
      />
    </>
  );
}
const styles = ScaledSheet.create({
  activeChatInfoText: {
    alignSelf: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
    color: defaultStyles.colors.white,
    fontSize: "13@s",
    marginTop: "20@s",
    textAlign: "center",
    width: "80%",
  },
  thoughtInfoText: {
    alignSelf: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
    borderRadius: "5@s",
    color: defaultStyles.colors.white,
    fontSize: "13@s",
    marginTop: "20@s",
    textAlign: "center",
    width: "80%",
  },
  container: {
    alignItems: "center",
  },
  modalMainContainer: {
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.8)",
    flex: 1,
    justifyContent: "center",
    width: "100%",
  },
  hintContainer: {
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: "5@s",
    justifyContent: "center",
    marginBottom: "2@s",
    padding: "10@s",
    width: "90%",
  },
  hintInput: {
    color: defaultStyles.colors.white,
    fontFamily: "ComicNeue-Bold",
    fontSize: "12@s",
    fontStyle: "normal",
    fontWeight: "normal",
    width: "100%",
  },
  imageBackground: {
    alignItems: "center",
    flex: 1,
    height: "100%",
    width: "100%",
  },
  inputBox: {
    marginVertical: "5@s",
  },
  optionsContainer: {
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
  selectActive: {
    alignItems: "center",
    elevation: 2,
    height: "35@s",
    justifyContent: "center",
    width: "100%",
  },
  screenSub: {
    borderTopRightRadius: 0,
    borderTopLeftRadius: 0,
    flex: 1,
    backgroundColor: "red",
  },
});

export default SendThoughtsScreen;
