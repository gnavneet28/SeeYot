import React from "react";
import { View, StyleSheet } from "react-native";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import AppImage from "./AppImage";
import AppText from "./AppText";

import defaultStyles from "../config/styles";

const ReplyCardSub = ({ message, reply }) => {
  dayjs.extend(relativeTime);
  return (
    <View style={styles.replyCard}>
      <AppImage
        activeOpacity={1}
        style={styles.image}
        subStyle={styles.imageSub}
        imageUrl={message.createdFor.picture}
      />
      <View style={styles.replyDetails}>
        <AppText style={styles.recipientName}>
          {message.createdFor.name}
        </AppText>
        <AppText style={styles.repliedMessage}>{reply.message}</AppText>
        <AppText style={styles.replyCreatedAt}>
          {dayjs(reply.createdAt).fromNow()}
        </AppText>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
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
  recipientName: {
    color: defaultStyles.colors.secondary,
    paddingBottom: 5,
  },
  replyCard: {
    flexDirection: "row",
    padding: 10,
    width: "100%",
  },
  replyDetails: {
    alignItems: "flex-start",
    flex: 1,
    paddingHorizontal: 5,
  },
  repliedMessage: {
    backgroundColor: defaultStyles.colors.light,
    borderRadius: 10,
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 5,
    textAlignVertical: "center",
  },
  replyCreatedAt: {
    color: defaultStyles.colors.lightGrey,
    fontSize: 14,
  },
});

export default ReplyCardSub;
