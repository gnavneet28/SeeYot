import React, { useState, useEffect, useCallback, useMemo } from "react";
import { StyleSheet, View, Modal, ScrollView } from "react-native";
import { useIsFocused } from "@react-navigation/native";

import ApiActivity from "../components/ApiActivity";
import AppActivityIndicator from "../components/ActivityIndicator";
import AppButton from "../components/AppButton";
import AppHeader from "../components/AppHeader";
import AppText from "../components/AppText";
import AppTextInput from "../components/AppTextInput";
import EchoMessageList from "../components/EchoMessageList";
import HelpDialogueBox from "../components/HelpDialogueBox";
import Screen from "../components/Screen";

import InfoAlert from "../components/InfoAlert";

import asyncStorage from "../utilities/cache";
import apiFlow from "../utilities/ApiActivityStatus";
import debounce from "../utilities/debounce";

import useAuth from "../auth/useAuth";

import echosApi from "../api/echos";
import myApi from "../api/my";
import usersApi from "../api/users";

import defaultStyles from "../config/styles";

function AddEchoScreen({ navigation, route }) {
  const { recipient, from } = route.params;
  const { apiActivityStatus, initialApiActivity } = apiFlow;

  const { user, setUser } = useAuth();
  const isFocused = useIsFocused();

  const [isReady, setIsReady] = useState(false);
  const [message, setMessage] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [echoMessageOption, setEchoMessageOption] = useState(null);
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
  const [showHelp, setShowHelp] = useState(false);

  // API ACTIVITY ACTIONS
  const handleApiActivityClose = useCallback(
    () => setApiActivity({ ...apiActivity, visible: false }),
    []
  );

  // INFO ALERT ACTION
  const handleCloseInfoAlert = useCallback(
    () => setInfoAlert({ ...infoAlert, showInfoAlert: false }),
    []
  );

  // ON PAGE FOCUS ACTION
  const updateSearchHistory = async () => {
    let modifiedUser = { ...user };
    const { ok, data } = await usersApi.addToSearchHstory(recipient);
    if (ok) {
      modifiedUser.searchHistory = data;
      setUser(modifiedUser);
      return await asyncStorage.store("userSearchHistory", data);
    }
  };

  const updateThisEchoMessage = useCallback(async () => {
    const { ok, problem, data } = await myApi.updateThisEchoMessage(
      recipient._id
    );
    if (ok) {
      let modifiedUser = { ...user };
      modifiedUser.echoMessage = data;
      setUser(modifiedUser);
      return await asyncStorage.store("userEchoMessage", data);
    }
  }, [user]);

  const setEchoMessage = useCallback(() => {
    let echoMessages =
      typeof user.echoMessage !== "undefined" ? user.echoMessage : [];
    const echoMessage = echoMessages.filter(
      (m) => m.messageFor == recipient._id
    )[0];
    if (echoMessage) {
      return echoMessage;
    }
  }, [recipient._id, isFocused]);

  const setUpPage = () => {
    updateThisEchoMessage();
    const echoMessage = setEchoMessage();
    setMessage(echoMessage ? echoMessage.message : "");
    setIsReady(true);
  };

  useEffect(() => {
    if (isFocused) {
      setUpPage();
      if (from == "VipSearchScreen") {
        updateSearchHistory();
      }
    }
  }, [isFocused]);

  // ECHO_MESSAGE LIST DATA AND ACTION
  const data = useMemo(
    () => user.echoMessage,
    [user.echoMessage.length, user.echoMessage]
  );

  const handleOnEchoMessagePress = useCallback((item) => {
    setEchoMessageOption(item);
    setIsVisible(true);
  }, []);

  // ECHO_MESSAGE SAVE ACTION
  const handleSave = useCallback(async () => {
    initialApiActivity(setApiActivity, "Updating your Echo Message...");
    let modifiedUser = { ...user };

    const response = await usersApi.updateEcho(recipient._id, message);
    if (response.ok) {
      modifiedUser.echoMessage = response.data.echoMessage;
      await asyncStorage.store("userEchoMessage", response.data.echoMessage);
      setUser(modifiedUser);
    }

    return apiActivityStatus(response, setApiActivity);
  }, [message, recipient._id, user]);

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
  const handleHelpPress = useCallback(() => {
    setShowHelp(true);
  }, []);

  const handleCloseHelp = useCallback(() => {
    setShowHelp(false);
  }, []);

  // ECHO_MESSAGE MODAL ACTIONS
  const handleModalClose = useCallback(() => setIsVisible(false), []);

  const handleCloseModal = useCallback(() => {
    setEchoMessageOption(null);
    setIsVisible(false);
  }, []);

  const handleUseThisEchoPress = useCallback(() => {
    setMessage(echoMessageOption.message);
    setIsVisible(false);
  }, [message, echoMessageOption]);

  const handleDeleteEchoPress = useCallback(async () => {
    initialApiActivity(setApiActivity, "Deleting this Echo Message...");
    let modifiedUser = { ...user };

    const response = await echosApi.deleteEcho(echoMessageOption._id);

    if (response.ok) {
      modifiedUser.echoMessage = response.data.echoMessage;
      await asyncStorage.store("userEchoMessage", response.data.echoMessage);
      setUser(modifiedUser);
      setIsVisible(false);
      setEchoMessageOption(null);
    }

    return apiActivityStatus(response, setApiActivity);
  }, [user.echoMessage.length, echoMessageOption, user]);

  return (
    <>
      <Screen style={styles.container}>
        <AppHeader
          title="Add Echo"
          leftIcon="arrow-back"
          onPressLeft={handleBack}
          rightIcon="help-outline"
          onPressRight={handleHelpPress}
        />
        <HelpDialogueBox
          information="Echo messages are flash messages and will only be displayed when a person interacts with you by either tapping on your profile picture or by sending you thoughts. You can set the type of interaction from your profile."
          onPress={handleCloseHelp}
          setVisible={setShowHelp}
          style={styles.helpDialogue}
          visible={showHelp}
        />
        <InfoAlert
          leftPress={handleCloseInfoAlert}
          description={infoAlert.infoAlertMessage}
          visible={infoAlert.showInfoAlert}
        />
        <ApiActivity
          message={apiActivity.message}
          onDoneButtonPress={handleApiActivityClose}
          onRequestClose={handleApiActivityClose}
          processing={apiActivity.processing}
          success={apiActivity.success}
          visible={apiActivity.visible}
        />
        <ScrollView contentContainerStyle={{ flex: 1 }}>
          <View
            style={{
              flexGrow: 1,
              alignItems: "center",
            }}
          >
            {!isReady ? (
              <AppActivityIndicator />
            ) : (
              <>
                <View style={styles.echoMessageListContainer}>
                  <AppText style={styles.allEchoMessagesText}>
                    All Echo Messages
                  </AppText>
                  {data.length ? (
                    <EchoMessageList
                      onEchoMessagePress={handleOnEchoMessagePress}
                      echoMessages={data}
                    />
                  ) : null}
                </View>
                <View style={styles.inputBoxContainer}>
                  <AppTextInput
                    maxLength={100}
                    multiline={true}
                    numberOfLines={4}
                    onChangeText={setMessage}
                    placeholder={`Enter your echo message for ${recipient.name}...`}
                    style={styles.inputBox}
                    subStyle={styles.textInputSub}
                    value={message}
                  />
                  <AppText style={{ textAlign: "right" }}>
                    {message.length}/100
                  </AppText>
                </View>
                <AppButton
                  disabled={message ? false : true}
                  onPress={handleSave}
                  style={styles.button}
                  subStyle={{ color: defaultStyles.colors.primary }}
                  title="Save"
                />
              </>
            )}
          </View>
        </ScrollView>
      </Screen>
      <Modal
        onRequestClose={handleModalClose}
        transparent={true}
        visible={isVisible}
      >
        <View style={styles.echoOptionMainContainer}>
          <View style={styles.optionsContainer}>
            <AppText style={[styles.optionClose]} onPress={handleCloseModal}>
              Close
            </AppText>

            <AppText style={styles.option} onPress={handleDeleteEchoPress}>
              Delete
            </AppText>
            <AppText style={styles.option} onPress={handleUseThisEchoPress}>
              Use this ehco
            </AppText>
          </View>
        </View>
      </Modal>
    </>
  );
}
const styles = StyleSheet.create({
  allEchoMessagesText: {
    color: defaultStyles.colors.dark,
    textAlign: "left",
    width: "100%",
  },
  button: {
    alignSelf: "center",
    backgroundColor: defaultStyles.colors.yellow_Variant,
    borderRadius: 10,
    height: defaultStyles.dimensionConstants.height,
    width: "90%",
  },
  container: {
    backgroundColor: defaultStyles.colors.white,
  },
  echoMessageListContainer: {
    marginTop: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
    width: "100%",
  },
  echoOptionMainContainer: {
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
    flex: 1,
    justifyContent: "center",
    width: "100%",
  },
  helpDialogue: {
    padding: 5,
    position: "absolute",
    right: 12,
    top: 48,
  },
  inputBoxContainer: {
    backgroundColor: defaultStyles.colors.white,
    borderColor: defaultStyles.colors.lightGrey,
    borderRadius: 10,
    borderWidth: 1,
    elevation: 1,
    marginBottom: 10,
    overflow: "hidden",
    padding: 5,
    width: "90%",
  },
  inputBox: {
    borderRadius: 5,
    height: 70,
    marginBottom: 5,
    paddingHorizontal: 15,
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
  optionClose: {
    borderBottomColor: defaultStyles.colors.light,
    borderBottomWidth: 1,
    color: defaultStyles.colors.blue,
    fontSize: 18,
    height: defaultStyles.dimensionConstants.height,
    opacity: 0.8,
    textAlign: "center",
    textAlignVertical: "center",
    width: "100%",
  },
  textInputSub: {
    textAlignVertical: "top",
    fontSize: 18,
  },
});

export default AddEchoScreen;
