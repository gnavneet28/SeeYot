import React, { memo } from "react";
import { View } from "react-native";
import { ScaledSheet } from "react-native-size-matters";

import AppImage from "./AppImage";
import AppText from "./AppText";

import defaultStyles from "../config/styles";

const defaultUser = {
  _id: "",
  name: "",
  picture: "",
};

function VipThoughtCard({ user = defaultUser, style, onPress }) {
  return (
    <View style={[styles.container, style]}>
      <AppImage
        style={styles.image}
        subStyle={styles.subImage}
        imageUrl={user.picture}
        onPress={() => onPress(user)}
      />
      <AppText style={styles.name} numberOfLines={1}>
        {user.name}
      </AppText>
    </View>
  );
}
const styles = ScaledSheet.create({
  container: {
    alignItems: "center",
    height: "75@s",
    justifyContent: "center",
    width: "70@s",
  },
  image: {
    alignItems: "center",
    borderColor: defaultStyles.colors.light,
    borderRadius: "22@s",
    borderWidth: 2,
    height: "44@s",
    justifyContent: "center",
    width: "44@s",
  },
  name: {
    color: defaultStyles.colors.secondary,
    fontSize: "12@s",
  },
  subImage: {
    borderRadius: "22@s",
    height: "44@s",
    width: "44@s",
  },
});

export default memo(VipThoughtCard);
