import React, { memo } from "react";
import { View, StyleSheet, Text } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import AppImage from "./AppImage";

import defaultStyles from "../config/styles";

const height = defaultStyles.height;

let defaultNotification = {
  type: "",
  message: "",
  createdAt: Date.now(),
};

function NotificationCard({
  onDeleteIconPress,
  onTapToSeePress,
  notification = defaultNotification,
}) {
  dayjs.extend(relativeTime);
  let customImage;

  if (notification.type && notification.type == "Unmatched")
    customImage = require("../assets/thoughts.png");
  else if (notification.type && notification.type == "Vip")
    customImage = require("../assets/vip.png");
  else if (notification.type && notification.type == "Official")
    customImage = require("../assets/app-logo.png");

  return (
    <View style={styles.container}>
      <AppImage
        style={styles.image}
        subStyle={styles.imageSub}
        imageUrl={
          notification.type && notification.type == "Matched"
            ? notification.createdBy.picture
            : ""
        }
        customImage={customImage ? customImage : require("../assets/user.png")}
      />
      <View style={styles.notificationInfo}>
        <Text
          numberOfLines={2}
          onPress={notification.type == "Vip" ? onTapToSeePress : null}
          style={styles.notificationMessage}
        >
          {notification.type != "Vip"
            ? notification.message
            : "Someone is thinking of you! Tap to see the message."}
        </Text>
        <Text style={styles.date}>
          {dayjs(notification.createdAt).fromNow()}
        </Text>
      </View>
      <MaterialCommunityIcons
        style={styles.deleteIcon}
        name="delete-circle-outline"
        size={25}
        onPress={onDeleteIconPress}
        color={defaultStyles.colors.danger}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.white,
    flexDirection: "row",
    height: 70,
    width: "100%",
  },
  date: {
    ...defaultStyles.text,
    color: defaultStyles.colors.placeholder,
    fontFamily: "Comic-Bold",
    fontSize: height * 0.014,
    opacity: 0.8,
  },
  deleteIcon: {
    marginHorizontal: 15,
  },
  image: {
    backgroundColor: defaultStyles.colors.white,
    borderRadius: 20,
    height: 40,
    marginLeft: 15,
    marginRight: 10,
    width: 40,
  },
  imageSub: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  notificationInfo: {
    justifyContent: "center",
    padding: 5,
    width: "80%",
    flexShrink: 1,
  },
  notificationMessage: {
    ...defaultStyles.text,
    fontFamily: "Comic-Bold",
    fontSize: 16,
    opacity: 0.8,
  },
  text: {
    ...defaultStyles.text,
  },
});

export default memo(NotificationCard);
