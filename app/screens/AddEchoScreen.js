import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { View, Keyboard, Pressable, TextInput, Text } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { scale, ScaledSheet } from "react-native-size-matters";
import { showMessage } from "react-native-flash-message";
import MaterialIcons from "../../node_modules/react-native-vector-icons/MaterialIcons";
import * as Animatable from "react-native-animatable";

import ApiProcessingContainer from "../components/ApiProcessingContainer";
import AppActivityIndicator from "../components/ActivityIndicator";
import AppButton from "../components/AppButton";
import AppHeader from "../components/AppHeader";
import AppText from "../components/AppText";
import AudioRecorder from "../components/AudioRecorder";
import EchoIcon from "../components/EchoIcon";
import EchoMessageList from "../components/EchoMessageList";
import EchoScreenOptions from "../components/EchoScreenOptions";
import InfoAlert from "../components/InfoAlert";
import Screen from "../components/Screen";
import Selection from "../components/Selection";

import useMountedRef from "../hooks/useMountedRef";
import storeDetails from "../utilities/storeDetails";

import debounce from "../utilities/debounce";
import apiActivity from "../utilities/apiActivity";

import useAuth from "../auth/useAuth";

import echosApi from "../api/echos";
import usersApi from "../api/users";

import defaultStyles from "../config/styles";
import defaultProps from "../utilities/defaultProps";
import ScreenSub from "../components/ScreenSub";
import AudioPlayer from "../components/AudioPlayer";

import checkFileType from "../utilities/checkFileType";

import onBoarding from "../utilities/onBoarding";

function AddEchoScreen({ navigation, route }) {
  const { recipient, from } = route.params;
  const { tackleProblem } = apiActivity;
  const textModeRef = useRef(null);
  const audioModeRef = useRef(null);
  const { onboardingKeys, isInfoSeen, updateInfoSeen } = onBoarding;

  const { user, setUser } = useAuth();
  const isFocused = useIsFocused();
  const mounted = useMountedRef().current;
  let isUnmounting = false;

  const [savingEcho, setSavingEcho] = useState(false);
  const [removingEcho, setRemovingEcho] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [initialMessage, setInitialMessage] = useState("");
  const [message, setMessage] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [echoMessageOption, setEchoMessageOption] = useState(
    defaultProps.defaultEchoMessageOption
  );
  const [infoAlert, setInfoAlert] = useState({
    infoAlertMessage: "",
    showInfoAlert: false,
  });
  const [showHelp, setShowHelp] = useState(false);
  const [sendNotification, setSendNotification] = useState(false);

  const [height, setHeight] = useState(0);

  // // AUDIO STATES
  const [recordAudio, setRecordAudio] = useState(false);

  // INFO ALERT ACTION
  const handleCloseInfoAlert = useCallback(
    () => setInfoAlert({ ...infoAlert, showInfoAlert: false }),
    []
  );

  // ONBOADING INFO

  const showOnboarding = async () => {
    const isShown = await isInfoSeen(onboardingKeys.ECHO);
    if (!isShown) {
      setShowHelp(true);
      updateInfoSeen(onboardingKeys.ECHO);
    }
  };

  useEffect(() => {
    if (!isUnmounting && isFocused) {
      setSendNotification(false);
    }

    return () => (isUnmounting = true);
  }, [isFocused]);

  useEffect(() => {
    showOnboarding();
  }, []);

  // ON PAGE FOCUS ACTION

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
    if (!isReady || mounted) {
      setMessage(echoMessage ? echoMessage.message : "");
      setInitialMessage(echoMessage ? echoMessage.message : "");
      if (echoMessage) {
        if (checkFileType(echoMessage.message)) {
          setRecordAudio(true);
        } else if (!checkFileType(echoMessage.message)) {
          setRecordAudio(false);
        }
      }
      setIsReady(true);
    }
  };

  useEffect(() => {
    if (isFocused) {
      setUpPage();
    } else if (!isFocused) {
      setIsReady(false);
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
        if (checkFileType(message.trim())) return;
        setSavingEcho(true);
        const { ok, data, problem } = await usersApi.updateEcho(
          recipient._id,
          message.trim(),
          sendNotification
        );
        if (ok) {
          Keyboard.dismiss();
          await storeDetails(data.user);
          setUser(data.user);
          setSavingEcho(false);
          return showMessage({
            ...defaultProps.alertMessageConfig,
            message: "Echo Updated successfully!",
            type: "success",
          });
        }
        setSavingEcho(false);
        tackleProblem(problem, data, setInfoAlert);
      },
      1000,
      true
    ),
    [message, recipient._id, user, sendNotification]
  );

  const handleSaveAudio = useCallback(
    debounce(
      async () => {
        if (message == initialMessage) return;
        if (!checkFileType(message)) return;
        setSavingEcho(true);
        const { ok, data, problem } = await usersApi.updateAudioEcho(
          message.trim(),
          recipient._id,
          sendNotification
        );
        if (ok) {
          Keyboard.dismiss();
          await storeDetails(data.user);
          setUser(data.user);
          setSavingEcho(false);
          return showMessage({
            ...defaultProps.alertMessageConfig,
            message: "Echo Updated successfully!",
            type: "success",
          });
        }
        setSavingEcho(false);
        tackleProblem(problem, data, setInfoAlert);
      },
      1000,
      true
    ),
    [message, recipient._id, user, sendNotification]
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

  // ECHO_MESSAGE MODAL ACTIONS
  const handleCloseModal = useCallback(() => {
    setEchoMessageOption(defaultProps.defaultEchoMessageOption);
    setIsVisible(false);
  }, []);

  const handleUseThisEchoPress = useCallback(() => {
    setMessage(echoMessageOption.message);
    if (checkFileType(echoMessageOption.message)) {
      setRecordAudio(true);
    } else if (!checkFileType(echoMessageOption.message)) {
      setRecordAudio(false);
    }
    setIsVisible(false);
  }, [message, echoMessageOption]);

  const handleDeleteEchoPress = useCallback(
    debounce(
      async () => {
        setRemovingEcho(true);

        const { data, ok, problem } = await echosApi.deleteEcho(
          echoMessageOption._id
        );

        if (ok) {
          await storeDetails(data.user);
          setUser(data.user);
          setRemovingEcho(false);
          setIsVisible(false);
          return setEchoMessageOption(defaultProps.defaultEchoMessageOption);
        }

        setRemovingEcho(false);
        setIsVisible(false);
        setEchoMessageOption(defaultProps.defaultEchoMessageOption);
        tackleProblem(problem, data, setInfoAlert);
      },
      1000,
      true
    ),
    [user.echoMessage.length, echoMessageOption, user]
  );

  // // Audio Actions

  const handleChangeToAudioMode = () => {
    if (!recordAudio && !savingEcho) {
      audioModeRef.current.rubberBand();
      return setRecordAudio(true);
    }
  };
  const handleChangeToMessageMode = () => {
    if (recordAudio && !savingEcho) {
      textModeRef.current.rubberBand();
      return setRecordAudio(false);
    }
  };

  const handleAudioRefresh = () => {
    setMessage("");
  };

  const handleCheckBoxSelection = useCallback(
    () => setSendNotification(!sendNotification),
    [sendNotification]
  );

  return (
    <>
      <Screen style={styles.container}>
        <AppHeader
          title="Echo"
          leftIcon="arrow-back"
          onPressLeft={handleBack}
          rightIcon="help-outline"
          onPressRight={handleHelpPress}
          tip="Echo messages are flash messages and will only be displayed when a person interacts with you by either tapping on your profile picture or by sending you thoughts. You can set the type of interaction from your profile."
          showTip={showHelp}
          setShowTip={setShowHelp}
        />
        <ScreenSub>
          <View style={styles.mainContainer}>
            {!isReady ? (
              <AppActivityIndicator />
            ) : (
              <>
                <View style={styles.messageTypeSelector}>
                  <Pressable
                    onPress={handleChangeToMessageMode}
                    style={[
                      styles.messageMode,
                      {
                        backgroundColor: recordAudio
                          ? defaultStyles.colors.lightGrey
                          : defaultStyles.colors.secondary,
                      },
                    ]}
                  >
                    <Animatable.View ref={textModeRef}>
                      <MaterialIcons
                        name="textsms"
                        size={scale(20)}
                        color={
                          recordAudio
                            ? defaultStyles.colors.dark
                            : defaultStyles.colors.yellow_Variant
                        }
                        onPress={handleChangeToMessageMode}
                      />
                    </Animatable.View>
                  </Pressable>
                  <Pressable
                    onPress={handleChangeToAudioMode}
                    style={[
                      styles.audioMode,
                      {
                        backgroundColor: recordAudio
                          ? defaultStyles.colors.secondary
                          : defaultStyles.colors.lightGrey,
                      },
                    ]}
                  >
                    <Animatable.View ref={audioModeRef} useNativeDriver={true}>
                      <MaterialIcons
                        name="audiotrack"
                        size={scale(20)}
                        color={
                          recordAudio
                            ? defaultStyles.colors.yellow_Variant
                            : defaultStyles.colors.dark
                        }
                        onPress={handleChangeToAudioMode}
                      />
                    </Animatable.View>
                  </Pressable>
                </View>
                <View style={styles.inputBoxContainer}>
                  <View style={styles.echoInfoContainer}>
                    <EchoIcon
                      forInfo={true}
                      size={scale(18)}
                      containerStyle={styles.echoIcon}
                    />

                    <AppText style={styles.saveEchoInfo}>
                      What would you like to say when{" "}
                      <Text style={styles.recipientNameInInfo}>
                        {recipient.name}
                      </Text>{" "}
                      taps on your Display Picture or sends you thoughts.
                    </AppText>
                  </View>
                  {recordAudio ? (
                    message && checkFileType(message) ? (
                      <AudioPlayer
                        onRefresh={handleAudioRefresh}
                        recordedFile={message}
                      />
                    ) : (
                      <AudioRecorder onStopRecording={setMessage} />
                    )
                  ) : (
                    <>
                      <TextInput
                        editable={!savingEcho}
                        maxLength={300}
                        multiline={true}
                        onChangeText={setMessage}
                        placeholder="Enter your echo message..."
                        style={[
                          styles.inputBox,
                          { height: Math.min(100, Math.max(35, height)) },
                        ]}
                        value={checkFileType(message.trim()) ? "" : message}
                        onContentSizeChange={(event) =>
                          setHeight(event.nativeEvent.contentSize.height)
                        }
                      />
                      <AppText style={styles.echoMessageLength}>
                        {checkFileType(message.trim()) ? 0 : message.length}/300
                      </AppText>
                    </>
                  )}
                </View>
                <Selection
                  iconSize={scale(8)}
                  style={styles.checkBoxContainer}
                  fontStyle={styles.checkBoxValue}
                  containerStyle={[
                    styles.checkBox,
                    {
                      borderColor: sendNotification
                        ? defaultStyles.colors.green
                        : defaultStyles.colors.yellow_Variant,
                    },
                  ]}
                  opted={sendNotification}
                  value={`Notify ${recipient.name} about this Echo Message.`}
                  onPress={handleCheckBoxSelection}
                />
                <ApiProcessingContainer
                  style={styles.apiProcessingContainer}
                  processing={savingEcho}
                >
                  <AppButton
                    disabled={
                      message.replace(/\s/g, "").length >= 1 && !savingEcho
                        ? false
                        : true
                    }
                    onPress={
                      checkFileType(message.trim())
                        ? handleSaveAudio
                        : handleSave
                    }
                    style={styles.button}
                    subStyle={{ color: defaultStyles.colors.secondary }}
                    title="Save"
                  />
                </ApiProcessingContainer>
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
              </>
            )}
          </View>
        </ScreenSub>
      </Screen>
      <EchoScreenOptions
        echoMessageOption={echoMessageOption}
        handleCloseModal={handleCloseModal}
        handleDeleteEchoPress={handleDeleteEchoPress}
        handleUseThisEchoPress={handleUseThisEchoPress}
        isVisible={isVisible}
        recipient={recipient}
        removingEcho={removingEcho}
      />
      <InfoAlert
        leftPress={handleCloseInfoAlert}
        description={infoAlert.infoAlertMessage}
        visible={infoAlert.showInfoAlert}
      />
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
    textAlign: "left",
    width: "100%",
  },
  apiProcessingContainer: {
    backgroundColor: defaultStyles.colors.yellow_Variant,
    borderRadius: "5@s",
    height: "38@s",
    marginTop: "5@s",
    padding: 0,
    width: "90%",
  },
  audioMode: {
    alignItems: "center",
    borderRadius: "20@s",
    flexShrink: 1,
    height: "35@s",
    justifyContent: "center",
    textAlign: "center",
    textAlignVertical: "center",
    width: "35@s",
  },
  button: {
    alignSelf: "center",
    backgroundColor: defaultStyles.colors.yellow_Variant,
    borderColor: defaultStyles.colors.light,
    borderRadius: "5@s",
    borderWidth: 2,
    height: "38@s",
    width: "100%",
  },
  container: {
    // backgroundColor: defaultStyles.colors.white,
  },
  checkBoxContainer: {
    alignSelf: "center",
    width: "92%",
  },
  checkBox: {
    height: "20@s",
    width: "20@s",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "5@s",
  },
  checkBoxValue: { fontSize: "10@s" },
  echoIcon: {
    borderRadius: "5@s",
    height: "25@s",
    width: "25@s",
  },
  echoInfoContainer: {
    flexDirection: "row",
    marginBottom: "5@s",
  },
  echoMessageListContainer: {
    flex: 1,
    marginTop: "2@s",
    paddingLeft: "5@s",
    width: "100%",
  },
  echoMessageLength: {
    fontSize: "10@s",
    textAlign: "right",
  },
  inputBoxContainer: {
    backgroundColor: defaultStyles.colors.light,
    borderBottomWidth: 1,
    borderColor: defaultStyles.colors.light,
    borderRadius: "8@s",
    marginBottom: "10@s",
    marginTop: "10@s",
    overflow: "hidden",
    padding: "10@s",
    width: "90%",
  },
  inputBox: {
    backgroundColor: "rgba(255,255,255,0.8)",
    borderRadius: "5@s",
    fontFamily: "ComicNeue-Bold",
    fontSize: "13.5@s",
    fontWeight: "normal",
    marginBottom: "5@s",
    padding: "5@s",
    width: "100%",
  },
  mainContainer: {
    alignItems: "center",
    flexGrow: 1,
  },
  messageTypeSelector: {
    borderRadius: "8@s",
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: "10@s",
    marginVertical: "5@s",
    overflow: "hidden",
    width: "35%",
  },
  messageMode: {
    alignItems: "center",
    borderRadius: "20@s",
    flexShrink: 1,
    height: "35@s",
    justifyContent: "center",
    textAlign: "center",
    textAlignVertical: "center",
    width: "35@s",
  },
  recipientNameInInfo: {
    color: defaultStyles.colors.blue,
  },
  saveEchoInfo: {
    borderColor: defaultStyles.colors.light,
    borderRadius: "8@s",
    borderWidth: 1,
    color: defaultStyles.colors.dark,
    flexShrink: 1,
    fontSize: "11.5@s",
    letterSpacing: "0.3@s",
    marginLeft: "5@s",
    paddingHorizontal: "10@s",
    paddingTop: 0,
    width: "100%",
  },
  saveButtonContainer: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: "40@s",
    width: "100%",
  },
});

export default AddEchoScreen;
