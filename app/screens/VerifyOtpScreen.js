import React, { useState, useEffect } from "react";
import { View, Text, Linking, Keyboard } from "react-native";
import { ScaledSheet, scale } from "react-native-size-matters";
import MaterialCommunityIcons from "../../node_modules/react-native-vector-icons/MaterialCommunityIcons";
import OtpAutocomplete from "react-native-otp-autocomplete";

import AppButton from "../components/AppButton";
import AppText from "../components/AppText";
import InfoAlert from "../components/InfoAlert";
import LoadingIndicator from "../components/LoadingIndicator";
import Screen from "../components/Screen";

import Constant from "../navigation/NavigationConstants";

import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from "react-native-confirmation-code-field";

import defaultStyles from "../config/styles";

import verifyApi from "../api/verify";
import crashlytics from "@react-native-firebase/crashlytics";

export default function VerifyOtpScreen({ navigation, route }) {
  const { phoneNumber, verificationId } = route.params;
  let number = phoneNumber;
  let verifiedId = verificationId;

  // STATES
  const [disabled, setDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [infoAlert, setInfoAlert] = useState({
    infoAlertMessage: "",
    showInfoAlert: false,
  });
  const [value, setValue] = useState("");
  const ref = useBlurOnFulfill({ value, cellCount: 6 });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  // OTP AUTOCOMPLETE

  // When Otp auto read then go to next screen
  const otpHandler = (message) => {
    if (message) {
      const otp = /(\d{6})/g.exec(message)[1];
      setValue(otp);
      Keyboard.dismiss();
      OtpAutocomplete.removeListener();
    }
  };

  useEffect(() => {
    if (value.length == 6) {
      handleSubmit();
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

  const openPrivacyPage = () => {
    Linking.openURL("https://seeyot-frontend.herokuapp.com/privacy_policy");
  };
  // INFO ALERT ACTION
  const handleCloseInfoAlert = () =>
    setInfoAlert({ ...infoAlert, showInfoAlert: false });

  const handleSendOtpAgainPress = async () => {
    setDisabled(true);
    setIsLoading(true);

    const { ok, data, problem } = await verifyApi.sendVerificationCode(number);

    if (ok) {
      verifiedId = data.attemptCode;
      setIsLoading(false);
      return setInfoAlert({
        infoAlertMessage: "Otp sent.",
        showInfoAlert: true,
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

  // SUBMIT ACTION
  const handleSubmit = async () => {
    setDisabled(false);
    setIsLoading(true);
    const { ok, data, problem } = await verifyApi.verifyNumber(number, value);

    if (ok && data.message == "Approved") {
      setIsLoading(false);
      return navigation.navigate(Constant.PROFILE_DETAILS_SCREEN, {
        number,
        verifiedId,
      });
    }

    if (problem && data) {
      setIsLoading(false);
      return setInfoAlert({
        infoAlertMessage:
          "Incorrect OTP! Please try to enter correct one or try send Otp again.",
        showInfoAlert: true,
      });
    }
    setIsLoading(false);
    setInfoAlert({
      infoAlertMessage: "Something went wrong! Please try again.",
      showInfoAlert: true,
    });
  };

  return (
    <>
      <Screen style={styles.container}>
        <View style={styles.infoIconContainer}>
          <MaterialCommunityIcons
            color={defaultStyles.colors.white}
            name="cellphone-text"
            size={scale(40)}
          />
        </View>
        <View style={styles.inputContainer}>
          <View style={styles.otpInputContainer}>
            <CodeField
              ref={ref}
              {...props}
              value={value}
              onChangeText={setValue}
              cellCount={6}
              rootStyle={styles.codeFieldRoot}
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
          <AppButton
            disabled={!value || value.length < 6 ? true : false}
            onPress={handleSubmit}
            style={styles.button}
            subStyle={{
              color: defaultStyles.colors.primary,
              letterSpacing: scale(2),
              fontSize: scale(16),
            }}
            title="Next"
          />
          <AppButton
            disabled={disabled}
            title="Send Otp again"
            style={styles.sendOtpAgain}
            subStyle={{ fontSize: scale(14) }}
            onPress={handleSendOtpAgainPress}
          />
        </View>
        <AppText onPress={openPrivacyPage} style={styles.infoText}>
          By continuing you agree to the Terms and Privacy policy.
        </AppText>
      </Screen>
      <LoadingIndicator visible={isLoading} />
      <InfoAlert
        leftPress={handleCloseInfoAlert}
        description={infoAlert.infoAlertMessage}
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
    marginVertical: "10@s",
    marginBottom: "25@s",
    width: "80%",
  },
  codeFieldRoot: {},
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
  container: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.primary,
    flex: 1,
    paddingTop: "120@s",
    width: "100%",
  },
  focusCell: {
    borderColor: defaultStyles.colors.dark_Variant,
  },
  inputContainer: {
    alignItems: "center",
    bottom: "20@s",
    justifyContent: "center",
    width: "100%",
  },
  infoText: {
    color: defaultStyles.colors.white,
    fontSize: "13.5@s",
    lineHeight: "15@s",
    textAlign: "center",
    width: "70%",
  },
  infoIconContainer: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.tomato,
    borderRadius: "50@s",
    height: "100@s",
    justifyContent: "center",
    marginBottom: "40@s",
    padding: "20@s",
    width: "100@s",
  },
  otpInputContainer: {
    alignItems: "center",
    alignSelf: "center",
    flexDirection: "row",
    height: "40@s",
    justifyContent: "space-between",
    width: "80%",
  },
  sendOtpAgain: {
    backgroundColor: defaultStyles.colors.blue,
    borderRadius: "20@s",
    height: "35@s",
    marginTop: "5@s",
    width: "50%",
  },
  screen: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.primary,
    justifyContent: "center",
    paddingHorizontal: "20@s",
  },
});
