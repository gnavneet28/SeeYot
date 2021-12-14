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
    alignSelf: "center",
    backgroundColor: defaultStyles.colors.light,
    borderRadius: "10@s",
    height: "75@s",
    justifyContent: "center",
    marginRight: "8@s",
    paddingLeft: "2@s",
    paddingRight: "2@s",
    paddingTop: "5@s",
    width: "70@s",
  },
  image: {
    alignItems: "center",
    borderColor: defaultStyles.colors.light,
    borderRadius: "20@s",
    borderWidth: 2,
    height: "40@s",
    justifyContent: "center",
    width: "40@s",
  },
  name: {
    color: defaultStyles.colors.dark,
    fontSize: "12@s",
  },
  subImage: {
    borderRadius: "19@s",
    height: "38@s",
    width: "38@s",
  },
});

export default memo(VipThoughtCard);
