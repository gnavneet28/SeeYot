import React from "react";
import { View, TouchableHighlight } from "react-native";
import { ScaledSheet } from "react-native-size-matters";

import AppText from "./AppText";
import AppImage from "./AppImage";
import defaultStyles from "../config/styles";

const SearchUserCard = ({
  user = { _id: "", name: "", picture: "" },
  selected,
  onPress,
}) => {
  return (
    <TouchableHighlight
      onPress={() => onPress(user)}
      activeOpacity={0.8}
      underlayColor={defaultStyles.colors.light}
      style={[
        styles.container,
        {
          backgroundColor:
            selected == user._id
              ? defaultStyles.colors.dark_Variant
              : defaultStyles.colors.white,
        },
      ]}
    >
      <>
        <AppImage
          style={styles.image}
          subStyle={styles.image}
          imageUrl={user.picture}
        />
        <AppText
          style={[
            styles.username,
            {
              color:
                selected == user._id
                  ? defaultStyles.colors.white
                  : defaultStyles.colors.dark,
            },
          ]}
        >
          {user.name}
        </AppText>
      </>
    </TouchableHighlight>
  );
};

const styles = ScaledSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    paddingVertical: "5@s",
    paddingHorizontal: "15@s",
    alignItems: "center",
  },
  username: {},
  image: {
    width: "30@s",
    height: "30@s",
    borderRadius: "15@s",
  },
});

export default SearchUserCard;
