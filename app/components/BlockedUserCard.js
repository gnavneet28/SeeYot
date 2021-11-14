import React from "react";
import { View } from "react-native";
import { ScaledSheet } from "react-native-size-matters";

import AppButton from "./AppButton";
import AppImage from "./AppImage";
import AppText from "./AppText";

import useAuth from "../auth/useAuth";

import defaultStyles from "../config/styles";
import defaultProps from "../utilities/defaultProps";

function AddContactCard({
  style,
  onUnBlockPress = () => null,
  blockedUser = defaultProps.defaultBlockedUser,
}) {
  const { user } = useAuth();

  const blockedUsers = user.blocked;

  const isBlocked = blockedUsers.filter((b) => b._id == blockedUser._id)[0];

  return (
    <View style={[styles.container, style]}>
      <AppImage
        activeOpacity={1}
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
const styles = ScaledSheet.create({
  blockedButton: {
    backgroundColor: defaultStyles.colors.yellow_Variant,
    borderRadius: "10@s",
    height: "30@s",
    marginRight: "5@s",
    width: "70@s",
  },
  blockButtonSub: {
    color: defaultStyles.colors.primary,
    fontSize: "14.5@s",
    letterSpacing: "0.5@s",
  },
  container: {
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: defaultStyles.colors.white,
    borderColor: defaultStyles.colors.light,
    borderRadius: "10@s",
    borderWidth: 1,
    elevation: 1,
    flexDirection: "row",
    height: "50@s",
    marginVertical: "5@s",
    padding: "2@s",
    paddingHorizontal: "5@s",
    width: "95%",
  },
  image: {
    backgroundColor: defaultStyles.colors.white,
    borderRadius: "19@s",
    height: "38@s",
    marginRight: "5@s",
    width: "38@s",
  },
  imageSub: {
    borderWidth: 0,
    height: "38@s",
    width: "38@s",
  },
  infoContainer: {
    flex: 1,
  },
  infoNameText: {
    color: defaultStyles.colors.primary,
    fontSize: "15@s",
    paddingBottom: 0,
  },
  infoNumberText: {
    color: defaultStyles.colors.secondary,
    fontSize: "10@s",
    paddingTop: 0,
  },
});

export default AddContactCard;
