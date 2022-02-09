import React, { memo } from "react";
import { View } from "react-native";
import { ScaledSheet } from "react-native-size-matters";

import defaultStyles from "../config/styles";

import AppImage from "./AppImage";
import AppText from "./AppText";

function ChatListHeader({ user, activeChat }) {
  return (
    <View style={styles.container}>
      <View style={styles.recipientDetailsContainerMain}>
        <AppImage
          activeOpacity={1}
          imageUrl={user.picture}
          style={styles.image}
          subStyle={styles.subImage}
        />
        <View style={styles.recipientDetailsContainerSub}>
          <AppText style={styles.name}>{user.name}</AppText>
          {activeChat ? (
            <AppText style={styles.infoText}>
              Send direct messages to{" "}
              {user.savedName ? user.savedName : user.name} and have an active
              conversation. These are temporary messages and are not stored
              anywhere, except your device until you refresh this chat, visit
              another one, leave this screen or the app becomes inactive.
            </AppText>
          ) : (
            <AppText style={styles.infoText}>
              Send your thoughts to{" "}
              {user.savedName ? user.savedName : user.name}, and within 10
              minutes if {user.savedName ? user.savedName : user.name} does the
              same for you, your thoughts will match. You can see all your
              matched thoughts here. You can send only one Thought within 10
              minutes to a single person.
            </AppText>
          )}
        </View>
      </View>
    </View>
  );
}
const styles = ScaledSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.light,
    borderBottomColor: defaultStyles.colors.lightGrey,
    borderBottomWidth: 1,
    width: "100%",
  },
  image: {
    backgroundColor: defaultStyles.colors.white,
    borderColor: defaultStyles.colors.white,
    borderRadius: "35@s",
    borderWidth: 2,
    height: "70@s",
    marginLeft: "10@s",
    width: "70@s",
  },
  subImage: {
    borderRadius: "34@s",
    height: "68@s",
    width: "68@s",
  },
  infoText: {
    color: defaultStyles.colors.primary,
    fontSize: "12.5@s",
    marginBottom: "5@s",
    textAlign: "left",
    width: "100%",
  },
  name: {
    alignSelf: "flex-start",
    backgroundColor: defaultStyles.colors.yellow_Variant,
    borderRadius: "20@s",
    color: defaultStyles.colors.secondary,
    fontSize: "13.5@s",
    paddingHorizontal: "10@s",
    textAlign: "center",
  },
  recipientDetailsContainerMain: {
    alignItems: "center",
    flexDirection: "row",
    padding: "6@s",
    width: "100%",
  },
  recipientDetailsContainerSub: {
    alignItems: "center",
    flexShrink: 1,
    justifyContent: "center",
    marginLeft: "10@s",
    width: "100%",
  },
});

export default memo(ChatListHeader);
