import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Keyboard, TouchableWithoutFeedback } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { ScaledSheet } from "react-native-size-matters";
import { showMessage } from "react-native-flash-message";

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
import ActiveMessagesContext from "../utilities/activeMessagesContext";
import apiActivity from "../utilities/apiActivity";
import ApiContext from "../utilities/apiContext";
import debounce from "../utilities/debounce";
import defaultProps from "../utilities/defaultProps";
import localThoughts from "../utilities/localThoughts";
import storeDetails from "../utilities/storeDetails";
import filterMessages from "../utilities/filterThoughts";

import defaultStyles from "../config/styles";

import useAuth from "../auth/useAuth";

import thoughtsApi from "../api/thoughts";
import usersApi from "../api/users";

import useMountedRef from "../hooks/useMountedRef";
import useAppState from "../hooks/useAppState";

function SendThoughtsScreen({ navigation, route }) {
  const { user, setUser } = useAuth();
  const { recipient, from } = route.params;
  const { activeFor, setActiveFor } = useContext(ActiveForContext);
  const mounted = useMountedRef().current;
  const isFocused = useIsFocused();
  const { tackleProblem } = apiActivity;
  const appStateVisible = useAppState();

  // STATES
  const [sendingMedia, setSendingMedia] = useState(false);
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
  const { activeMessages, setActiveMessages } = useContext(
    ActiveMessagesContext
  );
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

      setShowAlert(false);
      tackleProblem(problem, data, setInfoAlert);
    },
    5000,
    true
  );

  const stopCurrentUserTyping = useCallback(async () => {
    await usersApi.stopTyping(recipient._id);
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

  // SETTING ACTIVECHATMESSAGES, ACTIVE CHAT TO NULL AND REMOVING THE ACTIVECHAT FOR USER
  useEffect(() => {
    if (mounted) {
      if (activeMessages.length) {
        setActiveMessages([]);
      }

      if (activeChat) {
        setActiveChat(false);
        stopCurrentUserTyping();
      }
    }

    if (!isFocused || appStateVisible !== "active") {
      if (mounted) {
        handleSetChatInActive();
        if (activeMessages.length) {
          setActiveMessages([]);
        }

        if (activeChat === true) {
          setActiveChat(false);
        }
      }
    }
  }, [isFocused, appStateVisible, mounted]);

  useEffect(() => {
    if (!isFocused && mounted && infoAlert.showInfoAlert === true) {
      setInfoAlert({
        infoAlertMessage: "",
        showInfoAlert: true,
      });
    }
  }, [isFocused, mounted]);

  useEffect(() => {
    if (!isFocused && mounted && isVisible === true) {
      setIsVisible(false);
    }
  }, [isFocused, mounted]);

  useEffect(() => {
    if (!isFocused && mounted && showAlert === true) {
      setShowAlert(false);
    }
  }, [isFocused, mounted]);

  useEffect(() => {
    if (!isFocused && mounted && messageActivity.visible === true) {
      setMessageActivity({
        message: "",
        processing: true,
        visible: false,
        success: false,
        echoMessage: null,
      });
    }
  }, [isFocused, mounted]);

  useEffect(() => {
    if (mounted && showAlert === true && isRecipientActive) {
      setShowAlert(false);
    }
  }, [isRecipientActive, showAlert, mounted, isFocused]);
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

  let isRecipientActive = activeFor.filter((u) => u == recipient._id)[0];

  let isBlocked = useMemo(
    () => user.blocked.filter((b) => b._id == recipient._id)[0],
    [recipient._id, user, isFocused]
  );

  let inFavorites = useMemo(
    () => user.favorites.filter((f) => f._id == recipient._id)[0],
    [recipient._id, user, isFocused]
  );

  let inContacts = useMemo(
    () => user.contacts.filter((c) => c._id == recipient._id)[0],
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

        const message = textMessage.trim();
        const messageFor = recipient._id;
        const isVip = user.vip.subscription;

        const { data, problem, ok } = await thoughtsApi.sendThought(
          message,
          messageFor,
          isVip
        );
        if (ok) {
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

        if (data) {
          return setMessageActivity({
            message: data.message,
            processing: false,
            success: false,
            echoMessage: null,
            visible: true,
          });
        }
        return setMessageActivity({
          message: problem,
          processing: false,
          success: false,
          echoMessage: null,
          visible: true,
        });
      },
      1000,
      true
    ),
    [recipient._id, user]
  );

  const handleSendActiveMessage = useCallback(
    async (textMessage, media) => {
      // listRef.current.scrollToEnd({ animated: false });
      stopCurrentUserTyping();
      if (!isRecipientActive && mounted) {
        return setShowAlert(true);
      }
      let newMessage = media
        ? {
            _id:
              Date.now().toString(36) + Math.random().toString(36).substring(2),
            createdAt: new Date(),
            createdBy: user._id,
            createdFor: recipient._id,
            media: media,
          }
        : {
            _id:
              Date.now().toString(36) + Math.random().toString(36).substring(2),
            message: textMessage.trim(),
            createdAt: new Date(),
            createdBy: user._id,
            createdFor: recipient._id,
          };
      if (mounted) {
        activeMessages.push(newMessage);
        setActiveMessages([...activeMessages]);
      }
      const { ok, data, problem } = await usersApi.sendNewActiveMessage(
        newMessage
      );
      if (ok) {
        if (!data.isRecipientActive) {
          let newActiveList = activeFor.filter((u) => u != recipient._id);
          return setActiveFor(newActiveList);
        }
      }
      if (mounted) {
        tackleProblem(problem, data, setInfoAlert);
      }
    },
    [recipient._id, activeMessages, mounted, isRecipientActive]
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
    tackleProblem(problem, data, setInfoAlert);
  }, [user, recipient._id, deleteMessageOption.messageToDelete]);

  //ON FOCUS PAGE ACTION

  useEffect(() => {
    if (isFocused) {
      if (from == Constant.NOTIFICATION_SCREEN && isRecipientActive) {
        return handleSetChatActive();
      } else if (from == Constant.NOTIFICATION_SCREEN) {
        addRecipientToActiveList();
      }
    }
  }, [isFocused, mounted, isRecipientActive]);

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
        tackleProblem(problem, data, setInfoAlert);
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
        tackleProblem(problem, data, setInfoAlert);
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
        tackleProblem(problem, data, setInfoAlert);
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
        tackleProblem(problem, data, setInfoAlert);
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
        tackleProblem(problem, data, setInfoAlert);
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
    if (!isRecipientActive && mounted) {
      setShowAlert(true);
    }
    const { ok } = await usersApi.makeCurrentUserActiveFor(
      recipient._id,
      user._id
    );

    if (ok) return;
    return;
  }, [activeChat, recipient._id, mounted, isFocused]);

  const handleSetChatInActive = async () => {
    if (!activeChat) return;
    setActiveChat(false);

    const { ok } = await usersApi.makeCurrentUserInActiveFor(
      recipient._id,
      user._id
    );

    if (ok) return;
    return;
  };

  const handleSetTyping = useCallback(async () => {
    if (!isRecipientActive && !activeChat) return;

    const { ok, problem } = await usersApi.setTyping(recipient._id);
    if (ok) return;
    if (problem) return;
  }, [recipient._id, isFocused, isRecipientActive]);

  const placeholder = useMemo(() => {
    return activeChat ? `Send direct messages...` : `Send your thoughts...`;
  }, [activeChat, recipient._id]);

  const doNullFunction = useCallback(() => {
    return null;
  }, []);

  // MEDIA SEND ACTIVE CHAT

  const handleSendSelectedMedia = async (uri) => {
    setSendingMedia(true);

    const { ok, data, problem } = await usersApi.getUploadedPhoto(uri);
    if (ok) {
      handleSendActiveMessage("", data);
      return setSendingMedia(false);
    }
    setSendingMedia(false);
    if (problem) tackleProblem(problem, data, setInfoAlert);
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <>
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
            <ThoughtsList
              onLongPress={activeChat ? doNullFunction : handleThoughtLongPress}
              activeChat={activeChat}
              thoughts={activeChat ? activeMessagesList : thoughts}
              recipient={recipient}
            />
            {activeChat && !activeMessagesList.length ? (
              <AppText style={styles.activeChatInfoText}>
                Send direct messages to{" "}
                {recipient.savedName ? recipient.savedName : recipient.name} and
                have an active conversation. These are temporary messages and
                are not stored anywhere, except your device until you refresh
                this chat, visit another one, leave this screen or the app
                becomes inactive.
              </AppText>
            ) : null}
            {!activeChat && !thoughts.length ? (
              <AppText style={styles.activeChatInfoText}>
                Send your thoughts to{" "}
                {recipient.savedName ? recipient.savedName : recipient.name},
                and within 10 minutes if{" "}
                {recipient.savedName ? recipient.savedName : recipient.name}{" "}
                does the same for you, your thoughts will match. You can see all
                your matched thoughts here. You can send only one Thought within
                10 minutes to a single person.
              </AppText>
            ) : null}
            <ApiContext.Provider value={{ sendingMedia, setSendingMedia }}>
              <SendThoughtsInput
                onSendSelectedMedia={handleSendSelectedMedia}
                isFocused={isFocused}
                setTyping={handleSetTyping}
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
              />
            </ApiContext.Provider>
          </ScreenSub>
        </Screen>
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
    </TouchableWithoutFeedback>
  );
}
const styles = ScaledSheet.create({
  activeChatInfoText: {
    alignSelf: "center",
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
  },
});

export default SendThoughtsScreen;
