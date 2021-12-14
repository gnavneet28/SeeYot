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

import debounce from "../utilities/debounce";

import messagesApi from "../api/messages";

import useMountedRef from "../hooks/useMountedRef";

import defaultStyles from "../config/styles";
import defaultProps from "../utilities/defaultProps";

function RepliesScreen({ navigation }) {
  const [replies, setReplies] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const mounted = useMountedRef().current;
  const isFocused = useIsFocused();

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
    setReplies(newListOfMessages);
    setShowAlert(false);

    const { ok, data, problem } = await messagesApi.deleteMessage(
      messageToDelete
    );
    if (ok) {
      return;
    }
    setReplies(originalList);
    if (problem) {
      if (data) {
        return setInfoAlert({
          infoAlertMessage: data.message,
          showInfoAlert: true,
        });
      }

      return setInfoAlert({
        infoAlertMessage: "Something went wrong! Please try again.",
        showInfoAlert: true,
      });
    }
  };

  const allReplies = async () => {
    let { ok, data, problem } = await messagesApi.getAllRepliedMessages();
    if (ok) {
      return setReplies(data.allReplies);
    }
    setInfoAlert({
      infoAlertMessage: "Something went wrong! Please try again.",
      showInfoAlert: true,
    });
  };

  useEffect(() => {
    if (!isFocused && mounted && infoAlert.showInfoAlert === true) {
      setInfoAlert({
        infoAlertMessage: false,
        showInfoAlert: false,
      });
    }
  }, [isFocused, mounted]);

  useEffect(() => {
    if (!isFocused && mounted && message.isVisible === true) {
      setMessage({
        message: defaultProps.defaultMessage,
        isVisible: false,
      });
    }
  }, [isFocused, mounted]);

  useEffect(() => {
    if (!isFocused && mounted && showAlert === true) {
      setShowAlert(false);
    }
  }, [isFocused, mounted]);

  useEffect(() => {
    if (isFocused) {
      allReplies();
      if (!isReady) {
        setIsReady(true);
      }
    }
  }, [isFocused]);

  const handleRefresh = () => {
    allReplies();
  };

  // INFO ALERT ACTION
  const handleCloseInfoAlert = useCallback(
    () => setInfoAlert({ ...infoAlert, showInfoAlert: false }),
    []
  );

  return (
    <>
      <Screen style={styles.container}>
        <AppHeader
          title="All Replies"
          leftIcon="arrow-back"
          onPressLeft={handleBackPress}
        />
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
      </Screen>
      <InfoAlert
        leftPress={handleCloseInfoAlert}
        description={infoAlert.infoAlertMessage}
        visible={infoAlert.showInfoAlert}
      />
      <Alert
        onRequestClose={() => setShowAlert(false)}
        description="Are you sure you want to delete this message?"
        leftPress={() => setShowAlert(false)}
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
    backgroundColor: defaultStyles.colors.white,
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
