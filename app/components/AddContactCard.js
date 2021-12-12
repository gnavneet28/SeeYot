import React, { useState, useCallback, useContext } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import LottieView from "lottie-react-native";
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

function AddContactCard({ contact, onInvitePress, style }) {
  const { apiProcessing, setApiProcessing } = useContext(ApiContext);
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
        setApiProcessing(true);
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
          setApiProcessing(false);
          return setProcessing(false);
        }
        setProcessing(false);
        setApiProcessing(false);

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
              disabled={inContacts || apiProcessing ? true : false}
              style={styles.addButton}
              subStyle={[
                styles.addButtonSub,
                {
                  color: inContacts
                    ? defaultStyles.colors.tomato
                    : defaultStyles.colors.blue,
                },
              ]}
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
            fontSize: scale(14),
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
const styles = ScaledSheet.create({
  buttonContainer: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "10@s",
    height: "32@s",
    marginRight: "4@s",
    width: "60@s",
    borderWidth: 1,
    borderColor: defaultStyles.colors.lightGrey,
    overflow: "hidden",
  },
  addButton: {
    backgroundColor: defaultStyles.colors.light,
    borderRadius: "10@s",
    height: "32@s",
    width: "60@s",
  },
  addButtonSub: {
    fontSize: "14@s",
    letterSpacing: 0.2,
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
  infoNumberText: {
    color: defaultStyles.colors.secondary,
    fontSize: "10@s",
    opacity: 0.7,
    paddingTop: 0,
  },
  inviteButton: {
    backgroundColor: defaultStyles.colors.light,
    borderWidth: "1@s",
    borderColor: defaultStyles.colors.lightGrey,
    borderRadius: "10@s",
    height: "32@s",
    marginRight: "5@s",
    width: "60@s",
  },
});

export default AddContactCard;
