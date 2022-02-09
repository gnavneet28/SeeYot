import React, {
  memo,
  useCallback,
  useState,
  useEffect,
  useContext,
  useMemo,
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

import debounce from "../utilities/debounce";
import storeDetails from "../utilities/storeDetails";
import apiActivity from "../utilities/apiActivity";
import ApiContext from "../utilities/apiContext";

import useConnection from "../hooks/useConnection";

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
  tapToSeeMatchedThought,
  onLongPress,
  index,
  isConnected,
}) {
  dayjs.extend(relativeTime);
  let currentDate = new Date();
  // let customImage;

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

  // INFO ALERT ACTIONS
  const handleCloseInfoAlert = useCallback(async () => {
    setInfoAlert({ showInfoAlert: false });
  }, []);

  const imageUrl = useMemo(() => {
    return notification.type == "Matched" ||
      notification.type == "Replied" ||
      notification.type == "ActiveChat"
      ? notification.createdBy.picture
        ? notification.createdBy.picture
        : "user"
      : "";
  }, [notification.type, notification]);

  const handleDeletePress = useCallback(
    debounce(
      async () => {
        setApiProcessing(true);
        setProcessing(true);

        const { ok, data, problem } = await myApi.deleteNotification(
          notification._id
        );

        if (ok) {
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
    if (notification.type == "Vip") return () => onTapToSeePress(notification);

    if (notification.type == "Replied") {
      return () => tapToSeeMessage(notification);
    }

    if (notification.type == "ActiveChat") {
      return () => tapToSendMessage(notification);
    }

    if (notification.type == "Matched") {
      return () => tapToSeeMatchedThought(notification);
    }

    return () => null;
  };

  const opacity = () => {
    if (
      notification.type == "Vip" ||
      notification.type == "Replied" ||
      notification.type == "ActiveChat" ||
      notification.type == "Matched"
    )
      return 0.9;
    return 0.7;
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor:
            index % 2 === 0
              ? defaultStyles.colors.light
              : defaultStyles.colors.white,
        },
      ]}
    >
      <AppImage
        activeOpacity={1}
        style={styles.image}
        subStyle={styles.imageSub}
        imageUrl={imageUrl}
        customImage={{ uri: "logo" }}
      />
      <TouchableHighlight
        onLongPress={onLongPress}
        underlayColor={
          index % 2 == 0
            ? defaultStyles.colors.light
            : defaultStyles.colors.white
        }
        onPress={doWhenTappedWithType()}
        style={styles.notificationInfo}
      >
        <>
          <Text
            numberOfLines={2}
            onPress={doWhenTappedWithType()}
            style={[styles.notificationMessage, { opacity: opacity() }]}
          >
            {notification.message}
          </Text>
          <Text style={styles.date}>
            {dayjs(notification.createdAt).fromNow()}
          </Text>
        </>
      </TouchableHighlight>
      {dayjs(currentDate).diff(notification.createdAt, "minutes") <
      10 ? null : (
        <DeleteAction
          style={{
            backgroundColor:
              index % 2 !== 0
                ? defaultStyles.colors.light
                : defaultStyles.colors.white,
          }}
          apiAction={true}
          processing={processing}
          onPress={
            apiProcessing || !isConnected ? () => null : handleDeletePress
          }
        />
      )}
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
    fontFamily: "ComicNeue-Bold",
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
    elevation: 1,
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
    fontFamily: "ComicNeue-Bold",
    fontSize: "14@s",
  },
  text: {
    ...defaultStyles.text,
  },
});

export default memo(NotificationCard);
