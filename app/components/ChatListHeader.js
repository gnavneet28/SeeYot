import React, { memo } from "react";
import { View } from "react-native";
import { ScaledSheet, scale } from "react-native-size-matters";

import defaultStyles from "../config/styles";

import AppImage from "./AppImage";
import AppText from "./AppText";

function ChatListHeader({ user, activeChat }) {
  return (
    <View style={styles.container}>
      <AppImage
        activeOpacity={1}
        imageUrl={user.picture}
        style={styles.image}
        subStyle={styles.subImage}
      />
      <AppText style={styles.name}>{user.name}</AppText>
      {activeChat ? (
        <AppText style={styles.infoText}>
          Send direct messages to {user.savedName ? user.savedName : user.name}{" "}
          and have an active conversation. These are temporary messages and are
          not stored anywhere, except your device until you refresh this chat,
          visit another chat, leave this screen or the app becomes inactive.
        </AppText>
      ) : (
        <AppText style={styles.infoText}>
          Send your thoughts to {user.savedName ? user.savedName : user.name}{" "}
          and within 10 minutes if {user.savedName ? user.savedName : user.name}{" "}
          does the same for you, your thoughts will match. You can see all your
          matched thoughts here.
        </AppText>
      )}
    </View>
  );
}
const styles = ScaledSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.15)",
    paddingVertical: "10@s",
    width: "100%",
  },
  image: {
    backgroundColor: defaultStyles.colors.white,
    borderColor: defaultStyles.colors.light,
    borderRadius: "40@s",
    borderWidth: 2,
    height: "80@s",
    width: "80@s",
  },
  subImage: {
    borderRadius: "39@s",
    height: "78@s",
    width: "78@s",
  },
  infoText: {
    color: defaultStyles.colors.white,
    fontSize: "13@s",
    marginBottom: "5@s",
    textAlign: "center",
    width: "90%",
  },
  name: {
    backgroundColor: defaultStyles.colors.yellow_Variant,
    borderRadius: "20@s",
    color: defaultStyles.colors.secondary,
    fontSize: "13.5@s",
    marginTop: "10@s",
    paddingHorizontal: "10@s",
    paddingVertical: "2@s",
    textAlign: "center",
  },
});

export default memo(ChatListHeader);
