import React, { useState, useCallback } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import LottieView from "lottie-react-native";
import AntDesign from "react-native-vector-icons/AntDesign";

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

const defaulFavoriteUser = {
  name: "",
  phoneNumber: parseInt(""),
  picture: "",
};

function AddContactCard({
  onMessagePress = () => null,
  favoriteUser = defaulFavoriteUser,
  style,
}) {
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
        setProcessing(true);

        let modifiedUser = { ...user };

        const { ok, data, problem } = await usersApi.addFavorite(
          favoriteUser._id
        );

        if (ok) {
          modifiedUser.favorites = data.favorites;
          setUser(modifiedUser);
          await asyncStorage.store(DataConstants.FAVORITES, data.favorites);
          return setProcessing(false);
        }

        if (problem) {
          if (data) {
            setProcessing(false);
            return setInfoAlert({
              infoAlertMessage: data.message,
              showInfoAlert: true,
            });
          }

          setProcessing(false);
          return setInfoAlert({
            infoAlertMessage: "Something went wrong! Please try again.",
            showInfoAlert: true,
          });
        }
      },
      1000,
      true
    ),
    [user, favoriteUser._id]
  );

  const handleRemovePress = useCallback(
    debounce(
      async () => {
        setProcessing(true);

        let modifiedUser = { ...user };

        const { ok, data, problem } = await usersApi.removeFavorite(
          favoriteUser._id
        );

        if (ok) {
          modifiedUser.favorites = data.favorites;
          setUser(modifiedUser);
          await asyncStorage.store(DataConstants.FAVORITES, data.favorites);
          return setProcessing(false);
        }
        if (problem) {
          if (data) {
            setProcessing(false);
            return setInfoAlert({
              infoAlertMessage: data.message,
              showInfoAlert: true,
            });
          }
          setProcessing(false);
          return setInfoAlert({
            infoAlertMessage: "Something went wrong! Please try again.",
            showInfoAlert: true,
          });
        }
      },
      1000,
      true
    ),
    [user]
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
            size={18}
            color={
              inFavourites
                ? defaultStyles.colors.tomato
                : defaultStyles.colors.blue
            }
          />
        ) : (
          <AppButton
            title={inFavourites ? "Remove" : "Add"}
            style={[
              styles.addButton,
              {
                backgroundColor: inFavourites
                  ? defaultStyles.colors.tomato
                  : defaultStyles.colors.blue,
              },
            ]}
            subStyle={styles.addButtonSub}
            onPress={!inFavourites ? handleAddPress : handleRemovePress}
          />
        )}
      </View>
      <AntDesign
        style={{ marginHorizontal: 15 }}
        name="message1"
        size={25}
        color={defaultStyles.colors.dark_Variant}
        onPress={onMessagePress}
      />
      <InfoAlert
        leftPress={handleCloseInfoAlert}
        description={infoAlert.infoAlertMessage}
        visible={infoAlert.showInfoAlert}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  buttonContainer: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    height: 35,
    marginRight: 5,
    width: 65,
    borderWidth: 1,
    borderColor: defaultStyles.colors.light,
    overflow: "hidden",
  },
  addButton: {
    borderRadius: 10,
    height: 35,
    width: 65,
  },
  addButtonSub: {
    fontSize: 16,
  },
  container: {
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: defaultStyles.colors.white,
    borderRadius: 10,
    elevation: 1,
    flexDirection: "row",
    height: 60,
    marginVertical: 2,
    padding: 2,
    paddingHorizontal: 5,
    width: "95%",
  },
  emptyData: {
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: defaultStyles.colors.white,
    borderRadius: 5,
    height: 70,
    justifyContent: "center",
    width: "95%",
  },
  image: {
    borderRadius: 20,
    height: 40,
    marginRight: 5,
    marginLeft: 10,
    width: 40,
  },
  imageSub: {
    borderRadius: 20,
    height: 40,
    width: 40,
  },
  infoContainer: {
    flex: 1,
  },
  infoNameText: {
    color: defaultStyles.colors.primary,
    fontSize: 18,
    opacity: 0.9,
    paddingBottom: 0,
  },
  inviteButton: {
    backgroundColor: defaultStyles.colors.yellow_Variant,
    borderRadius: 5,
    height: 35,
    marginRight: 5,
    width: 60,
  },
});

export default AddContactCard;
