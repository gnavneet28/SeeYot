import React, { memo, useCallback, useState, useEffect } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  TouchableHighlight,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { ScaledSheet, scale } from "react-native-size-matters";

import AppImage from "./AppImage";
import AppText from "./AppText";
import InfoAlert from "../components/InfoAlert";

import useAuth from "../auth/useAuth";
import myApi from "../api/my";

import asyncStorage from "../utilities/cache";
import DataConstants from "../utilities/DataConstants";

import debounce from "../utilities/debounce";

import defaultStyles from "../config/styles";

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
        activeOpacity={1}
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
            size={scale(17)}
            onPress={handleDeletePress}
            color={defaultStyles.colors.danger}
          />
        ) : (
          <ActivityIndicator
            size={scale(16)}
            color={defaultStyles.colors.tomato}
          />
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
const styles = ScaledSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.white,
    flexDirection: "row",
    height: "60@s",
    width: "100%",
  },
  date: {
    ...defaultStyles.text,
    color: defaultStyles.colors.placeholder,
    fontFamily: "Comic-Bold",
    fontSize: "10@s",
    opacity: 0.8,
  },
  deleteContainer: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.light,
    borderColor: defaultStyles.colors.light,
    borderRadius: "10@s",
    borderWidth: 1,
    height: "30@s",
    justifyContent: "center",
    marginHorizontal: "15@s",
    width: "30@s",
  },
  emptyNotificationInfo: {
    fontSize: "18@s",
    textAlign: "center",
  },
  emptyNotificationContainer: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.white,
    height: "60@s",
    justifyContent: "center",
    width: "100%",
  },
  image: {
    backgroundColor: defaultStyles.colors.white,
    borderRadius: "18@s",
    elevation: 2,
    height: "36@s",
    marginLeft: "10@s",
    marginRight: "2@s",
    width: "36@s",
  },
  imageSub: {
    borderRadius: "18@s",
    height: "36@s",
    width: "36@s",
  },
  notificationInfo: {
    borderRadius: "10@s",
    flexShrink: 1,
    justifyContent: "center",
    padding: "5@s",
    width: "80%",
  },
  notificationMessage: {
    ...defaultStyles.text,
    fontFamily: "Comic-Bold",
    fontSize: "14@s",
    opacity: 0.8,
  },
  text: {
    ...defaultStyles.text,
  },
});

export default memo(NotificationCard);
