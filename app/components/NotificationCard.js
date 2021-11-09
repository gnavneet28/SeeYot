import React, { memo, useCallback, useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  TouchableHighlight,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import AppImage from "./AppImage";
import AppText from "./AppText";
import InfoAlert from "../components/InfoAlert";

import useAuth from "../auth/useAuth";
import myApi from "../api/my";

import asyncStorage from "../utilities/cache";
import DataConstants from "../utilities/DataConstants";

import debounce from "../utilities/debounce";

import defaultStyles from "../config/styles";

const height = defaultStyles.height;

let defaultNotification = {
  type: "",
  message: "",
  createdAt: Date.now(),
};

function NotificationCard({
  onTapToSeePress,
  notification = defaultNotification,
  tapToSeeMessage,
}) {
  dayjs.extend(relativeTime);
  let customImage;

  const { user, setUser } = useAuth();
  const [processing, setProcessing] = useState(false);
  const [infoAlert, setInfoAlert] = useState({
    infoAlertMessage: "",
    showInfoAlert: false,
  });

  useEffect(() => {
    setProcessing(false);

    return () => setProcessing(false);
  }, [notification._id]);

  if (notification.type && notification.type == "Unmatched")
    customImage = require("../assets/thoughts.png");
  else if (notification.type && notification.type == "Vip")
    customImage = require("../assets/vip.png");
  else if (notification.type && notification.type == "Official")
    customImage = require("../assets/app-logo.png");

  // INFO ALERT ACTIONS
  const handleCloseInfoAlert = useCallback(async () => {
    setInfoAlert({ showInfoAlert: false });
  }, []);

  const handleDeletePress = useCallback(
    debounce(
      async () => {
        setProcessing(true);
        let modifiedUser = { ...user };

        const { ok, data, problem } = await myApi.deleteNotification(
          notification._id
        );

        if (ok) {
          modifiedUser.notifications = data.notifications;
          setUser(modifiedUser);
          await asyncStorage.store(
            DataConstants.NOTIFICATIONS,
            data.notifications
          );
          return;
        }

        setProcessing(false);

        if (problem) {
          if (data) {
            return setInfoAlert({
              infoAlertMessage: data.message,
              showInfoAlert: true,
            });
          }

          return setInfoAlert({
            infoAlertMessage: "Something went wrong! Please try again.",
            showInfoAlert: true,
          });
        }
      },
      1000,
      true
    ),
    [notification, user]
  );

  if (!notification.createdAt)
    return (
      <View style={styles.emptyNotificationContainer}>
        <AppText style={styles.emptyNotificationInfo}>
          No notifications available.
        </AppText>
      </View>
    );

  const doWhenTappedWithType = () => {
    if (notification.type == "Vip") return onTapToSeePress;

    if (notification.type == "Replied") {
      return tapToSeeMessage;
    }

    return null;
  };

  return (
    <View style={styles.container}>
      <AppImage
        style={styles.image}
        subStyle={styles.imageSub}
        imageUrl={
          (notification.type && notification.type == "Matched") ||
          (notification.type && notification.type == "Replied")
            ? notification.createdBy.picture
            : ""
        }
        customImage={customImage ? customImage : require("../assets/user.png")}
      />
      <TouchableHighlight
        underlayColor={defaultStyles.colors.white}
        onPress={doWhenTappedWithType()}
        style={styles.notificationInfo}
      >
        <>
          <Text
            numberOfLines={2}
            onPress={doWhenTappedWithType()}
            style={styles.notificationMessage}
          >
            {notification.type != "Vip"
              ? notification.message
              : "Someone is thinking of you! Tap to see the message."}
          </Text>
          <Text style={styles.date}>
            {dayjs(notification.createdAt).fromNow()}
          </Text>
        </>
      </TouchableHighlight>
      <View style={styles.deleteContainer}>
        {!processing ? (
          <MaterialCommunityIcons
            name="delete-circle-outline"
            size={20}
            onPress={handleDeletePress}
            color={defaultStyles.colors.danger}
          />
        ) : (
          <ActivityIndicator size={18} color={defaultStyles.colors.tomato} />
        )}
      </View>
      <InfoAlert
        leftPress={handleCloseInfoAlert}
        description={infoAlert.infoAlertMessage}
        visible={infoAlert.showInfoAlert}
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
  deleteContainer: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.light,
    borderColor: defaultStyles.colors.light,
    borderRadius: 10,
    borderWidth: 1,
    height: 30,
    justifyContent: "center",
    marginHorizontal: 15,
    width: 30,
  },
  emptyNotificationInfo: {
    fontSize: 18,
    textAlign: "center",
  },
  emptyNotificationContainer: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.white,
    height: 70,
    justifyContent: "center",
    width: "100%",
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
    borderRadius: 10,
    flexShrink: 1,
    justifyContent: "center",
    padding: 5,
    width: "80%",
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
