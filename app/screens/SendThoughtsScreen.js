import React, { useState, useEffect, useCallback, useMemo } from "react";
import { View, StyleSheet, Modal, ImageBackground } from "react-native";
import { useIsFocused } from "@react-navigation/native";

import ApiActivity from "../components/ApiActivity";
import AppHeader from "../components/AppHeader";
import AppText from "../components/AppText";
import Screen from "../components/Screen";
import SendingThoughtActivity from "../components/SendingThoughtActivity";
import SendThoughtsInput from "../components/SendThoughtsInput";
import ThoughtsList from "../components/ThoughtsList";

import defaultStyles from "../config/styles";

import useAuth from "../auth/useAuth";

import myApi from "../api/my";
import thoughtsApi from "../api/thoughts";
import usersApi from "../api/users";

import apiFlow from "../utilities/ApiActivityStatus";
import asyncStorage from "../utilities/cache";
import debounce from "../utilities/debounce";

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
    .sort((a, b) => a.createdAt < b.createdAt);
};

function SendThoughtsScreen({ navigation, route }) {
  const { user, setUser } = useAuth();
  const { recipient, from } = route.params;
  const { apiActivityStatus, initialApiActivity } = apiFlow;

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

  // INFORMATION IN NEED
  let isBlocked = useMemo(
    () => user.blocked.filter((b) => b._id == recipient._id)[0],
    [recipient._id, user, isFocused]
  );

  let inContacts = useMemo(
    () => user.contacts.filter((c) => c._id == recipient._id)[0],
    [recipient._id, user, isFocused]
  );

  // THOUGHTS LIST ACTION
  const thoughts = useMemo(
    () => filterThoughts(user.thoughts, recipient, user),
    [isFocused, user.thoughts.length, recipient._id]
  );

  // SENDING THOUGHTS ACTION
  const handleSendThought = useCallback(
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
    [recipient._id]
  );

  // ON FOCUS PAGE ACTION
  const updateSearchHistory = async () => {
    let modifiedUser = { ...user };
    const { ok, data } = await usersApi.addToSearchHstory(recipient);
    if (ok) {
      modifiedUser.searchHistory = data;
      setUser(modifiedUser);
      return await asyncStorage.store("userSearchHistory", data);
    }
  };

  const updateCurrentContact = useCallback(async () => {
    let id = recipient._id;
    let savedName = recipient.savedName ? recipient.savedName : recipient.name;

    const { ok, data } = await myApi.updateThisContact(id, savedName);
    if (ok) {
      let modifiedUser = { ...user };
      modifiedUser.contacts = data;

      let modifiedContact = data.filter((c) => c._id == recipient._id)[0];
      let originalContact = user.contacts.filter(
        (c) => c._id == recipient._id
      )[0];

      let equalName = modifiedContact.name == originalContact.name;
      let equalPicture = modifiedContact.picture == originalContact.picture;

      if (equalName && equalPicture) return;

      await asyncStorage.store("userContacts", data);
      return setUser(modifiedUser);
    }
  }, [isFocused]);

  useEffect(() => {
    if (isFocused) {
      if (from == "HomeScreen") {
        updateCurrentContact();
      } else if (from == "VipSearchScreen") {
        updateSearchHistory();
      }
    }
  }, [isFocused]);

  // OPTIONS MODAL ACTIONS
  const handleModalClose = useCallback(() => setIsVisible(false), []);

  const handleUnfriendPress = useCallback(async () => {
    initialApiActivity(
      setApiActivity,
      `Removing ${recipient.name} from your friendlist...`
    );

    let modifiedUser = { ...user };

    const response = await usersApi.removeContact(recipient._id);

    if (response.ok) {
      modifiedUser.contacts = response.data.contacts;
      await asyncStorage.store("userContacts", response.data.contacts);
      setUser(modifiedUser);
    }

    return apiActivityStatus(response, setApiActivity);
  }, [
    recipient._id,
    user.contacts.length,
    user.blocked.length,
    isFocused,
    user,
  ]);

  const handleBlockPress = useCallback(async () => {
    initialApiActivity(setApiActivity, `Blocking ${recipient.name} ...`);

    let modifiedUser = { ...user };
    const response = await usersApi.blockContact(recipient._id);

    if (response.ok) {
      modifiedUser.blocked = response.data.blocked;
      await asyncStorage.store("blocked", response.data.blocked);
      setUser(modifiedUser);
    }

    return apiActivityStatus(response, setApiActivity);
  }, [
    recipient._id,
    user.blocked.length,
    user.contacts.length,
    isFocused,
    user,
  ]);

  const handleUnblockPress = useCallback(async () => {
    initialApiActivity(setApiActivity, `Unblocking ${recipient.name} ...`);

    let modifiedUser = { ...user };
    const response = await usersApi.unBlockContact(recipient._id);

    if (response.ok) {
      modifiedUser.blocked = response.data.blocked;
      await asyncStorage.store("blocked", response.data.blocked);
      setUser(modifiedUser);
    }

    return apiActivityStatus(response, setApiActivity);
  }, [
    recipient._id,
    user.blocked.length,
    user.contacts.length,
    isFocused,
    user,
  ]);

  return (
    <>
      <Screen style={styles.container}>
        <ImageBackground
          style={styles.imageBackground}
          source={require("../assets/chatWallPaper.png")}
        >
          <AppHeader
            fwr={true}
            leftIcon="arrow-back"
            onPressLeft={handleBack}
            onPressRight={handleOptionsPress}
            rightIcon="ellipsis-v"
            title={recipient ? recipient.name : ""}
          />
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
          {recipient.myNickName ? (
            <View style={styles.myNickNameContainer}>
              <AppText style={styles.myNickName}>
                {"Calls you by name" + " - " + recipient.myNickName}
              </AppText>
            </View>
          ) : null}
          <ThoughtsList thoughts={thoughts} recipient={recipient} />
          <View style={styles.sendThoughtsInputPlaceholder} />
          <SendThoughtsInput
            style={[styles.inputBox]}
            submit={handleSendThought}
          />
        </ImageBackground>
      </Screen>
      <Modal
        onRequestClose={handleModalClose}
        transparent={true}
        visible={isVisible}
      >
        <View style={styles.contactOptionMainContainer}>
          <View style={styles.optionsContainer}>
            <AppText
              style={[styles.option, { color: defaultStyles.colors.blue }]}
              onPress={handleModalClose}
            >
              Close
            </AppText>
            {inContacts ? (
              <AppText style={styles.option} onPress={handleUnfriendPress}>
                Unfriend
              </AppText>
            ) : null}
            <AppText
              style={styles.option}
              onPress={!isBlocked ? handleBlockPress : handleUnblockPress}
            >
              {isBlocked ? "Unblock" : "Block"}
            </AppText>
          </View>
        </View>
      </Modal>
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  contactOptionMainContainer: {
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
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
    bottom: 10,
    position: "absolute",
  },
  myNickName: {
    color: defaultStyles.colors.dark,
    flex: 1,
    fontSize: 16,
    textAlign: "center",
    textAlignVertical: "center",
  },
  myNickNameContainer: {
    backgroundColor: defaultStyles.colors.yellow_Variant,
    elevation: 1,
    minHeight: 40,
    width: "100%",
  },
  optionsContainer: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.white,
    borderRadius: 10,
    overflow: "hidden",
    width: "60%",
  },
  option: {
    borderBottomColor: defaultStyles.colors.light,
    borderBottomWidth: 1,
    fontSize: 18,
    height: defaultStyles.dimensionConstants.height,
    opacity: 0.8,
    textAlign: "center",
    textAlignVertical: "center",
    width: "100%",
  },
  sendThoughtsInputPlaceholder: {
    width: "100%",
    height: 60,
  },
});

export default SendThoughtsScreen;
