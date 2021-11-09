import React from "react";
import { View, StyleSheet } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import LottieView from "lottie-react-native";

import AppImage from "./AppImage";
import AppText from "./AppText";

import defaultStyles from "../config/styles";

const defaultMessage = {
  _id: "",
  message: "",
  createdAt: "",
  createdFor: {
    _id: "",
    name: "",
    picture: "",
  },
  reply: [
    {
      _id: "",
      message: "",
      createdAt: "",
      optionalAnswer: {
        _id: "",
        selected: true,
        answer: "",
      },
    },
  ],
  seen: true,
  mood: "",
  options: [],
};

function ReplyCard({
  message = defaultMessage,
  onDeletePress,
  onModalOpenPress,
}) {
  dayjs.extend(relativeTime);

  if (!message.message)
    return (
      <View style={styles.emptyDataContainer}>
        <View style={styles.emptyData}>
          <LottieView
            autoPlay
            loop
            source={require("../assets/animations/noresults.json")}
            style={{ flex: 1 }}
          />
        </View>
      </View>
    );

  return (
    <View style={styles.container}>
      <View style={styles.recipientDetailsContainerMain}>
        <AppImage
          style={styles.image}
          subStyle={styles.imageSub}
          imageUrl={message.createdFor.picture}
        />
        <View style={styles.recipientDetailsContainerSub}>
          <AppText numberOfLines={1} style={styles.recipientName}>
            {message.createdFor.name}
          </AppText>
          <AppText style={styles.messageCreatedAt}>
            {dayjs(message.createdAt).fromNow()}
          </AppText>
        </View>
        <View style={styles.deleteIconContainer}>
          <MaterialCommunityIcons
            name="delete-circle-outline"
            size={20}
            onPress={onDeletePress}
            color={defaultStyles.colors.danger}
          />
        </View>
      </View>
      <AppText
        onPress={onModalOpenPress}
        numberOfLines={1}
        style={styles.message}
      >
        {message.message}
      </AppText>
      <AppText onPress={onModalOpenPress} style={styles.repliesCount}>
        {message.reply.length} {message.reply.length <= 1 ? "reply" : "replies"}
      </AppText>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.white,
    borderRadius: 10,
    elevation: 2,
    marginVertical: 5,
    padding: 5,
    width: "95%",
    height: 150,
    alignSelf: "center",
  },
  deleteIconContainer: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.light,
    borderColor: defaultStyles.colors.light,
    borderRadius: 10,
    borderWidth: 1,
    height: 35,
    justifyContent: "center",
    marginHorizontal: 15,
    width: 35,
  },
  emptyDataContainer: {
    alignItems: "center",
    alignSelf: "center",
    borderRadius: 5,
    height: 160,
    justifyContent: "center",
    width: "95%",
  },
  emptyData: {
    alignItems: "center",
    alignSelf: "center",
    borderRadius: 5,
    height: 60,
    justifyContent: "center",
    width: "95%",
  },
  message: {
    backgroundColor: defaultStyles.colors.light,
    borderRadius: 10,
    color: defaultStyles.colors.dark_Variant,
    marginVertical: 10,
    maxWidth: "80%",
    paddingHorizontal: 10,
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
    borderRadius: 20,
    height: 40,
    width: 40,
  },
  messageCreatedAt: {
    color: defaultStyles.colors.lightGrey,
    fontSize: 14,
    paddingTop: 0,
  },
  recipientName: {
    color: defaultStyles.colors.secondary,
    paddingBottom: 0,
  },
  repliesCount: {
    alignSelf: "flex-end",
    backgroundColor: defaultStyles.colors.yellow_Variant,
    borderRadius: 20,
    color: defaultStyles.colors.secondary,
    fontSize: 16,
    paddingHorizontal: 10,
  },
  recipientDetailsContainerMain: {
    alignItems: "center",
    borderBottomColor: defaultStyles.colors.light,
    borderBottomWidth: 1,
    flexDirection: "row",
    padding: 5,
    width: "95%",
  },
  recipientDetailsContainerSub: {
    flex: 1,
    marginHorizontal: 5,
    padding: 5,
  },
});

export default ReplyCard;
