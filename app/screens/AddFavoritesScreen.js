import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { StyleSheet, Modal, View, ScrollView } from "react-native";
import { useIsFocused } from "@react-navigation/native";

import ApiActivity from "../components/ApiActivity";
import AppActivityIndicator from "../components/ActivityIndicator";
import AppHeader from "../components/AppHeader";
import InfoAlert from "../components/InfoAlert";
import Screen from "../components/Screen";
import AddFavoriteList from "../components/AddFavoriteList";
import Mood from "../components/Mood";

import DataConstants from "../utilities/DataConstants";

import usersApi from "../api/users";

import defaultStyles from "../config/styles";

import useAuth from "../auth/useAuth";
import messagesApi from "../api/messages";

import asyncStorage from "../utilities/cache";
import apiFlow from "../utilities/ApiActivityStatus";
import debounce from "../utilities/debounce";
import AppText from "../components/AppText";
import AppTextInput from "../components/AppTextInput";
import AppButton from "../components/AppButton";
import ToastMessage from "../components/ToastMessage";

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
  const { apiActivityStatus, initialApiActivity } = apiFlow;
  const isFocused = useIsFocused();
  const toast = useRef();

  // STATES
  const [isVisible, setIsVisible] = useState(false);
  const [message, setMessage] = useState({
    textMessage: "",
    mood: "",
  });
  const [recipient, setRecipient] = useState(defaultRecipient);
  const [isReady, setIsReady] = useState(false);
  const [users, setUsers] = useState([]);
  const [infoAlert, setInfoAlert] = useState({
    infoAlertMessage: "",
    showInfoAlert: false,
  });
  const [apiActivity, setApiActivity] = useState({
    message: "",
    processing: true,
    visible: false,
    success: false,
  });
  const [refreshing, setRefreshing] = useState(false);

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

    setUsers(finalList);
    setIsReady(true);
  };

  useEffect(() => {
    if (isFocused) {
      setUsersList();
    }
  }, [isFocused]);

  // API ACTIVITY ACTION
  const handleApiActivityClose = useCallback(
    () => setApiActivity({ ...apiActivity, visible: false }),
    []
  );

  //MESSAGE MODAL ACTION

  const handleCloseMessage = useCallback(() => {
    setRecipient(defaultRecipient);
    setMessage({ textMessage: "", mood: "" });
    setIsVisible(false);
  }, []);

  const handleSendMessagePress = async () => {
    let msg = message.textMessage;
    let mood = message.mood ? message.mood : "Happy";

    const { data, ok, problem } = await messagesApi.sendMessage(
      recipient._id,
      msg,
      mood
    );

    if (ok) {
      setMessage({
        mood: "",
        textMessage: "",
      });
      return toast.current.show(data.message, 4000);
    }

    if (problem) {
      if (data) {
        return toast.current.show(data.message, 4000);
      }
      return toast.current.show(
        "Problem connecting to network. Please try again!",
        5000
      );
    }
  };

  const handleSetMood = (mood) => {
    setMessage({
      ...message,
      mood: mood,
    });
  };

  // REFRESH ACTION
  const handleRefresh = () => {
    setUsersList();
  };

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

  // INFO ALERT ACTIONS
  const handleCloseInfoAlert = useCallback(async () => {
    setInfoAlert({ showInfoAlert: false });
  }, []);

  // ADDING , REMOVING AND MESSAGGIN FAVORITES ACTION
  const handleAddPress = useCallback(
    async (userToAdd) => {
      initialApiActivity(
        setApiActivity,
        "Adding" + " " + userToAdd.name + "..."
      );

      let modifiedUser = { ...user };

      const response = await usersApi.addFavorite(userToAdd._id);

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
    [user]
  );

  const handleRemovePress = useCallback(
    async (userToRemove) => {
      initialApiActivity(
        setApiActivity,
        "Removing" + " " + userToRemove.name + "..."
      );

      let modifiedUser = { ...user };

      const response = await usersApi.removeFavorite(userToRemove._id);

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
    [user]
  );

  const handleMessagePress = (recipient) => {
    setRecipient(recipient);
    setIsVisible(true);
  };

  return (
    <>
      <Screen style={styles.container}>
        <AppHeader
          leftIcon="arrow-back"
          onPressLeft={handleBack}
          title="Add Favorites"
        />
        <ApiActivity
          message={apiActivity.message}
          onDoneButtonPress={handleApiActivityClose}
          onRequestClose={handleApiActivityClose}
          processing={apiActivity.processing}
          success={apiActivity.success}
          visible={apiActivity.visible}
        />
        <InfoAlert
          leftPress={handleCloseInfoAlert}
          description={infoAlert.infoAlertMessage}
          visible={infoAlert.showInfoAlert}
        />
        {!isReady ? (
          <AppActivityIndicator />
        ) : (
          <AddFavoriteList
            onRefresh={handleRefresh}
            refreshing={refreshing}
            onAddPress={handleAddPress}
            onRemovePress={handleRemovePress}
            onMessagePress={handleMessagePress}
            users={users}
          />
        )}
      </Screen>
      <Modal
        visible={isVisible}
        onRequestClose={handleCloseMessage}
        transparent
        animationType="fade"
      >
        <View style={styles.messageBackground}>
          <View style={styles.messageMainContainer}>
            <AppText onPress={handleCloseMessage} style={styles.closeMessage}>
              Close
            </AppText>
            <AppTextInput
              value={message.textMessage}
              maxLength={250}
              onChangeText={(text) =>
                setMessage({ ...message, textMessage: text })
              }
              multiline={true}
              subStyle={styles.messageInputSub}
              style={styles.messageInput}
              placeholder={
                "What would you like to say to" + " " + recipient.name + "..."
              }
            />
            <AppText style={styles.wordCount}>
              {message.textMessage.length}/250
            </AppText>
            <View style={styles.moodContainerMain}>
              <ScrollView
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
                    onPress={() => handleSetMood(d.mood)}
                  />
                ))}
              </ScrollView>
            </View>
            <AppButton
              disabled={
                message.textMessage.replace(/\s/g, "").length >= 1
                  ? false
                  : true
              }
              style={styles.sendButton}
              title="Send"
              onPress={handleSendMessagePress}
            />
          </View>
        </View>
        <ToastMessage reference={toast} position="center" />
      </Modal>
    </>
  );
}
const styles = StyleSheet.create({
  closeMessage: {
    color: defaultStyles.colors.danger,
    marginBottom: 15,
    marginTop: 5,
    textAlign: "center",
    width: "100%",
  },
  container: {
    alignItems: "center",
  },
  messageBackground: {
    backgroundColor: "rgba(0,0,0,0.7)",
    flex: 1,
    justifyContent: "flex-end",
    width: "100%",
  },
  messageMainContainer: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: "hidden",
    width: "100%",
  },
  messageInput: {
    width: "94%",
    minHeight: 100,
    alignItems: "flex-start",
    borderWidth: 2,
    borderColor: defaultStyles.colors.light,
    borderRadius: 5,
  },
  messageInputSub: {
    fontSize: 16,
    minHeight: 90,
    textAlignVertical: "top",
  },
  moodContainerMain: {
    height: 80,
    width: "100%",
    marginVertical: 5,
  },
  moodContainerSub: {
    alignItems: "center",
    height: 50,
  },
  selectMood: {
    backgroundColor: defaultStyles.colors.yellow_Variant,
    borderRadius: 20,
    height: 35,
    paddingHorizontal: 10,
    marginLeft: 10,
    fontSize: 14,
    textAlign: "center",
    textAlignVertical: "center",
  },
  sendButton: {
    borderRadius: 0,
    marginTop: 10,
  },
  wordCount: {
    textAlign: "right",
    width: "94%",
  },
});

export default AddFavoritesScreen;
