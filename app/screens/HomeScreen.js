import React, {
  useState,
  useCallback,
  useMemo,
  useEffect,
  useRef,
} from "react";
import {
  Modal,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Linking,
} from "react-native";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useIsFocused } from "@react-navigation/native";
import { ScaledSheet, scale } from "react-native-size-matters";

import ApiActivity from "../components/ApiActivity";
import AppImage from "../components/AppImage";
import AppText from "../components/AppText";
import ContactList from "../components/ContactList";
import HomeAppHeader from "../components/HomeAppHeader";
import HomeMessages from "../components/HomeMessages";
import Icon from "../components/Icon";
import InfoAlert from "../components/InfoAlert";
import ReplyOption from "../components/ReplyOption";
import Screen from "../components/Screen";
import ToastMessage from "../components/ToastMessage";

import Constant from "../navigation/NavigationConstants";

import useAuth from "../auth/useAuth";

import usersApi from "../api/users";
import messagesApi from "../api/messages";

import defaultStyles from "../config/styles";

import storeDetails from "../utilities/storeDetails";
import debounce from "../utilities/debounce";
import asyncStorage from "../utilities/cache";

const defaultMessage = {
  _id: "",
  message: "",
  createdAt: Date.now(),
  mood: "",
  seen: false,
  options: [],
};

function HomeScreen({ navigation }) {
  dayjs.extend(relativeTime);
  const { user, setUser } = useAuth();
  const isFocused = useIsFocused();

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
  const [selectedMessageId, setSelectedMessageId] = useState("");

  const [isVisible, setIsVisible] = useState(false);
  const [message, setMessage] = useState(defaultMessage);
  const [messageCreator, setMessageCreator] = useState({
    name: "************",
    picture: "",
  });
  const [messagesList, setMessagesList] = useState([]);
  const [reply, setReply] = useState("");
  const [sendingReply, setSendingReply] = useState(false);

  useEffect(() => {
    let messages = user.messages ? user.messages : [];
    setMessagesList(messages);
  }, [user]);

  useEffect(() => {
    if (isFocused && isVisible) {
      setIsVisible(false);
    }
  }, [isFocused]);

  // APIACTIVITY ACTIONS
  const handleApiActivityClose = useCallback(
    () => setApiActivity({ ...apiActivity, visible: false }),
    []
  );

  // MESSAGES ACTION

  const handleMessagePress = useCallback(
    debounce(
      async (message) => {
        setMessage(message);
        setIsVisible(true);
        if (message.seen === false) {
          const { ok, data, problem } = await messagesApi.markRead(message._id);
          if (ok) {
            message.seen = true;
            setMessagesList(data.messages);
            return await asyncStorage.store(
              DataConstants.MESSAGES,
              data.messages
            );
          }
        }
        return;
      },
      500,
      true
    ),
    [user.messages, message]
  );

  // HEADER ACTIONS
  const handleRightPress = useCallback(() => {
    navigation.navigate(Constant.PROFILE_NAVIGATOR);
  }, []);

  const handleLeftPress = useCallback(() => {
    Linking.openURL("https://seeyot-frontend.herokuapp.com/how_it_works");
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
  const handleRefresh = useCallback(
    debounce(
      async () => {
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
      },
      5000,
      true
    ),
    []
  );

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
    setSelectedMessageId("");
    setIsVisible(false);
  }, []);

  const handleMessageReply = debounce(
    async () => {
      setSendingReply(true);
      toast.current.show("Sending!", 30000);

      if (selectedMessageId) {
        const { data, ok, problem } = await messagesApi.reply(
          message._id,
          reply,
          selectedMessageId
        );
        if (ok) {
          setSendingReply(false);
          setReply("");
          setMessageCreator({
            name: data.name,
            picture: data.picture,
          });
          return toast.current.show(data.message, 1000);
        }
        setSendingReply(false);
        if (problem) {
          if (data) {
            return toast.current.show(data.message, 3000);
          }

          return toast.current.show(problem, 3000);
        }
      }

      const { data, ok, problem } = await messagesApi.reply(message._id, reply);
      if (ok) {
        setSendingReply(false);
        setReply("");
        setMessageCreator({
          name: data.name,
          picture: data.picture,
        });
        return toast.current.show(data.message, 1000);
      }
      setSendingReply(false);

      if (problem) {
        if (data) {
          return toast.current.show(data.message, 3000);
        }

        return toast.current.show(problem, 3000);
      }
    },
    1000,
    true
  );

  return (
    <>
      <Screen style={styles.container}>
        <HomeAppHeader
          onPressLeft={handleLeftPress}
          onPressRight={handleRightPress}
          rightImageUrl={
            typeof user.picture !== "undefined" ? user.picture : ""
          }
        />
        {messagesList.filter(
          (m) => dayjs(new Date()).diff(dayjs(m.createdAt), "hours") <= 24
        ).length > 0 ? (
          <HomeMessages
            messages={messagesList}
            onMessagePress={handleMessagePress}
          />
        ) : null}
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
      {isVisible ? <View style={styles.modalFallback} /> : null}
      <Modal
        visible={isVisible}
        onRequestClose={sendingReply ? null : handleCloseMessage}
        transparent
        animationType="slide"
      >
        <View style={styles.messageBackground}>
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: "flex-end",
            }}
          >
            <View style={styles.messageMainContainer}>
              <AppText
                onPress={sendingReply ? null : handleCloseMessage}
                style={styles.closeMessage}
              >
                Close
              </AppText>
              <View style={styles.messageCreatorDetails}>
                <AppImage
                  activeOpacity={1}
                  style={styles.image}
                  subStyle={styles.imageSub}
                  imageUrl={messageCreator.picture}
                />
                <View style={styles.messageDetailsContainer}>
                  <AppText style={styles.creatorName}>
                    {messageCreator.name}
                  </AppText>
                  <AppText style={styles.message}>{message.message}</AppText>
                  <AppText style={styles.createdAt}>
                    {dayjs(message.createdAt).fromNow()}
                  </AppText>
                </View>
              </View>

              {message.options.length >= 1 ? (
                <View style={styles.optionContainerMain}>
                  <ScrollView>
                    <AppText style={styles.selectOption}>
                      Select a Reply
                    </AppText>
                    {message.options.map((d, index) => (
                      <ReplyOption
                        key={d._id + index.toString()}
                        selectedMessageId={selectedMessageId}
                        option={d}
                        onPress={
                          sendingReply
                            ? null
                            : () => setSelectedMessageId(d._id)
                        }
                      />
                    ))}
                  </ScrollView>
                </View>
              ) : null}

              <View style={styles.inputContainer}>
                <TextInput
                  maxLength={250}
                  onChangeText={sendingReply ? null : setReply}
                  placeholder="Reply to know who sent this message..."
                  style={[
                    styles.inputBox,
                    { fontFamily: "Comic-Bold", fontWeight: "normal" },
                  ]}
                  value={reply}
                />
                <TouchableOpacity
                  disabled={reply.replace(/\s/g, "").length >= 1 ? false : true}
                  onPress={sendingReply ? null : handleMessageReply}
                  style={styles.send}
                >
                  <Icon
                    color={
                      reply.replace(/\s/g, "").length >= 1 && !sendingReply
                        ? defaultStyles.colors.secondary
                        : defaultStyles.colors.lightGrey
                    }
                    name="send"
                    size={scale(28)}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
        <ToastMessage reference={toast} />
      </Modal>
    </>
  );
}
const styles = ScaledSheet.create({
  closeMessage: {
    color: defaultStyles.colors.danger,
    fontSize: "14@s",
    marginBottom: "5@s",
    marginTop: "5@s",
    textAlign: "center",
    width: "100%",
  },
  contactList: {
    marginTop: "2@s",
  },
  container: {
    alignItems: "center",
  },
  createdAt: {
    color: defaultStyles.colors.lightGrey,
    fontSize: "10@s",
  },
  creatorName: {
    color: defaultStyles.colors.primary,
    fontSize: "15@s",
  },
  inputContainer: {
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: defaultStyles.colors.white,
    borderColor: defaultStyles.colors.light,
    borderRadius: "30@s",
    borderWidth: 1,
    elevation: 1,
    flexDirection: "row",
    height: defaultStyles.dimensionConstants.height,
    justifyContent: "space-between",
    marginVertical: "15@s",
    width: "92%",
  },
  inputBox: {
    borderRadius: "30@s",
    flex: 1,
    fontSize: "15@s",
    height: "100%",
    marginRight: "5@s",
    paddingHorizontal: "10@s",
    width: "86%",
  },
  messageBackground: {
    flex: 1,
    justifyContent: "flex-end",
    width: "100%",
  },
  messageMainContainer: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.white,
    borderTopLeftRadius: "20@s",
    borderTopRightRadius: "20@s",
    overflow: "hidden",
    width: "100%",
  },
  messageCreatorDetails: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.white,
    borderBottomColor: defaultStyles.colors.light,
    borderBottomWidth: 1,
    flexDirection: "row",
    marginVertical: "5@s",
    minHeight: "70@s",
    paddingHorizontal: "5@s",
    width: "95%",
  },
  messageDetailsContainer: {
    flex: 1,
    padding: "5@s",
  },
  modalFallback: {
    backgroundColor: "rgba(0,0,0,0.7)",
    height: "100%",
    position: "absolute",
    width: "100%",
    zIndex: 22,
  },
  image: {
    borderColor: defaultStyles.colors.light,
    borderRadius: "22.5@s",
    borderWidth: 1,
    height: "45@s",
    marginRight: "8@s",
    width: "45@s",
  },
  imageSub: {
    borderRadius: "22@s",
    height: "44@s",
    width: "44@s",
  },
  message: {
    borderColor: defaultStyles.colors.blue,
    borderLeftWidth: 2,
    color: defaultStyles.colors.secondary,
    opacity: 0.8,
    paddingHorizontal: "10@s",
    textAlign: "left",
  },
  optionContainerMain: {
    marginVertical: "5@s",
    width: "100%",
  },
  selectOption: {
    alignSelf: "center",
    backgroundColor: defaultStyles.colors.light,
    borderRadius: "20@s",
    fontSize: "13@s",
    height: "35@s",
    marginBottom: "10@s",
    marginLeft: "10@s",
    paddingHorizontal: "20@s",
    textAlign: "center",
    textAlignVertical: "center",
  },
  send: {
    alignItems: "center",
    height: "40@s",
    justifyContent: "center",
    marginRight: "5@s",
    width: "40@s",
  },
});

export default HomeScreen;
