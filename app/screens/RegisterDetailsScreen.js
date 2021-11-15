import React, { useState } from "react";
import { View, ImageBackground } from "react-native";
import { ScaledSheet } from "react-native-size-matters";

import AddPicture from "../components/AddPicture";
import AppButton from "../components/AppButton";
import AppText from "../components/AppText";
import AppTextInput from "../components/AppTextInput";
import InfoAlert from "../components/InfoAlert";
import LoadingIndicator from "../components/LoadingIndicator";

import usersApi from "../api/users";

import useAuth from "../auth/useAuth";
import authStorage from "../auth/storage";

import storeDetails from "../utilities/storeDetails";

import defaultStyles from "../config/styles";
import { useKeyboard } from "@react-native-community/hooks";

function RegisterDetailsScreen({ route }) {
  const { logIn } = useAuth();
  const { number, verifiedId } = route.params;

  const { keyboardShown } = useKeyboard();

  // STATES
  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [infoAlert, setInfoAlert] = useState({
    infoAlertMessage: "",
    showInfoAlert: false,
  });

  // INFO ALERT ACTION
  const handleCloseInfoAlert = () =>
    setInfoAlert({ ...infoAlert, showInfoAlert: false });

  // SUBMIT ACTION
  const handleSubmit = async () => {
    setIsLoading(true);

    let picture = image ? image : "";

    if (!image) {
      const { ok, problem, data, headers } =
        await usersApi.registerUserWithoutPicture(
          parseInt(number),
          name,
          verifiedId
        );

      if (ok) {
        const authToken = headers["x-auth-token"];
        await authStorage.storeToken(authToken);
        await storeDetails(data);
        setIsLoading(false);
        return logIn(data);
      }

      if (problem) {
        if (data) {
          setIsLoading(false);
          return setInfoAlert({
            infoAlertMessage: data.message,
            showInfoAlert: true,
          });
        }
        setIsLoading(false);
        return setInfoAlert({
          infoAlertMessage: problem,
          showInfoAlert: true,
        });
      }
    }

    const { ok, problem, data, headers } =
      await usersApi.registerUserWithPicture(
        parseInt(number),
        picture,
        name,
        verifiedId
      );

    if (ok) {
      const authToken = headers["x-auth-token"];
      await authStorage.storeToken(authToken);
      await storeDetails(data);
      setIsLoading(false);
      return logIn(data);
    }

    if (problem) {
      if (data) {
        setIsLoading(false);
        return setInfoAlert({
          infoAlertMessage: data.message,
          showInfoAlert: true,
        });
      }
      setIsLoading(false);
      return setInfoAlert({
        infoAlertMessage: problem,
        showInfoAlert: true,
      });
    }
  };

  return (
    <ImageBackground
      fadeDuration={200}
      style={styles.imageBackground}
      source={require("../assets/chatWallPaper.png")}
    >
      <LoadingIndicator visible={isLoading} />
      <InfoAlert
        leftPress={handleCloseInfoAlert}
        description={infoAlert.infoAlertMessage}
        visible={infoAlert.showInfoAlert}
      />
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
        onPress={handleSubmit}
        style={[styles.button, { display: keyboardShown ? "none" : "flex" }]}
        subStyle={styles.submitButtonSub}
        title="Register"
      />
    </ImageBackground>
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
    height: "40@s",
    width: "90%",
  },
  container: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.primary,
    padding: "20@s",
  },
  enterDetailsContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: "90%",
  },
  enterName: {
    borderRadius: "5@s",
    height: "40@s",
    marginBottom: "5@s",
  },
  imageBackground: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.primary,
    flex: 1,
    justifyContent: "space-between",
    paddingVertical: "20@s",
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
