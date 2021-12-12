import React, { useCallback } from "react";
import { View } from "react-native";
import { ScaledSheet, scale } from "react-native-size-matters";

import Screen from "../components/Screen";
import AppHeader from "../components/AppHeader";
import AppText from "../components/AppText";
import AppButton from "../components/AppButton";

import defaultStyles from "../config/styles";

import debounce from "../utilities/debounce";

function SettingsScreen({ navigation }) {
  // HEADER ACTIONS
  const handleBack = useCallback(
    debounce(
      () => {
        navigation.goBack();
      },
      500,
      true
    ),
    []
  );

  const handleDeleteContacts = () => console.log("Contacts deleted!");

  return (
    <Screen style={styles.container}>
      <AppHeader
        leftIcon="arrow-back"
        onPressLeft={handleBack}
        title="Settings"
      />
      <View style={styles.deleteContactsContainer}>
        <AppText style={styles.deleteContactsTitle}>
          Remove my Contacts from the server.
        </AppText>
        <AppText style={styles.deleteContactsInfo}>
          We store your contacts available on your device to let you discover
          people who are on SeeYot, if you give access to your contacts. You can
          opt to remove your contacts from our server anytime you want.
        </AppText>
        <AppButton
          title="Remove my Contacts"
          onPress={handleDeleteContacts}
          style={styles.deleteContactsButton}
        />
      </View>
      <View style={styles.deleteContactsContainer}>
        <AppText style={styles.deleteContactsTitle}>Delete my Account.</AppText>
        <AppText style={styles.deleteContactsInfo}>
          If you want to delete your account, you can do it here. This action in
          irreversible and cannot be undone.
        </AppText>
        <AppButton
          title="Delete my Account"
          onPress={handleDeleteContacts}
          style={styles.deleteContactsButton}
        />
      </View>
    </Screen>
  );
}
const styles = ScaledSheet.create({
  container: {
    alignItems: "center",
  },
  deleteContactsContainer: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.light,
    borderRadius: "5@s",
    elevation: 4,
    justifyContent: "center",
    marginTop: "10@s",
    padding: "5@s",
    width: "95%",
  },
  deleteContactsTitle: {
    alignSelf: "flex-start",
    color: defaultStyles.colors.blue,
    fontSize: "15@s",
    marginBottom: "5@s",
  },
  deleteContactsInfo: {
    fontSize: "14@s",
    marginBottom: "10@s",
    width: "90%",
  },
  deleteContactsButton: {
    backgroundColor: defaultStyles.colors.tomato,
    height: "35@s",
    marginVertical: "5@s",
    width: "90%",
  },
});

export default SettingsScreen;
