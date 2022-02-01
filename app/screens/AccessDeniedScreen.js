import React from "react";
import { View, Image } from "react-native";
import { ScaledSheet } from "react-native-size-matters";

import Screen from "../components/Screen";
import AppText from "../components/AppText";

import defaultStyles from "../config/styles";

function AccessDeniedScreen(props) {
  return (
    <Screen style={styles.container}>
      <Image
        style={styles.image}
        resizeMode="contain"
        source={{
          uri: "https://seeyot-photos.s3.ap-south-1.amazonaws.com/accessDenied.png",
        }}
      />
      <View style={styles.errorContainer}>
        <AppText style={styles.errorCode}>403</AppText>
        <AppText style={styles.errorMessage}>Access Denied</AppText>
      </View>
    </Screen>
  );
}
const styles = ScaledSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  errorCode: {
    color: defaultStyles.colors.white,
    fontSize: "30@s",
  },
  errorMessage: {
    color: defaultStyles.colors.white,
    fontSize: "22@s",
  },
  errorContainer: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.danger,
    flex: 0.2,
    justifyContent: "center",
    width: "100%",
  },
  image: {
    flex: 0.8,
    width: "100%",
  },
});

export default AccessDeniedScreen;
