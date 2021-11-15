import React, { useState } from "react";
import { View, ImageBackground, Text, Linking } from "react-native";
import { ScaledSheet, scale } from "react-native-size-matters";

import AppButton from "../components/AppButton";
import AppText from "../components/AppText";
import InfoAlert from "../components/InfoAlert";
import LoadingIndicator from "../components/LoadingIndicator";

import Constant from "../navigation/NavigationConstants";

import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from "react-native-confirmation-code-field";

import defaultStyles from "../config/styles";

import verifyApi from "../api/verify";

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
      console.log(data.attemptCode);
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
    <ImageBackground
      style={styles.imageBackground}
      source={require("../assets/chatWallPaper.png")}
    >
      <LoadingIndicator visible={isLoading} />
      <InfoAlert
        leftPress={handleCloseInfoAlert}
        description={infoAlert.infoAlertMessage}
        visible={infoAlert.showInfoAlert}
      />
      <View style={styles.header}>
        <AppText style={styles.verifyInfo}>Verify OTP.</AppText>
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
                  { fontFamily: "Comic-Bold" },
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
          }}
          title="Next"
        />
        <AppButton
          disabled={disabled}
          title="Send Otp again"
          style={styles.sendOtpAgain}
          subStyle={{ fontSize: scale(10) }}
          onPress={handleSendOtpAgainPress}
        />
      </View>
      <AppText onPress={openPrivacyPage} style={styles.infoText}>
        By continuing you agree to the Terms and Privacy policy.
      </AppText>
    </ImageBackground>
  );
}

const styles = ScaledSheet.create({
  button: {
    backgroundColor: defaultStyles.colors.yellow_Variant,
    borderRadius: "5@s",
    height: "35@s",
    marginVertical: "10@s",
    width: "80%",
  },
  codeFieldRoot: {},
  cell: {
    backgroundColor: defaultStyles.colors.white,
    borderRadius: "5@s",
    fontSize: "15@s",
    height: "35@s",
    lineHeight: "38@s",
    marginHorizontal: "5.5@s",
    textAlign: "center",
    textAlignVertical: "center",
    width: "35@s",
  },
  focusCell: {
    borderColor: "#000",
  },
  header: {
    alignItems: "center",
    backgroundColor: "rgba(255, 80, 80, 0.8)",
    borderBottomLeftRadius: "80@s",
    borderBottomRightRadius: "80@s",
    height: "75@s",
    justifyContent: "center",
    position: "absolute",
    top: 0,
    width: "100%",
  },
  imageBackground: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.primary,
    flex: 1,
    paddingTop: "230@s",
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
    height: "25@s",
    marginTop: "5@s",
    width: "80@s",
  },
  screen: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.primary,
    justifyContent: "center",
    paddingHorizontal: "20@s",
  },
  verifyInfo: {
    color: defaultStyles.colors.white,
    fontSize: "17@s",
    top: "10@s",
  },
});
