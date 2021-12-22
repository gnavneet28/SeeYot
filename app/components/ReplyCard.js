import React from "react";
import { View } from "react-native";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import LottieView from "lottie-react-native";
import { ScaledSheet } from "react-native-size-matters";

import AppImage from "./AppImage";
import AppText from "./AppText";
import DeleteAction from "./DeleteAction";

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
  index,
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
          activeOpacity={1}
          style={styles.image}
          subStyle={styles.imageSub}
          imageUrl={message.createdFor.picture}
        />
        <View style={styles.recipientDetailsContainerSub}>
          <AppText
            onPress={onModalOpenPress}
            numberOfLines={1}
            style={styles.recipientName}
          >
            {message.createdFor.name}
          </AppText>
          <AppText
            onPress={onModalOpenPress}
            numberOfLines={1}
            style={styles.message}
          >
            {message.message}
          </AppText>
          <AppText onPress={onModalOpenPress} style={styles.repliesCount}>
            {message.reply.length}{" "}
            {message.reply.length <= 1 ? "reply" : "replies"}
          </AppText>
          <AppText style={styles.messageCreatedAt}>
            {dayjs(message.createdAt).fromNow()}
          </AppText>
        </View>
        <DeleteAction apiAction={false} onPress={onDeletePress} />
      </View>
    </View>
  );
}
const styles = ScaledSheet.create({
  container: {
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: defaultStyles.colors.white,
    borderBottomWidth: 1,
    borderColor: defaultStyles.colors.light,
    height: "95@s",
    padding: "5@s",
    width: "95%",
  },
  emptyDataContainer: {
    alignItems: "center",
    alignSelf: "center",
    borderRadius: 5,
    height: "145@s",
    justifyContent: "center",
    width: "95%",
  },
  emptyData: {
    alignItems: "center",
    alignSelf: "center",
    borderRadius: "5@s",
    height: "60@s",
    justifyContent: "center",
    width: "95%",
  },
  message: {
    alignSelf: "flex-start",
    borderRadius: "10@s",
    color: defaultStyles.colors.dark_Variant,
    fontSize: "13.5@s",
    maxWidth: "95%",
    paddingBottom: 0,
  },
  image: {
    backgroundColor: defaultStyles.colors.white,
    borderRadius: "20@s",
    elevation: 2,
    height: "40@s",
    marginLeft: "10@s",
    marginRight: "5@s",
    width: "40@s",
  },
  imageSub: {
    borderRadius: "20@s",
    height: "40@s",
    width: "40@s",
  },
  messageCreatedAt: {
    alignSelf: "flex-start",
    color: defaultStyles.colors.lightGrey,
    fontSize: "10@s",
    paddingTop: 0,
  },
  recipientName: {
    alignSelf: "flex-start",
    backgroundColor: defaultStyles.colors.light,
    borderRadius: "15@s",
    color: defaultStyles.colors.dark,
    fontSize: "14@s",
    paddingHorizontal: "10@s",
    paddingVertical: "3@s",
    textAlignVertical: "center",
  },
  repliesCount: {
    alignSelf: "flex-start",
    borderRadius: "20@s",
    color: defaultStyles.colors.secondary,
    fontSize: "12@s",
    textAlign: "left",
    textAlignVertical: "center",
  },
  recipientDetailsContainerMain: {
    alignItems: "center",
    flexDirection: "row",
    padding: "2@s",
    width: "100%",
  },
  recipientDetailsContainerSub: {
    alignItems: "center",
    flex: 1,
    marginRight: "5@s",
    padding: "5@s",
  },
});

export default ReplyCard;
