import React, {
  memo,
  useCallback,
  useState,
  useEffect,
  useContext,
} from "react";
import { View, Text, TouchableHighlight } from "react-native";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { ScaledSheet } from "react-native-size-matters";

import AppImage from "./AppImage";
import AppText from "./AppText";
import InfoAlert from "../components/InfoAlert";
import DeleteAction from "./DeleteAction";

import useAuth from "../auth/useAuth";
import myApi from "../api/my";
import usersApi from "../api/users";

import debounce from "../utilities/debounce";
import storeDetails from "../utilities/storeDetails";
import apiActivity from "../utilities/apiActivity";
import ApiContext from "../utilities/apiContext";

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
  tapToSendMessage,
}) {
  dayjs.extend(relativeTime);
  let customImage;

  const { user, setUser } = useAuth();
  const { apiProcessing, setApiProcessing } = useContext(ApiContext);
  const { tackleProblem } = apiActivity;

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
    customImage = require("../assets/logo.png");
  else if (notification.type && notification.type == "Vip")
    customImage = require("../assets/logo.png");
  else if (notification.type && notification.type == "Official")
    customImage = require("../assets/logo.png");

  // INFO ALERT ACTIONS
  const handleCloseInfoAlert = useCallback(async () => {
    setInfoAlert({ showInfoAlert: false });
  }, []);

  const handleDeletePress = useCallback(
    debounce(
      async () => {
        setApiProcessing(true);
        setProcessing(true);

        const { ok, data, problem } = await myApi.deleteNotification(
          notification._id
        );

        if (ok) {
          const res = await usersApi.getCurrentUser();
          if (res.ok && res.data) {
            if (res.data.__v > data.user.__v) {
              await storeDetails(res.data);
              setUser(res.data);
              setProcessing(false);
              return setApiProcessing(false);
            }
          }
          setProcessing(false);
          await storeDetails(data.user);
          setUser(data.user);
          return setApiProcessing(false);
        }

        setProcessing(false);
        setApiProcessing(false);
        tackleProblem(problem, data, setInfoAlert);
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

    if (notification.type == "ActiveChat") {
      return tapToSendMessage;
    }

    return null;
  };

  const opacity = () => {
    if (notification.type == "Vip") return 0.9;

    if (notification.type == "Replied") {
      return 0.9;
    }

    if (notification.type == "ActiveChat") {
      return 0.9;
    }

    return 0.7;
  };

  return (
    <View style={styles.container}>
      <AppImage
        activeOpacity={1}
        style={styles.image}
        subStyle={styles.imageSub}
        imageUrl={
          (notification.type && notification.type == "Matched") ||
          (notification.type && notification.type == "Replied") ||
          (notification.type && notification.type == "ActiveChat")
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
            style={[styles.notificationMessage, { opacity: opacity() }]}
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
      <DeleteAction
        apiAction={true}
        processing={processing}
        onPress={apiProcessing ? () => null : handleDeletePress}
      />
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
  emptyNotificationInfo: {
    fontSize: "15@s",
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
    borderRadius: "17.5@s",
    borderWidth: 1,
    borderColor: defaultStyles.colors.light,
    height: "35@s",
    marginLeft: "10@s",
    marginRight: "2@s",
    width: "35@s",
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
  },
  text: {
    ...defaultStyles.text,
  },
});

export default memo(NotificationCard);
