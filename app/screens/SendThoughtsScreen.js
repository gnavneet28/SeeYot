import React, { useState, useEffect, useCallback, useMemo } from "react";
import { View, StyleSheet, Modal, ImageBackground } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { ScaledSheet, scale } from "react-native-size-matters";

import ApiActivity from "../components/ApiActivity";
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

  // ON FOCUS PAGE ACTION
  const updateSearchHistory = async () => {
    let modifiedUser = { ...user };
    const { ok, data, problem } = await usersApi.addToSearchHstory(recipient);
    if (ok) {
      modifiedUser.searchHistory = data;
      setUser(modifiedUser);
      return await asyncStorage.store(DataConstants.SEARCH_HISTORY, data);
    }
    return;
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
      let equalNickName =
        modifiedContact.myNickName == originalContact.myNickName;

      if (equalName && equalPicture && equalNickName) return;

      await asyncStorage.store(DataConstants.CONTACTS, data);
      return setUser(modifiedUser);
    }
  }, [isFocused]);

  useEffect(() => {
    if (isFocused) {
      if (from == Constant.HOME_SCREEN) {
        updateCurrentContact();
      } else if (from == Constant.VIP_SEARCH_SCREEN) {
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

  return (
    <>
      <Screen style={styles.container}>
        <ImageBackground
          style={styles.imageBackground}
          source={require("../assets/chatWallPaper.png")}
        >
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
