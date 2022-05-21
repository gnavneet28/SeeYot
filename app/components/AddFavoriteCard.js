import React, {
  useState,
  useCallback,
  useContext,
  memo,
  useEffect,
} from "react";
import { View, TouchableOpacity } from "react-native";
import LottieView from "lottie-react-native";
import AntDesign from "../../node_modules/react-native-vector-icons/AntDesign";
import Ionicons from "../../node_modules/react-native-vector-icons/Ionicons";
import { ScaledSheet, scale } from "react-native-size-matters";

import AppImage from "./AppImage";
import AppText from "./AppText";
import InfoAlert from "./InfoAlert";
import ApiProcessingContainer from "./ApiProcessingContainer";

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

function AddFavoriteCard({
  onMessagePress = () => null,
  favoriteUser = defaulFavoriteUser,
  style,
}) {
  const { apiProcessing, setApiProcessing } = useContext(ApiContext);
  const { user, setUser } = useAuth();
  const { tackleProblem } = apiActivity;
  let isUnmounting = false;

  useEffect(() => {
    return () => (isUnmounting = true);
  });

  const handleOnMessagePress = () => {
    onMessagePress(favoriteUser);
  };
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
        setApiProcessing(favoriteUser._id);

        const { ok, data, problem } = await usersApi.addFavorite(
          favoriteUser._id
        );

        if (ok) {
          await storeDetails(data.user);
          setUser(data.user);
          return setApiProcessing("");
        }
        setApiProcessing("");
        if (!isUnmounting) {
          tackleProblem(problem, data, setInfoAlert);
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
        setApiProcessing(favoriteUser._id);

        const { ok, data, problem } = await usersApi.removeFavorite(
          favoriteUser._id
        );

        if (ok) {
          await storeDetails(data.user);
          setUser(data.user);
          return setApiProcessing("");
        }

        setApiProcessing("");
        if (!isUnmounting) {
          tackleProblem(problem, data, setInfoAlert);
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
        <ApiProcessingContainer
          color={defaultStyles.colors.white}
          processing={apiProcessing === favoriteUser._id}
          style={[
            styles.buttonContainer,
            {
              backgroundColor: inFavourites
                ? defaultStyles.colors.dark_Variant
                : defaultStyles.colors.secondary,
            },
          ]}
        >
          <Ionicons
            name={
              inFavourites
                ? "ios-remove-circle-outline"
                : "ios-add-circle-outline"
            }
            size={scale(22)}
            color={defaultStyles.colors.white}
            onPress={!inFavourites ? handleAddPress : handleRemovePress}
          />
        </ApiProcessingContainer>
        <TouchableOpacity
          underlayColor={defaultStyles.colors.yellow}
          onPress={handleOnMessagePress}
          style={styles.favoriteMessageIconContainer}
        >
          <AntDesign
            color={defaultStyles.colors.secondary}
            name="message1"
            onPress={handleOnMessagePress}
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
    flexDirection: "row",
    height: "32@s",
    justifyContent: "flex-start",
    overflow: "hidden",
    paddingLeft: "10@s",
    width: "55@s",
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

export default memo(AddFavoriteCard);
