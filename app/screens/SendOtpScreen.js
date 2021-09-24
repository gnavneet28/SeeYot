import React, { useState, useCallback } from "react";
import { View, StyleSheet, ImageBackground } from "react-native";

import AppButton from "../components/AppButton";
import AppText from "../components/AppText";
import AppTextInput from "../components/AppTextInput";
import CountryPicker from "../components/CountryPicker";
import InfoAlert from "../components/InfoAlert";
import LoadingIndicator from "../components/LoadingIndicator";

import defaultStyles from "../config/styles";

import verifyApi from "../api/verify";

const height = defaultStyles.height;

function SendOtpScreen({ navigation }) {
  //STATES
  const [visible, setVisible] = useState(false);
  const [code, setCode] = useState("+91");
  const [number, setNumber] = useState(null);
  const [verificationId, setVerificationId] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [infoAlert, setInfoAlert] = useState({
    infoAlertMessage: "",
    showInfoAlert: false,
  });

  // INFO ALERT ACTION
  const handleCloseInfoAlert = useCallback(
    () => setInfoAlert({ ...infoAlert, showInfoAlert: false }),
    []
  );

  const handleOpenCodePress = () => setVisible(true);

  const handleSetCode = (country) => {
    setCode(country.code);
    setVisible(false);
  };

  // SUBMIT ACTION
  const handleSubmit = async () => {
    setIsLoading(true);

    const phoneNumber = `${code}${number}`;
    const { ok, data, problem } = await verifyApi.sendVerificationCode(
      phoneNumber
    );

    if (ok) {
      setVerificationId(data.attemptCode);
      setIsLoading(false);
      return navigation.navigate("VerifyOtp", {
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

  return (
    <ImageBackground
      style={[styles.imageBackground]}
      source={require("../assets/chatWallPaper.png")}
    >
      <View style={styles.header}>
        <AppText style={styles.verifyInfo}>Verify your Phone Number.</AppText>
      </View>
      <LoadingIndicator visible={isLoading} />
      <InfoAlert
        leftPress={handleCloseInfoAlert}
        description={infoAlert.infoAlertMessage}
        visible={infoAlert.showInfoAlert}
      />
      <CountryPicker
        visible={visible}
        setVisible={setVisible}
        onPress={handleSetCode}
      />
      <View style={styles.inputContainer}>
        <View style={styles.phoneInputContainer}>
          <AppText onPress={handleOpenCodePress} style={styles.code}>
            {code}
          </AppText>
          <AppTextInput
            autoCorrect={false}
            keyboardType="phone-pad"
            textContentType="telephoneNumber"
            maxLength={10}
            onChangeText={(number) => setNumber(number)}
            value={number}
            placeholder="Enter phone number"
            style={styles.number}
            subStyle={styles.numberSub}
          />
        </View>
        <AppButton
          disabled={
            number && number.length == 10 && !verificationId ? false : true
          }
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
  code: {
    textAlign: "center",
    width: "20%",
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
    justifyContent: "center",
    marginBottom: 20,
    width: "100%",
  },
  inputBox: {
    backgroundColor: "tomato",
    borderRadius: 5,
    marginBottom: 20,
    width: "95%",
  },
  infoText: {
    color: defaultStyles.colors.white,
    height: 100,
    lineHeight: height > 640 ? height * 0.028 : height * 0.03,
    textAlign: "center",
    width: "80%",
  },
  number: {
    width: "75%",
  },
  numberSub: {
    letterSpacing: 2,
  },
  otpSentInfo: {
    color: defaultStyles.colors.white,
    fontSize: 18,
    marginTop: 10,
    textAlign: "center",
  },
  phoneInputContainer: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.white,
    borderRadius: 5,
    flexDirection: "row",
    height: 45,
    justifyContent: "space-between",
    marginBottom: 10,
    overflow: "hidden",
    width: "80%",
  },
  submitButtonSub: {
    color: defaultStyles.colors.primary,
    letterSpacing: 2,
  },
  verifyInfo: {
    color: defaultStyles.colors.white,
    fontSize: 22,
    top: 10,
  },
});

export default SendOtpScreen;
