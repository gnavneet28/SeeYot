import React, { useState, useCallback, useContext } from "react";
import { View, ActivityIndicator } from "react-native";
import LottieView from "lottie-react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import { ScaledSheet, scale } from "react-native-size-matters";

import AppButton from "./AppButton";
import AppImage from "./AppImage";
import AppText from "./AppText";
import InfoAlert from "../components/InfoAlert";

import DataConstants from "../utilities/DataConstants";

import useAuth from "../auth/useAuth";
import usersApi from "../api/users";

import asyncStorage from "../utilities/cache";
import debounce from "../utilities/debounce";

import defaultStyles from "../config/styles";
import ApiContext from "../utilities/apiContext";

const defaulFavoriteUser = {
  _id: "",
  name: "",
  phoneNumber: parseInt(""),
  picture: "",
};

function AddContactCard({
  onMessagePress = () => null,
  favoriteUser = defaulFavoriteUser,
  style,
}) {
  const { apiProcessing, setApiProcessing } = useContext(ApiContext);
  const { user, setUser } = useAuth();
  const [processing, setProcessing] = useState(false);
  const [infoAlert, setInfoAlert] = useState({
    infoAlertMessage: "",
    showInfoAlert: false,
  });

  const favorites = user.favorites;

  const inFavourites =
    favorites &&
    favorites.length > 0 &&
    favorites.filter((f) => f._id == favoriteUser._id)[0];

  // INFO ALERT ACTIONS
  const handleCloseInfoAlert = useCallback(async () => {
    setInfoAlert({ showInfoAlert: false });
  }, []);

  // ADDING , REMOVING AND MESSAGGIN FAVORITES ACTION
  const handleAddPress = useCallback(
    debounce(
      async () => {
        setApiProcessing(true);
        setProcessing(true);

        let modifiedUser = { ...user };

        const { ok, data, problem } = await usersApi.addFavorite(
          favoriteUser._id
        );

        if (ok) {
          modifiedUser.favorites = data.favorites;
          setUser(modifiedUser);
          await asyncStorage.store(DataConstants.FAVORITES, data.favorites);
          setProcessing(false);
          return setApiProcessing(false);
        }

        if (problem) {
          if (data) {
            setApiProcessing(false);
            setProcessing(false);
            return setInfoAlert({
              infoAlertMessage: data.message,
              showInfoAlert: true,
            });
          }

          setProcessing(false);
          setApiProcessing(false);
          return setInfoAlert({
            infoAlertMessage: "Something went wrong! Please try again.",
            showInfoAlert: true,
          });
        }
      },
      1000,
      true
    ),
    [user, favoriteUser._id, user.favorites]
  );

  const handleRemovePress = useCallback(
    debounce(
      async () => {
        setApiProcessing(true);
        setProcessing(true);

        let modifiedUser = { ...user };

        const { ok, data, problem } = await usersApi.removeFavorite(
          favoriteUser._id
        );

        if (ok) {
          modifiedUser.favorites = data.favorites;
          setUser(modifiedUser);
          await asyncStorage.store(DataConstants.FAVORITES, data.favorites);
          setApiProcessing(false);
          return setProcessing(false);
        }
        if (problem) {
          if (data) {
            setProcessing(false);
            setApiProcessing(false);
            return setInfoAlert({
              infoAlertMessage: data.message,
              showInfoAlert: true,
            });
          }
          setProcessing(false);
          setApiProcessing(false);
          return setInfoAlert({
            infoAlertMessage: "Something went wrong! Please try again.",
            showInfoAlert: true,
          });
        }
      },
      1000,
      true
    ),
    [user, user.favorites, favoriteUser._id]
  );

  if (!favoriteUser.name)
    return (
      <View style={styles.emptyData}>
        <LottieView
          autoPlay
          loop
          source={require("../assets/animations/noresults.json")}
          style={{ flex: 1 }}
        />
      </View>
    );

  return (
    <View style={[styles.container, style]}>
      <AppImage
        activeOpacity={1}
        imageUrl={favoriteUser.picture}
        style={styles.image}
        subStyle={styles.imageSub}
      />
      <View style={styles.infoContainer}>
        <AppText numberOfLines={1} style={[styles.infoNameText]}>
          {favoriteUser.name}
        </AppText>
      </View>
      <View style={styles.buttonContainer}>
        {processing ? (
          <ActivityIndicator
            size={scale(16)}
            color={
              inFavourites
                ? defaultStyles.colors.tomato
                : defaultStyles.colors.blue
            }
          />
        ) : (
          <AppButton
            disabled={apiProcessing ? true : false}
            title={inFavourites ? "Remove" : "Add"}
            style={styles.addButton}
            subStyle={[
              styles.addButtonSub,
              {
                color: inFavourites
                  ? defaultStyles.colors.tomato
                  : defaultStyles.colors.blue,
              },
            ]}
            onPress={!inFavourites ? handleAddPress : handleRemovePress}
          />
        )}
      </View>
      <AntDesign
        color={defaultStyles.colors.dark_Variant}
        name="message1"
        onPress={onMessagePress}
        size={scale(22)}
        style={{ marginHorizontal: scale(10) }}
      />
      <InfoAlert
        description={infoAlert.infoAlertMessage}
        leftPress={handleCloseInfoAlert}
        visible={infoAlert.showInfoAlert}
      />
    </View>
  );
}
const styles = ScaledSheet.create({
  buttonContainer: {
    alignItems: "center",
    borderColor: defaultStyles.colors.lightGrey,
    borderRadius: "10@s",
    borderWidth: 1,
    height: "32@s",
    justifyContent: "center",
    marginRight: "4@s",
    overflow: "hidden",
    width: "60@s",
  },
  addButton: {
    backgroundColor: defaultStyles.colors.light,
    borderRadius: "10@s",
    height: "32@s",
    width: "60@s",
  },
  addButtonSub: {
    fontSize: "14@s",
    letterSpacing: "0.2@s",
  },
  container: {
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: defaultStyles.colors.white,
    borderColor: defaultStyles.colors.light,
    borderRadius: "10@s",
    elevation: 1,
    flexDirection: "row",
    height: "50@s",
    marginVertical: "3@s",
    padding: "2@s",
    paddingHorizontal: "5@s",
    width: "95%",
  },
  emptyData: {
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: defaultStyles.colors.white,
    borderRadius: "5@s",
    height: "50@s",
    justifyContent: "center",
    width: "95%",
  },
  image: {
    borderRadius: "19@s",
    height: "38@s",
    marginHorizontal: "5@s",
    width: "38@s",
  },
  imageSub: {
    borderRadius: "19@s",
    height: "38@s",
    width: "38@s",
  },
  infoContainer: {
    flex: 1,
  },
  infoNameText: {
    color: defaultStyles.colors.primary,
    fontSize: "15@s",
    opacity: 0.9,
    paddingBottom: 0,
  },
});

export default AddContactCard;
