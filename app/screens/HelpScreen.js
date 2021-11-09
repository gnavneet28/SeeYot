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
    Linking.openURL("https://www.google.com/");
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
        title="Terms and Privacy Policy"
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
