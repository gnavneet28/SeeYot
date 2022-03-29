import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { ScaledSheet } from "react-native-size-matters";
import { useIsFocused } from "@react-navigation/native";

import AddPicture from "../components/AddPicture";
import AppButton from "../components/AppButton";
import AppText from "../components/AppText";
import AppTextInput from "../components/AppTextInput";
import InfoAlert from "../components/InfoAlert";
import LoadingIndicator from "../components/LoadingIndicator";
import Screen from "../components/Screen";

import usersApi from "../api/users";

import useAuth from "../auth/useAuth";
import authStorage from "../auth/storage";

import useMountedRef from "../hooks/useMountedRef";

import storeDetails from "../utilities/storeDetails";

import defaultStyles from "../config/styles";
import useKeyboard from "../hooks/useKeyboard";
import apiActivity from "../utilities/apiActivity";

function RegisterDetailsScreen({ route }) {
  const { logIn } = useAuth();
  const mounted = useMountedRef().current;
  const isFocused = useIsFocused();
  const { number, verifiedId } = route.params;
  let keyboardShown = useKeyboard();
  const { tackleProblem } = apiActivity;

  // STATES
  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [infoAlert, setInfoAlert] = useState({
    infoAlertMessage: "",
    showInfoAlert: false,
  });

  useEffect(() => {
    if (!isFocused && mounted && isLoading === true) {
      setIsLoading(false);
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

  // INFO ALERT ACTION
  const handleCloseInfoAlert = () =>
    setInfoAlert({ ...infoAlert, showInfoAlert: false });

  // SUBMIT ACTION

  const handleSubmitForm = async () => {
    setIsLoading(true);

    const { ok, problem, data, headers } = await usersApi.registerUser(
      parseInt(number),
      image,
      name.trim(),
      verifiedId
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

  return (
    <>
      <Screen style={styles.container}>
        <View style={styles.enterDetailsContainer}>
          <AddPicture
            image={image}
            onChangeImage={(image) => setImage(image)}
            style={styles.addPhoto}
          />
          <AppTextInput
            maxLength={25}
            onChangeText={(name) => setName(name)}
            placeholder="Enter your name here..."
            style={styles.enterName}
            subStyle={styles.enterNameSub}
          />
          <AppText style={styles.info}>
            Name you enter here, will be visible to your friends.
          </AppText>
        </View>
        <AppButton
          disabled={name ? false : true}
          onPress={handleSubmitForm}
          style={[styles.button, { display: keyboardShown ? "none" : "flex" }]}
          subStyle={styles.submitButtonSub}
          title="Next"
        />
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
  addPhoto: {
    marginBottom: "20@s",
    marginTop: "30@s",
  },
  button: {
    backgroundColor: defaultStyles.colors.yellow_Variant,
    borderRadius: "5@s",
    elevation: 2,
    height: "35@s",
    width: "90%",
  },
  container: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.primary,
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: "10@s",
    paddingVertical: "20@s",
    width: "100%",
  },
  enterDetailsContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: "90%",
  },
  enterName: {
    borderRadius: "5@s",
    elevation: 2,
    height: "40@s",
    marginBottom: "5@s",
  },
  info: {
    color: defaultStyles.colors.white,
    fontSize: "12@s",
    textAlign: "left",
    width: "100%",
  },
  enterNameSub: {
    marginHorizontal: "10@s",
  },
  submitButtonSub: {
    color: defaultStyles.colors.primary,
    letterSpacing: "1@s",
  },
});

export default RegisterDetailsScreen;
