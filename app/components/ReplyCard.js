import React from "react";
import { View } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import LottieView from "lottie-react-native";
import { ScaledSheet, scale } from "react-native-size-matters";

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
          activeOpacity={1}
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
            size={scale(18)}
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
const styles = ScaledSheet.create({
  container: {
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: defaultStyles.colors.white,
    borderRadius: "10@s",
    elevation: 2,
    height: "145@s",
    marginBottom: "5@s",
    padding: "5@s",
    width: "95%",
  },
  deleteIconContainer: {
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
    backgroundColor: defaultStyles.colors.light,
    borderRadius: "10@s",
    color: defaultStyles.colors.dark_Variant,
    marginVertical: "10@s",
    maxWidth: "80%",
    paddingHorizontal: "10@s",
  },
  image: {
    backgroundColor: defaultStyles.colors.white,
    borderRadius: "18@s",
    height: "36@s",
    marginLeft: "15@s",
    marginRight: "2@s",
    width: "36@s",
  },
  imageSub: {
    borderRadius: "18@s",
    height: "36@s",
    width: "36@s",
  },
  messageCreatedAt: {
    color: defaultStyles.colors.lightGrey,
    fontSize: "10@s",
    paddingTop: 0,
  },
  recipientName: {
    color: defaultStyles.colors.secondary,
    paddingBottom: 0,
  },
  repliesCount: {
    alignSelf: "flex-end",
    backgroundColor: defaultStyles.colors.yellow_Variant,
    borderColor: defaultStyles.colors.yellow,
    borderRadius: "20@s",
    borderWidth: 2,
    bottom: "5@s",
    color: defaultStyles.colors.secondary,
    fontSize: "12@s",
    marginRight: "5@s",
    paddingHorizontal: "10@s",
    position: "absolute",
    right: "5@s",
    textAlign: "center",
    textAlignVertical: "center",
  },
  recipientDetailsContainerMain: {
    alignItems: "center",
    borderBottomColor: defaultStyles.colors.light,
    borderBottomWidth: 1,
    flexDirection: "row",
    padding: "5@s",
    width: "95%",
  },
  recipientDetailsContainerSub: {
    flex: 1,
    marginRight: "5@s",
    padding: "5@s",
  },
});

export default ReplyCard;
