import React from "react";
import { View, StyleSheet } from "react-native";
import LottieView from "lottie-react-native";
import AntDesign from "react-native-vector-icons/AntDesign";

import AppButton from "./AppButton";
import AppImage from "./AppImage";
import AppText from "./AppText";

import useAuth from "../auth/useAuth";

import defaultStyles from "../config/styles";

const defaulFavoriteUser = {
  name: "",
  phoneNumber: parseInt(""),
  picture: "",
};

function AddContactCard({
  onAddPress = () => null,
  onRemovePress = () => null,
  onMessagePress = () => null,
  favoriteUser = defaulFavoriteUser,
  style,
}) {
  const { user } = useAuth();

  const favorites = user.favorites;

  const inFavourites =
    favorites &&
    favorites.length > 0 &&
    favorites.filter((f) => f.phoneNumber == favoriteUser.phoneNumber)[0];

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
        <AppText style={styles.infoNumberText}>
          {favoriteUser.phoneNumber}
        </AppText>
      </View>
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
        onPress={!inFavourites ? onAddPress : onRemovePress}
      />
      <AntDesign
        style={{ marginHorizontal: 15 }}
        name="message1"
        size={25}
        color={defaultStyles.colors.blue}
        onPress={onMessagePress}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  addButton: {
    borderRadius: 10,
    height: 35,
    marginRight: 5,
    width: 65,
  },
  addButtonSub: {
    fontSize: 16,
  },
  container: {
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: defaultStyles.colors.white,
    borderColor: defaultStyles.colors.light,
    borderRadius: 10,
    elevation: 1,
    flexDirection: "row",
    height: 60,
    marginVertical: 5,
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
  infoNumberText: {
    color: defaultStyles.colors.secondary,
    fontSize: 14,
    opacity: 0.7,
    paddingTop: 0,
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
