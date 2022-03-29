import React from "react";
import { View } from "react-native";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { ScaledSheet } from "react-native-size-matters";

import AppImage from "./AppImage";
import AppText from "./AppText";

import defaultStyles from "../config/styles";

const FavoritesReplyCard = ({ reply, user }) => {
  dayjs.extend(relativeTime);

  const selectedOption = reply.optionalAnswer;
  return (
    <View style={styles.replyCard}>
      <AppImage
        activeOpacity={1}
        style={styles.image}
        subStyle={styles.imageSub}
        imageUrl={user.picture}
      />
      <View style={styles.replyDetails}>
        <AppText style={styles.recipientName}>{user.name}</AppText>
        <AppText style={styles.repliedMessage}>{reply.message.trim()}</AppText>
        {selectedOption ? (
          <AppText style={styles.repliedMessageOption}>
            {selectedOption.answer.trim()}
          </AppText>
        ) : null}
        <AppText style={styles.replyCreatedAt}>
          {dayjs(reply.createdAt).fromNow()}
        </AppText>
      </View>
    </View>
  );
};
const styles = ScaledSheet.create({
  image: {
    backgroundColor: defaultStyles.colors.white,
    borderRadius: "13@s",
    elevation: 1,
    height: "25@s",
    marginLeft: "5@s",
    marginRight: "2@s",
    width: "25@s",
  },
  imageSub: {
    borderRadius: "13@s",
    height: "25@s",
    width: "25@s",
  },
  recipientName: {
    color: defaultStyles.colors.dark,
    fontSize: "12@s",
    paddingBottom: "2@s",
    paddingTop: 0,
  },
  replyCard: {
    flexDirection: "row",
    padding: "10@s",
    width: "100%",
  },
  replyDetails: {
    alignItems: "flex-start",
    flex: 1,
    paddingHorizontal: "5@s",
  },
  repliedMessage: {
    backgroundColor: defaultStyles.colors.light,
    borderRadius: "15@s",
    color: defaultStyles.colors.dark,
    fontSize: "12@s",
    paddingHorizontal: "10@s",
    paddingVertical: "5@s",
    textAlignVertical: "center",
  },
  repliedMessageOption: {
    backgroundColor: defaultStyles.colors.blue,
    borderRadius: "15@s",
    color: defaultStyles.colors.white,
    fontSize: "12@s",
    marginTop: "2@s",
    paddingHorizontal: "10@s",
    paddingVertical: "5@s",
    textAlignVertical: "center",
  },
  replyCreatedAt: {
    color: defaultStyles.colors.lightGrey,
    fontSize: "8@s",
  },
});

export default FavoritesReplyCard;
