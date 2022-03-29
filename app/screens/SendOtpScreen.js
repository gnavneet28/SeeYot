import React, { useState, useCallback, useEffect } from "react";
import { View } from "react-native";
import { ScaledSheet, scale } from "react-native-size-matters";
import { useIsFocused } from "@react-navigation/native";
import FontAwesome5 from "../../node_modules/react-native-vector-icons/FontAwesome5";
import OtpAutocomplete from "react-native-otp-autocomplete";
import Bugsnag from "@bugsnag/react-native";

import AppButton from "../components/AppButton";
import AppText from "../components/AppText";
import AppTextInput from "../components/AppTextInput";
import CountryPicker from "../components/CountryPicker";
import InfoAlert from "../components/InfoAlert";
import LoadingIndicator from "../components/LoadingIndicator";

import Constant from "../navigation/NavigationConstants";

import defaultStyles from "../config/styles";

import useMountedRef from "../hooks/useMountedRef";

import verifyApi from "../api/verify";
import Screen from "../components/Screen";

// TODO: For google verification
// import usersApi from "../api/users";
import useAuth from "../auth/useAuth";
// import authStorage from "../auth/storage";
// import storeDetails from "../utilities/storeDetails";

function SendOtpScreen({ navigation }) {
  // TODO: google verification
  const { logIn, setUser } = useAuth();
  const mounted = useMountedRef().current;
  const isFocused = useIsFocused();
  //STATES
  const [visible, setVisible] = useState(false);
  // const [code, setCode] = useState("+91");
  const [number, setNumber] = useState(null);
  const [verificationId, setVerificationId] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [infoAlert, setInfoAlert] = useState({
    infoAlertMessage: "",
    showInfoAlert: false,
  });
  const [appHash, setAppHash] = useState("");

  useEffect(() => {
    if (mounted) {
      OtpAutocomplete.getHash()
        .then((hash) => setAppHash(hash))
        .catch((err) => {
          Bugsnag.notify(err);
        });
    }
  }, [mounted]);

  // TODO: google verification

  // const setAuthToken = async () => {
  //   const authToken =
  //     "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MWVhYWI2NTNlZGU3NDA0YThhZDZkODAiLCJwaG9uZU51bWJlciI6MTIzNDU2Nzg5MCwiaWF0IjoxNjQ1MDEyMzY1fQ.c47x_zurxwpRWIvLJWzAJE__8dmQQFKzoywDsuUgihw";
  //   await authStorage.storeToken(authToken);
  // };

  // useEffect(() => {
  //   setAuthToken();
  // }, []);

  useEffect(() => {
    if (!isFocused && mounted && infoAlert.showInfoAlert === true) {
      setInfoAlert({
        infoAlertMessage: "",
        showInfoAlert: false,
      });
    }
  }, [isFocused, mounted]);

  useEffect(() => {
    if (!isFocused && mounted && isLoading === true) {
      setIsLoading(false);
    }
  }, [isFocused, mounted]);

  useEffect(() => {
    if (!isFocused && mounted && visible === true) {
      setVisible(false);
    }
  }, [isFocused, mounted]);

  // INFO ALERT ACTION
  const handleCloseInfoAlert = useCallback(
    () => setInfoAlert({ ...infoAlert, showInfoAlert: false }),
    []
  );

  // const handleOpenCodePress = () => setVisible(true);

  // const handleSetCode = (country) => {
  //   setCode(country.code);
  //   setVisible(false);
  // };

  // SUBMIT ACTION
  const handleSubmit = async () => {
    setIsLoading(true);

    const phoneNumber = `+91${number}`;
    const { ok, data, problem } = await verifyApi.sendVerificationCode(
      phoneNumber,
      appHash
    );

    if (ok) {
      setVerificationId(data.attemptCode);
      setIsLoading(false);
      return navigation.navigate(Constant.VERIFY_OTP_SCREEN, {
        verificationId: data.attemptCode,
        phoneNumber,
      });
    }

    if (problem && data) {
      setIsLoading(false);
      return setInfoAlert({
        infoAlertMessage: data.message,
        showInfoAlert: true,
      });
    }

    setIsLoading(false);
    return setInfoAlert({
      infoAlertMessage: "Something went wrong please try again.",
      showInfoAlert: true,
    });
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
        {/* <CountryPicker
        onPress={handleSetCode}
        setVisible={setVisible}
        visible={visible}
      /> */}
        <View style={styles.infoIconContainer}>
          <FontAwesome5
            color={defaultStyles.colors.white}
            name="mobile-alt"
            size={scale(40)}
          />
        </View>
        <View style={styles.inputContainer}>
          <View style={styles.phoneInputContainer}>
            <AppText style={styles.code}>+91</AppText>
            <AppTextInput
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
          <AppButton
            disabled={
              number && number.length == 10 && !verificationId ? false : true
            }
            // onPress={number == 1234567890 ? handleSubmitForm : handleSubmit}
            onPress={handleSubmit}
            style={styles.button}
            subStyle={styles.submitButtonSub}
            title="Send Otp"
          />
        </View>
        <AppText style={styles.infoText}>
          by continuing you confirm that you are authorized to use this phone
          number and agree to receive text messages.
        </AppText>
      </Screen>
      <LoadingIndicator visible={isLoading} />
      <InfoAlert
        description={infoAlert.infoAlertMessage}
        leftPress={handleCloseInfoAlert}
        visible={infoAlert.showInfoAlert}
      />
    </>
  );
}

const styles = ScaledSheet.create({
  button: {
    backgroundColor: defaultStyles.colors.yellow_Variant,
    borderRadius: "5@s",
    elevation: 2,
    height: "35@s",
    width: "80%",
  },
  code: {
    textAlign: "center",
    width: "20%",
  },
  container: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.primary,
    flex: 1,
    paddingTop: "120@s",
    width: "100%",
  },
  inputContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "30@s",
    width: "100%",
  },
  inputBox: {
    backgroundColor: "tomato",
    borderRadius: "5@s",
    marginBottom: "20@s",
    width: "95%",
  },
  infoText: {
    color: defaultStyles.colors.white,
    fontSize: "13.5@s",
    lineHeight: "15@s",
    paddingHorizontal: "10@s",
    paddingVertical: "5@s",
    textAlign: "center",
    width: "70%",
  },
  infoIconContainer: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.tomato,
    borderRadius: "50@s",
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
  number: {
    width: "75%",
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
    borderRadius: 5,
    elevation: 2,
    flexDirection: "row",
    height: "40@s",
    justifyContent: "space-between",
    marginBottom: "15@s",
    overflow: "hidden",
    width: "80%",
  },
  submitButtonSub: {
    color: defaultStyles.colors.primary,
    letterSpacing: "1@s",
    fontSize: "16@s",
  },
});

export default SendOtpScreen;
