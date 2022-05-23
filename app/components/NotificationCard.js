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
import { scale, ScaledSheet } from "react-native-size-matters";
import IonIcons from "../../node_modules/react-native-vector-icons/Ionicons";

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
import ApiProcessingContainer from "./ApiProcessingContainer";

let defaultNotification = {
  _id: "",
  type: "",
  message: "",
  createdAt: Date.now(),
  data: {
    phoneNumber: parseInt(""),
  },
};

function NotificationCard({
  onTapToSeePress = () => {},
  notification = defaultNotification,
  tapToSeeMessage = () => {},
  tapToSendMessage = () => {},
  tapToSeeMatchedThought = () => {},
  tapToSeeGroupReply = () => {},
  onLongPress = () => {},
  index,
  tapToVisitGroup = () => {},
}) {
  dayjs.extend(relativeTime);
  let currentDate = new Date();

  const { user, setUser } = useAuth();
  const { apiProcessing, setApiProcessing } = useContext(ApiContext);
  const [addingUser, setAddingUser] = useState(false);
  const { tackleProblem } = apiActivity;
  let isUnmounting = false;

  const [infoAlert, setInfoAlert] = useState({
    infoAlertMessage: "",
    showInfoAlert: false,
  });

  let inContacts;
  const contacts = user.contacts;
  let savedName = "";

  if (user.phoneContacts && notification.type == "Add") {
    let inPhoneContacts = user.phoneContacts.filter(
      (c) => c.phoneNumber == notification.data.phoneNumber
    )[0];
    if (inPhoneContacts) {
      savedName = inPhoneContacts.name ? inPhoneContacts.name : "";
    }
  }

  if (notification.type == "Add") {
    inContacts =
      contacts &&
      contacts.length > 0 &&
      contacts.filter((c) => c.phoneNumber == notification.data.phoneNumber)[0];
  }

  useEffect(() => {
    return () => (isUnmounting = true);
  }, []);

  // ADD CONTACTS ACTION
  const handleAddPress = useCallback(
    debounce(
      async () => {
        if (!isUnmounting) {
          setAddingUser(true);
        }
        const { ok, data, problem } = await usersApi.addContact(
          notification.data.phoneNumber,
          savedName
        );

        if (ok) {
          await storeDetails(data.user);
          setUser(data.user);
          if (!isUnmounting) {
            setAddingUser(false);
          }
          return;
        }
        if (!isUnmounting) {
          setAddingUser(false);
          tackleProblem(problem, data, setInfoAlert);
        }
      },
      1000,
      true
    ),
    [user, notification]
  );

  // INFO ALERT ACTIONS
  const handleCloseInfoAlert = useCallback(async () => {
    setInfoAlert({ showInfoAlert: false });
  }, []);

  const imageUrl = useMemo(() => {
    return notification.type == "Matched" ||
      notification.type == "Replied" ||
      notification.type == "ActiveChat" ||
      notification.type == "Add" ||
      (notification.type == "GroupChatInvite" && notification.createdBy) ||
      notification.type == "GroupReply"
      ? notification.createdBy.picture
        ? notification.createdBy.picture
        : "user"
      : "";
  }, [notification.type, notification]);

  const handleDeletePress = useCallback(
    debounce(
      async () => {
        setApiProcessing(notification._id);

        const { ok, data, problem } = await myApi.deleteNotification(
          notification._id
        );

        if (ok) {
          await storeDetails(data.user);
          setUser(data.user);
          return setApiProcessing("");
        }

        setApiProcessing("");
        if (!isUnmounting) {
          tackleProblem(problem, data, setInfoAlert);
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
    if (notification.type == "Vip" || notification.type == "Unmatched")
      return () => onTapToSeePress(notification);

    if (notification.type == "Replied") {
      return () => tapToSeeMessage(notification);
    }

    if (notification.type == "ActiveChat") {
      return () => tapToSendMessage(notification);
    }

    if (notification.type == "Matched") {
      return () => tapToSeeMatchedThought(notification);
    }
    if (notification.type == "GroupChatInvite") {
      return () => tapToVisitGroup(notification);
    }
    if (notification.type == "GroupReply") {
      return () => tapToSeeGroupReply(notification);
    }

    return () => null;
  };

  const opacity = () => {
    if (
      notification.type == "Vip" ||
      notification.type == "Replied" ||
      notification.type == "ActiveChat" ||
      notification.type == "Matched" ||
      notification.type == "Add" ||
      notification.type == "Unmatched" ||
      notification.type == "GroupReply"
    )
      return 0.9;
    return 0.7;
  };

  const doNull = () => {};

  return (
    <>
      <View style={styles.container}>
        <AppImage
          activeOpacity={1}
          style={styles.image}
          subStyle={styles.imageSub}
          imageUrl={imageUrl}
          customImage={{ uri: "logo" }}
        />
        <TouchableHighlight
          onLongPress={onLongPress}
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
              {notification.message}
            </Text>
            <Text style={styles.date}>
              {dayjs(notification.createdAt).fromNow()}
            </Text>
          </>
        </TouchableHighlight>
        {notification.type == "Add" && !inContacts ? (
          <ApiProcessingContainer
            color={defaultStyles.colors.dark}
            style={styles.addUserIconContainer}
            processing={addingUser}
          >
            <TouchableHighlight
              underlayColor={defaultStyles.colors.yellow}
              onPress={handleAddPress}
              style={styles.addIconContainer}
            >
              <IonIcons
                name="person-add"
                onPress={handleAddPress}
                size={scale(15)}
                color={defaultStyles.colors.secondary}
              />
            </TouchableHighlight>
          </ApiProcessingContainer>
        ) : (
          notification.type == "Add" && (
            <AppText style={styles.addedInfo}>Added</AppText>
          )
        )}
        {dayjs(currentDate).diff(notification.createdAt, "minutes") < 10 ||
        notification.type == "Add" ? null : (
          <DeleteAction
            style={{
              marginRight: scale(10),
              marginLeft: 0,
            }}
            apiAction={"true"}
            processing={apiProcessing == notification._id}
            onPress={apiProcessing ? doNull : handleDeletePress}
          />
        )}
      </View>
      <InfoAlert
        leftPress={handleCloseInfoAlert}
        description={infoAlert.infoAlertMessage}
        visible={infoAlert.showInfoAlert}
      />
    </>
  );
}
const styles = ScaledSheet.create({
  addUserIconContainer: {
    backgroundColor: defaultStyles.colors.yellow_Variant,
    borderRadius: "10@s",
    height: "32@s",
    marginRight: "15@s",
    padding: 0,
    width: "32@s",
  },
  addedInfo: {
    backgroundColor: defaultStyles.colors.yellow_Variant,
    color: defaultStyles.colors.secondary,
    marginHorizontal: "8@s",
    borderRadius: "8@s",
    paddingHorizontal: "10@s",
    paddingVertical: "8@s",
    fontSize: "13@s",
  },
  addIconContainer: {
    alignItems: "center",
    height: "32@s",
    justifyContent: "center",
    padding: 0,
    width: "32@s",
  },
  addButton: {
    backgroundColor: defaultStyles.colors.light,
    borderRadius: "8@s",
    height: "32@s",
    width: "60@s",
  },
  addButtonSub: {
    fontSize: "14@s",
    letterSpacing: 0.2,
  },
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
    borderRadius: "21@s",
    elevation: 1,
    height: "42@s",
    marginLeft: "10@s",
    marginRight: "6@s",
    width: "42@s",
  },
  imageSub: {
    borderRadius: "21@s",
    height: "42@s",
    width: "42@s",
  },
  notificationInfo: {
    borderRadius: "10@s",
    flexShrink: 1,
    justifyContent: "center",
    marginRight: "5@s",
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
