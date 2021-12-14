import React, { useState, useCallback, useEffect } from "react";
import { View } from "react-native";
import { ScaledSheet } from "react-native-size-matters";
import { LinearGradient } from "expo-linear-gradient";
import { useIsFocused } from "@react-navigation/native";

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

function SendOtpScreen({ navigation }) {
  const mounted = useMountedRef().current;
  const isFocused = useIsFocused();
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

  return (
    <Screen style={styles.container}>
      <LinearGradient
        colors={["#1c1d1f", "#1d1f24", "#6b6863"]}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <AppText style={styles.verifyInfo}>Verify your Phone Number.</AppText>
        </View>
        <LoadingIndicator visible={isLoading} />
        <InfoAlert
          description={infoAlert.infoAlertMessage}
          leftPress={handleCloseInfoAlert}
          visible={infoAlert.showInfoAlert}
        />
        <CountryPicker
          onPress={handleSetCode}
          setVisible={setVisible}
          visible={visible}
        />
        {visible ? <View style={styles.modalFallback} /> : null}
        <View style={styles.inputContainer}>
          <View style={styles.phoneInputContainer}>
            <AppText onPress={handleOpenCodePress} style={styles.code}>
              {code}
            </AppText>
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
      </LinearGradient>
    </Screen>
  );
}

const styles = ScaledSheet.create({
  button: {
    backgroundColor: defaultStyles.colors.yellow_Variant,
    borderRadius: "5@s",
    height: "40@s",
    width: "80%",
  },
  code: {
    textAlign: "center",
    width: "20%",
  },
  container: {
    alignItems: "center",
    backgroundColor: "#1c1d1f",
  },
  gradient: {
    alignItems: "center",
    width: "100%",
    flex: 1,
    paddingTop: "230@s",
  },
  header: {
    alignItems: "center",
    backgroundColor: "rgba(255, 80, 80, 0.7)",
    borderBottomLeftRadius: "80@s",
    borderBottomRightRadius: "80@s",
    height: "75@s",
    justifyContent: "center",
    position: "absolute",
    top: "-35@s",
    width: "100%",
  },
  inputContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "20@s",
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
    fontSize: "12@s",
    lineHeight: "15@s",
    paddingHorizontal: "10@s",
    paddingVertical: "5@s",
    textAlign: "center",
    width: "60%",
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
    flexDirection: "row",
    height: "40@s",
    justifyContent: "space-between",
    marginBottom: "10@s",
    overflow: "hidden",
    width: "80%",
  },
  submitButtonSub: {
    color: defaultStyles.colors.primary,
    letterSpacing: "1@s",
  },
  verifyInfo: {
    color: defaultStyles.colors.white,
    fontSize: "17@s",
    top: "10@s",
  },
});

export default SendOtpScreen;
