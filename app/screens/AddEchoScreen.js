import React, { useState, useEffect, useCallback, useMemo } from "react";
import { View, Modal, ScrollView } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { ScaledSheet, scale } from "react-native-size-matters";

import ApiActivity from "../components/ApiActivity";
import AppActivityIndicator from "../components/ActivityIndicator";
import AppButton from "../components/AppButton";
import AppHeader from "../components/AppHeader";
import AppText from "../components/AppText";
import AppTextInput from "../components/AppTextInput";
import EchoMessageList from "../components/EchoMessageList";
import HelpDialogueBox from "../components/HelpDialogueBox";
import Option from "../components/Option";
import Screen from "../components/Screen";

import Constant from "../navigation/NavigationConstants";
import DataConstants from "../utilities/DataConstants";
import useMountedRef from "../hooks/useMountedRef";

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
  const mounted = useMountedRef().current;

  const [isReady, setIsReady] = useState(false);
  const [initialMessage, setInitialMessage] = useState("");
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

  const updateAllEchoMessages = useCallback(async () => {
    const { ok, data, problem } = await myApi.updateMyEchoMessages();
    if (ok) {
      let modifiedUser = { ...user };
      modifiedUser.echoMessage = data.echoMessages;
      setUser(modifiedUser);
      return await asyncStorage.store(
        DataConstants.ECHO_MESSAGE,
        data.echoMessages
      );
    }
    if (problem) return;
  }, [user]);

  useEffect(() => {
    updateAllEchoMessages();
  }, []);

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
    const echoMessage = setEchoMessage();
    setMessage(echoMessage ? echoMessage.message : "");
    setInitialMessage(echoMessage ? echoMessage.message : "");
    setIsReady(true);
  };

  useEffect(() => {
    if (isFocused) {
      setUpPage();
    }
  }, [isFocused]);

  useEffect(() => {
    if (!isFocused && mounted && isVisible) {
      setIsVisible(false);
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
    if (!isFocused && mounted && apiActivity.visible === true) {
      setApiActivity({
        message: "",
        processing: true,
        visible: false,
        success: false,
      });
    }
  }, [isFocused, mounted]);

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
  const handleSave = useCallback(
    debounce(
      async () => {
        if (message == initialMessage) return;
        initialApiActivity(setApiActivity, "Updating your Echo Message...");
        let modifiedUser = { ...user };

        const response = await usersApi.updateEcho(recipient._id, message);
        if (response.ok) {
          modifiedUser.echoMessage = response.data.echoMessage;
          await asyncStorage.store(
            DataConstants.ECHO_MESSAGE,
            response.data.echoMessage
          );
          setUser(modifiedUser);
        }

        return apiActivityStatus(response, setApiActivity);
      },
      1000,
      true
    ),
    [message, recipient._id, user]
  );

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

  const handleDeleteEchoPress = useCallback(
    debounce(
      async () => {
        initialApiActivity(setApiActivity, "Deleting this Echo Message...");
        let modifiedUser = { ...user };

        const response = await echosApi.deleteEcho(echoMessageOption._id);

        if (response.ok) {
          modifiedUser.echoMessage = response.data.echoMessage;
          await asyncStorage.store(
            DataConstants.ECHO_MESSAGE,
            response.data.echoMessage
          );
          setUser(modifiedUser);
          setIsVisible(false);
          setEchoMessageOption(null);
        }

        return apiActivityStatus(response, setApiActivity);
      },
      1000,
      true
    ),
    [user.echoMessage.length, echoMessageOption, user]
  );

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
        <ScrollView
          keyboardShouldPersistTaps="always"
          contentContainerStyle={{ flex: 1 }}
        >
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
                  <AppText style={styles.saveEchoInfo}>
                    What would you like to say when {recipient.name} taps on
                    your Display Picture or sends you thoughts.
                  </AppText>
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
                  <AppText style={{ textAlign: "right", fontSize: scale(10) }}>
                    {message.length}/100
                  </AppText>
                </View>
                <AppButton
                  disabled={
                    message.replace(/\s/g, "").length >= 1 ? false : true
                  }
                  onPress={handleSave}
                  style={styles.button}
                  subStyle={{ color: defaultStyles.colors.secondary }}
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
            <Option
              title="Close"
              titleStyle={styles.optionClose}
              onPress={handleCloseModal}
            />

            <Option title="Delete" onPress={handleDeleteEchoPress} />

            <Option title="Use this echo" onPress={handleUseThisEchoPress} />
          </View>
        </View>
      </Modal>
    </>
  );
}
const styles = ScaledSheet.create({
  allEchoMessagesText: {
    alignSelf: "flex-start",
    borderRadius: 20,
    color: defaultStyles.colors.dark,
    fontSize: "14@s",
    marginVertical: "5@s",
    paddingHorizontal: "10@s",
    textAlign: "center",
  },
  button: {
    alignSelf: "center",
    backgroundColor: defaultStyles.colors.yellow_Variant,
    borderColor: defaultStyles.colors.light,
    borderRadius: "5@s",
    borderWidth: 2,
    height: "38@s",
    marginTop: "5@s",
    width: "90%",
  },
  container: {
    backgroundColor: defaultStyles.colors.white,
  },
  echoMessageListContainer: {
    marginTop: "2@s",
    marginBottom: "15@s",
    paddingLeft: "5@s",
    width: "100%",
  },
  echoOptionMainContainer: {
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.8)",
    flex: 1,
    justifyContent: "center",
    width: "100%",
  },
  inputBoxContainer: {
    backgroundColor: defaultStyles.colors.white,
    borderColor: defaultStyles.colors.light,
    borderRadius: "5@s",
    borderWidth: 1,
    marginBottom: "5@s",
    marginTop: "10@s",
    overflow: "hidden",
    width: "90%",
  },
  inputBox: {
    borderRadius: "5@s",
    height: "70@s",
    marginBottom: "5@s",
    paddingHorizontal: "5@s",
    width: "100%",
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
  optionClose: {
    backgroundColor: defaultStyles.colors.dark_Variant,
    color: defaultStyles.colors.white,
    opacity: 1,
  },
  saveEchoInfo: {
    backgroundColor: defaultStyles.colors.light,
    color: defaultStyles.colors.secondary,
    fontSize: "10@s",
    letterSpacing: "0.3@s",
    paddingHorizontal: "10@s",
    width: "100%",
  },
  textInputSub: {
    fontSize: "14.5@s",
    textAlignVertical: "top",
  },
});

export default AddEchoScreen;
