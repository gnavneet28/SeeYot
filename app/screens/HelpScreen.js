import React, { useCallback } from "react";
import { View, StyleSheet, Linking } from "react-native";

import AppHeader from "../components/AppHeader";
import Heading from "../components/Heading";
import Screen from "../components/Screen";
import UserDetailsCard from "../components/UserDetailsCard";

import debounce from "../utilities/debounce";

function HelpScreen({ navigation }) {
  // HEADER ACTION
  const handleBackPress = useCallback(
    debounce(
      () => {
        navigation.goBack();
      },
      500,
      true
    ),
    []
  );

  const openPrivacyPage = () => {
    Linking.openURL("https://seeyot-frontend.herokuapp.com/privacy_policy");
  };

  const openTermsPage = () => {
    Linking.openURL("https://seeyot-frontend.herokuapp.com/terms_of_service");
  };

  const openHowItWorksPage = () => {
    Linking.openURL("https://seeyot-frontend.herokuapp.com/how_it_works");
  };

  return (
    <Screen style={styles.container}>
      <AppHeader
        title="Help"
        leftIcon="arrow-back"
        onPressLeft={handleBackPress}
      />
      <View style={styles.contactUs}>
        <Heading iconName="contact-mail" title="Contact Us" />
        <UserDetailsCard
          data="SeeYot@gmail.com"
          editable={false}
          iconName="email"
          size={20}
          style={{ marginBottom: 10 }}
          title="Email"
        />
        <UserDetailsCard
          data="+91 9944603844"
          editable={false}
          iconName="phone"
          size={20}
          title="Contact Number"
        />
      </View>
      <Heading
        iconName="article"
        onPress={openPrivacyPage}
        title="Privacy Policy"
        style={{ marginTop: 10, marginBottom: 0 }}
      />
      <Heading
        iconName="article"
        onPress={openTermsPage}
        style={{ marginVertical: 0 }}
        title="Terms of Service"
      />
      <Heading
        iconName="article"
        onPress={openHowItWorksPage}
        style={{ marginTop: 0 }}
        title="How it Works"
      />
    </Screen>
  );
}
const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  contactUs: {
    justifyContent: "center",
    width: "100%",
    marginBottom: 20,
  },
});

export default HelpScreen;
