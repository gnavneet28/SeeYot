import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useContext,
} from "react";
import { View, Keyboard, TouchableWithoutFeedback } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { ScaledSheet } from "react-native-size-matters";

import Alert from "../components/Alert";
import AppHeader from "../components/AppHeader";
import Screen from "../components/Screen";
import SendingThoughtActivity from "../components/SendingThoughtActivity";
import SendThoughtsInput from "../components/SendThoughtsInput";
import SendThoughtsOptionsModal from "../components/SendThoughtsOptionsModal";
import ThoughtsList from "../components/ThoughtsList";

import Constant from "../navigation/NavigationConstants";
import storeDetails from "../utilities/storeDetails";
import localThoughts from "../utilities/localThoughts";

import defaultStyles from "../config/styles";

import useAuth from "../auth/useAuth";

import thoughtsApi from "../api/thoughts";
import usersApi from "../api/users";

import debounce from "../utilities/debounce";
import ActiveForContext from "../utilities/activeForContext";
import InfoAlert from "../components/InfoAlert";
import ActiveMessagesContext from "../utilities/activeMessagesContext";
import apiActivity from "../utilities/apiActivity";
import SuccessMessageContext from "../utilities/successMessageContext";

import useMountedRef from "../hooks/useMountedRef";
import useAppState from "../hooks/useAppState";
import ScreenSub from "../components/ScreenSub";

const filterThoughts = (thoughts = [], recipient, creator) => {
  return thoughts
    .filter(
      (t) =>
        (t.messageFor == recipient._id && t.createdBy == creator._id) ||
        (t.messageFor == creator._id && t.createdBy == recipient._id)
    )
    .sort((a, b) => a.createdAt > b.createdAt);
};

const filterActiveMessages = (messages = [], recipient, creator) => {
  return messages.filter(
    (m) =>
      (m.createdFor == recipient._id && m.createdBy == creator._id) ||
      (m.createdFor == creator._id && m.createdBy == recipient._id)
  );
};

function SendThoughtsScreen({ navigation, route }) {
  const { user, setUser } = useAuth();
  const { recipient, from } = route.params;
  const { activeFor } = useContext(ActiveForContext);
  const { setSuccess } = useContext(SuccessMessageContext);
  const mounted = useMountedRef().current;
  const isFocused = useIsFocused();
  const { tackleProblem, showSucessMessage } = apiActivity;
  const appStateVisible = useAppState();

  // STATES
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
        return showSucessMessage(setSuccess, "Request sent!", 3000);
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
    () => filterThoughts(user.thoughts, recipient, user),
    [isFocused, user, recipient._id, user]
  );

  const activeMessagesList = useMemo(
    () => filterActiveMessages(activeMessages, recipient, user),
    [activeMessages.length, activeMessages]
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
    async (textMessage) => {
      stopCurrentUserTyping();
      if (!isRecipientActive && mounted) {
        return setShowAlert(true);
      }
      let newMessage = {
        _id: Date.now().toString(36) + Math.random().toString(36).substr(2),
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
        return;
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
    if (mounted && isRecipientActive && showAlert) {
      setShowAlert(false);
    }
  }, [isFocused, isRecipientActive]);

  useEffect(() => {
    if (isFocused) {
      if (from == Constant.NOTIFICATION_SCREEN && !isRecipientActive) {
        handleSetChatActive();
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
  }, [activeChat, recipient._id, mounted]);

  const handleSetChatInActive = async () => {
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
    return activeChat
      ? `Send direct messages to ${recipient.name}...`
      : `Send your thoughts to ${recipient.name}...`;
  }, [activeChat, recipient._id]);

  const doNullFunction = useCallback(() => {
    return null;
  }, []);

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <>
        <Screen style={styles.container}>
          <AppHeader
            leftIcon="arrow-back"
            onPressLeft={handleBack}
            onPressRight={handleOptionsPress}
            rightIcon="more-vert"
            title={activeChat ? "Active Chat" : "Thoughts"}
          />
          <ScreenSub>
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
              visible={deleteMessageOption.isVisible}
              title="Delete"
              description="Delete this thought. This action will only delete the thought from your side."
              onRequestClose={handleCloseDeleteMessageModal}
              leftOption="Cancel"
              rightOption="Yes"
              leftPress={handleCloseDeleteMessageModal}
              rightPress={handleDeleteMessage}
            />
            <InfoAlert
              leftPress={handleCloseInfoAlert}
              description={infoAlert.infoAlertMessage}
              visible={infoAlert.showInfoAlert}
            />

            <ThoughtsList
              onLongPress={activeChat ? doNullFunction : handleThoughtLongPress}
              activeChat={activeChat}
              thoughts={activeChat ? activeMessagesList : thoughts}
              recipient={recipient}
            />
            <View style={styles.sendThoughtsInputPlaceholder} />
            <SendThoughtsInput
              isFocused={isFocused}
              setTyping={handleSetTyping}
              placeholder={placeholder}
              activeChat={activeChat}
              isRecipientActive={isRecipientActive}
              onActiveChatSelection={
                activeChat ? handleSetChatInActive : handleSetChatActive
              }
              style={[styles.inputBox]}
              submit={activeChat ? handleSendActiveMessage : handleSendThought}
            />
          </ScreenSub>
        </Screen>
        <SendThoughtsOptionsModal
          isVisible={isVisible}
          isBlocked={isBlocked}
          inContacts={inContacts}
          inFavorites={inFavorites}
          handleModalClose={handleModalClose}
          handleAddFavoritePress={handleAddFavoritePress}
          handleRemoveFavoritePress={handleRemoveFavoritePress}
          handleUnblockPress={handleUnblockPress}
          handleBlockPress={handleBlockPress}
          handleUnfriendPress={handleUnfriendPress}
          favoriteProcessing={favoriteProcessing}
          blockProcessing={blockProcessing}
          unfriendProcessing={unfriendProcessing}
        />
      </>
    </TouchableWithoutFeedback>
  );
}
const styles = ScaledSheet.create({
  container: {
    alignItems: "center",
    //backgroundColor: defaultStyles.colors.white,
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
    bottom: 0,
    position: "absolute",
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
  sendThoughtsInputPlaceholder: {
    height: "50@s",
    width: "100%",
  },
  selectActive: {
    alignItems: "center",
    elevation: 2,
    height: "35@s",
    justifyContent: "center",
    width: "100%",
  },
});

export default SendThoughtsScreen;
