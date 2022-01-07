import React from "react";
import { View, Image, useWindowDimensions } from "react-native";
import { ScaledSheet } from "react-native-size-matters";

import AppText from "../components/AppText";

import defaultStyles from "../config/styles";

function OnboardingItem({ item }) {
  const { width } = useWindowDimensions();
  return (
    <View style={[styles.container, { width }]}>
      <Image
        source={item.imageUri}
        style={[styles.image, { width, resizeMode: "contain" }]}
      />
      <View style={{ flex: 0.4 }}>
        <AppText style={styles.title}>{item.title}</AppText>
        {/* <AppText style={styles.description}>{item.description}</AppText> */}
        <AppText style={styles.subDescription}>{item.subDescription}</AppText>
      </View>
    </View>
  );
}
const styles = ScaledSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  image: {
    flex: 0.6,
    justifyContent: "center",
  },
  title: {
    fontFamily: "Comic-Bold",
    fontSize: "20@s",
    marginBottom: "5@s",
    textAlign: "center",
  },
  description: {
    color: defaultStyles.colors.secondary,
    fontSize: "17@s",
    paddingHorizontal: "20@s",
    textAlign: "center",
  },
  subDescription: {
    color: defaultStyles.colors.dark_Variant,
    fontSize: "14@s",
    paddingHorizontal: "20@s",
    textAlign: "center",
  },
});

export default OnboardingItem;
