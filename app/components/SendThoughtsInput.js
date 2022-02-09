import React, {
  useState,
  useContext,
  useCallback,
  useEffect,
  memo,
} from "react";
import {
  View,
  TouchableOpacity,
  TextInput,
  TouchableHighlight,
} from "react-native";
import { ScaledSheet, scale } from "react-native-size-matters";
import IonicIcons from "../../node_modules/react-native-vector-icons/Ionicons";
import LottieView from "lottie-react-native";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import AppActivityIndicator from "./ActivityIndicator";
import AppHeader from "./AppHeader";
import AppModal from "./AppModal";
import AppText from "./AppText";
import Icon from "./Icon";
import LocalThoughtsList from "./LocalThoughtsList";
import Selection from "./Selection";

import debounce from "../utilities/debounce";
import TypingContext from "../utilities/typingContext";
import localThoughts from "../utilities/localThoughts";

import thoughtsApi from "../api/thoughts";

import useMountedRef from "../hooks/useMountedRef";
import useConnection from "../hooks/useConnection";
import useAuth from "../auth/useAuth";

import defaultStyles from "../config/styles";

const typingIndicator = "typing.json";

function SendThoughtsInput({
  isRecipientActive,
  activeChat,
  onActiveChatSelection,
  onBlur,
  onFocus,
  placeholder = "Send your thoughts...",
  processing,
  style,
  submit,
  setTyping = () => null,
  isFocused,
}) {
  dayjs.extend(relativeTime);
  let currentDate = new Date();

  const { user } = useAuth();

  const [message, setMessage] = useState("");
  const isConnected = useConnection();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { typing } = useContext(TypingContext);
  const [previousThoughts, setPreviousThoughts] = useState([]);
  const [isReady, setIsReady] = useState(false);
  const mounted = useMountedRef();

  const getPreviousThoughts = async () => {
    let thoughts = await localThoughts.getLocalThoughts();
    setPreviousThoughts(thoughts);
    if (!isReady) {
      setTimeout(() => {
        setIsReady(true);
      }, 1000);
    }
  };

  const handlePress = debounce(
    () => {
      submit(message);
      setMessage("");
    },
    1000,
    true
  );

  useEffect(() => {
    if (!isFocused && mounted && isModalVisible) {
      setIsModalVisible(false);
    }
  }, [isFocused, mounted]);

  const handleCloseModal = useCallback(() => {
    setIsModalVisible(false);
  }, []);

  const handleOpenModal = useCallback(async () => {
    await localThoughts.deleteMatchedThoughts(user.thoughts);
    getPreviousThoughts();
    setIsModalVisible(true);
  }, [user.thoughts]);

  const handleOnChangeText = useCallback(
    (text) => {
      if (activeChat) {
        setTyping(text);
      }
      setMessage(text);
    },
    [setTyping, activeChat]
  );

  const handleOnSelectPreviousThought = useCallback((text) => {
    setIsModalVisible(false);
    setMessage(text);
  }, []);

  const handleDeletePress = useCallback(
    async (thought) => {
      await localThoughts.deleteThought(thought);
      let newThoughts = await localThoughts.getLocalThoughts();
      setPreviousThoughts(newThoughts);
      if (dayjs(currentDate).diff(thought.createdAt, "minutes") < 10) {
        await thoughtsApi.deleteTemporaryThought(thought.key);
      }
    },
    [currentDate]
  );

  return (
    <>
      <View style={[styles.contentContainer, style]}>
        {!activeChat ? (
          <TouchableOpacity
            disabled={!activeChat ? false : true}
            onPress={handleOpenModal}
            style={styles.previousMessages}
          >
            <IonicIcons
              color={defaultStyles.colors.white}
              name="list-circle-outline"
              size={scale(22)}
            />
          </TouchableOpacity>
        ) : null}
        <View style={[styles.container]}>
          <TouchableHighlight
            disabled={typing ? true : false}
            underlayColor={defaultStyles.colors.light}
            activeOpacity={0.8}
            onPress={onActiveChatSelection}
            style={styles.selectionContainer}
          >
            <>
              {typing && activeChat ? (
                <LottieView
                  autoPlay
                  loop
                  source={typingIndicator}
                  style={{ width: scale(30), height: scale(30) }}
                />
              ) : (
                <Selection
                  onPress={onActiveChatSelection}
                  opted={activeChat}
                  style={styles.selectActive}
                  containerStyle={{
                    borderColor: isRecipientActive
                      ? defaultStyles.colors.darkGreen
                      : defaultStyles.colors.yellow_Variant,
                  }}
                />
              )}
            </>
          </TouchableHighlight>
          <TextInput
            multiline={true}
            maxLength={250}
            onBlur={onBlur}
            onChangeText={handleOnChangeText}
            placeholder={placeholder}
            style={[
              styles.inputBox,
              { fontFamily: "ComicNeue-Bold", fontWeight: "normal" },
            ]}
            value={message}
          />
          <TouchableOpacity
            disabled={
              (!activeChat &&
                message.replace(/\s/g, "").length >= 1 &&
                isConnected) ||
              (activeChat &&
                message.replace(/\s/g, "").length >= 1 &&
                isConnected &&
                isRecipientActive)
                ? false
                : true
            }
            onPress={handlePress}
            style={styles.send}
          >
            <Icon
              color={
                (!activeChat &&
                  message.replace(/\s/g, "").length >= 1 &&
                  isConnected) ||
                (activeChat &&
                  message.replace(/\s/g, "").length >= 1 &&
                  isConnected &&
                  isRecipientActive)
                  ? defaultStyles.colors.secondary
                  : defaultStyles.colors.lightGrey
              }
              name="send"
              size={scale(28)}
            />
          </TouchableOpacity>
        </View>
      </View>
      <AppModal
        animationType="slide"
        visible={isModalVisible}
        onRequestClose={handleCloseModal}
      >
        <View style={styles.mainContainer}>
          <AppHeader
            onPressLeft={handleCloseModal}
            underlayColor={defaultStyles.colors.light}
            leftIcon="arrow-back"
            title="Thoughts History"
            titleStyle={{ color: defaultStyles.colors.primary }}
            style={{ backgroundColor: defaultStyles.colors.light }}
            leftIconColor={defaultStyles.colors.primary}
          />
          <AppText style={styles.previousThoughtInfo}>
            All the thoughts that you have sent and did not match when sent,
            appear here for future reference, so that you don't have to type the
            same Thought again. These Thoughts are saved locally on your device.
            Press on any of these Thoughts to edit and send or directly send
            them. If you would like to delete the Thought before getting matched
            then delete it within 10 minutes while the delete icon is yellow.
          </AppText>
          {isReady ? (
            <LocalThoughtsList
              thoughts={previousThoughts}
              onPress={handleOnSelectPreviousThought}
              onDeletePress={handleDeletePress}
            />
          ) : (
            <AppActivityIndicator />
          )}
        </View>
      </AppModal>
    </>
  );
}
const styles = ScaledSheet.create({
  container: {
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: defaultStyles.colors.white,
    borderRadius: "30@s",
    flexDirection: "row",
    flexShrink: 1,
    justifyContent: "space-between",
    minHeight: "38@s",
    width: "100%",
  },
  contentContainer: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.white,
    borderTopColor: defaultStyles.colors.light,
    borderTopWidth: 1,
    elevation: 10,
    flexDirection: "row",
    overflow: "hidden",
    paddingHorizontal: "10@s",
    paddingVertical: "5@s",
    width: "100%",
  },
  inputBox: {
    borderRadius: "30@s",
    flex: 1,
    fontSize: "14@s",
    height: "100%",
    marginRight: "5@s",
    paddingHorizontal: "5@s",
    width: "100%",
  },
  mainContainer: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.light,
    borderTopLeftRadius: "25@s",
    borderTopRightRadius: "25@s",
    flex: 1,
    overflow: "hidden",
    width: "100%",
  },
  sendIconProcessingContainer: {
    alignItems: "center",
    borderRadius: "20@s",
    height: "40@s",
    justifyContent: "center",
    marginRight: "5@s",
    overflow: "hidden",
    width: "40@s",
  },
  send: {
    alignItems: "center",
    borderRadius: "20@s",
    height: "40@s",
    justifyContent: "center",
    overflow: "hidden",
    width: "40@s",
  },
  previousMessages: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.blue,
    borderRadius: "18@s",
    height: "36@s",
    justifyContent: "center",
    marginRight: "5@s",
    overflow: "hidden",
    paddingLeft: "2@s",
    width: "36@s",
  },
  previousThoughtInfo: {
    backgroundColor: defaultStyles.colors.white,
    borderBottomWidth: 1,
    borderColor: defaultStyles.colors.lightGrey,
    borderTopWidth: 1,
    color: defaultStyles.colors.dark_Variant,
    fontSize: "12@s",
    paddingHorizontal: "20@s",
    paddingTop: "10@s",
    textAlign: "center",
    width: "100%",
  },
  selectActive: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.light,
    borderRadius: "18@s",
    height: "35@s",
    justifyContent: "center",
    width: "35@s",
  },
  selectionContainer: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.light,
    borderRadius: "18@s",
    elevation: 1,
    justifyContent: "center",
    height: "36@s",
    width: "36@s",
  },
  title: {
    color: defaultStyles.colors.primary,
    fontSize: "17@s",
    paddingVertical: "10@s",
    textAlign: "center",
    width: "100%",
  },
});

export default memo(SendThoughtsInput);
