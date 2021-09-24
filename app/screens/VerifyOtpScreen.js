import React, { useState, useRef, useEffect } from "react";
import { View, StyleSheet, TextInput, ImageBackground } from "react-native";
import auth from "@react-native-firebase/auth";

import AppButton from "../components/AppButton";
import AppText from "../components/AppText";
import InfoAlert from "../components/InfoAlert";
import LoadingIndicator from "../components/LoadingIndicator";

import defaultStyles from "../config/styles";

import verifyApi from "../api/verify";

const height = defaultStyles.height;

export default function VerifyOtpScreen({ navigation, route }) {
  const { phoneNumber, verificationId } = route.params;

  let number = phoneNumber;
  let verifiedId = verificationId;

  console.log(verifiedId, verificationId);

  // STATES
  const [disabled, setDisabled] = useState(false);
  const [code1, setCode1] = useState("");
  const [code2, setCode2] = useState("");
  const [code3, setCode3] = useState("");
  const [code4, setCode4] = useState("");
  const [code5, setCode5] = useState("");
  const [code6, setCode6] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [infoAlert, setInfoAlert] = useState({
    infoAlertMessage: "",
    showInfoAlert: false,
  });
  let input1 = useRef("");
  let input2 = useRef("");
  let input3 = useRef("");
  let input4 = useRef("");
  let input5 = useRef("");
  let input6 = useRef("");

  // INFO ALERT ACTION
  const handleCloseInfoAlert = () =>
    setInfoAlert({ ...infoAlert, showInfoAlert: false });

  // ON PAGE FOCUS ACTION
  useEffect(() => {
    input1.current.focus();
  }, []);

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
  let finalCode = code1 + code2 + code3 + code4 + code5 + code6;
  const handleSubmit = async () => {
    setDisabled(false);
    setIsLoading(true);
    const { ok, data, problem } = await verifyApi.verifyNumber(
      number,
      finalCode
    );

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
          <TextInput
            keyboardType="numeric"
            maxLength={1}
            onChangeText={(text) => {
              if (text) {
                setCode1(text);
                input2.current.focus();
                return;
              }
              setCode1("");
            }}
            placeholder="0"
            ref={input1}
            style={styles.otpInput}
            value={code1}
          />
          <TextInput
            keyboardType="numeric"
            maxLength={1}
            onFocus={() => {
              if (!code1) {
                setCode2("");
                input1.current.focus();
              }
            }}
            onChangeText={(text) => {
              if (text) {
                setCode2(text);
                input3.current.focus();
                return;
              }
              setCode2("");
              input1.current.focus();
            }}
            placeholder="0"
            ref={input2}
            style={styles.otpInput}
            value={code2}
          />
          <TextInput
            keyboardType="numeric"
            onFocus={() => {
              if (!code2) {
                setCode3("");
                input2.current.focus();
              }
            }}
            onChangeText={(text) => {
              if (text) {
                setCode3(text);
                input4.current.focus();
                return;
              }
              setCode3("");
              input2.current.focus();
            }}
            ref={input3}
            placeholder="0"
            maxLength={1}
            style={styles.otpInput}
            value={code3}
          />
          <TextInput
            value={code4}
            onFocus={() => {
              if (!code3) {
                setCode4("");
                input3.current.focus();
              }
            }}
            keyboardType="numeric"
            onChangeText={(text) => {
              if (text) {
                setCode4(text);
                input5.current.focus();
                return;
              }
              setCode4("");
              input3.current.focus();
            }}
            ref={input4}
            placeholder="0"
            maxLength={1}
            style={styles.otpInput}
          />
          <TextInput
            value={code5}
            onFocus={() => {
              if (!code4) {
                setCode5("");
                input4.current.focus();
              }
            }}
            keyboardType="numeric"
            onChangeText={(text) => {
              if (text) {
                setCode5(text);
                input6.current.focus();
                return;
              }
              setCode5("");
              input4.current.focus();
            }}
            ref={input5}
            placeholder="0"
            maxLength={1}
            style={styles.otpInput}
          />
          <TextInput
            value={code6}
            onFocus={() => {
              if (!code5) {
                setCode6("");
                input5.current.focus();
              }
            }}
            keyboardType="numeric"
            onChangeText={(text) => {
              if (text) {
                setCode6(text);
                return;
              }
              setCode6("");
              input5.current.focus();
            }}
            ref={input6}
            placeholder="0"
            maxLength={1}
            style={styles.otpInput}
          />
        </View>
        <AppButton
          disabled={!finalCode || finalCode.length < 6 ? true : false}
          onPress={handleSubmit}
          style={styles.button}
          subStyle={{ color: defaultStyles.colors.primary, letterSpacing: 2 }}
          title="Next"
        />
        <AppButton
          disabled={disabled}
          title="Send Otp again"
          style={styles.sendOtpAgain}
          subStyle={{ fontSize: 17 }}
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
  enterOtpText: {
    color: defaultStyles.colors.white,
    fontSize: 22,
    marginBottom: 15,
    textAlign: "center",
    width: "100%",
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
  otpInput: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.white,
    borderRadius: 5,
    fontSize: 18,
    height: "100%",
    justifyContent: "center",
    textAlign: "center",
    width: "14%",
  },
  sendOtpAgain: {
    backgroundColor: defaultStyles.colors.blue,
    height: 35,
    marginVertical: 20,
    width: 130,
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
