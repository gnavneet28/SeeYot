import React, { useState, useEffect, useCallback } from "react";
import { useIsFocused } from "@react-navigation/native";
import { ScaledSheet } from "react-native-size-matters";
import { showMessage } from "react-native-flash-message";

import AddFavoriteList from "../components/AddFavoriteList";
import FavoriteOptionsModal from "../components/FavoriteOptionsModal";
import AppActivityIndicator from "../components/ActivityIndicator";
import AppHeader from "../components/AppHeader";
import FavoriteMessageInput from "../components/FavoriteMessageInput";
import InfoAlert from "../components/InfoAlert";
import Screen from "../components/Screen";
import ModalFallback from "../components/ModalFallback";

import useAuth from "../auth/useAuth";
import messagesApi from "../api/messages";
import usersApi from "../api/users";

import useMountedRef from "../hooks/useMountedRef";
import useConnection from "../hooks/useConnection";

import Constants from "../navigation/NavigationConstants";

import debounce from "../utilities/debounce";
import ApiContext from "../utilities/apiContext";
import apiActivity from "../utilities/apiActivity";
import ScreenSub from "../components/ScreenSub";
import defaultProps from "../utilities/defaultProps";
import onBoarding from "../utilities/onBoarding";
import defaultStyles from "../config/styles";

const defaultRecipient = {
  name: "",
  _id: "",
};

const moodData = [
  { mood: "Happy" },
  { mood: "Sad" },
  { mood: "Furious" },
  { mood: "Confused" },
  { mood: "Love" },
];

function AddFavoritesScreen({ navigation }) {
  const { user } = useAuth();
  const isFocused = useIsFocused();
  const mounted = useMountedRef().current;
  const isConnected = useConnection();
  const { tackleProblem } = apiActivity;
  const { onboardingKeys, isInfoSeen, updateInfoSeen } = onBoarding;
  // STATES
  const [isVisible, setIsVisible] = useState(false);
  const [message, setMessage] = useState({
    textMessage: "",
    mood: "Happy",
  });
  const [recipient, setRecipient] = useState(defaultRecipient);
  const [isReady, setIsReady] = useState(false);
  const [users, setUsers] = useState([]);
  const [showHelp, setShowHelp] = useState(false);
  const [optionalAnswer, setOptionalAnswer] = useState([]);
  const [showAddoption, setShowAddOption] = useState(false);
  const [optionalMessage, setOptionalMessage] = useState("");
  const [processing, setProcessing] = useState(false);
  const [apiProcessing, setApiProcessing] = useState(false);
  const [infoAlert, setInfoAlert] = useState({
    infoAlertMessage: "",
    showInfoAlert: false,
  });

  // ONBOADING INFO

  const showOnboarding = async () => {
    const isFavoriteInfoShown = await isInfoSeen(onboardingKeys.FAVORITES);
    if (!isFavoriteInfoShown) {
      setShowHelp(true);
      updateInfoSeen(onboardingKeys.FAVORITES);
    }
  };

  useEffect(() => {
    showOnboarding();
  }, []);

  // ON PAGE FOCUS ACTION
  const setUsersList = () => {
    let finalList = [];

    const userContacts = user.contacts;
    const userFavorites = user.favorites;

    let newList = [...userContacts, ...userFavorites];

    for (let user of newList) {
      if (!finalList.filter((i) => i._id == user._id)[0]) {
        finalList.push(user);
      }
    }
    if (!isReady || mounted) {
      setUsers(finalList.sort((a, b) => a.name > b.name));
      setIsReady(true);
    }
  };

  useEffect(() => {
    if (isFocused) {
      setUsersList();
    }
  }, [isFocused]);

  useEffect(() => {
    if (!isFocused && mounted && isVisible) {
      setIsVisible(false);
    }
  }, [isFocused, mounted]);

  useEffect(() => {
    if (!isFocused && mounted && showAddoption) {
      setShowAddOption(false);
    }
  }, [isFocused, mounted]);

  // ADD OPTION MODAL ACTION

  const handleCloseAddOption = useCallback(() => {
    setOptionalMessage("");
    setShowAddOption(false);
  }, []);

  const handleAddOptionPress = useCallback(() => {
    setShowAddOption(true);
  }, []);

  // TODO:
  const handleAddOptionalReplyPress = () => {
    // check if there is already a option with the given option to add and then add
    if (optionalAnswer.length < 4) {
      let newList = [...optionalAnswer];
      newList.push(optionalMessage.trim());
      setOptionalAnswer(newList);
      return setOptionalMessage("");
    }
    setOptionalMessage("");
    setShowAddOption(false);
  };

  const handleRemoveOptionalAnswer = (answer) => {
    let currentList = [...optionalAnswer];
    let newList = currentList.filter((a) => a != answer);
    setOptionalAnswer(newList);
  };

  //MESSAGE MODAL ACTION

  const handleCloseMessage = useCallback(() => {
    setRecipient(defaultRecipient);
    setMessage({ textMessage: "", mood: "Happy" });
    setIsVisible(false);
  }, []);

  const handleSendMessagePress = useCallback(
    debounce(
      async () => {
        setProcessing(true);
        let msg = message.textMessage.trim();
        let mood = message.mood;
        let optionalReplies = optionalAnswer;

        const { data, ok, problem } = await messagesApi.sendMessage(
          recipient._id,
          msg,
          mood,
          optionalReplies
        );

        if (ok) {
          setMessage({
            mood: "Happy",
            textMessage: "",
          });
          setOptionalMessage("");
          setOptionalAnswer([]);
          setProcessing(false);
          setIsVisible(false);
          if (recipient._id != user._id) {
            usersApi.updateReceivedMessagesCount(recipient._id);
          }
          showMessage({
            ...defaultProps.alertMessageConfig,
            type: "success",
            message: "Message Sent!",
            backgroundColor: defaultStyles.colors.green,
          });
        }
        setProcessing(false);
        tackleProblem(problem, data, setInfoAlert);
      },
      1000,
      true
    ),
    [message, recipient._id, user.messages, optionalAnswer]
  );

  const handleSetMood = (mood) => {
    setMessage({
      ...message,
      mood: mood,
    });
  };

  // INFO ALERT ACTION
  const handleCloseInfoAlert = useCallback(
    () => setInfoAlert({ ...infoAlert, showInfoAlert: false }),
    []
  );

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

  const handleHelpPress = useCallback(() => {
    setShowHelp(true);
  }, []);

  const handleCloseHelp = useCallback(() => {
    setShowHelp(false);
  }, []);

  // MESSAGGIN FAVORITES ACTION

  const handleMessagePress = useCallback((recipient) => {
    setRecipient(recipient);
    setIsVisible(true);
  }, []);

  const handleOnAllRepliesPress = useCallback(
    () =>
      navigation.navigate(Constants.FAVORITES_NAVIGATOR, {
        screen: Constants.ALL_REPLIES_SCREEN,
      }),
    []
  );

  return (
    <>
      <Screen style={styles.container}>
        <AppHeader
          leftIcon="arrow-back"
          onPressLeft={handleBack}
          title={`Favorites (${user.favorites.length})`}
          rightIcon="help-outline"
          onPressRight={handleHelpPress}
          showTip={showHelp}
          setShowTip={setShowHelp}
          tip="Add people to your Favorites to receive messages from them. When you send a message to someone who has added you in Favorites, he/she could see your name only when they reply to your messages.This way of interaction ensures mutual interest."
        />
        <ScreenSub>
          {!isReady ? (
            <AppActivityIndicator />
          ) : (
            <ApiContext.Provider value={{ apiProcessing, setApiProcessing }}>
              <AddFavoriteList
                isConnected={isConnected}
                isFocused={isFocused}
                onAllRepliesPress={handleOnAllRepliesPress}
                onMessagePress={handleMessagePress}
                users={users}
                style={styles.list}
                // showTip={showReplyHelp}
                // setShowTip={setShowReplyHelp}
                // tip="Tap to see all the replies of favorite messages."
              />
            </ApiContext.Provider>
          )}
        </ScreenSub>
      </Screen>
      {isVisible ? <ModalFallback /> : null}
      <FavoriteMessageInput
        handleAddOptionPress={handleAddOptionPress}
        handleCloseMessage={handleCloseMessage}
        handleSendMessagePress={handleSendMessagePress}
        handleSetMood={handleSetMood}
        isConnected={isConnected}
        isVisible={isVisible}
        message={message}
        moodData={moodData}
        optionalAnswer={optionalAnswer}
        processing={processing}
        recipient={recipient}
        setMessage={setMessage}
        handleRemoveOptionalAnswer={handleRemoveOptionalAnswer}
      />
      <FavoriteOptionsModal
        handleAddOptionalReplyPress={handleAddOptionalReplyPress}
        handleCloseAddOption={handleCloseAddOption}
        optionalMessage={optionalMessage}
        setOptionalMessage={setOptionalMessage}
        showAddoption={showAddoption}
        recipient={recipient}
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
  container: {
    alignItems: "center",
  },
});

export default AddFavoritesScreen;
