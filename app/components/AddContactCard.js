import React from "react";
import { View, StyleSheet } from "react-native";

import AppButton from "./AppButton";
import AppImage from "./AppImage";
import AppText from "./AppText";

import useAuth from "../auth/useAuth";

import defaultStyles from "../config/styles";

const height = defaultStyles.height;

function AddContactCard({
  isRegistered,
  imageUrl = "",
  name = "",
  onPress = () => null,
  onInvitePress,
  phoneNumber = parseInt(""),
  style,
}) {
  const { user } = useAuth();

  const contacts = user.contacts;

  const inContacts =
    contacts &&
    contacts.length > 0 &&
    contacts.filter((c) => c.phoneNumber == phoneNumber)[0];

  if (!name)
    return (
      <View style={styles.emptyData}>
        <AppText>No contacts to show!</AppText>
      </View>
    );

  return (
    <View style={[styles.container, style]}>
      <AppImage
        imageUrl={imageUrl}
        style={styles.image}
        subStyle={styles.imageSub}
      />
      <View style={styles.infoContainer}>
        <AppText numberOfLines={1} style={[styles.infoNameText]}>
          {name}
        </AppText>
        <AppText style={styles.infoNumberText}>{phoneNumber}</AppText>
      </View>
      {isRegistered ? (
        <AppButton
          title={inContacts ? "Added" : "Add"}
          disabled={inContacts ? true : false}
          style={[
            styles.addButton,
            {
              backgroundColor: inContacts
                ? defaultStyles.colors.blue
                : defaultStyles.colors.secondary,
            },
          ]}
          subStyle={styles.addButtonSub}
          onPress={onPress}
        />
      ) : (
        <AppButton
          title="Invite"
          onPress={onInvitePress}
          style={[styles.inviteButton]}
          subStyle={{
            color: defaultStyles.colors.dark,
            fontSize: 16,
            letterSpacing: 1,
          }}
        />
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  addButton: {
    borderRadius: 5,
    height: 35,
    marginRight: 5,
    width: 60,
  },
  addButtonSub: {
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
    paddingBottom: 0,
  },
  infoNumberText: {
    color: defaultStyles.colors.secondary,
    fontSize: 14,
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
