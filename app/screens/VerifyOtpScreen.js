import React, { useState, useRef, useEffect } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  ImageBackground,
  Text,
} from "react-native";
import auth from "@react-native-firebase/auth";

import AppButton from "../components/AppButton";
import AppText from "../components/AppText";
import InfoAlert from "../components/InfoAlert";
import LoadingIndicator from "../components/LoadingIndicator";
import OtpCodeInput from "../components/OtpCodeInput";

import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from "react-native-confirmation-code-field";

import defaultStyles from "../config/styles";

import verifyApi from "../api/verify";

const height = defaultStyles.height;

export default function VerifyOtpScreen({ navigation, route }) {
  const { phoneNumber, verificationId } = route.params;

  const [value, setValue] = useState("");
  const ref = useBlurOnFulfill({ value, cellCount: 6 });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  let number = phoneNumber;
  let verifiedId = verificationId;

  console.log(verifiedId, verificationId);

  // STATES
  const [disabled, setDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [infoAlert, setInfoAlert] = useState({
    infoAlertMessage: "",
    showInfoAlert: false,
  });

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
      return navigation.navigate("ProfileDetails", {
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
        <AppText style={styles.enterOtpText}>Enter the otp.</AppText>
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
          subStyle={{ color: defaultStyles.colors.primary, letterSpacing: 2 }}
          title="Next"
        />
        <AppButton
          disabled={disabled}
          title="Send Otp again"
          style={styles.sendOtpAgain}
          subStyle={{ fontSize: 16 }}
          onPress={handleSendOtpAgainPress}
        />
      </View>
      <AppText style={styles.infoText}>
        By continuing you agree to the Terms and Privacy policy.
      </AppText>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: defaultStyles.colors.yellow_Variant,
    borderRadius: 5,
    height: defaultStyles.dimensionConstants.height,
    width: "80%",
  },
  codeFieldRoot: { marginTop: 20 },
  cell: {
    backgroundColor: defaultStyles.colors.white,
    width: 45,
    height: 45,
    lineHeight: 38,
    fontSize: 20,
    borderWidth: 2,
    borderColor: "#00000030",
    textAlign: "center",
    marginHorizontal: 5,
    borderRadius: 5,
    textAlignVertical: "center",
  },
  enterOtpText: {
    color: defaultStyles.colors.white,
    fontSize: 22,
    marginBottom: 15,
    textAlign: "center",
    width: "100%",
  },
  focusCell: {
    borderColor: "#000",
  },
  header: {
    alignItems: "center",
    backgroundColor: "rgba(255, 80, 80, 0.8)",
    borderBottomLeftRadius: 80,
    borderBottomRightRadius: 80,
    height: 100,
    justifyContent: "center",
    position: "absolute",
    top: 0,
    width: "100%",
  },
  imageBackground: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.primary,
    flex: 1,
    justifyContent: "center",
  },
  inputContainer: {
    alignItems: "center",
    bottom: 20,
    justifyContent: "center",
    width: "100%",
  },
  inputBox: {
    borderRadius: 30,
    marginBottom: 20,
  },
  infoText: {
    color: defaultStyles.colors.white,
    lineHeight: height > 640 ? height * 0.028 : height * 0.03,
    textAlign: "center",
    width: "70%",
  },
  otpInputContainer: {
    alignItems: "center",
    flexDirection: "row",
    height: defaultStyles.dimensionConstants.height,
    justifyContent: "space-between",
    marginBottom: 20,
    width: "80%",
  },
  sendOtpAgain: {
    backgroundColor: defaultStyles.colors.blue,
    height: 35,
    marginVertical: 30,
    width: 110,
  },
  screen: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.primary,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  verifyInfo: {
    color: defaultStyles.colors.white,
    fontSize: 22,
    top: 10,
  },
});
