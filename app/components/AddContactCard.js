import React, { useState, useCallback } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import LottieView from "lottie-react-native";

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

function AddContactCard({ contact, onInvitePress, style }) {
  const { user, setUser } = useAuth();
  const [processing, setProcessing] = useState(false);
  const [infoAlert, setInfoAlert] = useState({
    infoAlertMessage: "",
    showInfoAlert: false,
  });

  const contacts = user.contacts;

  const inContacts =
    contacts &&
    contacts.length > 0 &&
    contacts.filter((c) => c.phoneNumber == contact.phoneNumber)[0];

  // INFO ALERT ACTIONS
  const handleCloseInfoAlert = useCallback(async () => {
    setInfoAlert({ showInfoAlert: false });
  }, []);

  // ADD CONTACTS ACTION
  const handleAddPress = useCallback(
    debounce(
      async () => {
        setProcessing(true);

        let modifiedUser = { ...user };

        const { ok, data, problem } = await usersApi.addContact(
          contact.phoneNumber,
          contact.name
        );

        if (ok) {
          modifiedUser.contacts = data.contacts;
          setUser(modifiedUser);
          await asyncStorage.store(DataConstants.CONTACTS, data.contacts);
          return setProcessing(false);
        }
        setProcessing(false);

        if (problem) {
          if (data) {
            return setInfoAlert({
              infoAlertMessage: data.message,
              showInfoAlert: true,
            });
          }

          setInfoAlert({
            infoAlertMessage: "Something went wrong! Please try again.",
            showInfoAlert: true,
          });
        }
      },
      1000,
      true
    ),
    [user, contact]
  );

  if (!contact.name)
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
        imageUrl={contact.picture}
        style={styles.image}
        subStyle={styles.imageSub}
      />
      <View style={styles.infoContainer}>
        <AppText numberOfLines={1} style={[styles.infoNameText]}>
          {contact.name}
        </AppText>
        <AppText style={styles.infoNumberText}>{contact.phoneNumber}</AppText>
      </View>

      {contact.isRegistered ? (
        <View style={styles.buttonContainer}>
          {!processing ? (
            <AppButton
              title={inContacts ? "Added" : "Add"}
              disabled={inContacts ? true : false}
              style={[
                styles.addButton,
                {
                  backgroundColor: inContacts
                    ? defaultStyles.colors.tomato
                    : defaultStyles.colors.blue,
                },
              ]}
              subStyle={styles.addButtonSub}
              onPress={handleAddPress}
            />
          ) : (
            <ActivityIndicator size={18} color={defaultStyles.colors.tomato} />
          )}
        </View>
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
    letterSpacing: 0.2,
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
    marginVertical: 3,
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
    marginHorizontal: 5,
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
    opacity: 0.8,
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
    borderRadius: 10,
    height: 35,
    marginRight: 5,
    width: 65,
  },
});

export default AddContactCard;
