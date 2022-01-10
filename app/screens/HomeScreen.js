import React, {
  useState,
  useCallback,
  useMemo,
  useEffect,
  useContext,
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
import AntDesign from "react-native-vector-icons/AntDesign";

import ApiProcessingContainer from "../components/ApiProcessingContainer";
import AppImage from "../components/AppImage";
import AppText from "../components/AppText";
import ContactList from "../components/ContactList";
import HomeAppHeader from "../components/HomeAppHeader";
import HomeMessages from "../components/HomeMessages";
import Icon from "../components/Icon";
import InfoAlert from "../components/InfoAlert";
import ReplyOption from "../components/ReplyOption";
import Screen from "../components/Screen";

import Constant from "../navigation/NavigationConstants";

import useAuth from "../auth/useAuth";

import myApi from "../api/my";
import messagesApi from "../api/messages";

import useMountedRef from "../hooks/useMountedRef";
import useConnection from "../hooks/useConnection";

import defaultStyles from "../config/styles";

import storeDetails from "../utilities/storeDetails";
import debounce from "../utilities/debounce";
import SuccessMessageContext from "../utilities/successMessageContext";
import apiActivity from "../utilities/apiActivity";
import authorizeUpdates from "../utilities/authorizeUpdates";

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
  const mounted = useMountedRef().current;
  const isFocused = useIsFocused();
  const isConnected = useConnection();
  const { setSuccess } = useContext(SuccessMessageContext);
  const { tackleProblem, showSucessMessage } = apiActivity;

  const [infoAlert, setInfoAlert] = useState({
    showInfoAlert: false,
    infoAlertMessage: "",
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
  const [refreshing, setRefreshing] = useState(false);

  const clearJunkData = async () => {
    let canUpdate = await authorizeUpdates.authorizeExpiredUpdate();
    if (!canUpdate) return;
    const { ok, data, problem } = await myApi.clearExpiredData();
    if (ok) return await authorizeUpdates.updateExpiredUpdate();
    if (problem) return;
  };

  const updateAllContacts = async () => {
    let canUpdate = await authorizeUpdates.authorizeContactsUpdate();
    if (!canUpdate) return;
    const { ok, data, problem } = await myApi.updateMyContacts();
    if (ok) {
      setUser(data.user);
      await storeDetails(data.user);
      return await authorizeUpdates.updateContactsUpdate();
    }
    return;
  };

  const updateAllReadMessages = async () => {
    let canUpdate = await authorizeUpdates.authorizeReadMessagesUpdate();
    if (!canUpdate) return;
    const { ok, problem } = await messagesApi.updateAllMessages();
    if (ok) return await authorizeUpdates.updateReadMessagesUpdate();
    if (problem) return;
  };

  useEffect(() => {
    clearJunkData();
    updateAllReadMessages();
    updateAllContacts();
  }, []);

  useEffect(() => {
    let messages = user.messages ? user.messages : [];
    setMessagesList(messages);
  }, [user]);

  useEffect(() => {
    if (!isFocused && mounted && isVisible) {
      setIsVisible(false);
    }
  }, [isFocused, mounted]);

  useEffect(() => {
    if (!isFocused && mounted && messageCreator.picture) {
      setMessageCreator({
        name: "************",
        picture: "",
      });
    }
  }, [isFocused, mounted]);

  useEffect(() => {
    if (!isFocused && mounted && infoAlert.showInfoAlert === true) {
      setInfoAlert({
        infoAlertMessage: "",
        showInfoAlert: false,
      });
    }
  }, [isFocused, mounted]);

  useEffect(() => {
    if (mounted && selectedMessageId) {
      setSelectedMessageId("");
    }
  }, [isFocused, mounted]);

  // MESSAGES ACTION

  const handleMessagePress = useCallback(
    debounce(
      async (message) => {
        setMessage(message);
        setIsVisible(true);
        if (message.seen === false) {
          const { ok, data, problem } = await messagesApi.markRead(message._id);
          if (ok) {
            setMessagesList(data.messages);
            await storeDetails(data.user);
            return setUser(data.user);
          }
          return;
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
    Linking.openURL("http://www.seeyot.com/how_it_works");
  }, []);

  // EMPTY FRIENDLIST
  const handleAddFriendPress = useCallback(
    () => navigation.navigate(Constant.ADD_CONTACTS_SCREEN),
    []
  );

  // INFO ALERT ACTIONS
  const handleCloseInfoAlert = useCallback(
    () => setInfoAlert({ ...infoAlert, showInfoAlert: false }),
    []
  );

  // REFRESH ACTION
  const handleRefresh = useCallback(
    debounce(
      async () => {
        setRefreshing(true);

        const { data, ok, problem } = await myApi.updateMyContacts();
        if (ok) {
          await storeDetails(data.user);
          setUser(data.user);
          return setRefreshing(false);
        }
        setRefreshing(false);
        tackleProblem(problem, data, setInfoAlert);
      },
      5000,
      true
    ),
    [user]
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
      setInfoAlert({
        infoAlertMessage: "Something went wrong! Please try again.",
        showInfoAlert: true,
      });
    },
    [infoAlert.infoAlertMessage, infoAlert.showInfoAlert]
  );

  const handleAddEchoButtonPress = useCallback(
    (user) => {
      if (user) {
        return navigation.navigate(Constant.ADD_ECHO_SCREEN, {
          recipient: user,
          from: Constant.HOME_SCREEN,
        });
      }
      setInfoAlert({
        infoAlertMessage: "Something went wrong! Please try again.",
        showInfoAlert: true,
      });
    },
    [infoAlert.infoAlertMessage, infoAlert.showInfoAlert]
  );

  const data = useMemo(
    () =>
      typeof user.contacts !== "undefined"
        ? user.contacts.sort((a, b) => a.name > b.name)
        : [],
    [user, user.contacts]
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
          return showSucessMessage(setSuccess, "Reply Sent!");
        }
        setSendingReply(false);
        tackleProblem(problem, data, setInfoAlert);
      }

      const { data, ok, problem } = await messagesApi.reply(message._id, reply);
      if (ok) {
        setSendingReply(false);
        setReply("");
        setMessageCreator({
          name: data.name,
          picture: data.picture,
        });
        return showSucessMessage(setSuccess, "Reply Sent!");
      }
      setSendingReply(false);
      tackleProblem(problem, data, setInfoAlert);
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
        <InfoAlert
          description={infoAlert.infoAlertMessage}
          leftPress={handleCloseInfoAlert}
          visible={infoAlert.showInfoAlert}
        />
        <ContactList
          onAddEchoPress={handleAddEchoButtonPress}
          onAddFriendPress={handleAddFriendPress}
          onRefresh={handleRefresh}
          onSendThoughtsPress={handleOnSendThoughtButtonPress}
          refreshing={refreshing}
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
            keyboardShouldPersistTaps="always"
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: "flex-end",
            }}
          >
            <View style={styles.closeMessageIconContainer}>
              <AntDesign
                onPress={sendingReply ? null : handleCloseMessage}
                name="downcircle"
                color={defaultStyles.colors.tomato}
                size={scale(28)}
              />
            </View>
            <View style={styles.messageMainContainer}>
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
                  <ScrollView keyboardShouldPersistTaps="always">
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
                  editable={!sendingReply}
                  maxLength={250}
                  onChangeText={setReply}
                  placeholder="Reply to know who sent this message..."
                  style={[
                    styles.inputBox,
                    { fontFamily: "Comic-Bold", fontWeight: "normal" },
                  ]}
                  value={reply}
                />
                <TouchableOpacity
                  disabled={
                    reply.replace(/\s/g, "").length >= 1 && isConnected
                      ? false
                      : true
                  }
                  onPress={
                    sendingReply || !isConnected ? null : handleMessageReply
                  }
                  style={styles.send}
                >
                  <ApiProcessingContainer processing={sendingReply}>
                    <Icon
                      color={
                        reply.replace(/\s/g, "").length >= 1 &&
                        !sendingReply &&
                        isConnected
                          ? defaultStyles.colors.secondary
                          : defaultStyles.colors.lightGrey
                      }
                      name="send"
                      size={scale(28)}
                    />
                  </ApiProcessingContainer>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </>
  );
}
const styles = ScaledSheet.create({
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
    backgroundColor: defaultStyles.colors.light,
    borderRadius: "30@s",
    flexDirection: "row",
    height: "38@s",
    justifyContent: "space-between",
    marginVertical: "15@s",
    width: "90%",
  },
  inputBox: {
    borderRadius: "30@s",
    flex: 1,
    fontSize: "14@s",
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
    borderTopLeftRadius: "10@s",
    borderTopRightRadius: "10@s",
    overflow: "hidden",
    paddingTop: "20@s",
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
    borderColor: defaultStyles.colors.yellow_Variant,
    borderLeftWidth: 2,
    color: defaultStyles.colors.secondary,
    fontSize: "14@s",
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
    marginBottom: "10@s",
    marginLeft: "10@s",
    paddingHorizontal: "10@s",
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
