import React, { useCallback, useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { useIsFocused } from "@react-navigation/native";

import Alert from "../components/Alert";
import AppActivityIndicator from "../components/ActivityIndicator";
import AppHeader from "../components/AppHeader";
import InfoAlert from "../components/InfoAlert";
import RepliesList from "../components/RepliesList";
import ReplyModal from "../components/ReplyModal";
import Screen from "../components/Screen";
import ScreenSub from "../components/ScreenSub";

import debounce from "../utilities/debounce";

import messagesApi from "../api/messages";

import defaultProps from "../utilities/defaultProps";
import apiActivity from "../utilities/apiActivity";

function RepliesScreen({ navigation }) {
  const [replies, setReplies] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const isFocused = useIsFocused();
  const { tackleProblem } = apiActivity;
  let isUnmounting = false;

  const [message, setMessage] = useState({
    isVisible: false,
    message: defaultProps.defaultMessage,
  });

  const [messageToDelete, setMessageToDelete] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  const [infoAlert, setInfoAlert] = useState({
    infoAlertMessage: "",
    showInfoAlert: false,
  });

  const [isReady, setIsReady] = useState(false);

  // MODAL MESSAGE ACTION

  // OnUnmount
  useEffect(() => {
    return () => (isUnmounting = true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setMessage({ message: defaultProps.defaultMessage, isVisible: false });
  }, []);

  const handleOpenModal = useCallback((message) => {
    setMessage({ message: message, isVisible: true });
  }, []);

  const handleBackPress = useCallback(
    debounce(() => navigation.goBack(), 500, true),
    []
  );

  const handleSetMessageToDelete = (item) => {
    setMessageToDelete(item._id);
    setShowAlert(true);
  };

  const handleDeletePress = async () => {
    let originalList = [...replies];
    let newListOfMessages = replies.filter((r) => r._id != messageToDelete);
    if (!isUnmounting) {
      setReplies(newListOfMessages);
      setShowAlert(false);
    }

    const { ok, data, problem } = await messagesApi.deleteMessage(
      messageToDelete
    );
    if (ok) {
      return;
    }
    if (!isUnmounting) {
      setReplies(originalList);
      tackleProblem(problem, data, setInfoAlert);
    }
  };

  const allReplies = async () => {
    if (isReady) return;
    let { ok, data, problem } = await messagesApi.getAllRepliedMessages();
    if (ok) {
      if (!isReady && !isUnmounting) {
        setIsReady(true);
      }
      if (!isUnmounting) {
        return setReplies(data.allReplies);
      }
      return;
    }
    if (!isReady && !isUnmounting) {
      setIsReady(true);
    }
    if (!isUnmounting) {
      tackleProblem(problem, data, setInfoAlert);
    }
  };

  useEffect(() => {
    if (!isFocused && !isUnmounting && infoAlert.showInfoAlert === true) {
      setInfoAlert({
        infoAlertMessage: false,
        showInfoAlert: false,
      });
    }
  }, [isFocused]);

  useEffect(() => {
    if (!isFocused && !isUnmounting && message.isVisible === true) {
      setMessage({
        message: defaultProps.defaultMessage,
        isVisible: false,
      });
    }
  }, [isFocused]);

  useEffect(() => {
    if (!isFocused && !isUnmounting && showAlert === true) {
      setShowAlert(false);
    }
  }, [isFocused]);

  useEffect(() => {
    if (isFocused && !isUnmounting) {
      allReplies();
    }
  }, [isFocused]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await allReplies();
    setRefreshing(false);
  }, []);

  // INFO ALERT ACTION
  const handleCloseInfoAlert = useCallback(
    () => setInfoAlert({ ...infoAlert, showInfoAlert: false }),
    []
  );

  const handleCloseAlert = () => setShowAlert(false);

  return (
    <>
      <Screen style={styles.container}>
        <AppHeader
          title="All Replies"
          leftIcon="arrow-back"
          onPressLeft={handleBackPress}
        />
        <ScreenSub>
          {!isReady ? (
            <AppActivityIndicator />
          ) : (
            <RepliesList
              onModalOpenPress={handleOpenModal}
              replies={replies.sort((a, b) => a.createdAt < b.createdAt)}
              onDeletePress={handleSetMessageToDelete}
              refreshing={refreshing}
              onRefresh={handleRefresh}
            />
          )}
        </ScreenSub>
      </Screen>
      <InfoAlert
        leftPress={handleCloseInfoAlert}
        description={infoAlert.infoAlertMessage}
        visible={infoAlert.showInfoAlert}
      />
      <Alert
        onRequestClose={handleCloseAlert}
        description="Are you sure you want to delete this message?"
        leftPress={handleCloseAlert}
        leftOption="Cancel"
        rightOption="Ok"
        rightPress={handleDeletePress}
        setVisible={setShowAlert}
        title="Delete this Message"
        visible={showAlert}
      />
      {message.isVisible ? <View style={styles.modalFallback} /> : null}
      <ReplyModal message={message} handleCloseModal={handleCloseModal} />
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    //backgroundColor: defaultStyles.colors.white,
  },
  modalFallback: {
    backgroundColor: "rgba(0,0,0,0.7)",
    height: "100%",
    position: "absolute",
    width: "100%",
    zIndex: 22,
  },
});

export default RepliesScreen;
