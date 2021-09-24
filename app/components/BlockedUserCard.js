import React from "react";
import { View, StyleSheet } from "react-native";

import AppButton from "./AppButton";
import AppImage from "./AppImage";
import AppText from "./AppText";

import useAuth from "../auth/useAuth";

import defaultStyles from "../config/styles";

const height = defaultStyles.height;

let defaultBlockedUser = {
  _id: "",
  picture: "",
  name: "",
  phoneNumber: parseInt(""),
};

function AddContactCard({
  style,
  onUnBlockPress = () => null,
  blockedUser = defaultBlockedUser,
}) {
  const { user } = useAuth();

  const blockedUsers = user.blocked;

  const isBlocked = blockedUsers.filter((b) => b._id == blockedUser._id)[0];

  return (
    <View style={[styles.container, style]}>
      <AppImage
        imageUrl={blockedUser.picture}
        style={styles.image}
        subStyle={styles.imageSub}
      />
      <View style={styles.infoContainer}>
        <AppText numberOfLines={1} style={styles.infoNameText}>
          {blockedUser.name}
        </AppText>
        <AppText style={styles.infoNumberText}>
          {blockedUser.phoneNumber}
        </AppText>
      </View>
      <AppButton
        disabled={isBlocked ? false : true}
        onPress={onUnBlockPress}
        style={styles.blockedButton}
        subStyle={styles.blockButtonSub}
        title={isBlocked ? "Unblock" : "Unblocked"}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  blockedButton: {
    backgroundColor: defaultStyles.colors.yellow_Variant,
    borderRadius: 5,
    height: 35,
    marginRight: 5,
    width: 80,
  },
  blockButtonSub: {
    color: defaultStyles.colors.primary,
    fontSize: 16,
    letterSpacing: 1,
  },
  container: {
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: defaultStyles.colors.white,
    borderColor: defaultStyles.colors.light,
    borderRadius: 10,
    borderWidth: 1,
    elevation: 1,
    flexDirection: "row",
    height: 60,
    marginVertical: 5,
    padding: 2,
    paddingHorizontal: 5,
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
    paddingBottom: 0,
  },
  infoNumberText: {
    color: defaultStyles.colors.secondary,
    fontSize: 14,
    paddingTop: 0,
  },
});

export default AddContactCard;
