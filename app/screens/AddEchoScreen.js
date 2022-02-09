import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useContext,
} from "react";
import { View, Keyboard } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { ScaledSheet } from "react-native-size-matters";

import ApiProcessingContainer from "../components/ApiProcessingContainer";
import AppActivityIndicator from "../components/ActivityIndicator";
import AppButton from "../components/AppButton";
import AppHeader from "../components/AppHeader";
import AppText from "../components/AppText";
import AppTextInput from "../components/AppTextInput";
import EchoIcon from "../components/EchoIcon";
import EchoMessageList from "../components/EchoMessageList";
import EchoScreenOptions from "../components/EchoScreenOptions";
import HelpDialogueBox from "../components/HelpDialogueBox";
import InfoAlert from "../components/InfoAlert";
import Screen from "../components/Screen";

import useMountedRef from "../hooks/useMountedRef";
import useConnection from "../hooks/useConnection";
import storeDetails from "../utilities/storeDetails";
import SuccessMessageContext from "../utilities/successMessageContext";

import debounce from "../utilities/debounce";
import apiActivity from "../utilities/apiActivity";

import useAuth from "../auth/useAuth";

import echosApi from "../api/echos";
import usersApi from "../api/users";

import defaultStyles from "../config/styles";
import defaultProps from "../utilities/defaultProps";
import ScreenSub from "../components/ScreenSub";

function AddEchoScreen({ navigation, route }) {
  const { recipient, from } = route.params;
  const isConnected = useConnection();
  const { setSuccess } = useContext(SuccessMessageContext);
  const { tackleProblem, showSucessMessage } = apiActivity;

  const { user, setUser } = useAuth();
  const isFocused = useIsFocused();
  const mounted = useMountedRef().current;

  const [savingEcho, setSavingEcho] = useState(false);
  const [removingEcho, setRemovingEcho] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [initialMessage, setInitialMessage] = useState("");
  const [message, setMessage] = useState("".trim());
  const [isVisible, setIsVisible] = useState(false);
  const [echoMessageOption, setEchoMessageOption] = useState(
    defaultProps.defaultEchoMessageOption
  );
  const [infoAlert, setInfoAlert] = useState({
    infoAlertMessage: "",
    showInfoAlert: false,
  });
  const [showHelp, setShowHelp] = useState(false);

  // INFO ALERT ACTION
  const handleCloseInfoAlert = useCallback(
    () => setInfoAlert({ ...infoAlert, showInfoAlert: false }),
    []
  );

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
      setIsReady(true);
    }
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
        setSavingEcho(true);

        const { ok, data, problem } = await usersApi.updateEcho(
          recipient._id,
          message.trim()
        );
        if (ok) {
          Keyboard.dismiss();
          await storeDetails(data.user);
          setUser(data.user);
          setSavingEcho(false);
          return showSucessMessage(setSuccess, "Echo Updated successfully.");
        }
        setSavingEcho(false);
        tackleProblem(problem, data, setInfoAlert);
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
  const handleCloseModal = useCallback(() => {
    setEchoMessageOption(defaultProps.defaultEchoMessageOption);
    setIsVisible(false);
  }, []);

  const handleUseThisEchoPress = useCallback(() => {
    setMessage(echoMessageOption.message);
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

  return (
    <>
      <Screen style={styles.container}>
        <AppHeader
          title="Echo"
          leftIcon="arrow-back"
          onPressLeft={handleBack}
          rightIcon="help-outline"
          onPressRight={handleHelpPress}
        />
        <ScreenSub>
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
          <View style={styles.mainContainer}>
            {!isReady ? (
              <AppActivityIndicator />
            ) : (
              <>
                <AppText style={styles.heading}>Create Echo</AppText>
                <View style={styles.inputBoxContainer}>
                  <View style={styles.echoInfoContainer}>
                    <EchoIcon forInfo={true} style={styles.echoIcon} />

                    <AppText style={styles.saveEchoInfo}>
                      What would you like to say when {recipient.name} taps on
                      your Display Picture or sends you thoughts.
                    </AppText>
                  </View>
                  <AppTextInput
                    editable={!savingEcho}
                    maxLength={100}
                    multiline={true}
                    numberOfLines={4}
                    onChangeText={setMessage}
                    placeholder={`Enter your echo message for ${recipient.name}...`}
                    style={styles.inputBox}
                    subStyle={styles.textInputSub}
                    value={message}
                  />
                  <AppText style={styles.echoMessageLength}>
                    {message.length}/100
                  </AppText>
                </View>
                <ApiProcessingContainer
                  style={styles.apiProcessingContainer}
                  processing={savingEcho}
                >
                  <AppButton
                    disabled={
                      message.replace(/\s/g, "").length >= 1 &&
                      !savingEcho &&
                      isConnected
                        ? false
                        : true
                    }
                    onPress={handleSave}
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
    height: "38@s",
    marginTop: "5@s",
    width: "100%",
  },
  button: {
    alignSelf: "center",
    backgroundColor: defaultStyles.colors.yellow_Variant,
    borderColor: defaultStyles.colors.light,
    borderRadius: "5@s",
    borderWidth: 2,
    height: "38@s",
    width: "90%",
  },
  container: {
    // backgroundColor: defaultStyles.colors.white,
  },
  echoIcon: {
    borderRadius: "5@s",
    width: "30@s",
  },
  echoInfoContainer: {
    flexDirection: "row",
  },
  echoMessageListContainer: {
    flex: 1,
    marginTop: "2@s",
    paddingLeft: "5@s",
    width: "100%",
  },
  echoMessageLength: {
    textAlign: "right",
    fontSize: "10@s",
  },
  heading: {
    fontSize: "15@s",
    marginTop: "10@s",
    textAlign: "center",
  },
  inputBoxContainer: {
    backgroundColor: defaultStyles.colors.white,
    borderBottomWidth: 1,
    borderColor: defaultStyles.colors.light,
    borderRadius: "8@s",
    marginBottom: "20@s",
    marginTop: "10@s",
    overflow: "hidden",
    width: "90%",
  },
  inputBox: {
    borderRadius: "5@s",
    height: "70@s",
    marginBottom: "5@s",
    paddingHorizontal: "5@s",
    paddingTop: "10@s",
    width: "100%",
  },
  mainContainer: {
    alignItems: "center",
    flexGrow: 1,
  },
  saveEchoInfo: {
    backgroundColor: defaultStyles.colors.light,
    borderRadius: "8@s",
    color: defaultStyles.colors.secondary,
    flexShrink: 1,
    fontSize: "11.5@s",
    letterSpacing: "0.3@s",
    marginLeft: "5@s",
    paddingHorizontal: "10@s",
    width: "100%",
  },
  saveButtonContainer: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: "40@s",
    width: "100%",
  },
  textInputSub: {
    fontSize: "14@s",
    textAlignVertical: "top",
  },
});

export default AddEchoScreen;
