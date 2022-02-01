import React, { useState, useContext, useCallback, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  TextInput,
  TouchableHighlight,
} from "react-native";
import { ScaledSheet, scale } from "react-native-size-matters";
import IonicIcons from "../../node_modules/react-native-vector-icons/Ionicons";
import LottieView from "lottie-react-native";

import AppModal from "./AppModal";
import AppText from "./AppText";
import AppActivityIndicator from "./ActivityIndicator";
import Icon from "./Icon";
import Selection from "./Selection";

import defaultStyles from "../config/styles";
import debounce from "../utilities/debounce";
import useConnection from "../hooks/useConnection";
import TypingContext from "../utilities/typingContext";
import localThoughts from "../utilities/localThoughts";
import LocalThoughtsList from "./LocalThoughtsList";
import AppHeader from "./AppHeader";

import useMountedRef from "../hooks/useMountedRef";

const typingIndicator = require("../assets/animations/typing.json");

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

  const handleOpenModal = useCallback(() => {
    getPreviousThoughts();
    setIsModalVisible(true);
  }, []);

  const handleOnChangeText = (text) => {
    setTyping(text);
    setMessage(text);
  };

  const handleOnSelectPreviousThought = (text) => {
    setIsModalVisible(false);
    setMessage(text);
  };

  const handleDeletePress = async (thought) => {
    await localThoughts.deleteThought(thought);
    let newThoughts = await localThoughts.getLocalThoughts();
    setPreviousThoughts(newThoughts);
  };

  return (
    <>
      <View style={[{ flexDirection: "row", width: "98%" }, style]}>
        <View style={[styles.container]}>
          <TouchableHighlight
            underlayColor={defaultStyles.colors.light}
            activeOpacity={0.8}
            onPress={onActiveChatSelection}
            style={styles.selectionContainer}
          >
            <>
              {typing ? (
                <LottieView
                  autoPlay
                  loop
                  source={typingIndicator}
                  style={{ width: scale(25), height: scale(25) }}
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
            maxLength={250}
            onBlur={onBlur}
            onChangeText={handleOnChangeText}
            onFocus={onFocus}
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
        {!activeChat ? (
          <TouchableOpacity
            disabled={!activeChat ? false : true}
            onPress={handleOpenModal}
            style={styles.previousMessages}
          >
            <IonicIcons
              color={defaultStyles.colors.white}
              name="list-circle-outline"
              size={scale(25)}
            />
          </TouchableOpacity>
        ) : null}
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
            All the thoughts that you have sent and did not match, appear here
            for future reference, so that you don't have to type the same
            Thought again. These Thoughts are saved locally on your device.
            Press on any of these Thoughts to edit and send or directly send
            them.
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
    borderColor: defaultStyles.colors.light,
    borderRadius: "30@s",
    borderWidth: 1,
    elevation: 1,
    flexDirection: "row",
    height: "38@s",
    justifyContent: "space-between",
    width: "100%",
    flexShrink: 1,
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
  mainContainer: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.light,
    borderTopLeftRadius: "25@s",
    borderTopRightRadius: "25@s",
    flex: 1,
    overflow: "hidden",
    width: "100%",
  },
  send: {
    alignItems: "center",
    borderRadius: "20@s",
    height: "40@s",
    justifyContent: "center",
    marginRight: "5@s",
    overflow: "hidden",
    width: "40@s",
  },
  previousMessages: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.blue,
    borderRadius: "20@s",
    height: "40@s",
    justifyContent: "center",
    marginLeft: "5@s",
    overflow: "hidden",
    paddingLeft: "2@s",
    width: "40@s",
  },
  previousThoughtInfo: {
    backgroundColor: defaultStyles.colors.white,
    borderBottomWidth: 1,
    borderColor: defaultStyles.colors.lightGrey,
    borderTopWidth: 1,
    color: defaultStyles.colors.dark_Variant,
    fontSize: "13@s",
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
    borderRadius: "50@s",
    elevation: 3,
    justifyContent: "center",
    height: "36@s",
    width: "55@s",
  },
  title: {
    color: defaultStyles.colors.primary,
    fontSize: "17@s",
    paddingVertical: "10@s",
    textAlign: "center",
    width: "100%",
  },
});

export default SendThoughtsInput;
