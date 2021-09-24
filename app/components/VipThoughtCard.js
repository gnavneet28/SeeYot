import React, { memo } from "react";
import { View, StyleSheet } from "react-native";

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
        subStyle={styles.image}
        imageUrl={user.picture}
        onPress={() => onPress(user)}
      />
      <AppText style={{ fontSize: 16 }} numberOfLines={1}>
        {user.name}
      </AppText>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    height: 100,
    justifyContent: "center",
    width: 80,
  },
  image: {
    borderColor: defaultStyles.colors.light,
    borderRadius: 25,
    borderWidth: 1,
    height: 50,
    width: 50,
  },
  imageSub: {
    borderRadius: 24.5,
    height: 49,
    width: 49,
  },
});

export default memo(VipThoughtCard);
