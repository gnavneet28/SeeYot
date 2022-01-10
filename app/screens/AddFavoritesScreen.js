import React, { useState, useEffect, useCallback, useContext } from "react";
import { Modal, View, ScrollView, TextInput } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { ScaledSheet, scale } from "react-native-size-matters";
import AntDesign from "react-native-vector-icons/AntDesign";

import AddFavoriteList from "../components/AddFavoriteList";
import ApiProcessingContainer from "../components/ApiProcessingContainer";
import AppActivityIndicator from "../components/ActivityIndicator";
import AppButton from "../components/AppButton";
import AppHeader from "../components/AppHeader";
import AppImage from "../components/AppImage";
import AppText from "../components/AppText";
import HelpDialogueBox from "../components/HelpDialogueBox";
import InfoAlert from "../components/InfoAlert";
import Mood from "../components/Mood";
import OptionalAnswer from "../components/OptionalAnswer";
import Screen from "../components/Screen";
import ModalFallback from "../components/ModalFallback";

import defaultStyles from "../config/styles";

import useAuth from "../auth/useAuth";
import messagesApi from "../api/messages";
import myApi from "../api/my";
import usersApi from "../api/users";

import useMountedRef from "../hooks/useMountedRef";
import useConnection from "../hooks/useConnection";

import Constants from "../navigation/NavigationConstants";

import storeDetails from "../utilities/storeDetails";
import SuccessMessageContext from "../utilities/successMessageContext";
import debounce from "../utilities/debounce";
import ApiContext from "../utilities/apiContext";
import apiActivity from "../utilities/apiActivity";
import authorizeUpdates from "../utilities/authorizeUpdates";

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
  const { user, setUser } = useAuth();
  const isFocused = useIsFocused();
  const mounted = useMountedRef().current;
  const isConnected = useConnection();
  const { setSuccess } = useContext(SuccessMessageContext);
  const { tackleProblem, showSucessMessage } = apiActivity;

  // STATES
  const [isVisible, setIsVisible] = useState(false);
  const [message, setMessage] = useState({
    textMessage: "",
    mood: "Happy",
  });
  const [recipient, setRecipient] = useState(defaultRecipient);
  const [isReady, setIsReady] = useState(false);
  const [users, setUsers] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
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
      setUsers(finalList);
      setIsReady(true);
    }
  };

  const updateMyFavoritesList = async () => {
    let canUpdate = await authorizeUpdates.authorizeFavoritesUpdate();
    if (!canUpdate) return;
    const { ok, data, problem } = await myApi.updateMyFavorites();
    if (ok) {
      await storeDetails(data.user);
      setUser(data.user);
      await authorizeUpdates.updateFavoritesUpdate();
      if (!isReady || mounted) {
        return setUsersList();
      }
    }

    if (problem) return;
  };

  useEffect(() => {
    updateMyFavoritesList();
  }, []);

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
    setShowAddOption(false);
  }, []);

  const handleAddOptionPress = useCallback(() => {
    setShowAddOption(true);
  }, []);

  const handleAddOptionalReplyPress = () => {
    if (optionalAnswer.length < 4) {
      let newList = [...optionalAnswer];
      newList.push(optionalMessage);
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
        let msg = message.textMessage;
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
          setOptionalAnswer([]);
          setProcessing(false);
          setIsVisible(false);
          if (recipient._id != user._id) {
            usersApi.updateReceivedMessagesCount(recipient._id);
          }
          return showSucessMessage(setSuccess, "Message Sent!");
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

  // REFRESH ACTION
  const handleRefresh = useCallback(async () => {
    if (!isReady || mounted) {
      setRefreshing(true);
      setUsersList();
      await updateMyFavoritesList();
      setRefreshing(false);
    }
  }, [isReady, mounted]);

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

  const handleMessagePress = (recipient) => {
    setRecipient(recipient);
    setIsVisible(true);
  };

  const handleOnAllRepliesPress = useCallback(
    () =>
      navigation.navigate(Constants.FAVORITES_NAVIGATOR, {
        screen: Constants.ALL_REPLIES_SCREEN,
      }),
    []
  );

  const checkSendButtonDisability = () => {
    if (!isConnected) return true;
    if (optionalAnswer.length) {
      if (
        message.textMessage.replace(/\s/g, "").length >= 1 &&
        optionalAnswer.length > 1
      ) {
        return false;
      }

      return true;
    }

    if (!optionalAnswer.length) {
      if (message.textMessage.replace(/\s/g, "").length < 1) {
        return true;
      }

      return false;
    }
  };

  return (
    <>
      <Screen style={styles.container}>
        <AppHeader
          leftIcon="arrow-back"
          onPressLeft={handleBack}
          title="Add Favorites"
          rightIcon="help-outline"
          onPressRight={handleHelpPress}
        />
        <HelpDialogueBox
          information="Add people to your Favorites to receive messages from them. When you send a message to someone who has added you in Favorites, he/she could see your name only when they reply to your messages.This way of interaction ensures mutual interest."
          onPress={handleCloseHelp}
          setVisible={setShowHelp}
          visible={showHelp}
        />
        <InfoAlert
          leftPress={handleCloseInfoAlert}
          description={infoAlert.infoAlertMessage}
          visible={infoAlert.showInfoAlert}
        />
        {!isReady ? (
          <AppActivityIndicator />
        ) : (
          <ApiContext.Provider value={{ apiProcessing, setApiProcessing }}>
            <AddFavoriteList
              onAllRepliesPress={handleOnAllRepliesPress}
              onRefresh={handleRefresh}
              refreshing={refreshing}
              onMessagePress={handleMessagePress}
              users={users}
            />
          </ApiContext.Provider>
        )}
      </Screen>
      {isVisible ? <ModalFallback /> : null}
      <Modal
        visible={isVisible}
        onRequestClose={processing === true ? () => null : handleCloseMessage}
        transparent
        animationType="slide"
      >
        <View style={styles.messageBackground}>
          <ScrollView
            keyboardShouldPersistTaps="always"
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: "flex-end",
            }}
          >
            <View style={styles.closeMessageIconContainer}>
              <AntDesign
                onPress={processing === true ? () => null : handleCloseMessage}
                name="downcircle"
                color={defaultStyles.colors.tomato}
                size={scale(28)}
              />
            </View>
            <View
              style={[
                styles.messageMainContainer,
                {
                  borderBottomColor:
                    checkSendButtonDisability() || processing === true
                      ? defaultStyles.colors.lightGrey
                      : defaultStyles.colors.secondary,
                },
              ]}
            >
              <View style={styles.inputBoxContainerMain}>
                <AppImage
                  imageUrl={recipient.picture}
                  style={styles.image}
                  subStyle={styles.imageSub}
                />
                <View style={styles.inputBoxContainer}>
                  <TextInput
                    editable={!processing}
                    placeholder={
                      "What would you like to say to" +
                      " " +
                      recipient.name +
                      "..."
                    }
                    multiline={true}
                    value={message.textMessage}
                    maxLength={250}
                    onChangeText={(text) =>
                      setMessage({ ...message, textMessage: text })
                    }
                    style={styles.messageInput}
                  />
                  <AppText style={styles.wordCount}>
                    {message.textMessage.length}/250
                  </AppText>
                </View>
              </View>
              <View style={styles.moodContainerMain}>
                <ScrollView
                  keyboardShouldPersistTaps="always"
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.moodContainerSub}
                >
                  <AppText style={styles.selectMood}>Select your mood</AppText>
                  {moodData.map((d, index) => (
                    <Mood
                      key={d.mood + index.toString()}
                      mood={d.mood}
                      isSelected={message.mood === d.mood ? true : false}
                      onPress={
                        processing === true
                          ? () => null
                          : () => handleSetMood(d.mood)
                      }
                    />
                  ))}
                </ScrollView>
              </View>
              {optionalAnswer.length >= 1 ? (
                <View style={styles.optionContainerMain}>
                  <ScrollView contentContainerStyle={styles.optionContainerSub}>
                    <AppText style={styles.selectOption}>
                      Optional Replies
                    </AppText>
                    {optionalAnswer.map((d, index) => (
                      <OptionalAnswer
                        key={d + index.toString()}
                        answer={d}
                        onPress={
                          processing === true
                            ? () => null
                            : () => handleRemoveOptionalAnswer(d)
                        }
                      />
                    ))}
                  </ScrollView>
                </View>
              ) : null}
              {optionalAnswer.length < 4 ? (
                <AppButton
                  onPress={
                    processing === true ? () => null : handleAddOptionPress
                  }
                  title="Add Options"
                  style={styles.addOptions}
                  subStyle={styles.addOptionsSub}
                />
              ) : null}
              <ApiProcessingContainer
                style={[
                  styles.apiProcessingContainer,
                  {
                    backgroundColor:
                      checkSendButtonDisability() || processing === true
                        ? defaultStyles.colors.lightGrey
                        : defaultStyles.colors.secondary,
                  },
                ]}
                processing={processing}
              >
                <AppButton
                  disabled={checkSendButtonDisability() ? true : false}
                  style={[
                    styles.sendButton,
                    {
                      backgroundColor:
                        checkSendButtonDisability() || processing === true
                          ? defaultStyles.colors.lightGrey
                          : defaultStyles.colors.secondary,
                    },
                  ]}
                  title="Send"
                  onPress={
                    processing === true ? () => null : handleSendMessagePress
                  }
                />
              </ApiProcessingContainer>
            </View>
          </ScrollView>
        </View>
      </Modal>
      <Modal
        visible={showAddoption}
        onRequestClose={handleCloseAddOption}
        transparent
        animationType="fade"
      >
        <View style={styles.addoptionModalFallback}>
          <View style={styles.addOptionContainer}>
            <AppText style={styles.addOptionTitle}>Add Option</AppText>
            <AppText style={styles.addOptionInfo}>
              Add option you expect {recipient.name} to reply with. You can add
              a minimum of 2 and a maximum of 4 options. Options help you to get
              valid replies.
            </AppText>
            <TextInput
              maxLength={100}
              multiline={true}
              onChangeText={setOptionalMessage}
              placeholder="Add an expected reply..."
              style={styles.addOptionInput}
              value={optionalMessage}
            />
            <AppText style={styles.optionLengthInfo}>
              Option should be minimum 3 characters long.
            </AppText>
            <View style={styles.addOptionActionContainer}>
              <AppButton
                onPress={handleCloseAddOption}
                title="Close"
                style={styles.closeButton}
                subStyle={{
                  fontSize: 15,
                  color: defaultStyles.colors.secondary,
                }}
              />
              <AppButton
                disabled={
                  optionalMessage.replace(/\s/g, "").length >= 3 ? false : true
                }
                onPress={handleAddOptionalReplyPress}
                title="Add"
                style={[
                  styles.addButton,
                  {
                    backgroundColor:
                      optionalMessage.replace(/\s/g, "").length >= 3
                        ? defaultStyles.colors.blue
                        : defaultStyles.colors.lightGrey,
                  },
                ]}
                subStyle={{ fontSize: 15 }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}
const styles = ScaledSheet.create({
  addoptionModalFallback: {
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.8)",
    flex: 1,
    justifyContent: "center",
    width: "100%",
  },
  addOptions: {
    backgroundColor: defaultStyles.colors.dark_Variant,
    borderRadius: "20@s",
    height: "30@s",
    marginVertical: "10@s",
    width: "85@s",
  },
  addOptionsSub: {
    fontSize: "14@s",
  },
  addOptionContainer: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.white,
    borderColor: defaultStyles.colors.dark_Variant,
    borderRadius: "10@s",
    borderWidth: 2,
    elevation: 5,
    overflow: "hidden",
    width: "80%",
  },
  addOptionTitle: {
    backgroundColor: defaultStyles.colors.dark_Variant,
    color: defaultStyles.colors.white,
    height: "40@s",
    textAlign: "center",
    textAlignVertical: "center",
    width: "100%",
  },
  addOptionInfo: {
    color: defaultStyles.colors.secondary,
    fontSize: "13@s",
    marginVertical: "5@s",
    textAlign: "center",
    width: "95%",
  },
  addOptionInput: {
    borderColor: defaultStyles.colors.lightGrey,
    borderRadius: "10@s",
    borderWidth: 1,
    fontFamily: "Comic-Bold",
    fontSize: "15@s",
    fontWeight: "normal",
    marginTop: "5@s",
    padding: "5@s",
    paddingHorizontal: "10@s",
    width: "95%",
  },
  addOptionActionContainer: {
    alignItems: "center",
    flexDirection: "row",
    height: "50@s",
    justifyContent: "center",
    marginVertical: "10@s",
    padding: "5@s",
    width: "95%",
  },
  addButton: {
    backgroundColor: defaultStyles.colors.blue,
    borderRadius: "10@s",
    height: "32@s",
    width: "55@s",
  },
  apiProcessingContainer: {
    height: "40@s",
    marginTop: "10@s",
    width: "100%",
  },
  closeMessageIconContainer: {
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: defaultStyles.colors.white,
    borderRadius: "25@s",
    bottom: "-25@s",
    height: "40@s",
    justifyContent: "center",
    padding: "5@s",
    width: "40@s",
    zIndex: 222,
  },
  closeButton: {
    backgroundColor: defaultStyles.colors.yellow_Variant,
    borderRadius: "10@s",
    height: "32@s",
    marginRight: "20@s",
    width: "55@s",
  },
  container: {
    alignItems: "center",
  },
  inputBoxContainerMain: {
    alignItems: "center",
    flexDirection: "row",
    width: "100%",
  },
  inputBoxContainer: {
    alignItems: "center",
    flexShrink: 1,
    width: "100%",
  },
  image: {
    alignSelf: "flex-start",
    borderRadius: "19@s",
    height: "38@s",
    marginLeft: "15@s",
    width: "38@s",
  },
  imageSub: {
    borderRadius: "19@s",
    height: "38@s",
    width: "38@s",
  },
  messageBackground: {
    flex: 1,
    justifyContent: "flex-end",
    width: "100%",
  },
  messageMainContainer: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.white,
    borderBottomWidth: 2,
    borderTopLeftRadius: "10@s",
    borderTopRightRadius: "10@s",
    overflow: "hidden",
    paddingTop: "32@s",
    width: "100%",
  },
  messageInput: {
    borderColor: defaultStyles.colors.light,
    borderRadius: "5@s",
    borderWidth: 1,
    fontFamily: "Comic-Bold",
    fontSize: "14.5@s",
    fontWeight: "normal",
    padding: "5@s",
    paddingHorizontal: "10@s",
    textAlignVertical: "top",
    width: "94%",
  },
  moodContainerMain: {
    height: "50@s",
    marginVertical: "5@s",
    width: "100%",
  },
  moodContainerSub: {
    alignItems: "center",
    height: "50@s",
  },
  optionContainerMain: {
    marginVertical: "5@s",
    width: "100%",
  },
  optionLengthInfo: {
    alignSelf: "flex-start",
    color: defaultStyles.colors.dark_Variant,
    fontSize: "12@s",
    marginBottom: "10@s",
    marginLeft: "10@s",
    marginTop: "5@s",
    paddingBottom: 0,
    paddingTop: 0,
  },
  selectMood: {
    backgroundColor: defaultStyles.colors.yellow_Variant,
    borderRadius: "20@s",
    color: defaultStyles.colors.secondary,
    fontSize: "12@s",
    height: "32@s",
    marginLeft: "10@s",
    paddingHorizontal: "10@s",
    textAlign: "center",
    textAlignVertical: "center",
  },
  selectOption: {
    alignSelf: "center",
    backgroundColor: defaultStyles.colors.light,
    borderRadius: "20@s",
    fontSize: "14@s",
    height: "32@s",
    marginBottom: "10@s",
    marginLeft: "10@s",
    paddingHorizontal: "15@s",
    textAlign: "center",
    textAlignVertical: "center",
  },
  sendButton: {
    borderRadius: 0,
    height: "40@s",
  },
  wordCount: {
    fontSize: "12@s",
    textAlign: "right",
    width: "94%",
  },
});

export default AddFavoritesScreen;
