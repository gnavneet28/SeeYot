import React, {
  useState,
  useCallback,
  useMemo,
  useEffect,
  useRef,
} from "react";
import { StyleSheet, Modal, View } from "react-native";

import ApiActivity from "../components/ApiActivity";
import ContactList from "../components/ContactList";
import HomeAppHeader from "../components/HomeAppHeader";
import HomeMessages from "../components/HomeMessages";
import InfoAlert from "../components/InfoAlert";
import Screen from "../components/Screen";
import AppText from "../components/AppText";
import AppImage from "../components/AppImage";

import Constant from "../navigation/NavigationConstants";

import useAuth from "../auth/useAuth";

import usersApi from "../api/users";
import messagesApi from "../api/messages";

import defaultStyles from "../config/styles";

import storeDetails from "../utilities/storeDetails";
import debounce from "../utilities/debounce";
import SendThoughtsInput from "../components/SendThoughtsInput";
import asyncStorage from "../utilities/cache";
import ToastMessage from "../components/ToastMessage";

const defaultMessage = {
  _id: "",
  message: "",
  createdAt: Date.now(),
  mood: "",
  seen: false,
};

function HomeScreen({ navigation }) {
  const { user, setUser } = useAuth();

  const toast = useRef();

  const [state, setState] = useState({
    showInfoAlert: false,
    infoAlertMessage: "",
  });
  const [apiActivity, setApiActivity] = useState({
    message: "",
    processing: true,
    visible: false,
    success: false,
  });

  const [isVisible, setIsVisible] = useState(false);
  const [message, setMessage] = useState(defaultMessage);
  const [messageCreator, setMessageCreator] = useState({
    name: "************",
    picture: "",
  });
  const [messagesList, setMessagesList] = useState([]);

  useEffect(() => {
    let messages = user.messages ? user.messages : [];
    setMessagesList(messages);
  }, [user]);

  // APIACTIVITY ACTIONS
  const handleApiActivityClose = useCallback(
    () => setApiActivity({ ...apiActivity, visible: false }),
    []
  );

  // MESSAGES ACTION

  const handleAddFavoritesButtonPress = useCallback(
    () => navigation.navigate(Constant.ADD_FAVORITES_SCREEN),
    []
  );

  const handleMessagePress = async (message) => {
    setMessage(message);
    setIsVisible(true);
    if (message.seen === false) {
      const { ok, data, problem } = await messagesApi.markRead(message._id);
      if (ok) {
        message.seen = true;
        return await asyncStorage.store(DataConstants.MESSAGES, data.messages);
      }
    }
    return;
  };

  // HEADER ACTIONS
  const handleRightPress = useCallback(() => {
    navigation.navigate(Constant.PROFILE_NAVIGATOR);
  }, []);

  // EMPTY FRIENDLIST
  const handleAddFriendPress = useCallback(
    () => navigation.navigate(Constant.ADD_CONTACTS_SCREEN),
    []
  );

  // INFO ALERT ACTIONS
  const handleCloseInfoAlert = useCallback(
    () => setState({ ...state, showInfoAlert: false }),
    []
  );

  // REFRESH ACTION
  const handleRefresh = useCallback(async () => {
    setApiActivity({
      processing: true,
      message: "Refreshing...",
      visible: true,
      success: false,
    });

    const { data, ok } = await usersApi.getCurrentUser();
    if (ok) {
      await storeDetails(data);
      setUser(data);
      return setApiActivity({
        processing: true,
        visible: false,
        message: "",
        success: true,
      });
    }
    setApiActivity({
      message: "Something failed! Please try again.",
      success: false,
      processing: false,
      visible: true,
    });
  }, []);

  // CONTACT CARD OPTIONS
  const handleOnSendThoughtButtonPress = useCallback(
    (user) => {
      if (user) {
        return navigation.navigate(Constant.SEND_THOUGHT_SCREEN, {
          recipient: user,
          from: Constant.HOME_SCREEN,
        });
      }
      setState({
        ...state,
        infoAlertMessage: "Something went wrong! Please try again.",
        showInfoAlert: true,
      });
    },
    [state.infoAlertMessage, state.showInfoAlert]
  );

  const handleAddEchoButtonPress = useCallback(
    (user) => {
      if (user) {
        return navigation.navigate(Constant.ADD_ECHO_SCREEN, {
          recipient: user,
          from: Constant.HOME_SCREEN,
        });
      }
      setState({
        ...state,
        infoAlertMessage: "Something went wrong! Please try again.",
        showInfoAlert: true,
      });
    },
    [state.infoAlertMessage, state.showInfoAlert]
  );

  const data = useMemo(
    () =>
      typeof user.contacts !== "undefined"
        ? user.contacts.sort((a, b) => a.name > b.name)
        : [],
    [user.contacts.length, user.contacts]
  );

  //MESSAGE MODAL ACTION

  const handleCloseMessage = useCallback(() => {
    setMessageCreator({ name: "**********", picture: "" });
    setMessage(defaultMessage);
    setIsVisible(false);
  }, []);

  const handleMessageReply = debounce(
    async (reply) => {
      const { data, ok, problem } = await messagesApi.reply(message._id, reply);
      if (ok) {
        setMessageCreator({
          name: data.name,
          picture: data.picture,
        });
        return toast.current.show(data.message, 4000);
      }

      if (problem) {
        if (data) {
          return toast.current.show(data.message, 4000);
        }

        return toast.current.show(problem, 4000);
      }
    },
    1000,
    true
  );

  return (
    <>
      <Screen style={styles.container}>
        <HomeAppHeader
          onPressRight={handleRightPress}
          rightImageUrl={
            typeof user.picture !== "undefined" ? user.picture : ""
          }
        />
        <HomeMessages
          messages={messagesList}
          onMessagePress={handleMessagePress}
          onPress={handleAddFavoritesButtonPress}
        />
        <ApiActivity
          message={apiActivity.message}
          onDoneButtonPress={handleApiActivityClose}
          processing={apiActivity.processing}
          success={apiActivity.success}
          visible={apiActivity.visible}
        />
        <InfoAlert
          description={state.infoAlertMessage}
          leftPress={handleCloseInfoAlert}
          visible={state.showInfoAlert}
        />
        <ContactList
          onAddEchoPress={handleAddEchoButtonPress}
          onAddFriendPress={handleAddFriendPress}
          onRefresh={handleRefresh}
          onSendThoughtsPress={handleOnSendThoughtButtonPress}
          refreshing={false}
          users={data}
        />
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
            <View style={styles.messageCreatorDetails}>
              <AppImage
                style={styles.image}
                subStyle={styles.imageSub}
                imageUrl={messageCreator.picture}
              />
              <View style={styles.messageDetailsContainer}>
                <AppText style={styles.creatorName}>
                  {messageCreator.name}
                </AppText>
                <AppText style={styles.message}>{message.message}</AppText>
                <AppText style={styles.createdAt}>{message.createdAt}</AppText>
              </View>
            </View>
            <SendThoughtsInput
              placeholder="Reply to know who sent you this message..."
              submit={handleMessageReply}
              style={{ marginVertical: 10 }}
            />
          </View>
        </View>
        <ToastMessage reference={toast} />
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
  contactList: {
    marginTop: 2,
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
  messageCreatorDetails: {
    minHeight: 70,
    width: "100%",
    backgroundColor: defaultStyles.colors.white,
    marginVertical: 5,
    flexDirection: "row",
    paddingHorizontal: 5,
    alignItems: "center",
  },
  messageDetailsContainer: {
    flex: 1,
    padding: 5,
  },
  image: {
    borderColor: defaultStyles.colors.light,
    borderRadius: 25,
    borderWidth: 1,
    height: 50,
    marginHorizontal: 8,
    width: 50,
  },
  imageSub: {
    borderRadius: 24.5,
    height: 49,
    width: 49,
  },
  message: {
    textAlign: "left",
    borderLeftWidth: 2,
    borderColor: defaultStyles.colors.blue,
    paddingHorizontal: 15,
    opacity: 0.8,
    color: defaultStyles.colors.secondary,
  },

  createdAt: {
    fontSize: 14,
    color: defaultStyles.colors.lightGrey,
  },
  creatorName: {
    fontSize: 18,
    color: defaultStyles.colors.primary,
  },
});

export default HomeScreen;
