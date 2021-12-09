import React, { useCallback } from "react";
import { View, Linking } from "react-native";
import { ScaledSheet, scale } from "react-native-size-matters";

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
    Linking.openURL("http://www.seeyot.com/privacy_policy");
  };

  const openTermsPage = () => {
    Linking.openURL("http://www.seeyot.com/terms_of_service");
  };

  const openHowItWorksPage = () => {
    Linking.openURL("http://www.seeyot.com/how_it_works");
  };

  return (
    <Screen style={styles.container}>
      <AppHeader
        leftIcon="arrow-back"
        onPressLeft={handleBackPress}
        title="Help"
      />
      <View style={styles.contactUs}>
        <Heading
          iconName="contact-mail"
          title="Contact Us"
          style={{ marginTop: scale(5), marginBottom: 0 }}
        />
        <UserDetailsCard
          data="help@seeyot.com"
          editable={false}
          iconName="email"
          size={scale(20)}
          title="Email"
        />
        <UserDetailsCard
          data="+91 9944603844"
          editable={false}
          iconName="phone"
          size={scale(20)}
          title="Contact Number"
        />
      </View>
      <Heading
        iconName="article"
        onPress={openPrivacyPage}
        style={{ marginTop: scale(5), marginBottom: 0 }}
        title="Privacy Policy"
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
const styles = ScaledSheet.create({
  container: {
    alignItems: "center",
  },
  contactUs: {
    justifyContent: "center",
    marginBottom: "15@s",
    width: "100%",
  },
});

export default HelpScreen;
