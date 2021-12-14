import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useContext,
} from "react";
import { View, Modal } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { ScaledSheet } from "react-native-size-matters";

import ApiActivity from "../components/ApiActivity";
import Alert from "../components/Alert";
import AppHeader from "../components/AppHeader";
import Option from "../components/Option";
import Screen from "../components/Screen";
import SendingThoughtActivity from "../components/SendingThoughtActivity";
import SendThoughtsInput from "../components/SendThoughtsInput";
import ThoughtsList from "../components/ThoughtsList";
import ThoughtTimer from "../components/ThoughtTimer";

import Constant from "../navigation/NavigationConstants";
import DataConstants from "../utilities/DataConstants";

import defaultStyles from "../config/styles";

import useAuth from "../auth/useAuth";

import thoughtsApi from "../api/thoughts";
import usersApi from "../api/users";

import apiFlow from "../utilities/ApiActivityStatus";
import asyncStorage from "../utilities/cache";
import debounce from "../utilities/debounce";
import ActiveForContext from "../utilities/activeForContext";
import InfoAlert from "../components/InfoAlert";
import ActiveMessagesContext from "../utilities/activeMessagesContext";

import useMountedRef from "../hooks/useMountedRef";

const filterThoughts = (thoughts = [], recipient, creator) => {
  return thoughts
    .filter(
      (t) =>
        (t.messageFor == recipient._id &&
          t.createdBy == creator._id &&
          t.matched == true) ||
        (t.messageFor == creator._id &&
          t.createdBy == recipient._id &&
          t.matched == true)
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
  const { apiActivityStatus, initialApiActivity } = apiFlow;
  const { activeFor, setActiveFor } = useContext(ActiveForContext);
  const mounted = useMountedRef().current;
  const isFocused = useIsFocused();

  // STATES
  const [isVisible, setIsVisible] = useState(false);
  const [apiActivity, setApiActivity] = useState({
    message: "",
    processing: true,
    visible: false,
    success: false,
  });
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

  // ALERT ACTION

  const handleCloseAlert = useCallback(() => setShowAlert(false), []);

  const handleSendNewMessageNotification = async () => {
    const { ok, data, problem } = await usersApi.notifyUserForActiveChat(
      recipient._id
    );
    if (ok) {
      return setShowAlert(false);
    }

    setShowAlert(false);
    if (data) {
      return setInfoAlert({
        infoAlertMessage: data.message,
        showInfoAlert: true,
      });
    }

    return setInfoAlert({
      infoAlertMessage: problem,
      showInfoAlert: true,
    });
  };

  // SETTING ACTIVECHATMESSAGES, ACTIVE CHAT TO NULL AND REMOVING THE ACTIVECHAT FOR USER
  useEffect(() => {
    setActiveMessages([]);
    setActiveChat(false);

    if (!isFocused) {
      handleSetChatInActive();
    }
  }, [isFocused]);

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
    if (!isFocused && mounted && apiActivity.visible === true) {
      setApiActivity({
        message: "",
        processing: true,
        visible: false,
        success: false,
      });
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

  // API ACTIVITY ACTIONS
  const handleApiActivityClose = useCallback(
    () => setApiActivity({ ...apiActivity, visible: false }),
    []
  );

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
  const thoughts = useMemo(
    () => filterThoughts(user.thoughts, recipient, user),
    [isFocused, user.thoughts.length, recipient._id, user.thoughts]
  );

  const activeMessagesList = useMemo(
    () => filterActiveMessages(activeMessages, recipient, user),
    [isFocused, activeMessages.length, recipient._id, activeMessages]
  );

  const latestThought = useMemo(
    () =>
      user.thoughts.filter(
        (t) => t.messageFor == recipient._id && t.matched !== true
      )[
        user.thoughts.filter(
          (t) => t.messageFor == recipient._id && t.matched !== true
        ).length - 1
      ],
    [isFocused, user.thoughts, recipient._id]
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

        const message = textMessage;
        const messageFor = recipient._id;

        const { data, problem, ok } = await thoughtsApi.sendThought(
          message,
          messageFor
        );
        if (ok) {
          if (!data.matched) {
            let modifiedUser = { ...user };
            modifiedUser.thoughts = data.thoughts;
            setUser(modifiedUser);
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
    [recipient._id, user.thoughts]
  );

  const handleSendActiveMessage = async (textMessage) => {
    if (!isRecipientActive) {
      return setShowAlert(true);
    }
    let newMessage = {
      _id: Date.now().toString(36) + Math.random().toString(36).substr(2),
      message: textMessage,
      createdAt: new Date(),
      createdBy: user._id,
      createdFor: recipient._id,
    };
    const response = await usersApi.sendNewActiveMessage(newMessage);
    if (response.ok) {
      return setActiveMessages([...activeMessages, newMessage]);
    }

    if (response.problem)
      return setInfoAlert({
        infoAlertMessage: "Something went wrong! Please try again.",
        showInfoAlert: true,
      });
  };

  // ON FOCUS PAGE ACTION
  const updateSearchHistory = async () => {
    let modifiedUser = { ...user };
    const { ok, data, problem } = await usersApi.addToSearchHistory(
      recipient._id
    );
    if (ok) {
      modifiedUser.searchHistory = data;
      setUser(modifiedUser);
      return await asyncStorage.store(DataConstants.SEARCH_HISTORY, data);
    } else return;
  };

  useEffect(() => {
    if (isFocused) {
      if (from == Constant.VIP_SEARCH_SCREEN) {
        updateSearchHistory();
      }
    }
  }, [isFocused]);

  // OPTIONS MODAL ACTIONS
  const handleModalClose = useCallback(() => setIsVisible(false), []);

  const handleUnfriendPress = useCallback(
    debounce(
      async () => {
        initialApiActivity(
          setApiActivity,
          `Removing ${recipient.name} from your friendlist...`
        );

        let modifiedUser = { ...user };

        const response = await usersApi.removeContact(recipient._id);

        if (response.ok) {
          modifiedUser.contacts = response.data.contacts;
          await asyncStorage.store(
            DataConstants.CONTACTS,
            response.data.contacts
          );
          setUser(modifiedUser);
        }

        return apiActivityStatus(response, setApiActivity);
      },
      1000,
      true
    ),
    [recipient._id, user.contacts.length, user.blocked.length, isFocused, user]
  );

  const handleBlockPress = useCallback(
    debounce(
      async () => {
        initialApiActivity(setApiActivity, `Blocking ${recipient.name} ...`);

        let modifiedUser = { ...user };
        const response = await usersApi.blockContact(recipient._id);

        if (response.ok) {
          modifiedUser.blocked = response.data.blocked;
          await asyncStorage.store(
            DataConstants.BLOCKED,
            response.data.blocked
          );
          setUser(modifiedUser);
        }

        return apiActivityStatus(response, setApiActivity);
      },
      1000,
      true
    ),
    [recipient._id, user.blocked.length, user.contacts.length, isFocused, user]
  );

  const handleUnblockPress = useCallback(
    debounce(
      async () => {
        initialApiActivity(setApiActivity, `Unblocking ${recipient.name} ...`);

        let modifiedUser = { ...user };
        const response = await usersApi.unBlockContact(recipient._id);

        if (response.ok) {
          modifiedUser.blocked = response.data.blocked;
          await asyncStorage.store(
            DataConstants.BLOCKED,
            response.data.blocked
          );
          setUser(modifiedUser);
        }

        return apiActivityStatus(response, setApiActivity);
      },
      1000,
      true
    ),
    [recipient._id, user.blocked.length, user.contacts.length, isFocused, user]
  );

  const handleAddFavoritePress = useCallback(
    debounce(
      async () => {
        initialApiActivity(
          setApiActivity,
          "Adding" + " " + recipient.name + "..."
        );

        let modifiedUser = { ...user };

        const response = await usersApi.addFavorite(recipient._id);

        if (response.ok) {
          modifiedUser.favorites = response.data.favorites;
          setUser(modifiedUser);
          await asyncStorage.store(
            DataConstants.FAVORITES,
            response.data.favorites
          );
        }

        return apiActivityStatus(response, setApiActivity);
      },
      1000,
      true
    ),
    [user, recipient._id, user.favorites.length]
  );

  const handleRemoveFavoritePress = useCallback(
    debounce(
      async () => {
        initialApiActivity(
          setApiActivity,
          "Removing" + " " + recipient.name + "..."
        );

        let modifiedUser = { ...user };

        const response = await usersApi.removeFavorite(recipient._id);

        if (response.ok) {
          modifiedUser.favorites = response.data.favorites;
          setUser(modifiedUser);
          await asyncStorage.store(
            DataConstants.FAVORITES,
            response.data.favorites
          );
        }

        return apiActivityStatus(response, setApiActivity);
      },
      1000,
      true
    ),
    [user]
  );

  // CHANGING THE CHAT ACTIVE STATUS

  const handleSetChatActive = async () => {
    setActiveChat(true);
    const { ok } = await usersApi.makeCurrentUserActiveFor(
      recipient._id,
      user._id
    );

    if (ok) return;
    return;
  };

  const handleSetChatInActive = async () => {
    setActiveChat(false);

    const { ok } = await usersApi.makeCurrentUserInActiveFor(
      recipient._id,
      user._id
    );

    if (ok) return;
    return;
  };

  return (
    <>
      <Screen style={styles.container}>
        <AppHeader
          leftIcon="arrow-back"
          onPressLeft={handleBack}
          onPressRight={handleOptionsPress}
          rightIcon="more-vert"
          title="Thoughts"
        />
        {latestThought ? <ThoughtTimer thought={latestThought} /> : null}
        <SendingThoughtActivity
          echoMessage={messageActivity.echoMessage}
          message={messageActivity.message}
          onDoneButtonPress={handleSendingActivityClose}
          onRequestClose={handleSendingActivityClose}
          processing={messageActivity.processing}
          success={messageActivity.success}
          visible={messageActivity.visible}
        />
        <ApiActivity
          message={apiActivity.message}
          onDoneButtonPress={handleApiActivityClose}
          onRequestClose={handleApiActivityClose}
          processing={apiActivity.processing}
          success={apiActivity.success}
          visible={apiActivity.visible}
        />
        <Alert
          visible={showAlert}
          title="Not Active"
          description={`${recipient.name} is not active for you right now.Send a notification requesting to come online.`}
          onRequestClose={handleCloseAlert}
          leftOption="Cancel"
          rightOption="Yes"
          leftPress={handleCloseAlert}
          rightPress={handleSendNewMessageNotification}
        />
        <InfoAlert
          leftPress={handleCloseInfoAlert}
          description={infoAlert.infoAlertMessage}
          visible={infoAlert.showInfoAlert}
        />

        <ThoughtsList
          activeChat={activeChat}
          thoughts={activeChat ? activeMessagesList : thoughts}
          recipient={recipient}
        />
        <View style={styles.sendThoughtsInputPlaceholder} />
        <SendThoughtsInput
          placeholder={
            activeChat ? "Send direct messages..." : "Send your thoughts..."
          }
          activeChat={activeChat}
          isRecipientActive={isRecipientActive}
          onActiveChatSelection={
            activeChat ? handleSetChatInActive : handleSetChatActive
          }
          style={[styles.inputBox]}
          submit={activeChat ? handleSendActiveMessage : handleSendThought}
        />
      </Screen>
      <Modal
        onRequestClose={handleModalClose}
        transparent={true}
        visible={isVisible}
      >
        <View style={styles.contactOptionMainContainer}>
          <View style={styles.optionsContainer}>
            <Option
              title="Close"
              titleStyle={styles.closeOption}
              onPress={handleModalClose}
            />

            {inContacts ? (
              <Option title="Unfriend" onPress={handleUnfriendPress} />
            ) : null}

            <Option
              title={inFavorites ? "Remove from Favorites" : "Add to Favorites"}
              onPress={
                !inFavorites
                  ? handleAddFavoritePress
                  : handleRemoveFavoritePress
              }
            />

            <Option
              title={isBlocked ? "Unblock" : "Block"}
              onPress={!isBlocked ? handleBlockPress : handleUnblockPress}
            />
          </View>
        </View>
      </Modal>
    </>
  );
}
const styles = ScaledSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.primary,
  },
  contactOptionMainContainer: {
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
    bottom: "8@s",
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
    height: "54@s",
    width: "100%",
  },
});

export default SendThoughtsScreen;
