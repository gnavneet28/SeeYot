import React from "react";
import { View } from "react-native";
import { ScaledSheet, scale } from "react-native-size-matters";

import AppImage from "./AppImage";
import AppText from "./AppText";

import defaultStyles from "../config/styles";

function SubscriptionDetailsCard({ uri, title, value }) {
  return (
    <View style={styles.container}>
      <AppImage
        imageUrl={uri}
        style={styles.image}
        subStyle={styles.imageSub}
      />
      <AppText style={styles.title}>{title}</AppText>
      <AppText style={styles.value}>{value}</AppText>
    </View>
  );
}
const styles = ScaledSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.light,
    borderRadius: "10@s",
    justifyContent: "center",
    paddingVertical: "15@s",
    width: "35%",
  },
  image: {
    borderRadius: "5@s",
    height: "40@s",
    marginBottom: "5@s",
    width: "40@s",
  },
  imageSub: {
    borderRadius: "5@s",
    height: "40@s",
    width: "40@s",
  },
  title: {
    fontSize: "10@s",
    textAlign: "center",
    textAlignVertical: "center",
  },
  value: {
    color: defaultStyles.colors.blue,
    fontSize: "13@s",
    textAlign: "center",
    textAlignVertical: "center",
  },
});

export default SubscriptionDetailsCard;
