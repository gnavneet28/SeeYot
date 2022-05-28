import React, { useCallback } from "react";
import { View, Linking } from "react-native";
import { ScaledSheet, scale } from "react-native-size-matters";

import AppHeader from "../components/AppHeader";
import Heading from "../components/Heading";
import Screen from "../components/Screen";
import UserDetailsCard from "../components/UserDetailsCard";

import debounce from "../utilities/debounce";
import defaultStyles from "../config/styles";
import ScreenSub from "../components/ScreenSub";

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
    Linking.openURL("https://seeyot.com/privacy_policy");
  };

  const openTermsPage = () => {
    Linking.openURL("https://seeyot.com/terms_of_service");
  };

  const openHowItWorksPage = () => {
    Linking.openURL("https://seeyot.com/how_it_works");
  };

  const handleOpenMail = () => {
    Linking.openURL(
      `mailto:help@seeyot.com?subject=Help&body=write your concern here...`
    );
  };

  return (
    <Screen style={styles.container}>
      <AppHeader
        leftIcon="arrow-back"
        onPressLeft={handleBackPress}
        title="Help"
      />
      <ScreenSub>
        <View style={styles.contactUs}>
          <Heading
            iconName="contact-mail"
            title="Contact Us"
            style={{ marginTop: scale(5), marginBottom: 0 }}
          />
          <UserDetailsCard
            data="help@seeyot.com"
            dataStyle={{ color: defaultStyles.colors.blue }}
            editable={false}
            iconName="email"
            onDataPress={handleOpenMail}
            size={scale(20)}
            title="Email"
            iconCategory={"MaterialCommunityIcons"}
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
      </ScreenSub>
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
    width: "90%",
  },
});

export default HelpScreen;
