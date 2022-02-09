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
import defaultProps from "../utilities/defaultProps";

const defaultMessage = defaultProps.defaultMessage;

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
            loop={false}
            source={"noresults.json"}
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
            {message.message.trim()}
          </AppText>
          <View style={styles.replyStatsContainer}>
            <AppText onPress={onModalOpenPress} style={styles.repliesCount}>
              {message.reply.length}{" "}
              {message.reply.length <= 1 ? "reply" : "replies"}
            </AppText>
            <AppText style={styles.messageCreatedAt}>
              {dayjs(message.createdAt).fromNow()}
            </AppText>
          </View>
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
    height: "80@s",
    justifyContent: "center",
    padding: "5@s",
    width: "95%",
  },
  emptyDataContainer: {
    alignItems: "center",
    alignSelf: "center",
    borderRadius: 5,
    height: "80@s",
    justifyContent: "center",
    width: "95%",
  },
  emptyData: {
    alignItems: "center",
    alignSelf: "center",
    borderRadius: "5@s",
    height: "50@s",
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
    paddingTop: 0,
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
    color: defaultStyles.colors.lightGrey,
    fontSize: "10@s",
    paddingBottom: 0,
    paddingTop: 0,
    textAlignVertical: "center",
  },
  recipientName: {
    alignSelf: "flex-start",
    borderRadius: "15@s",
    color: defaultStyles.colors.dark,
    fontSize: "14.5@s",
    paddingBottom: 0,
    textAlignVertical: "center",
  },
  repliesCount: {
    borderRadius: "20@s",
    color: defaultStyles.colors.secondary,
    fontSize: "12@s",
    marginRight: "10@s",
    paddingBottom: 0,
    paddingTop: 0,
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
  replyStatsContainer: {
    alignItems: "center",
    flexDirection: "row",
    marginTop: "8@s",
    width: "100%",
  },
});

export default ReplyCard;
