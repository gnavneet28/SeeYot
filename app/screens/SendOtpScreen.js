import React, {
  useState,
  useCallback,
  useEffect,
  useRef,
  useContext,
} from "react";
import { View, TextInput, Text, Keyboard } from "react-native";
import { ScaledSheet, scale } from "react-native-size-matters";
import { useIsFocused } from "@react-navigation/native";
import FontAwesome5 from "../../node_modules/react-native-vector-icons/FontAwesome5";
import OtpAutocomplete from "react-native-otp-autocomplete";
import crashlytics from "@react-native-firebase/crashlytics";
import * as Animatable from "react-native-animatable";
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from "react-native-confirmation-code-field";
import authStorage from "../auth/storage";
import storeDetails from "../utilities/storeDetails";

import AppButton from "../components/AppButton";
import AppText from "../components/AppText";
import InfoAlert from "../components/InfoAlert";

import defaultStyles from "../config/styles";

import verifyApi from "../api/verify";
import Screen from "../components/Screen";
import apiActivity from "../utilities/apiActivity";
import OtpContext from "../utilities/otpContext";

// TODO: For google verification
// import usersApi from "../api/users";
// import authStorage from "../auth/storage";
// import storeDetails from "../utilities/storeDetails";

import useAuth from "../auth/useAuth";
import ApiProcessingContainer from "../components/ApiProcessingContainer";

function SendOtpScreen({ navigation }) {
  // TODO: google verification
  const { logIn, setUser } = useAuth();
  const isFocused = useIsFocused();

  const nameInputRef = useRef(null);
  const numberInputRef = useRef(null);

  const { tackleProblem } = apiActivity;

  let isUnmounting = false;

  //STATES
  const [otpVisible, setOtpVisible] = useState(false);
  const [number, setNumber] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [infoAlert, setInfoAlert] = useState({
    infoAlertMessage: "",
    showInfoAlert: false,
  });
  const [appHash, setAppHash] = useState("");

  const [name, setName] = useState("");
  const [nameInputFocused, setNameInputFocused] = useState(false);
  const [numberInputFocused, setNumberInputFocused] = useState(false);

  const [value, setValue] = useState("");
  const ref = useBlurOnFulfill({ value, cellCount: 6 });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });
  const { otpFailed, setOtpFailed } = useContext(OtpContext);

  // OnUnmount
  useEffect(() => {
    return () => (isUnmounting = true);
  }, []);

  useEffect(() => {
    if (!isUnmounting) {
      OtpAutocomplete.getHash()
        .then((hash) => {
          if (hash !== "err" && !isUnmounting) {
            setAppHash(hash);
          } else if (hash === "err" && !isUnmounting) {
            setAppHash("err");
          }
        })
        .catch((error) => {
          if (typeof error === "string") {
            crashlytics().recordError(new Error(error));
          }
        });
    }
  }, [isFocused]);

  // TODO: google verification

  // const setAuthToken = async () => {
  //   const authToken =
  //     "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MWVhYWI2NTNlZGU3NDA0YThhZDZkODAiLCJwaG9uZU51bWJlciI6MTIzNDU2Nzg5MCwiaWF0IjoxNjQ1MDEyMzY1fQ.c47x_zurxwpRWIvLJWzAJE__8dmQQFKzoywDsuUgihw";
  //   await authStorage.storeToken(authToken);
  // };

  // useEffect(() => {
  //   setAuthToken();
  // }, []);

  // INFO ALERT ACTION

  const handleCloseInfoAlert = useCallback(
    () => setInfoAlert({ ...infoAlert, showInfoAlert: false }),
    []
  );

  // Reading Otp Actions

  const otpHandler = (message) => {
    if (message && message !== "Timeout Error.") {
      const otp = /(\d{6})/g.exec(message)[1];
      if (!isUnmounting) {
        setValue(otp);
        Keyboard.dismiss();
      }
      OtpAutocomplete.removeListener();
    } else if (message == "Timeout Error.") {
    }
  };

  useEffect(() => {
    if (value.length == 6) {
      handleSubmitOtp();
    }
  }, [value]);

  const otpListener = () =>
    OtpAutocomplete.getOtp()
      .then((p) => OtpAutocomplete.addListener(otpHandler))
      .catch((error) => {
        if (typeof error === "string") {
          crashlytics().recordError(new Error(error));
        }
      });

  useEffect(() => {
    otpListener();

    return () => OtpAutocomplete.removeListener();
  }, [otpListener]);

  const handleSubmitOtp = async () => {
    setIsLoading(true);

    const { ok, data, problem, headers } = await verifyApi.verifyNumber(
      `+91${number}`,
      name.trim(),
      value
    );

    if (ok) {
      const authToken = headers["x-auth-token"];
      await authStorage.storeToken(authToken);
      await storeDetails(data);
      setIsLoading(false);
      return logIn(data);
    }

    setIsLoading(false);
    tackleProblem(problem, data, setInfoAlert);
  };

  // SUBMIT ACTION
  const handleSendOtp = async () => {
    setIsLoading(true);
    setNumberInputFocused(false);

    const phoneNumber = `+91${number}`;
    const { ok, data, problem } = await verifyApi.sendVerificationCode(
      phoneNumber,
      name,
      appHash
    );
    if (ok) {
      setIsLoading(false);
      setTimeout(() => {
        setOtpFailed(true);
      }, 30000);
      return setOtpVisible(true);
    }
    if (!isUnmounting) {
      setIsLoading(false);
      tackleProblem(problem, data, setInfoAlert);
    }
  };

  const handleSendOtpAgain = () => {
    setOtpFailed(false);
    setValue("");
    setOtpVisible(false);
    handleSendOtp();
  };

  // TODO: for google verification
  // const handleSubmitForm = async () => {
  //   setIsLoading(true);

  //   const { ok, problem, data } = await usersApi.getCurrentUser();

  //   if (ok) {
  //     await storeDetails(data);
  //     setIsLoading(false);
  //     return setUser(data);
  //   }
  //   setIsLoading(false);
  //   tackleProblem(problem, data, setInfoAlert);
  // };

  return (
    <>
      <Screen style={styles.container}>
        <View style={styles.headerIconContainer}>
          <Animatable.View
            animation="zoomIn"
            iterationCount="infinite"
            iterationDelay={2}
          >
            <FontAwesome5
              color={defaultStyles.colors.secondary}
              name="mobile-alt"
              size={scale(40)}
            />
          </Animatable.View>
        </View>

        <View style={styles.inputFormContainer}>
          {!otpVisible ? (
            <>
              <TextInput
                onFocus={() => setNameInputFocused(true)}
                onBlur={() => {
                  setNameInputFocused(false);
                }}
                editable={!isLoading}
                ref={nameInputRef}
                placeholder="Full Name"
                maxLength={30}
                keyboardType="default"
                style={[
                  styles.nameInput,
                  {
                    borderWidth: nameInputFocused ? 2 : 1,
                    elevation: nameInputFocused ? 2 : 0,
                  },
                ]}
                placeholderTextColor={defaultStyles.colors.placeholder}
                onChangeText={setName}
                value={name}
                textContentType="name"
              />
              <View
                style={[
                  styles.phoneInputContainer,
                  {
                    borderWidth: numberInputFocused ? 2 : 1,
                    elevation: numberInputFocused ? 2 : 0,
                  },
                ]}
              >
                <AppText style={styles.code}>+91</AppText>
                <TextInput
                  editable={!isLoading}
                  ref={numberInputRef}
                  placeholderTextColor={defaultStyles.colors.placeholder}
                  onFocus={() => setNumberInputFocused(true)}
                  onBlur={() => {
                    setNumberInputFocused(false);
                  }}
                  autoCorrect={false}
                  keyboardType="phone-pad"
                  maxLength={10}
                  onChangeText={(number) => setNumber(number)}
                  placeholder="Enter phone number"
                  style={styles.number}
                  subStyle={styles.numberSub}
                  textContentType="telephoneNumber"
                  value={number}
                />
              </View>

              <ApiProcessingContainer
                color={defaultStyles.colors.white}
                style={[
                  styles.buttonContainer,
                  {
                    backgroundColor:
                      number && number.length == 10 && name.trim().length >= 3
                        ? defaultStyles.colors.secondary
                        : defaultStyles.colors.secondary_Variant,
                  },
                ]}
                processing={isLoading}
              >
                <AppButton
                  disabled={
                    number && number.length == 10 && name.trim().length >= 3
                      ? false
                      : true
                  }
                  onPress={handleSendOtp}
                  style={[
                    styles.button,
                    {
                      backgroundColor:
                        number && number.length == 10 && name.trim().length >= 3
                          ? defaultStyles.colors.secondary
                          : defaultStyles.colors.secondary_Variant,
                    },
                  ]}
                  subStyle={styles.submitButtonSub}
                  title="Send Otp"
                />
              </ApiProcessingContainer>
            </>
          ) : (
            <>
              <View style={styles.inputContainer}>
                <View style={styles.otpInputContainer}>
                  <CodeField
                    ref={ref}
                    {...props}
                    value={value}
                    onChangeText={isLoading ? () => {} : setValue}
                    cellCount={6}
                    rootStyle={{}}
                    keyboardType="number-pad"
                    textContentType="oneTimeCode"
                    renderCell={({ index, symbol, isFocused }) => (
                      <Text
                        key={index}
                        style={[
                          styles.cell,
                          isFocused && styles.focusCell,
                          { fontFamily: "ComicNeue-Bold" },
                        ]}
                        onLayout={getCellOnLayoutHandler(index)}
                      >
                        {symbol || (isFocused ? <Cursor /> : null)}
                      </Text>
                    )}
                  />
                </View>
                <ApiProcessingContainer
                  style={styles.submitOtpButtonContainer}
                  processing={isLoading}
                  color={defaultStyles.colors.white}
                >
                  <AppButton
                    disabled={!value || value.length < 6 ? true : false}
                    onPress={handleSubmitOtp}
                    style={styles.submitOtpButton}
                    subStyle={styles.submitOtpButtonSub}
                    title="Verify and Register"
                  />
                </ApiProcessingContainer>
                {otpFailed ? (
                  <AppText
                    onPress={handleSendOtpAgain}
                    style={styles.sendOtpAgain}
                  >
                    Send Otp again
                  </AppText>
                ) : null}
              </View>
            </>
          )}
        </View>

        <AppText style={styles.infoText}>
          {otpVisible
            ? " By continuing you agree to the Terms and Privacy policy."
            : "by continuing you confirm that you are authorized to use this phone number and agree to receive text messages."}
        </AppText>
      </Screen>
      <InfoAlert
        description={infoAlert.infoAlertMessage}
        leftPress={handleCloseInfoAlert}
        visible={infoAlert.showInfoAlert}
      />
    </>
  );
}

const styles = ScaledSheet.create({
  buttonContainer: {
    backgroundColor: defaultStyles.colors.secondary_Variant,
    borderRadius: "25@s",
    height: "35@s",
    width: "80%",
    borderWidth: "1@s",
    borderColor: defaultStyles.colors.secondary,
  },
  button: {
    backgroundColor: defaultStyles.colors.secondary_Variant,
    borderRadius: "25@s",
    height: "35@s",
    width: "100%",
  },
  code: {
    textAlign: "center",
    width: "20%",
  },
  container: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.white,
    flex: 1,
    paddingTop: "80@s",
    width: "100%",
  },
  inputFormContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "30@s",
    width: "100%",
  },
  infoText: {
    color: defaultStyles.colors.lightGrey,
    fontSize: "13.5@s",
    lineHeight: "15@s",
    paddingHorizontal: "10@s",
    paddingVertical: "5@s",
    textAlign: "center",
    width: "70%",
  },
  headerIconContainer: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.yellow_Variant,
    borderBottomLeftRadius: "50@s",
    borderBottomRightRadius: "50@s",
    borderTopLeftRadius: "5@s",
    borderTopRightRadius: "50@s",
    height: "100@s",
    justifyContent: "center",
    marginBottom: "30@s",
    padding: "20@s",
    width: "100@s",
  },
  modalFallback: {
    backgroundColor: "rgba(0,0,0,0.7)",
    height: "100%",
    position: "absolute",
    width: "100%",
    zIndex: 22,
  },
  nameInput: {
    backgroundColor: defaultStyles.colors.white,
    borderColor: defaultStyles.colors.yellow_Variant,
    borderRadius: "25@s",
    borderWidth: 1,
    fontFamily: "ComicNeue-Bold",
    fontSize: "14@s",
    fontWeight: "normal",
    height: "35@s",
    letterSpacing: "1@s",
    marginBottom: "8@s",
    paddingLeft: "10@s",
    textAlign: "center",
    width: "80%",
  },
  number: {
    backgroundColor: defaultStyles.colors.white,
    width: "75%",
    fontFamily: "ComicNeue-Bold",
    letterSpacing: "1@s",
    fontWeight: "normal",
    fontSize: "14@s",
  },
  numberSub: {
    letterSpacing: "1@s",
  },
  otpSentInfo: {
    color: defaultStyles.colors.white,
    fontSize: "18@s",
    marginTop: "10@s",
    textAlign: "center",
  },
  phoneInputContainer: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.white,
    borderColor: defaultStyles.colors.yellow_Variant,
    borderRadius: "25@s",
    borderWidth: "1@s",
    flexDirection: "row",
    height: "35@s",
    justifyContent: "space-between",
    marginBottom: "15@s",
    overflow: "hidden",
    width: "80%",
  },
  submitButtonSub: {
    color: defaultStyles.colors.white,
    fontSize: "16@s",
    letterSpacing: "1@s",
  },

  // OtpInput

  inputContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  otpInputContainer: {
    alignItems: "center",
    height: "40@s",
    justifyContent: "center",
    marginBottom: "15@s",
    width: "100%",
  },
  cell: {
    backgroundColor: defaultStyles.colors.white,
    borderRadius: "5@s",
    elevation: 2,
    fontSize: "15@s",
    height: "35@s",
    lineHeight: "38@s",
    marginHorizontal: "5.5@s",
    textAlign: "center",
    textAlignVertical: "center",
    width: "35@s",
  },
  focusCell: {
    borderColor: defaultStyles.colors.dark_Variant,
  },
  submitOtpButtonContainer: {
    backgroundColor: defaultStyles.colors.secondary_Variant,
    borderRadius: "25@s",
    height: "35@s",
    marginVertical: "10@s",
    width: "80%",
  },
  submitOtpButtonSub: {
    color: defaultStyles.colors.white,
    letterSpacing: "1@s",
    fontSize: "14@s",
  },
  submitOtpButton: {
    backgroundColor: defaultStyles.colors.secondary_Variant,
    borderRadius: "25@s",
    height: "35@s",
    width: "100%",
  },
  sendOtpAgain: {
    backgroundColor: defaultStyles.colors.yellow_Variant,
    borderRadius: "20@s",
    color: defaultStyles.colors.dark,
    fontSize: "12@s",
    marginTop: "10@s",
    paddingHorizontal: "10@s",
    paddingVertical: "5@s",
  },
});

export default SendOtpScreen;
