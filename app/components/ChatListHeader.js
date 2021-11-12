import React, { memo } from "react";
import { View, StyleSheet } from "react-native";

import defaultStyles from "../config/styles";

import AppImage from "./AppImage";
import AppText from "./AppText";

function ChatListHeader({ user }) {
  return (
    <View style={styles.container}>
      <AppImage
        activeOpacity={1}
        imageUrl={user.picture}
        style={styles.image}
        subStyle={styles.subImage}
      />
      <AppText style={styles.name}>{user.name}</AppText>
      {user.myNickName ? (
        <AppText style={styles.myNickName}>
          {"Calls you by name" + " - " + user.myNickName}
        </AppText>
      ) : null}
      <AppText style={styles.infoText}>
        Send your thoughts to {user.name} and within 10 minutes if {user.name}{" "}
        does the same for you, your thoughts will match. You can see all your
        matched thoughts here.
      </AppText>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingVertical: 10,
    width: "100%",
  },
  image: {
    backgroundColor: defaultStyles.colors.white,
    borderColor: defaultStyles.colors.light,
    borderRadius: 50,
    borderWidth: 2,
    height: 100,
    width: 100,
  },
  subImage: {
    borderRadius: 49,
    height: 98,
    width: 98,
  },
  infoText: {
    color: defaultStyles.colors.white,
    marginVertical: 5,
    textAlign: "center",
    width: "80%",
    fontSize: 15,
  },
  myNickName: {
    backgroundColor: defaultStyles.colors.yellow_Variant,
    borderRadius: 20,
    color: defaultStyles.colors.dark,
    fontSize: 16,
    paddingHorizontal: 10,
    textAlign: "center",
  },
  name: {
    backgroundColor: defaultStyles.colors.blue,
    borderRadius: 20,
    color: defaultStyles.colors.white,
    fontSize: 16,
    marginVertical: 10,
    paddingHorizontal: 10,
    textAlign: "center",
  },
});

export default memo(ChatListHeader);
