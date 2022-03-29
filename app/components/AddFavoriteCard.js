import React, { useState, useCallback, useContext } from "react";
import { View, TouchableOpacity } from "react-native";
import LottieView from "lottie-react-native";
import AntDesign from "../../node_modules/react-native-vector-icons/AntDesign";
import { ScaledSheet, scale } from "react-native-size-matters";

import AppButton from "./AppButton";
import AppImage from "./AppImage";
import AppText from "./AppText";
import InfoAlert from "./InfoAlert";
import ApiProcessingContainer from "./ApiProcessingContainer";
import ActionSelector from "./ActionSelector";

import storeDetails from "../utilities/storeDetails";

import useAuth from "../auth/useAuth";
import usersApi from "../api/users";

import debounce from "../utilities/debounce";

import defaultStyles from "../config/styles";
import ApiContext from "../utilities/apiContext";
import apiActivity from "../utilities/apiActivity";

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
  isConnected,
}) {
  const { apiProcessing, setApiProcessing } = useContext(ApiContext);
  const { user, setUser } = useAuth();
  const { tackleProblem } = apiActivity;

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

        const { ok, data, problem } = await usersApi.addFavorite(
          favoriteUser._id
        );

        if (ok) {
          await storeDetails(data.user);
          setUser(data.user);
          setProcessing(false);
          return setApiProcessing(false);
        }
        setApiProcessing(false);
        setProcessing(false);

        tackleProblem(problem, data, setInfoAlert);
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

        const { ok, data, problem } = await usersApi.removeFavorite(
          favoriteUser._id
        );

        if (ok) {
          await storeDetails(data.user);
          setUser(data.user);
          setApiProcessing(false);
          return setProcessing(false);
        }
        setProcessing(false);
        setApiProcessing(false);
        tackleProblem(problem, data, setInfoAlert);
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
          loop={false}
          source={"noresults.json"}
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
      <View style={styles.actionContainer}>
        <ActionSelector
          processing={processing}
          style={styles.actionSelectionStyle}
          plusAction={!inFavourites}
        >
          <ApiProcessingContainer
            processing={processing}
            style={styles.buttonContainer}
          >
            <AppButton
              disabled={apiProcessing || !isConnected ? true : false}
              title={inFavourites ? "Remove" : "Add"}
              style={styles.addButton}
              subStyle={[
                styles.addButtonSub,
                {
                  color: inFavourites
                    ? defaultStyles.colors.yellow_Variant
                    : defaultStyles.colors.white,
                },
              ]}
              onPress={!inFavourites ? handleAddPress : handleRemovePress}
            />
          </ApiProcessingContainer>
        </ActionSelector>
        <TouchableOpacity
          underlayColor={defaultStyles.colors.yellow}
          // activeOpacity={0.5}
          onPress={onMessagePress}
          style={styles.favoriteMessageIconContainer}
        >
          <AntDesign
            color={defaultStyles.colors.secondary}
            name="message1"
            onPress={onMessagePress}
            size={scale(18)}
          />
        </TouchableOpacity>
      </View>
      <InfoAlert
        description={infoAlert.infoAlertMessage}
        leftPress={handleCloseInfoAlert}
        visible={infoAlert.showInfoAlert}
      />
    </View>
  );
}

const styles = ScaledSheet.create({
  actionSelectionStyle: {
    backgroundColor: defaultStyles.colors.secondary,
  },
  actionContainer: {
    backgroundColor: defaultStyles.colors.yellow_Variant,
    borderRadius: "8@s",
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
  },
  buttonContainer: {
    alignItems: "center",
    height: "32@s",
    justifyContent: "center",
    overflow: "hidden",
    width: "60@s",
  },
  addButton: {
    backgroundColor: defaultStyles.colors.secondary,
    borderRadius: "8@s",
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
  favoriteMessageIconContainer: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.yellow_Variant,
    borderRadius: "10@s",
    height: "32@s",
    justifyContent: "center",
    marginLeft: "5@s",
    width: "32@s",
  },
  image: {
    borderRadius: "19@s",
    elevation: 2,
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
